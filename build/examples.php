<?php

require( 'lib/DT_Example.php' );


/*
 * Configuration options
 */
$dir_order = array(
	'basic_init',
	'advanced_init',
	'styling',
	'data_sources',
	'ajax',
	'server_side',
	'api',
	'plug-ins'
);


/*
 * Command line options
 */
$shortopts  = "c:";  // CSS library (added to the predefined libraries)
$shortopts .= "j:";  // JS library (added to the predefined libraries)
$shortopts .= "l:";  // Libraries to add to the XML library list
$shortopts .= "m:";  // Media library (DataTables and jQuery)
$shortopts .= "o:";  // Input / Output directory (replaces the XML files)
$shortopts .= "t:";  // Example template
$shortopts .= "u:";  // Example index template

$longopts  = array(
	"css:",
	"js:",
	"libs:",
	"media:",
	"output:",
	"template:",
	"index-template:"
);


/*
 * Initial settings
 */
$dir_input = '';
$dir_media = '';
$file_index_template = '';
$file_example_template = '';
$additional_libs = array(
	'css' => array(),
	'js'  => array()
);


/*
 * Command line options
 */
$options = getopt( $shortopts, $longopts );

foreach ($options as $key => $value) {
	switch( $key ) {
		case "c":
		case "css":
			$a = explode(':', $value);
			DT_Example::$lookup_libraries['css'][$a[0]] = realpath( $a[1] );
			break;

		case "j":
		case "js":
			$a = explode(':', $value);
			DT_Example::$lookup_libraries['js'][$a[0]] = realpath( $a[1] );
			break;

		case "l":
		case "libs":
			$a = explode(' ', $value);
			for ( $i=0 ; $i<count($a) ; $i++ ) {
				$b = explode(':', $a[$i]);
				$additional_libs[ $b[0] ][] = $b[1];
			}
			break;

		case "m":
		case "media":
			$dir_media = path_simplify( $value );
			break;

		case "o":
		case "output":
			$dir_input = $value;
			break;

		case "t":
		case "template":
			$file_example_template = realpath( $value );
			break;

		case "u":
		case "index-template":
			$file_index_template = realpath( $value );
			break;
	}
}

// Default libraries
DT_Example::$lookup_libraries['css']['datatables']          = $dir_media.'/css/jquery.dataTables.css';
DT_Example::$lookup_libraries['css']['datatables-jqueryui'] = $dir_media.'/css/jquery.dataTables_themeroller.css';

DT_Example::$lookup_libraries['js']['jquery']      = $dir_media.'/js/jquery.js';
DT_Example::$lookup_libraries['js']['datatables']  = $dir_media.'/js/jquery.dataTables.js';

//print_r( DT_Example::$lookup_libraries );

// Structure
//   "type"  => "file",
//   "src"   => "...",
//   "title" => "...",
//   "name"  => "...",
//   "data"  => DT_Example,
//   "order" => int
//
//   "type"  => "dir",
//   "files" => array()
//   "name"  => "..."
$examples = array();



// Read the files into the examples array
read_structure( $examples, $dir_input, $file_index_template, $file_example_template, $additional_libs );

// Remove any directories without examples
tidy_structure( $examples, $dir_order );

toc_structure( $examples );

process_structure( $examples );

//dump_structure( $examples );




