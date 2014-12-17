#!/bin/sh

. include.sh

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BASE_DIR="${SCRIPT_DIR}/.."
BUILD_DIR="${BASE_DIR}/built"

SYNC_BRANCH="master"
VERSION=$(grep " * @version     " ${BASE_DIR}/js/DataTables.js | awk -F" " '{ print $3 }')
CMD=$1
SUBCMD=$2

DEBUG=""
if [ "$SUBCMD" = "debug" -o "$3" = "debug" ]; then
	DEBUG=1
fi


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

	OLD_IFS=$IFS
	IFS='%'
	cp DataTables.js DataTables.js.build
	grep "require('" DataTables.js.build > /dev/null

	while [ $? -eq 0 ]; do
		REQUIRE=$(grep "require('" DataTables.js.build | head -n 1)

		SPACER=$(echo ${REQUIRE} | cut -d r -f 1)
		FILE=$(echo ${REQUIRE} | sed -e "s#^.*require('##g" -e "s#');##")
		DIR=$(echo ${FILE} | cut -d \. -f 1)

		sed "s#^#${SPACER}#" < ${DIR}/${FILE} > ${DIR}/${FILE}.build

		sed -e "/${REQUIRE}/r ${DIR}/${FILE}.build" -e "/${REQUIRE}/d" < DataTables.js.build > DataTables.js.out
		mv DataTables.js.out DataTables.js.build

		rm ${DIR}/${FILE}.build

		grep "require('" DataTables.js.build > /dev/null
	done

	mv DataTables.js.build $OUT_FILE

	# JSHint
	jshint --config $SCRIPT_DIR/jshint.config $OUT_FILE
	if [ $? -eq 0 ]; then
		echo_msg "JSHint passed"
	else
		echo_error "JSHint failed"
	fi

	if [ ! $DEBUG ]; then
		echo "/*! DataTables $VERSION
 * ©2008-$(date +%Y) SpryMedia Ltd - datatables.net/license
 */" > $OUT_MIN_FILE

		echo_section "JS min"
		java -jar $CLOSURE --js $OUT_FILE >> $OUT_MIN_FILE
		echo_msg "File size: $(ls -l $OUT_MIN_FILE | awk -F" " '{ print $5 }')"
	fi

	cp jquery.js $OUT_DIR

	IFS=$OLD_IFS
}


