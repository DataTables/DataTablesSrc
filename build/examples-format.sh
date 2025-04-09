#!/bin/sh

#
# Can be used on both examples directories and docs. Each has
# slightly different processing - the docs is more aggressive
# in updating code style.
#
# Call with the path to the directory with the xml files you
# want to process.
#

DOCS_DIR=$1

shopt -s globstar

if [ -z "$DOCS_DIR" ]; then
	echo "No documents directory given"
	exit;
fi

find $DOCS_DIR -name "*.xml" -print0 | while read -d $'\0' file
do
    # echo $(realpath -s $file)
	php examples-format.php $file
done