function read_structure ( &$examples, $dir, $index_template, $example_template, $additional_libs )
{
	$dh = opendir( $dir );

	while (($file = readdir($dh)) !== false) {
		if ( $file == '.' || $file == '..' ) {
			continue;
		}

		$fileParts = pathinfo( $file );

		if ( is_dir( $dir.'/'.$file ) ) {
			$sub = array(
				'type'  => 'dir',
				'name'  => $file,
				'order' => 0,
				'files' => array(),
				'toc'   => '',
				'title' => ucwords( str_replace('_', ' ', $file) ),
				'path'  => $dir
			);

			read_structure( $sub['files'], $dir.'/'.$file, $index_template, $example_template, $additional_libs );
			$examples[] = $sub;
		}
		else if ( $fileParts['extension'] === 'xml' ) {
			$example = new DT_Example(
				$dir.'/'.$file,
				$fileParts['filename'] === 'index' ?
					$index_template :
					$example_template,
				function ( $path ) use ( $dir, $fileParts ) {
					return path_resolve( $dir.'/'.$fileParts['filename'].'.html', $path );
				},
				$additional_libs
			);
			$examples[] = array(
				'type'  => 'file',
				'name'  => $fileParts['filename'],
				'data'  => $example,
				'title' => $example->title(),
				'order' => $example->order(),
				'path'  => $dir
			);
		}
	}

	closedir( $dh );
}


function tidy_structure ( &$examples, $order )
{
	for ( $i=count($examples)-1 ; $i>=0 ; $i-- ) {
		if ( $examples[$i]['type'] === 'dir' &&
			 count($examples[$i]['files']) === 0
		) {
			// Remove any directories which are empty
			array_splice( $examples, $i, 1 );
		}
		else if ( $examples[$i]['type'] === 'dir' &&
			      ! has_files( $examples[$i]['files'] )
		) {
			// Remove any directories have only directories for children
			array_splice( $examples, $i, 1 );
		}
		else if ( $examples[$i]['type'] === 'dir' ) {
			tidy_structure( $examples[$i]['files'], $order );

			// Order the examples
			usort( $examples[$i]['files'], function ($a, $b) {
				if ( $a['order'] === $b['order'] ) {
					return 0;
				}
				return ($a['order'] < $b['order']) ? -1 : 1;
			} );
		}
	}

	// Order the top level directories
	usort( $examples, function ( $a, $b ) use( $order ) {
		if ( $a['type'] === 'file' && $b['type'] === 'file' ) {
			return 0;
		}
		else if ( $a['type'] === 'file' || $b['type'] === 'file' ) {
			return -1;
		}
		else {
			$idxA = array_search( $a['name'], $order );
			$idxB = array_search( $b['name'], $order );

			return $idxA === $idxB ? 0 :
				$idxA < $idxB ? -1 : 1;
		}
	} );
}


function dump_structure( &$examples, $pre="" )
{
	for ( $i=0, $ien=count($examples) ; $i<$ien ; $i++ ) {
		$example = $examples[$i];

		if ( $example['type'] === 'dir' ) {
			echo $pre.'  / '.$example['name']."\n";
			dump_structure( $example['files'], $pre.'  ' );
		}
		else {
			echo $pre.'  - '.$example['order'].'. '.$example['title']."\n";
		}
	}
}


function process_structure ( &$examples, $toc='', $cat='' )
{
	for ( $i=0, $ien=count($examples) ; $i<$ien ; $i++ ) {
		$example = $examples[$i];

		if ( $example['type'] === 'dir' ) {
			for ( $j=0, $jen=count($example['files']) ; $j<$jen ; $j++ ) {
				$subexample = $example['files'][$j];

				process_example( $examples, $subexample, $example );
			}
		}
		else {
			process_example( $examples, $example );
		}
	}
}


function process_example ( &$examples, $example, $category=null )
{
	try {
		// echo 'Want to write '.$example['name'].' to '.$example['path']."\n";

		$built = $example['data']->transform( array(
			'toc' => build_toc( $examples, $example, $category )
		) );

		file_put_contents(
			$example['path'].'/'.$example['name'].'.html',
			$built
		);
	}
	catch( Exception $e ) {
		echo 'ERROR: '.$category['name'].'/'.$example['name'].' '.$e->getMessage()."\n";
	}

	unlink( $example['path'].'/'.$example['name'].'.xml' );
}


