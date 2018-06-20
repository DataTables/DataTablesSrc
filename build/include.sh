#
# DataTables build environment variables and common functions
#

CLOSURE="/usr/local/closure_compiler/compiler.jar"
JSHINT="/usr/bin/jshint"


# CSS styling frameworks that DataTables supports
FRAMEWORKS=(
	'bootstrap4'
	'bootstrap'
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
		FILE=$(basename $1 .css)
		DIR=$(dirname $1)

		echo_msg "CSS compressing $FILE.css"
		sass --scss --stop-on-error --style compressed $DIR/$FILE.css > $DIR/$FILE.min.css
		
		echo_msg "  File size: $(ls -l $DIR/$FILE.min.css | awk -F" " '{ print $5 }')"
	fi
}

# Compile a SCSS file
#
# $1 - string - Full path to the file to compile
function scss_compile {
	FILE=$(basename $1 .scss)
	DIR=$(dirname $1)

	echo_msg "SCSS compiling $FILE.scss"
	sass --scss --stop-on-error --style expanded $DIR/$FILE.scss > $DIR/$FILE.css

	css_compress $DIR/$FILE.css
}

# Compile SCSS files for a specific extension and the supported frameworks
#
# $1 - string - Extension name (camelCase)
# $2 - string Build directory where the CSS files should be created
function css_frameworks {
	EXTN=$1
	DIR=$2

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
function js_frameworks {
	EXTN=$1
	DIR=$2

	for FRAMEWORK in ${FRAMEWORKS[*]}; do
		if [ -e $DIR/$1.$FRAMEWORK.js ]; then
			js_compress $DIR/$EXTN.$FRAMEWORK.js
		fi
	done
}

# Will compress a JS file using Closure compiler, saving the new file into the
# same directory as the uncompressed file, but with `.min.js` as the extension.
#
# $1 - string - Full path to the file to compress
# $2 - string - Enable ('on' - default) errors or disable ('off')
function js_compress {
	LOG=$2

	if [ -z "$DEBUG" ]; then
		FILE=$(basename $1 .js)
		DIR=$(dirname $1)

		echo_msg "JS compressing $FILE.js"

		# Closure Compiler doesn't support "important" comments so we add a
		# @license jsdoc comment to the license block to preserve it
		cp $DIR/$FILE.js /tmp/$FILE.js
		perl -i -0pe "s/^\/\*! (.*)$/\/** \@license \$1/s" /tmp/$FILE.js

		rm /tmp/closure_error.log
		java -jar $CLOSURE --charset 'utf-8' --js /tmp/$FILE.js > /tmp/$FILE.min.js 2> /tmp/closure_error.log

		if [ -e /tmp/closure_error.log ]; then
			if [ -z "$LOG" -o "$LOG" = "on" ]; then
				cat /tmp/closure_error.log
			fi
		fi

		# And add the important comment back in
		perl -i -0pe "s/^\/\*/\/*!/s" /tmp/$FILE.min.js

		mv /tmp/$FILE.min.js $DIR/$FILE.min.js
		rm /tmp/$FILE.js

		echo_msg "  File size: $(ls -l $DIR/$FILE.min.js | awk -F" " '{ print $5 }')"
	fi
}

# $1 - string - Full path to input file
# $2 - string - Full path to use for the output file
function js_require {
	IN_FILE=$(basename $1)
	DIR=$(dirname $1)
	OUT=$2
	CURR_DIR=$(pwd)

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

