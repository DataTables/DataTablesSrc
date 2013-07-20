#!/bin/sh


CLOSURE="/usr/local/closure_compiler/compiler.jar"
JSDOC="/usr/local/jsdoc/jsdoc"

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BASE_DIR="${SCRIPT_DIR}/.."
BUILD_DIR="${BASE_DIR}/build"

SYNC_BRANCH="1_10_wip"
VERSION=$(grep " * @version     " ${BASE_DIR}/js/DataTables.js | awk -F" " '{ print $3 }')
CMD=$1

DEBUG=""
if [ "$2" = "debug" ]; then
	DEBUG=1
fi


function echo_section {
	# Cyan
	echo "\033[0;36m  ${1}\033[0m"
}

function echo_msg {
	# Green
	echo "\033[0;32m    ${1}\033[0m"
}

function echo_error {
	# Red
	echo "\033[0;31m  ${1}\033[0m"
}


function build_js {
	echo_section "JS"
	SRC_DIR="${BASE_DIR}/js"
	OUT_DIR="${BUILD_DIR}/js"
	OUT_FILE="${OUT_DIR}/jquery.dataTables.js"
	OUT_MIN_FILE="${OUT_DIR}/jquery.dataTables.min.js"

	if [ -d $OUT_DIR ]; then
		rm -r $OUT_DIR
	fi
	mkdir $OUT_DIR

	cd $SRC_DIR

	IFS='%'
	cp DataTables.js DataTables.js.build
	grep "require(" DataTables.js.build > /dev/null

	while [ $? -eq 0 ]; do
		REQUIRE=$(grep "require(" DataTables.js.build | head -n 1)

		SPACER=$(echo ${REQUIRE} | cut -d r -f 1)
		FILE=$(echo ${REQUIRE} | sed -e "s#^.*require('##g" -e "s#');##")
		DIR=$(echo ${FILE} | cut -d \. -f 1)

		sed "s#^#${SPACER}#" < ${DIR}/${FILE} > ${DIR}/${FILE}.build

		sed -e "/${REQUIRE}/r ${DIR}/${FILE}.build" -e "/${REQUIRE}/d" < DataTables.js.build > DataTables.js.out
		mv DataTables.js.out DataTables.js.build

		rm ${DIR}/${FILE}.build

		grep "require(" DataTables.js.build > /dev/null
	done

	mv DataTables.js.build $OUT_FILE

	if [ ! $DEBUG ]; then
		echo_section "/*! DataTables $VERSION
 * ©2008-$(date +%Y) Allan Jardine - datatables.net/license
 */" > $OUT_MIN_FILE

		echo_section "JS min"
		java -jar $CLOSURE --js $OUT_FILE >> $OUT_MIN_FILE
		echo_msg "File size: $(ls -l $OUT_MIN_FILE | awk -F" " '{ print $5 }')"
	fi
}


function build_css {
	echo_section "CSS"
	SRC_DIR="${BASE_DIR}/css"
	OUT_DIR="${BUILD_DIR}/css"
	OUT_FILE="${OUT_DIR}/jquery.dataTables.css"
	OUT_MIN_FILE="${OUT_DIR}/jquery.dataTables.min.css"

	if [ -d $OUT_DIR ]; then
		rm -r $OUT_DIR
	fi
	mkdir $OUT_DIR

	cd $SRC_DIR

	sass --scss --stop-on-error --style expanded jquery.dataTables.scss > $OUT_FILE

	if [ ! $DEBUG ]; then
		echo_section "CSS min"
		sass --scss --stop-on-error --style compressed jquery.dataTables.scss > $OUT_MIN_FILE
		echo_msg "File size: $(ls -l $OUT_MIN_FILE | awk -F" " '{ print $5 }')"
	fi
}


