#!/bin/bash

. include.sh

export DT_BUILD=1

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BASE_DIR="${SCRIPT_DIR}/.."
BUILD_DIR="${BASE_DIR}/built"

SYNC_BRANCH="master"
VERSION=$(grep " * @version     " ${BASE_DIR}/js/umd.js | awk -F" " '{ print $3 }')
CMD=$1
SUBCMD=$2

DEBUG=""
if [ "$SUBCMD" = "debug" -o "$3" = "debug" ]; then
	DEBUG=1
fi


function build_js {
	IN_FILE=$1
	OUT_NAME=$2
	OUT_EXTN=$3

	echo_section "JS ${OUT_EXTN}"

	SRC_DIR="${BASE_DIR}/js"
	OUT_DIR="${BUILD_DIR}/js"
	OUT_FILE="${OUT_DIR}/${OUT_NAME}.${OUT_EXTN}"
	OUT_MIN_FILE="${OUT_DIR}/${IN_FILE}.min.${OUT_EXTN}"

	if [ ! -d $OUT_DIR ]; then
		mkdir $OUT_DIR
	fi

	cd $SRC_DIR

	OLD_IFS=$IFS
	IFS='%'
	cp $IN_FILE DataTables.js.build
	grep "_buildInclude('" DataTables.js.build > /dev/null

	while [ $? -eq 0 ]; do
		REQUIRE=$(grep "_buildInclude('" DataTables.js.build | head -n 1)

		SPACER=$(echo ${REQUIRE} | cut -d _ -f 1)
		FILE=$(echo ${REQUIRE} | sed -e "s#^.*_buildInclude('##g" -e "s#');##")
		DIR=$(echo ${FILE} | cut -d \. -f 1)

		sed "s#^#${SPACER}#" < ${DIR}/${FILE} > ${DIR}/${FILE}.build

		sed -e "/${REQUIRE}/r ${DIR}/${FILE}.build" -e "/${REQUIRE}/d" < DataTables.js.build > DataTables.js.out
		mv DataTables.js.out DataTables.js.build

		rm ${DIR}/${FILE}.build

		grep "_buildInclude('" DataTables.js.build > /dev/null
	done

	mv DataTables.js.build $OUT_FILE

	# JSHint
	if [ -e $JSHINT ]; then
		$JSHINT --config $SCRIPT_DIR/jshint.config $OUT_FILE

		if [ $? -eq 0 ]; then
			echo_msg "JSHint passed"
		else
			echo_error "JSHint failed"
		fi
	fi

	js_compress $OUT_FILE

	cp jquery.js $OUT_DIR
	cp integration/* $OUT_DIR

	IFS=$OLD_IFS
}


function build_css {
	echo_section "CSS"
	SRC_DIR="${BASE_DIR}/css"
	OUT_DIR="${BUILD_DIR}/css"

	if [ -d $OUT_DIR ]; then
		rm -r $OUT_DIR
	fi
	mkdir $OUT_DIR

	cd $SRC_DIR

	for file in $(find $SRC_DIR -name "*dataTables*.scss"); do
		filename=$(basename $file .scss)
		sass --stop-on-error --style expanded $file > $OUT_DIR/$filename.css
		css_compress $OUT_DIR/$filename.css
	done
}

function build_types {
	echo_section "Types"
	if [ -d $BUILD_DIR/types ]; then
		rm -r $BUILD_DIR/types		
	fi
	mkdir $BUILD_DIR/types

	if [ -d $BASE_DIR/types/ ]; then
		cp $BASE_DIR/types/* $BUILD_DIR/types
	else
		if [ -f $BASE_DIR/types.d.ts ]; then
			cp $BASE_DIR/types.d.ts $BUILD_DIR/types
		fi
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

	# Build DataTables with two different loader types
	build_js umd.js jquery.dataTables js
	build_js esm.js jquery.dataTables mjs

	echo_section "Styling frameworks JS"

	js_frameworks dataTables $OUT_DIR
	build_css
	build_types
	build_images
	build_examples

	#echo $BUILD_DIR
	cp $BUILD_DIR/js/* ${BUILD_DIR}/DataTables/media/js/
	cp $BUILD_DIR/css/* ${BUILD_DIR}/DataTables/media/css/

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
		git clone https://github.com/DataTables/DataTables.git
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
		#git clone https://github.com/DataTables/${EXTENSION}.git
	fi

	if [ -e ${BASE_DIR}/extensions/${EXTENSION}/make.sh ]; then
		# If there is a make file, then leave it to the extension to do its own
		# build and copy files into place
		echo_msg "Running $EXTENSION build script"
		bash ${BASE_DIR}/extensions/${EXTENSION}/make.sh \
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

	  all [debug] - Build DataTables core and all extensions

      extension <ext> [debug] - Extension to build where <ext> is one of:
        - AutoFill
        - Buttons
        - ColReorder
        - DateTime
        - FixedColumns
        - FixedHeader
        - KeyTable
        - RowReorder
        - Responsive
        - Scroller
        - Select
        - SearchBuilder
        - SearchPanes
        - StateRestore

    and the optional [debug] parameter can be used to disable JS and CSS
    compression for faster development build times."
}


#
# Main script
#
cd $BASE_DIR

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

	"all")
		build_repo
		build_extension AutoFill
		build_extension Buttons
		build_extension ColReorder
		build_extension DateTime
		build_extension FixedColumns
		build_extension FixedHeader
		build_extension KeyTable
		build_extension Responsive
		build_extension RowGroup
		build_extension RowReorder
		build_extension Scroller
		build_extension SearchBuilder
		build_extension SearchPanes
		build_extension Select
		build_extension StateRestore
		if [ -d ../extensions/Editor ]; then
			build_extension Editor
		fi
		;;

	"examples")
		build_examples
		;;

	"test")
		;;

	"js")
		build_js umd.js jquery.dataTables js
		build_js esm.js jquery.dataTables mjs
		;;

	"css")
		build_css
		;;

	"sync")
		# Sanity check that the working branch is going to build correctly
		CURR_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
		if [ $SYNC_BRANCH != $CURR_BRANCH ]; then
			echo_error "Working branch ($CURR_BRANCH) is not the same as the script branch ($SYNC_BRANCH)"
			echo_error "Exiting..."
			exit
		fi

		build_repo_sync
		;;

	"extension")
		build_extension $SUBCMD
		;;

	*)
		usage
esac


unset DT_BUILD

echo ""
echo_section "Done"
echo ""


