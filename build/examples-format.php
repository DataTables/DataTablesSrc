<?php

$file = $argv[1];
$tmpName = '/tmp/dt-formatting.js';

if ( ! is_file( $file ) ) {
	throw new Exception("File $file not found", 1);
}

$xmlString = file_get_contents($file);
$xml = simplexml_load_string( $xmlString );

foreach ($xml->example as $key => $example) {
	$code = (string)$example;

	file_put_contents($tmpName, $code);

	exec(
		'/home/vagrant/DataTablesSrc/node_modules/.bin/prettier-m '.
		'--break-before-else '.
		'--break-long-method-chains '.
		'--single-quote '.
		'--use-tabs '.
		'--indent-chains '.
		'--write '.
		$tmpName
	);

	$formatted = file_get_contents($tmpName);
	unlink($tmpName);

	// Doing a string replace rather than XML as I don't want PHP to
	// reformat the XML!
	$xmlString = str_replace($code, "\n".$formatted, $xmlString);

	echo $xmlString;

	// echo $formatted;
}
