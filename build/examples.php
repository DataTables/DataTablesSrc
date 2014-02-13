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
	'api',
	'ajax',
	'server_side',
	'plug-ins'
);

$dir_names = array(
	'basic_init'    => "Basic initialisation",
	'advanced_init' => "Advanced initialisation",
	'styling'       => "Styling",
	'data_sources'  => "Data sources",
	'api'           => "API",
	'ajax'          => "Ajax",
	'server_side'   => "Server-side",
	'plug-ins'      => "Plug-ins"
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
$shortopts .= "d";  // Do not create data files

$longopts  = array(
	"css:",
	"js:",
	"libs:",
	"media:",
	"output:",
	"template:",
	"index-template:",
	"no-data-files"
);

$options = getopt( $shortopts, $longopts );

/*
 * Initial settings
 */
$create_data_files = true;
$dir_input = '';
$dir_media = '';
$file_index_template = '';
$file_example_template = '';
$additional_libs = array(
	'css' => array(),
	'js'  => array()
);

if ( isset( $options['m'] ) ) {
	$dir_media = $options['m'];
}
else if ( isset( $options['media'] ) ) {
	$dir_media = $options['media'];
}

// Default libraries
DT_Example::$lookup_libraries['js' ]['jquery']          = $dir_media.'/js/jquery.js';
DT_Example::$lookup_libraries['css']['datatables']      = $dir_media.'/css/jquery.dataTables.css';
DT_Example::$lookup_libraries['js' ]['datatables']      = $dir_media.'/js/jquery.dataTables.js';
DT_Example::$lookup_libraries['css']['autofill']        = path_simplify( $dir_media.'/../extensions/AutoFill/css/dataTables.autoFill.css' );
DT_Example::$lookup_libraries['js' ]['autofill']        = path_simplify( $dir_media.'/../extensions/AutoFill/js/dataTables.autoFill.js' );
DT_Example::$lookup_libraries['css']['colreorder']      = path_simplify( $dir_media.'/../extensions/ColReorder/css/dataTables.colReorder.css' );
DT_Example::$lookup_libraries['js' ]['colreorder']      = path_simplify( $dir_media.'/../extensions/ColReorder/js/dataTables.colReorder.js' );
DT_Example::$lookup_libraries['css']['colvis']          = path_simplify( $dir_media.'/../extensions/ColVis/css/dataTables.colVis.css' );
DT_Example::$lookup_libraries['css']['colvis-jqueryui'] = path_simplify( $dir_media.'/../extensions/ColVis/css/dataTables.colvis.jqueryui.css' );
DT_Example::$lookup_libraries['js' ]['colvis']          = path_simplify( $dir_media.'/../extensions/ColVis/js/dataTables.colVis.js' );
DT_Example::$lookup_libraries['css']['editor']          = path_simplify( $dir_media.'/../extensions/Editor/css/dataTables.editor.css' );
DT_Example::$lookup_libraries['js' ]['editor']          = path_simplify( $dir_media.'/../extensions/Editor/js/dataTables.editor.js' );
DT_Example::$lookup_libraries['css']['fixedcolumns']    = path_simplify( $dir_media.'/../extensions/FixedColumns/css/dataTables.fixedColumns.css' );
DT_Example::$lookup_libraries['js' ]['fixedcolumns']    = path_simplify( $dir_media.'/../extensions/FixedColumns/js/dataTables.fixedColumns.js' );
DT_Example::$lookup_libraries['css']['fixedheader']     = path_simplify( $dir_media.'/../extensions/FixedHeader/css/dataTables.fixedHeader.css' );
DT_Example::$lookup_libraries['js' ]['fixedheader']     = path_simplify( $dir_media.'/../extensions/FixedHeader/js/dataTables.fixedHeader.js' );
DT_Example::$lookup_libraries['css']['keytable']        = path_simplify( $dir_media.'/../extensions/KeyTable/css/dataTables.keyTable.css' );
DT_Example::$lookup_libraries['js' ]['keytable']        = path_simplify( $dir_media.'/../extensions/KeyTable/js/dataTables.keyTable.js' );
DT_Example::$lookup_libraries['css']['scroller']        = path_simplify( $dir_media.'/../extensions/Scroller/css/dataTables.scroller.css' );
DT_Example::$lookup_libraries['js' ]['scroller']        = path_simplify( $dir_media.'/../extensions/Scroller/js/dataTables.scroller.js' );
DT_Example::$lookup_libraries['css']['tabletools']      = path_simplify( $dir_media.'/../extensions/TableTools/css/dataTables.tableTools.css' );
DT_Example::$lookup_libraries['js' ]['tabletools']      = path_simplify( $dir_media.'/../extensions/TableTools/js/dataTables.tableTools.js' );


$versions = json_decode( file_get_contents( 'http://datatables.net/feeds/versions.php' ), true );
$pluginsHash = $versions['Plugins']['release']['version'];

DT_Example::$lookup_libraries['css']['datatables-bootstrap']  = '//cdn.datatables.net/plug-ins/'.$pluginsHash.'/integration/bootstrap/3/dataTables.bootstrap.css';
DT_Example::$lookup_libraries['js' ]['datatables-bootstrap']  = '//cdn.datatables.net/plug-ins/'.$pluginsHash.'/integration/bootstrap/3/dataTables.bootstrap.js';
DT_Example::$lookup_libraries['js' ]['editor-bootstrap']      = path_simplify( $dir_media.'/../extensions/Editor/examples/support/bootstrap/dataTables/dataTables.editor.bootstrap.js' );
DT_Example::$lookup_libraries['css']['datatables-foundation'] = '//cdn.datatables.net/plug-ins/'.$pluginsHash.'/integration/foundation/3/dataTables.foundation.css';
DT_Example::$lookup_libraries['js' ]['datatables-foundation'] = '//cdn.datatables.net/plug-ins/'.$pluginsHash.'/integration/foundation/3/dataTables.foundation.js';
DT_Example::$lookup_libraries['css']['datatables-jqueryui']   = '//cdn.datatables.net/plug-ins/'.$pluginsHash.'/integration/jqueryui/dataTables.jqueryui.css';
DT_Example::$lookup_libraries['js' ]['datatables-jqueryui']   = '//cdn.datatables.net/plug-ins/'.$pluginsHash.'/integration/jqueryui/dataTables.jqueryui.js';


function multiple ( $value, $fn )
{
	if ( is_array( $value ) ) {
		for ( $i=0, $ien=count($value) ; $i<$ien ; $i++ ) {
			$fn( $value[$i] );
		}
	}
	else {
		$fn( $value );
	}
}


/*
 * Command line options
 */

foreach ($options as $key => $value) {
	switch( $key ) {
		case "c":
		case "css":
			multiple( $value, function ( $val ) {
				$a = explode(':', $val);

				if ( strpos($a[1], '//') === 0 ) {
					DT_Example::$lookup_libraries['css'][$a[0]] = $a[1];
				}
				else {
					$get = explode('?', $a[1]);
					DT_Example::$lookup_libraries['css'][$a[0]] =
						realpath( $get[0] ).( count($get)>1 ? '?'.$get[1] : '' );
				}
			} );
			break;

		case "j":
		case "js":
			multiple( $value, function ( $val ) {
				$a = explode(':', $val);

				if ( strpos($a[1], '//') === 0 ) {
					DT_Example::$lookup_libraries['js'][$a[0]] = $a[1];
				}
				else {
					$get = explode('?', $a[1]);
					DT_Example::$lookup_libraries['js'][$a[0]] =
						realpath( $get[0] ).( count($get)>1 ? '?'.$get[1] : '' );
				}
			} );
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

		case "d":
		case "no-data-files":
			$create_data_files = false;
			break;

		default:
			break;
	}
}

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

if ( $create_data_files ) {
	json_files( $dir_input );
	sql_files( $dir_input );
}

//dump_structure( $examples );




// Create the JSON files needed for the Ajax examples
function sql_files ( $out_dir )
{
	$out_dir = $out_dir.'/server_side/scripts';

	$json = json_decode(
		file_get_contents( dirname(__FILE__).'/data.json' ),
		true
	);

	$out = [];
	for ( $i=0, $ien=count($json) ; $i<$ien ; $i++ ) {
		$out[] = "( ".
			    $json[$i]['id'].", ".
			"'".$json[$i]['first_name']."', ".
			"'".$json[$i]['last_name']."', ".
			    $json[$i]['age'].", ".
			"'".$json[$i]['position']."', ".
			    $json[$i]['salary'].", ".
			"'".$json[$i]['start_date']."', ".
			    $json[$i]['extn'].", ".
			"'".$json[$i]['email']."', ".
			"'".$json[$i]['office']."' ".
		")";
	}

	$values = join( ",\n\t\t", $out );
	$str = <<<EOD
# DataTables server-side processing example database structure and dataTables

DROP TABLE IF EXISTS `datatables-demo`;

CREATE TABLE `datatables-demo` (
  `id`         int(10) NOT NULL auto_increment,
  `first_name` varchar(250) NOT NULL default '',
  `last_name`  varchar(250) NOT NULL default '',
  `position`   varchar(250) NOT NULL default '',
  `email`      varchar(250) NOT NULL default '',
  `office`     varchar(250) NOT NULL default '',
  `start_date` timestamp DEFAULT CURRENT_TIMESTAMP,
  `age`        int(8),
  `salary`     int(8),
  `extn`       int(8),
  PRIMARY KEY  (`id`)
);

INSERT
	INTO `datatables-demo`
		( id, first_name, last_name, age, position, salary, start_date, extn, email, office ) 
	VALUES
		$values;
EOD;

	file_put_contents( $out_dir.'/data.sql', $str );
}



// Create the JSON files needed for the Ajax examples
function json_files ( $out_dir )
{
	$out_dir = $out_dir.'/ajax/data';

	if ( ! is_dir( $out_dir ) ) {
		mkdir( $out_dir );
	}

	$json = json_decode(
		file_get_contents( dirname(__FILE__).'/data.json' ),
		true
	);

	// Plain arrays
	$out = [];
	for ( $i=0, $ien=count($json) ; $i<$ien ; $i++ ) {
		$out[] = [
			$json[$i]['first_name'].' '.$json[$i]['last_name'],
			$json[$i]['position'],
			$json[$i]['office'],
			$json[$i]['extn'],
			$json[$i]['start_date'],
			'$'.number_format($json[$i]['salary'])
		];
	}

	file_put_contents(
		$out_dir.'/arrays.txt',
		json_encode( array( 'data' => $out ), JSON_PRETTY_PRINT )
	);

	// Custom property
	file_put_contents(
		$out_dir.'/arrays_custom_prop.txt',
		json_encode( array( 'demo' => $out ), JSON_PRETTY_PRINT )
	);

	// Arrays with sub objects
	$out = [];
	for ( $i=0, $ien=count($json) ; $i<$ien ; $i++ ) {
		$out[] = [
			$json[$i]['first_name'].' '.$json[$i]['last_name'],
			'hr' => [
				'position'   => $json[$i]['position'],
				'salary'     => '$'.number_format($json[$i]['salary']),
				'start_date' => $json[$i]['start_date']
			],
			'contact' => [
				'office' => $json[$i]['office'],
				'extn'    => $json[$i]['extn']
			]
		];
	}

	file_put_contents(
		$out_dir.'/arrays_subobjects.txt',
		json_encode( array( 'data' => $out ), JSON_PRETTY_PRINT )
	);
	
	// Simple object base case
	$out = [];
	for ( $i=0, $ien=count($json) ; $i<$ien ; $i++ ) {
		$out[] = [
			'name'       => $json[$i]['first_name'] .' '. $json[$i]['last_name'],
			'position'   => $json[$i]['position'],
			'salary'     => '$'.number_format($json[$i]['salary']),
			'start_date' => $json[$i]['start_date'],
			'office'     => $json[$i]['office'],
			'extn'        => $json[$i]['extn']
		];
	}

	file_put_contents(
		$out_dir.'/objects.txt',
		json_encode( array( 'data' => $out ), JSON_PRETTY_PRINT )
	);
	
	// Objects with no nested property
	file_put_contents(
		$out_dir.'/objects_root_array.txt',
		json_encode( $out, JSON_PRETTY_PRINT )
	);

	// Objects with sub objects and arrays
	$out = [];
	for ( $i=0, $ien=count($json) ; $i<$ien ; $i++ ) {
		$out[] = [
			'name' => $json[$i]['first_name'].' '.$json[$i]['last_name'],
			'hr' => [
				'position'   => $json[$i]['position'],
				'salary'     => '$'.number_format($json[$i]['salary']),
				'start_date' => $json[$i]['start_date']
			],
			'contact' => [
				$json[$i]['office'],
				$json[$i]['extn']
			]
		];
	}

	file_put_contents(
		$out_dir.'/objects_deep.txt',
		json_encode( array( 'data' => $out ), JSON_PRETTY_PRINT )
	);

	// Objects with sub objects
	$out = [];
	for ( $i=0, $ien=count($json) ; $i<$ien ; $i++ ) {
		$out[] = [
			'name'       => [ $json[$i]['last_name'], $json[$i]['first_name'] ],
			'hr'         => [
				$json[$i]['position'],
				'$'.number_format($json[$i]['salary']),
				$json[$i]['start_date']
			],
			'office'     => $json[$i]['office'],
			'extn'        => $json[$i]['extn']
		];
	}

	file_put_contents(
		$out_dir.'/objects_subarrays.txt',
		json_encode( array( 'data' => $out ), JSON_PRETTY_PRINT )
	);

	// Orthogonal date data
	$out = [];
	for ( $i=0, $ien=count($json) ; $i<$ien ; $i++ ) {
		$t = strtotime( $json[$i]['start_date'] );
		$out[] = [
			'name'       => $json[$i]['first_name'] .' '. $json[$i]['last_name'],
			'position'   => $json[$i]['position'],
			'salary'     => '$'.number_format($json[$i]['salary']),
			'start_date' => array(
				'display'   => date('D jS M y', $t),
				'timestamp' => date('U', $t)
			),
			'office'     => $json[$i]['office'],
			'extn'       => $json[$i]['extn']
		];
	}

	file_put_contents(
		$out_dir.'/orthogonal.txt',
		json_encode( array( 'data' => $out ), JSON_PRETTY_PRINT )
	);
}



function read_structure ( &$examples, $dir, $index_template, $example_template, $additional_libs )
{
	global $dir_names;
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
				'title' => isset($dir_names[$file]) ? $dir_names[$file] : ucwords( str_replace('_', ' ', $file) ),
				'path'  => $dir
			);

			read_structure( $sub['files'], $dir.'/'.$file, $index_template, $example_template, $additional_libs );
			$examples[] = $sub;
		}
		else if ( isset($fileParts['extension']) && $fileParts['extension'] === 'xml' ) {
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
	//echo $from.'   '.$to."\n";
	if ( ! $to ) {
		echo "Empty $ to\n";
		return '';
	}
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