function build_css {
	echo_section "CSS"
	SRC_DIR="${BASE_DIR}/css"
	OUT_DIR="${BUILD_DIR}/css"
	OUT_FILE="${OUT_DIR}/jquery.dataTables.css"
	OUT_MIN_FILE="${OUT_DIR}/jquery.dataTables.min.css"
	OUT_JUI_FILE="${OUT_DIR}/jquery.dataTables_themeroller.css"
	OUT_JUI_MIN_FILE="${OUT_DIR}/jquery.dataTables_themeroller.min.css"

	if [ -d $OUT_DIR ]; then
		rm -r $OUT_DIR
	fi
	mkdir $OUT_DIR

	cd $SRC_DIR

	sass --scss --stop-on-error --style expanded jquery.dataTables.scss > $OUT_FILE
	sass --scss --stop-on-error --style expanded jquery.dataTables_themeroller.scss > $OUT_JUI_FILE

	if [ ! $DEBUG ]; then
		echo_section "CSS min"
		sass --scss --stop-on-error --style compressed jquery.dataTables.scss > $OUT_MIN_FILE
		sass --scss --stop-on-error --style compressed jquery.dataTables_themeroller.scss > $OUT_JUI_MIN_FILE
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


function build_examples {
	echo_section "Examples"

	SRC_DIR="${BASE_DIR}/examples"
	OUT_DIR="${BUILD_DIR}/examples"
	TEMPLATE_DIR="${BASE_DIR}/build/templates"

	if [ -e $OUT_DIR ]; then
		rm -Rf $OUT_DIR
	fi

	# Transform in place
	cp -r $SRC_DIR $OUT_DIR
	php ${BASE_DIR}/build/examples.php \
		-o $OUT_DIR \
		-u ${TEMPLATE_DIR}/example_index.html \
		-t ${TEMPLATE_DIR}/example.html \
		-c "demo:${OUT_DIR}/resources/demo.css" \
		-j "demo:${OUT_DIR}/resources/demo.js" \
		-c "syntax:${OUT_DIR}/resources/syntax/shCore.css" \
		-j "syntax:${OUT_DIR}/resources/syntax/shCore.js" \
		-m "${BUILD_DIR}/media" \
		-l "js:jquery css:syntax css:demo js:syntax js:demo"
}



# Use the latest JS, CSS etc in the DataTables build repo
# Assumes that the files have already been built
function build_repo {
	echo_section "Deploying to build repo"
	update_build_repo

	build_js
	build_css
	build_images
	compress_images
	build_examples

	cp $BUILD_DIR/js/jquery.js ${BUILD_DIR}/DataTables/media/js/
	cp $BUILD_DIR/js/jquery.dataTables.js ${BUILD_DIR}/DataTables/media/js/
	if [ ! $DEBUG ]; then
		cp $BUILD_DIR/js/jquery.dataTables.min.js ${BUILD_DIR}/DataTables/media/js/
	fi

	cp $BUILD_DIR/css/jquery.dataTables.css ${BUILD_DIR}/DataTables/media/css/
	cp $BUILD_DIR/css/jquery.dataTables_themeroller.css ${BUILD_DIR}/DataTables/media/css/
	if [ ! $DEBUG ]; then
		cp $BUILD_DIR/css/jquery.dataTables.min.css ${BUILD_DIR}/DataTables/media/css/
		cp $BUILD_DIR/css/jquery.dataTables_themeroller.min.css ${BUILD_DIR}/DataTables/media/css/
	fi

	cp -r $BUILD_DIR/images ${BUILD_DIR}/DataTables/media/
	if [ -e ${BUILD_DIR}/DataTables/examples ]; then
		rm -Rf ${BUILD_DIR}/DataTables/examples
	fi
	cp -r $BUILD_DIR/examples ${BUILD_DIR}/DataTables/examples

	# Create the manifest files for the various package managers
	build_descriptors
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
		CHANGES=0

		for HASH in $COMMITS; do
			echo_msg "Checking if there are build changes resulting from commit $HASH"
			git checkout $HASH

			COMMIT_MESSAGE=$(git log -1 --format=format:%B $HASH)

			build_repo

			cd ${BUILD_DIR}/DataTables

			# git appears to have a bug whereby --quiet doesn't work immediately
			# after files have been generated. Running twice fixes
			git diff --quiet --exit-code
			git diff --quiet --exit-code
			if [ $? -eq 1 ]; then
				echo_msg "Committing changes"

				echo $HASH > .datatables-commit-sync
				git commit -a -m "$COMMIT_MESSAGE"
				CHANGES=1
			else
				echo_msg "No build changes"
			fi

			cd - > /dev/null 2>&1
		done

		# Push latest changes up to origin
		if [ $CHANGES -eq 1 ]; then
			echo_msg "Pushing changes in build repo up to origin"
			cd ${BUILD_DIR}/DataTables
			git push --quiet origin $SYNC_BRANCH
			cd - > /dev/null 2>&1
		fi
	fi

	git checkout --quiet $SYNC_BRANCH
}


function build_descriptors {
	echo_msg "Updating package descriptors"

	for FILE in $(ls ${BASE_DIR}/descriptors); do
		cat ${BASE_DIR}/descriptors/${FILE} | \
			sed -e "s/\_VERSION\_/${VERSION}/g" > ${BUILD_DIR}/DataTables/${FILE}
	done
}


function update_build_repo {
	if [ ! -d "${BUILD_DIR}/DataTables" ]; then
		echo_msg "Checking out DataTables/DataTables"
		cd $BUILD_DIR
		git clone git@github.com:DataTables/DataTables.git
		cd - > /dev/null 2>&1
	else
		echo_msg "Pulling latest changes for build repo from origin"
	fi

	# This will throw away local changes in the build file...
	# Don't change files in it!
	cd $BUILD_DIR/DataTables
	#git pull --quiet origin $SYNC_BRANCH
	git checkout --quiet -f $SYNC_BRANCH
	cd - > /dev/null 2>&1
}


function extensions_dirs {
	if [ ! -d ${BASE_DIR}/extensions ]; then
		mkdir ${BASE_DIR}/extensions
	fi

	if [ ! -d ${BUILD_DIR}/DataTables/extensions ]; then
		mkdir ${BUILD_DIR}/DataTables/extensions
	fi
}


function build_extension {
	EXTENSION=$1

	echo_section "Building DataTables extension $EXTENSION"

	extensions_dirs
	cd ${BASE_DIR}/extensions

	if [ ! -d ${BASE_DIR}/extensions/${EXTENSION} ]; then
		echo_msg "Cloning $EXTENSION from GitHub"
		git clone git@github.com:DataTables/${EXTENSION}.git
	fi

	if [ -e ${BASE_DIR}/extensions/${EXTENSION}/make.sh ]; then
		# If there is a make file, then leave it to the extension to do its own
		# build and copy files into place
		echo_msg "Running $EXTENSION build script"
		sh ${BASE_DIR}/extensions/${EXTENSION}/make.sh \
			${BUILD_DIR}/DataTables/extensions/${EXTENSION} $DEBUG
	else
		# Otherwise, just copy the whole lot over
		echo_msg "Copying $EXTENSION files into place"
		rsync -r ${BASE_DIR}/extensions/${EXTENSION} \
			${BUILD_DIR}/DataTables/extensions
	fi
}



function usage {
	echo "  Usage: make.sh <cmd> [debug]

    where <cmd> is one of:

      build    - Create the build repo from the current source files. Will
                 automatically make the calls to to build the 'js' and 'css'
                 targets. The created repo is in 'built/DataTables'

      js       - Create the DataTables Javascript file

      css      - Create the DataTables CSS files

      sync     - Synchronise the DataTables/DataTables build repo to the source
                 repo

      examples - Build the examples

      test     - Build the unit tests

      extension <ext> [debug] - Extension to build where <ext> is one of:
        - AutoFill
        - ColVis
        - ColReorder
        - FixedColumns
        - FixedHeader
        - KeyTable
        - Scroller
        - TableTools

    and the optional [debug] parameter can be used to disable JS and CSS
    compression for faster development build times."
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


if [ ! -d $BUILD_DIR ]; then
	mkdir $BUILD_DIR
fi

case "$1" in
	"thirdparty")
		# Update all third party libraries used for the DataTables distribution
		#thirdparty_markdown()
		;;

	"build")
		build_repo
		;;

	"examples")
		build_examples
		;;

	"test")
		;;

	"js")
		build_js
		;;

	"css")
		build_css
		;;

	"sync")
		build_repo_sync
		;;

	"extension")
		build_extension $SUBCMD
		;;

	*)
		usage
esac



echo ""
echo_section "Done"
echo ""
