<?php

$file = $argv[1];
$tmpName = '/tmp/dt-formatting.js';

if ( ! is_file( $file ) ) {
	throw new Exception("File $file not found", 1);
}

$xmlString = file_get_contents($file);
$xml = simplexml_load_string( $xmlString );
$counter = 1;

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
			'--trailing-comma none '.
			'--write '.
			$tmpName .' '.
			'2>&1',
		$output,
		$result
	);

	unset($output); // don't care

	if ($result !== 0) {
		echo "Invalid syntax: Example $counter - $file\n";
	}
	else {
		$formatted = file_get_contents($tmpName);

		// Doing a string replace rather than XML as I don't want PHP to
		// reformat the XML!
		$xmlString = str_replace($code, "\n".$formatted, $xmlString);
	}

	// echo $xmlString;

	unlink($tmpName);

	$counter++;
}

file_put_contents($file, $xmlString);
