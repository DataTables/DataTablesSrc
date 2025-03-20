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

	for file in $(find $SRC_DIR -name "dataTables.*.scss"); do
		filename=$(basename $file .scss)
		$SASS --no-charset --stop-on-error --style expanded $file > $OUT_DIR/$filename.css
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


function build_examples {
	echo_section "Examples"

	SRC_DIR="${BASE_DIR}/examples"
	OUT_DIR="${BUILD_DIR}/examples"
	TEMPLATE_DIR="${BASE_DIR}/build/templates"

	if [ -e $OUT_DIR ]; then
		rm -Rf $OUT_DIR
	fi

	$SASS --stop-on-error --style expanded $SRC_DIR/resources/demo.scss > $SRC_DIR/resources/demo.css

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
		-m "${BUILD_DIR}" \
		-l "css:syntax css:demo js:syntax js:demo"
}


function build_lint {
	echo_section "Lint"

	if [ -e $ESLINT ]; then
		$ESLINT ${BUILD_DIR}/js/dataTables.js
		RESULT=$?

		if [ $RESULT -ne 0 ]; then
			echo_error "Lint failed"
		else
			echo_msg "Pass"
		fi
	else
		echo_error "ESLint not installed"
	fi
}


# Use the latest JS, CSS etc in the DataTables build repo
# Assumes that the files have already been built
function build_repo {
	echo_section "Deploying to build repo"
	update_build_repo

	# Build DataTables with two different loader types
	build_js umd.js dataTables js
	build_js esm.js dataTables mjs

	echo_section "Styling frameworks JS"

	js_frameworks dataTables $OUT_DIR "jquery datatables.net"
	build_css
	build_types
	build_examples
	build_lint

	#echo $BUILD_DIR
	cp $BUILD_DIR/js/* ${BUILD_DIR}/DataTables/js/
	cp $BUILD_DIR/css/* ${BUILD_DIR}/DataTables/css/

	if [ ! -d "${BUILD_DIR}/DataTables/types" ]; then
		mkdir ${BUILD_DIR}/DataTables/types
	fi

	cp $BUILD_DIR/types/* ${BUILD_DIR}/DataTables/types

	if [ -e ${BUILD_DIR}/DataTables/examples ]; then
		rm -Rf ${BUILD_DIR}/DataTables/examples
	fi
	cp -r $BUILD_DIR/examples ${BUILD_DIR}/DataTables/examples

	# Create the manifest files for the various package managers
	build_descriptors
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
		mkdir ${BUILD_DIR}/DataTables
	fi

	if [ ! -d "${BUILD_DIR}/DataTables/js" ]; then
		mkdir ${BUILD_DIR}/DataTables/js
	fi

	if [ ! -d "${BUILD_DIR}/DataTables/css" ]; then
		mkdir ${BUILD_DIR}/DataTables/css
	fi
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

function requirements {
	if ! [ -x "$(command -v php)" ]; then
		echo "Error: php is not installed and is required to build the examples."
		echo "  Install with 'sudo apt install php php-xml php-mbstring php-curl' or similar for your platform"
		exit 1
	fi

	TEST=$(php -i | grep xml.ini)
	if [ $? -eq 1 ]; then
		echo "Error: php's xml module is not installed and is required to build the examples."
		echo "  Install with 'sudo apt install php-xml' or similar for your platform"
		exit 1
	fi

	TEST=$(php -i | grep mbstring.ini)
	if [ $? -eq 1 ]; then
		echo "Error: php's mbstring module is not installed and is required to build the examples."
		echo "  Install with 'sudo apt install php-mbstring' or similar for your platform"
		exit 1
	fi

	TEST=$(php -i | grep curl.ini)
	if [ $? -eq 1 ]; then
		echo "Error: php's curl module is not installed and is required to build the examples."
		echo "  Install with 'sudo apt install php-curl' or similar for your platform"
		exit 1
	fi

	TEST=$(php -i | grep tidy.ini)
	if [ $? -eq 1 ]; then
		echo "Warning: php's tidy module is not installed and is used to clean up build the examples."
		echo "  Install with 'sudo apt install php-tidy' or similar for your platform"
	fi

	if ! [ -x "$(command -v chromium)" ]; then
		if ! [ -x "$(command -v google-chrome)" ]; then
			echo "Warning: Neither Chrome nor Chromium is installed, and is used for the unit tests."
			echo "  Install with 'sudo apt install chromium-browser' or similar for your platform"
		fi
	fi

	if [ ! -d node_modules ]; then
		npm install
	fi
}



function usage {
	echo "  Usage: make.sh <cmd> [debug]

    where <cmd> is one of:

      all [debug]   - Build DataTables core and all extensions

      build [debug] - Build DataTables (css, examples, and js). Resultant
                      files are in 'built/DataTables'

      css           - Create the DataTables CSS files

      examples      - Build the examples

      extension <ext> [debug] - Extension to build where <ext> is one of:
        - AutoFill
        - Buttons
        - ColReorder
        - ColumnControl
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

      js            - Create the DataTables JavaScript file

      serve         - Run an HTTP server to allow the built examples to load

      test          - Build the unit tests

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

# Check we have what is needed for the build
requirements

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
		build_extension ColumnControl
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
		build_js umd.js dataTables js
		build_js esm.js dataTables mjs
		;;

	"css")
		build_css
		;;

	"extension")
		build_extension $SUBCMD
		;;

	"serve")
		npx http-server built/DataTables/
		;;

	*)
		usage
esac


unset DT_BUILD

echo ""
echo_section "Done"
echo ""


