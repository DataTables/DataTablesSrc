#
# DataTables build environment variables and common functions
#

CLOSURE="/usr/local/closure_compiler/compiler.jar"
JSDOC="/usr/local/jsdoc/jsdoc"


# $1 - string - section name to echo
function echo_section {
	# Cyan
	echo "\033[0;36m  ${1}\033[0m"
}

# $1 - string - message to echo
function echo_msg {
	# Green
	echo "\033[0;32m    ${1}\033[0m"
}

# $1 - string - error to echo
function echo_error {
	# Red
	echo "\033[0;31m  ${1}\033[0m"
}

# Will compress a CSS file using SASS, saving the new file into the same
# directory as the uncompressed file, but with `.min.css` as the extension.
#
# $1 - string - Full path to the file to compress
function css_compress {
	# Only compresses CSS at the moment
	# TODO extend to support SCSS as well
	if [ -z "$DEBUG" ]; then
		FILE=$(basename $1 .css)
		DIR=$(dirname $1)

		echo_msg "CSS compressing $FILE.css"
		sass --scss --stop-on-error --style compressed $DIR/$FILE.css > $DIR/$FILE.min.css
	fi
}

# Will compress a JS file using Closure compiler, saving the new file into the
# same directory as the uncompressed file, but with `.min.js` as the extension.
#
# $1 - string - Full path to the file to compress
function js_compress {
	if [ -z "$DEBUG" ]; then
		FILE=$(basename $1 .js)
		DIR=$(dirname $1)

		echo_msg "JS compressing $FILE.js"

		# Closure Compiler doesn't support "important" comments so we add a
		# @license jsdoc comment to the license block to preserve it
		cp $DIR/$FILE.js /tmp/$FILE.js
		perl -i -0pe "s/^\/\*! (.*)$/\/** \@license \$1/s" /tmp/$FILE.js

		java -jar $CLOSURE --charset 'utf-8' --js /tmp/$FILE.js > /tmp/$FILE.min.js

		# And add the important comment back in
		perl -i -0pe "s/^\/\*/\/*!/s" /tmp/$FILE.min.js

		mv /tmp/$FILE.min.js $DIR/$FILE.min.js
		rm /tmp/$FILE.js
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
		-o $OUT_DIR \
		-u ${DT_SRC}/build/templates/example_index.html \
		-t ${DT_SRC}/build/templates/example.html \
		-c "demo:${DT_BUILT}/examples/resources/demo.css" \
		-j "demo:${DT_BUILT}/examples/resources/demo.js" \
		-c "syntax:${DT_BUILT}/examples/resources/syntax/shCore.css" \
		-j "syntax:${DT_BUILT}/examples/resources/syntax/shCore.js" \
		-m "${DT_BUILT}/media" \
		-l "css:syntax css:demo js:syntax js:demo"
}

