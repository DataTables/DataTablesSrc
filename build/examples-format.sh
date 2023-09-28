#!/bin/sh

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
	break
done