function build_images {
	echo_section "Images"
	SRC_DIR="${BASE_DIR}/images"
	OUT_DIR="${BUILD_DIR}/images"
	OUT_FILE="${OUT_DIR}/jquery.dataTables.css"
	OUT_MIN_FILE="${OUT_DIR}/jquery.dataTables.min.css"

	if [ -d $OUT_DIR ]; then
		rm -r $OUT_DIR
	fi
	mkdir $OUT_DIR

	cp $SRC_DIR/*.png $OUT_DIR
	cp $SRC_DIR/*.ico $OUT_DIR
}



# Use the latest JS, CSS etc in the DataTables build repo
# Assumes that the files have already been built
function build_repo {
	echo_section "Deploying to build repo"
	update_build_repo

	cp $BUILD_DIR/js/jquery.dataTables.js ${BUILD_DIR}/DataTables/media/js/
	if [ ! $DEBUG ]; then
		cp $BUILD_DIR/js/jquery.dataTables.min.js ${BUILD_DIR}/DataTables/media/js/
	fi

	cp $BUILD_DIR/css/jquery.dataTables.css ${BUILD_DIR}/DataTables/media/css/
	if [ ! $DEBUG ]; then
		cp $BUILD_DIR/css/jquery.dataTables.min.css ${BUILD_DIR}/DataTables/media/css/
	fi

	cp -r $BUILD_DIR/images ${BUILD_DIR}/DataTables/media/
}


# Build the DataTables/DataTables distribution
function build_repo_sync {
	echo_section "Syncing build repo to source repo"
	update_build_repo

	LAST_HASH=$(cat ${BUILD_DIR}/DataTables/.datatables-commit-sync)

	# Get the commits between the latest commit that the build repo was synced
	# to and the head
	COMMITS=$(git log --format=format:%H --reverse ${LAST_HASH}..HEAD)

	if [ "$COMMITS" = "" ]; then
		echo_msg "Build repo up to date"
	else
		for HASH in $COMMITS; do
			echo_msg "Committing changes from $HASH"
			git checkout $HASH

			COMMIT_MESSAGE=$(git log -1 --format=format:%B $HASH)

			build_repo

			cd ${BUILD_DIR}/DataTables
			echo $HASH > .datatables-commit-sync

			git commit -a -m "$COMMIT_MESSAGE"

			cd - > /dev/null 2>&1
		done

		# Push latest changes up to origin
		cd ${BUILD_DIR}/DataTables
		git push origin $SYNC_BRANCH
		cd - > /dev/null 2>&1
	fi

	git checkout $SYNC_BRANCH
}


function update_build_repo {
	if [ ! -d "${BUILD_DIR}/DataTables" ]; then
		echo_msg "Checking out DataTables/DataTables"
		cd $BUILD_DIR
		git clone git@github.com:DataTables/DataTables.git
		cd - > /dev/null 2>&1
	else 
		echo_msg "Updating build repo"
	fi

	# This will throw away local changes in the build file...
	# Don't change files in it!
	cd $BUILD_DIR/DataTables
	git pull origin $SYNC_BRANCH
	git checkout -f $SYNC_BRANCH
	cd - > /dev/null 2>&1
}



#
# Main script
#
cd $BASE_DIR

# Sanity check that the working branch is going to build correctly
CURR_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [ $SYNC_BRANCH != $CURR_BRANCH ]; then
	echo_error "Working branch ($CURR_BRANCH) is not the same as the script branch ($SYNC_BRANCH)"
	echo_error "Exiting..."
	exit
fi

echo ""
echo_section "DataTables build ($VERSION) - branch: $SYNC_BRANCH"
echo ""


if [ ! -d build ]; then
	mkdir build
fi

case "$1" in
	"thirdparty")
		# Update all third party libraries used for the DataTables distribution
		#thirdparty_markdown()
		;;

	"build")
		build_js
		build_css
		build_images
		build_repo
		;;

	"examples")
		;;

	"test")
		;;

	"js")
		build_js
		;;

	"css")
		build_css
		;;

	"deploy")
		build_deploy
		;;

	"sync")
		build_repo_sync
		;;
esac






# if [ "$CMD" != "debug" ]; then
# 	if [ "$CMD" = "jshint" -o "$CMD" = "" -o "$CMD" = "cdn" ]; then
# 		echo "  -- Skipping JS Hint"
# 		# echo "  JSHint"
# 		# jshint --config ../../scripts/jshint.config $MAIN_FILE
# 		# if [ $? -ne 0 ]; then
# 		# 	echo "    Errors occured - exiting"
# 		# 	exit 1
# 		# else
# 		# 	echo "    Pass" 
# 		# fi
# 	fi
# 
# 	if [ "$CMD" = "compress" -o "$CMD" = "" -o "$CMD" = "cdn" ]; then
# 		echo "  Minification"
# 		echo "/*! DataTables $VERSION
#  * ©2008-2013 Allan Jardine - datatables.net/license
#  */" > $MIN_FILE 
# 
# 		java -jar $CLOSURE --js $MAIN_FILE >> $MIN_FILE
# 		echo "    Min JS file size: $(ls -l $MIN_FILE | awk -F" " '{ print $5 }')"
# 	fi
# 
# 	if [ "$CMD" = "docs" -o "$CMD" = "" ]; then
# 		echo "  Documentation"
# 		$JSDOC -d ../../docs -t JSDoc-DataTables $MAIN_FILE
# 	fi
# 
# 	if [ "$CMD" = "cdn" ]; then
# 		echo "  CDN"
# 		if [ -d ../../cdn ]; then
# 			rm -Rf ../../cdn
# 		fi
# 		mkdir ../../cdn
# 		mkdir ../../cdn/css
# 		cp $MAIN_FILE ../../cdn
# 		cp $MIN_FILE ../../cdn
# 		cp ../css/jquery.dataTables.css ../../cdn/css
# 		cp ../css/jquery.dataTables_themeroller.css ../../cdn/css
# 		cp -r ../images ../../cdn/
# 		rm ../../cdn/images/Sorting\ icons.psd
# 	fi
# fi
# 
# 
# # Back to DataTables root dir
# cd ../..
# 
# #
# # Packaging files
# #
# cat <<EOF > package.json
# {
# 	"name": "DataTables",
# 	"version": "${VERSION}",
# 	"title": "DataTables",
# 	"author": {
# 		"name": "Allan Jardine",
# 		"url": "http://sprymedia.co.uk"
# 	},
# 	"licenses": [
# 		{
# 			"type": "BSD",
# 			"url": "http://datatables.net/license_bsd"
# 		},
# 		{
# 			"type": "GPLv2",
# 			"url": "http://datatables.net/license_gpl2"
# 		}
# 	],
# 	"dependencies": {
# 		"jquery": "1.4 - 1.8"
# 	},
# 	"description": "DataTables enhances HTML tables with the ability to sort, filter and page the data in the table very easily. It provides a comprehensive API and set of configuration options, allowing you to consume data from virtually any data source.",
# 	"keywords": [
# 		"DataTables",
# 		"DataTable",
# 		"table",
# 		"grid",
# 		"filter",
# 		"sort",
# 		"page",
# 		"internationalisable"
# 	],
# 	"homepage": "http://datatables.net"
# }
# EOF
# 
# cat <<EOF > component.json
# {
# 	"name": "DataTables",
# 	"version": "${VERSION}",
# 	"main": [
# 		"./media/js/jquery.dataTables.js",
# 		"./media/css/jquery.dataTables.css"
# 	],
# 	"dependencies": {
# 		"jquery": "~1.8.0"
# 	}
# }
# EOF


echo ""
echo_section "Done"
echo ""


