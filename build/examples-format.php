<?php
/*
 * DataTables reference documentation and examples formatting
 */
error_reporting(\E_ALL);
ini_set('display_errors', '1');

define( 'TMPNAME', '/tmp/dt-formatting.js');

$file = $argv[1];

if ( ! is_file( $file ) ) {
	throw new Exception("File $file not found", 1);
}

$xmlString = file_get_contents($file);
$xml = simplexml_load_string( $xmlString );
$counter = 1;

// Examples
foreach ($xml->example as $key => $example) {
	$code = (string)$example;

	$replaced = replacements($code);
	warnings($replaced, $file, $xml);

	$formatted = format($replaced, $counter, $file);

	// Doing a string replace rather than XML as I don't want PHP to
	// reformat the XML!
	$xmlString = str_replace($code, "\n".$formatted, $xmlString);

	$counter++;
}

// Reference docs
foreach ($xml->js as $key => $js) {
	$code = trim((string)$js);

	warnings($code, $file, $xml);

	$formatted = format($code, $counter, $file);
	$formatted = trim($formatted);
	$xmlString = str_replace($code, $formatted, $xmlString);

	$counter++;
}

foreach ($xml->{'js-vanilla'} as $key => $js) {
	$code = trim((string)$js);

	warnings($code, $file, $xml);

	$formatted = format($code, $counter, $file);
	$formatted = trim($formatted);
	$xmlString = str_replace($code, $formatted, $xmlString);

	$counter++;
}

// Finish
file_put_contents($file, $xmlString);


/**
 * Use the external prettier-m program to format the code
 */
function format ( $jsCode, $counter, $file ) {
	// Save into a file which will be formatted
	file_put_contents(TMPNAME, $jsCode);

	// Formatted
	exec(
		'/home/vagrant/DataTablesSrc/node_modules/.bin/prettier-m '.
			'--break-before-else '.
			'--break-long-method-chains '.
			'--single-quote '.
			'--use-tabs '.
			'--indent-chains '.
			'--trailing-comma none '.
			'--write '.
			TMPNAME .' '.
			'2>&1',
		$output,
		$result
	);

	unset($output); // don't care

	if ($result !== 0) {
		echo "Invalid syntax: Example $counter - $file\n";
		unlink(TMPNAME);

		return $jsCode;
	}
	else {
		$formatted = file_get_contents(TMPNAME);
		unlink(TMPNAME);

		return $formatted;
	}
}


/**
 * Update any code examples from old style to new with simple
 * replacements
 */
function replacements( $example ) {
	$example = preg_replace(
		'/\$\(["\']#(example|myTable)["\']\)\.DataTable\( ?\{/',
		'new DataTable(\'#myTable\', {',
		$example
	);

	$example = preg_replace(
		'/\$\(["\']#(example|myTable)["\']\)\.DataTable\(\)/',
		'new DataTable(\'#myTable\')',
		$example
	);

	$example = preg_replace(
		'/\$\.fn\.[dD]ataTables?\./',
		'DataTable.',
		$example
	);

	return $example;
}

/**
 * Identify legacy code that needs to be updated
 */
function warnings($example, $path, $xml) {
	if (preg_match('/\$\(.*dataTable/', $example) === 1) {
		echo "$path - Old jQuery style init\n";
	}

	if (preg_match('/dom["\']?:/', $example) === 1) {
		echo "$path - dom parameter found. Needs to be updated to be to `layout`\n";
	}

	if (preg_match('/deferRender: true/', $example) === 1) {
		echo "$path - deferRender found with new default value set\n";
	}

	descriptionWarnings((string)$xml->description, $path);
	descriptionWarnings((string)$xml->info, $path);
}

function descriptionWarnings($description, $path) {

	if (strpos($description, '-init dom') !== false) {
		echo "$path - Description includes a reference to the `dom` parameter\n";
	}
	if (strpos($description, '-init stateRestore') !== false) {
		echo "$path - Description includes a reference to a StateRestore param - they don't exist, they are in the type now\n";
	}
}