<?php

require( 'lib/DT_Example.php' );

// if ( $argc !== 5 ) {
// 	echo 'Wrong usage';
//	exit;
// }

// argv[1] - examples location - this will remove the XML files!
//         - this allows a bash `cp -r` and then work on the copy
$dir_input = realpath( $argv[1] );
if ( $dir_input === false ) {
	throw new Exception('Media path does not exist: '.$argv[1], 1);
}

// argv[2] - js and css directory name (at the same level as the examples folder)
$dir_media = $argv[2];

// argv[3] - index template file
$file_index_template = realpath( $argv[3] );
if ( $file_index_template === false ) {
	throw new Exception('Media path does not exist: '.$argv[3], 1);
}

// argv[4] - example template file
$file_example_template = realpath( $argv[4] );
if ( $file_example_template === false ) {
	throw new Exception('Media path does not exist: '.$argv[4], 1);
}

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
read_structure( $examples, $dir_input, $dir_media, $file_index_template, $file_example_template );

// Remove any directories without examples
tidy_structure( $examples, $dir_order );

toc_structure( $examples );

process_structure( $examples );


//dump_structure( $examples );


// Build a table of contents


// Transform the examples

// $example = new DT_Example( $argv[1] );
// echo $example->transform( '../example.html' );



function read_structure ( &$examples, $dir, $dir_media, $index_template, $example_template )
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

			read_structure( $sub['files'], $dir.'/'.$file, $dir_media, $index_template, $example_template );
			$examples[] = $sub;
		}
		else if ( $fileParts['extension'] === 'xml' ) {
			$example = new DT_Example(
				$dir.'/'.$file,
				$fileParts['filename'] === 'index' ?
					$index_template :
					$example_template,
				$dir_media
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

	return '<h3><a href="'.$link.'">'.$category['title'].'</a></h3>'.
		'<ul class="toc'.($inCategory ? ' active' : '').'">'.$out.'</ul>';
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