function build_toc ( $examples, $example, $category )
{
	if ( $example['name'] === 'index' && $category !== null ) {
		// Restrict to just the category
		return build_toc_category( $category, $example );	
	}
	else {
		// Use all examples
		$out = '';

		for ( $i=0, $ien=count($examples) ; $i<$ien ; $i++ ) {
			if ( $examples[$i]['type'] === 'dir' ) {
				$out .= build_toc_category( $examples[$i], $example );
			}
		}

		return $out;
	}
}


function build_toc_category ( $category, $current=null )
{
	$inCategory = false;
	$out = '';

	for ( $i=0, $ien=count($category['files']) ; $i<$ien ; $i++ ) {
		$example = $category['files'][$i];

		if ( $example['name'] !== 'index' ) {
			$class = '';
			if ( $example === $current ) {
				$class = ' class="active"';
				$inCategory = true;
			}

			$link = '';
			if ( $current ) {
				$link = path_resolve(
					$current['path'].'/'.$current['name'].'.html',
					$example['path'].'/'.$example['name'].'.html'
				) ."\n";
			}
			$out .= '<li'.$class.'><a href="'.$link.'">'.$example['title'].'</a></li>';
		}
	}

	$link = '';
	if ( $current ) {
		$link = path_resolve(
			$current['path'].'/'.$current['name'].'.html',
			$category['path'].'/'.$category['name'].'/index.html'
		) ."\n";
	}

	return '<div class="toc-group">'.
			'<h3><a href="'.$link.'">'.$category['title'].'</a></h3>'.
			'<ul class="toc'.($inCategory ? ' active' : '').'">'.$out.'</ul>'.
		'</div>';
}



function has_files ( $files )
{
	for ( $i=0, $ien=count($files) ; $i<$ien ; $i++ ) {
		if ( $files[$i]['type'] === 'file' ) {
			return true;
		}
	}

	return false;
}






function toc_structure ( &$examples )
{
	for ( $i=0, $ien=count($examples) ; $i<$ien ; $i++ ) {
		$group = &$examples[$i];

		if ( $group['type'] === 'dir' ) {
			$files = $group['files'];
			$toc = '';

			for ( $j=0, $jen=count($files) ; $j<$jen ; $j++ ) {
				$toc .= '<li><a href="'.$files[$j]['name'].'.html">'.
						$files[$j]['title'].
					'</a></li>';
			}

			$group['toc'] = '<h2>'.$group['title'].'</h2>'.
				'<ul class="toc">'.$toc.'</ul>';
		}
	}
}


function path_resolve( $from, $to )
{
	$from = path_simplify( $from );
	$to = path_simplify( $to );

	// some compatibility fixes for Windows paths
	$from = is_dir($from) ? rtrim($from, '\/') . '/' : $from;
	$to   = is_dir($to)   ? rtrim($to, '\/') . '/'   : $to;
	$from = str_replace('\\', '/', $from);
	$to   = str_replace('\\', '/', $to);

	$from     = explode('/', $from);
	$to       = explode('/', $to);
	$relPath  = $to;

	foreach ( $from as $depth => $dir ) {
		// find first non-matching dir
		if ( $dir === $to[$depth] ) {
			// ignore this directory
			array_shift($relPath);
		}
		else {
			// get number of remaining dirs to $from
			$remaining = count($from) - $depth;
			if ( $remaining > 1 ) {
				// add traversals up to first matching dir
				$padLength = (count($relPath) + $remaining - 1) * -1;
				$relPath = array_pad($relPath, $padLength, '..');
				break;
			}
			else {
				$relPath[0] = './' . $relPath[0];
			}
		}
	}

	if ( count($relPath) === 0 ) {
		return './'.$from[ count($from)-1 ];
	}

	return implode('/', $relPath);
}


function path_simplify( $path )
{
	$out = array();
	$a = explode('/', $path);

	for ( $i=count($a)-1 ; $i>= 0 ; $i-- ) {
		if ( $a[$i] !== '..' ) {
			array_unshift( $out, $a[$i] );
		}
		else {
			// Skip the next path as well
			$i--;
		}
	}

	return implode( '/', $out);
}

