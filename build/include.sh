#
# DataTables build environment variables and common functions
#

CLOSURE="/usr/local/closure_compiler/compiler.jar"
JSHINT="/usr/bin/jshint"


# CSS styling frameworks that DataTables supports
FRAMEWORKS=(
	'bootstrap5'
	'bootstrap4'
	'bootstrap'
	'bulma'
	'foundation'
	'jqueryui'
	'semanticui'
	'material'
	'uikit'
	'dataTables'
)


# $1 - string - file to get the version from
function version_from_file {
	echo $(grep " * @version     " $1 | awk -F" " '{ print $3 }')
}

# $1 - string - section name to echo
function echo_section {
	# Cyan
	printf "\033[0;36m  %s\033[0m \n" "$1"
}

# $1 - string - message to echo
function echo_msg {
	# Green
	printf "\033[0;32m    %s\033[0m \n" "$1"
}

# $1 - string - error to echo
function echo_error {
	# Red
	printf "\033[0;31m  %s\033[0m \n" "$1"
}

# Will compress a CSS file using SASS, saving the new file into the same
# directory as the uncompressed file, but with `.min.css` as the extension.
#
# $1 - string - Full path to the file to compress
function css_compress {
	# Only compresses CSS at the moment
	if [ -z "$DEBUG" ]; then
		local FILE=$(basename $1 .css)
		local DIR=$(dirname $1)

		echo_msg "CSS compressing $FILE.css"
		sass --no-charset --stop-on-error --style compressed $DIR/$FILE.css > $DIR/$FILE.min.css
		
		echo_msg "  File size: $(ls -l $DIR/$FILE.min.css | awk -F" " '{ print $5 }')"
	fi
}

# Compile a SCSS file
#
# $1 - string - Full path to the file to compile
function scss_compile {
	local FILE=$(basename $1 .scss)
	local DIR=$(dirname $1)

	echo_msg "SCSS compiling $FILE.scss"
	sass --no-charset --stop-on-error --style expanded $DIR/$FILE.scss > $DIR/$FILE.css

	css_compress $DIR/$FILE.css
}

# Compile SCSS files for a specific extension and the supported frameworks
#
# $1 - string - Extension name (camelCase)
# $2 - string Build directory where the CSS files should be created
function css_frameworks {
	local EXTN=$1
	local DIR=$2

	for FRAMEWORK in ${FRAMEWORKS[*]}; do
		if [ -e $DIR/$1.$FRAMEWORK.scss ]; then
			scss_compile $DIR/$EXTN.$FRAMEWORK.scss
			rm $DIR/$EXTN.$FRAMEWORK.scss
		fi
	done
}

# Compress JS files for a specific extension and the supported frameworks
#
# $1 string - Extension name (camelCase)
# $2 string - Build directory where the JS min files should be created
# $3 string - Require libs `FW` will be replaced with the framework code
function js_frameworks {
	local EXTN=$1
	local DIR=$2
	local REQUIRE=$3

	for FRAMEWORK in ${FRAMEWORKS[*]}; do
		if [ -e $DIR/$1.$FRAMEWORK.js ]; then
			js_wrap $DIR/$EXTN.$FRAMEWORK.js "$REQUIRE"
		fi
	done
}

# Wrap a source file for ES and UMD loaders
# Note that this is not used by DataTables core itself
# (although the styling frameworks do).
#
# $1 - string - Full path to the file to wrap
# $2 - string - Require libs
function js_wrap {
	local FULL=$1
	local REQUIRE=$2

	local EXTN="${FULL##*.}"
	local FILE=$(basename $1 ".${EXTN}")
	local DIR=$(dirname $1)
	local WRAPPER="${SCRIPT_DIR}/wrapper.js"

	if [ ! -z "$DT_DIR" ]; then
		WRAPPER="$DT_DIR/build/wrapper.js"
	fi

	echo_msg "JS processing $FILE"

	echo_msg "  Creating ES module"
	node $WRAPPER $FULL es $DIR/$FILE "$REQUIRE"
	js_compress "$DIR/$FILE.mjs"

	echo_msg "  Creating UMD"
	node $WRAPPER $FULL umd $DIR/$FILE "$REQUIRE"
	js_compress "$DIR/$FILE.js"
}


# Will compress a JS file, saving the new file into the
# same directory as the uncompressed file, but with `.min.`
# added into the file's extension
#
# $1 - string - Full path to the file to compress
# $2 - string - Require libs
function js_compress {
	local LOG=$2

	if [ -z "$DEBUG" ]; then
		local FULL=$1
		local COMP_EXTN="${FULL##*.}"
		local FILE=$(basename $1 ".${COMP_EXTN}")
		local DIR=$(dirname $1)

		if ! command -v uglifyjs &> /dev/null
		then
			echo_error "Uglifyjs not installed - attempting install"
			npm install -g uglify-js
		fi

		echo_msg "  Minification - $COMP_EXTN"

		# Closure Compiler doesn't support "important" comments so we add a
		# @license jsdoc comment to the license block to preserve it
		cp $DIR/$FILE.$COMP_EXTN /tmp/$FILE.$COMP_EXTN
		perl -i -0pe "s/^\/\*! (.*)$/\/** \@license \$1/s" /tmp/$FILE.$COMP_EXTN

		uglifyjs /tmp/$FILE.$COMP_EXTN -c -m -o /tmp/$FILE.min.$COMP_EXTN 

		# And add the important comment back in
		perl -i -0pe "s/^\/\*/\/*!/s" /tmp/$FILE.min.$COMP_EXTN

		mv /tmp/$FILE.min.$COMP_EXTN $DIR/$FILE.min.$COMP_EXTN
		rm /tmp/$FILE.$COMP_EXTN

		echo_msg "    File size: $(ls -l $DIR/$FILE.min.$COMP_EXTN | awk -F" " '{ print $5 }')"
	fi
}

# $1 - string - Full path to input file
# $2 - string - Full path to use for the output file
function js_require {
	local IN_FILE=$(basename $1)
	local DIR=$(dirname $1)
	local OUT=$2
	local CURR_DIR=$(pwd)

	cd $DIR

	OLD_IFS=$IFS
	IFS='%'

	cp $IN_FILE $IN_FILE.build
	grep "_buildInclude('" $IN_FILE.build > /dev/null

	while [ $? -eq 0 ]; do
		REQUIRE=$(grep "_buildInclude('" $IN_FILE.build | head -n 1)

		SPACER=$(echo ${REQUIRE} | cut -d _ -f 1)
		FILE=$(echo ${REQUIRE} | sed -e "s#^.*_buildInclude('##g" -e "s#');##")
		DIR=$(echo ${FILE} | cut -d \. -f 1)

		sed "s#^#${SPACER}#" < ${DIR}/${FILE} > ${DIR}/${FILE}.build

		sed -e "/${REQUIRE}/r ${DIR}/${FILE}.build" -e "/${REQUIRE}/d" < $IN_FILE.build > $IN_FILE.out
		mv $IN_FILE.out $IN_FILE.build

		rm ${DIR}/${FILE}.build

		grep "_buildInclude('" $IN_FILE.build > /dev/null
	done

	mv $IN_FILE.build $OUT

	IFS=$OLD_IFS

	cd $CURR_DIR
}

# Run JSHint over a JS file
#
# $1 - string - Full path to input file
function js_hint {
	FILE=$1
	DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

	# JSHint
	if [ -e $JSHINT ]; then
		$JSHINT --config $DIR/jshint.config $FILE

		if [ $? -eq 0 ]; then
			echo_msg "JSHint passed"
		else
			echo_error "JSHint failed"
		fi
	else
		echo_error "JSHint not installed at $JSHINT - skipping"
	fi
}

# Process XML example files into HTML files - in place! The XML files will be
# removed.
#
# $1 - string - Path to the examples to processing - note that /examples is
#               added automatically
function examples_process {
	php ${DT_SRC}/build/examples.php \
		-d \
		-o $1 \
		-u ${DT_SRC}/build/templates/example_index.html \
		-t ${DT_SRC}/build/templates/example.html \
		-c "demo:${DT_BUILT}/examples/resources/demo.css" \
		-j "demo:${DT_BUILT}/examples/resources/demo.js" \
		-c "syntax:${DT_BUILT}/examples/resources/syntax/shCore.css" \
		-j "syntax:${DT_BUILT}/examples/resources/syntax/shCore.js" \
		-m "${DT_BUILT}/media" \
		-l "css:syntax css:demo js:syntax js:demo"
}

