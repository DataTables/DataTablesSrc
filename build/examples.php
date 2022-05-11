<?php

error_reporting(E_ALL);
ini_set('display_errors', '1');



require( 'lib/DT_Example.php' );


/*
 * Configuration options
 */
$dir_order = array(
	'basic_init',
	'non_jquery',
	'advanced_init',
	'data_sources',
	'i18n',
	'datetime',
	'styling',
	'api',
	'ajax',
	'server_side',
	'plug-ins'
);

$dir_names = array(
	'basic_init'    => "Basic initialisation",
	'advanced_init' => "Advanced initialisation",
	'non_jquery'    => "Non-jQuery initialisation",
	'datetime'      => "DateTime",
	'i18n'          => "Internationalisation",
	'styling'       => "Styling",
	'data_sources'  => "Data sources",
	'api'           => "API",
	'ajax'          => "Ajax",
	'server_side'   => "Server-side",
	'plug-ins'      => "Plug-ins"
); // for extensions example ordering, see below


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
$shortopts .= "d";   // Do not create data files
$shortopts .= "r:";  // Example directory order (`$dir_order`)

$longopts  = array(
	"cdn",
	"css:",
	"js:",
	"libs:",
	"media:",
	"output:",
	"template:",
	"index-template:",
	"no-data-files",
	"order:"
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
$versions = json_decode(
	is_file('/tmp/dt-versions')
		? file_get_contents('/tmp/dt-versions')
		: file_get_contents_curl('https://api.datatables.net/versions/pre-release'),
	true
);
$pluginsHash = $versions['DataTables']['release']['version'];


DT_Example::$components_cdn = isset( $options['cdn'] );

DT_Example::$components['datatables'] = [
	'path' => path_simplify( $dir_media ),
	'release' => $versions['DataTables']['release']['version'],
	'filename' => 'dataTables',
	'framework' => [
		'css' => true,
		'js' => true
	]
];

DT_Example::$components['autofill'] = [
	'path' => path_simplify( $dir_media.'/../extensions/AutoFill' ),
	'release' => $versions['AutoFill']['release']['version'],
	'filename' => 'autoFill',
	'framework' => [
		'css' => true,
		'js' => true
	]
];

DT_Example::$components['buttons'] = [
	'path' => path_simplify( $dir_media.'/../extensions/Buttons' ),
	'release' => $versions['Buttons']['release']['version'],
	'filename' => 'buttons',
	'framework' => [
		'css' => true,
		'js' => true
	]
];

DT_Example::$components['colreorder'] = [
	'path' => path_simplify( $dir_media.'/../extensions/ColReorder' ),
	'release' => $versions['ColReorder']['release']['version'],
	'filename' => 'colReorder',
	'framework' => [
		'css' => true,
		'js' => false
	]
];

DT_Example::$components['editor'] = [
	'path' => path_simplify( $dir_media.'/../extensions/Editor' ),
	'release' => $versions['Editor']['release']['version'],
	'filename' => 'editor',
	'framework' => [
		'css' => true,
		'js' => true
	]
];

DT_Example::$components['fixedcolumns'] = [
	'path' => path_simplify( $dir_media.'/../extensions/FixedColumns' ),
	'release' => $versions['FixedColumns']['release']['version'],
	'filename' => 'fixedColumns',
	'framework' => [
		'css' => true,
		'js' => false
	]
];

DT_Example::$components['fixedheader'] = [
	'path' => path_simplify( $dir_media.'/../extensions/FixedHeader' ),
	'release' => $versions['FixedHeader']['release']['version'],
	'filename' => 'fixedHeader',
	'framework' => [
		'css' => true,
		'js' => false
	]
];

DT_Example::$components['keytable'] = [
	'path' => path_simplify( $dir_media.'/../extensions/KeyTable' ),
	'release' => $versions['KeyTable']['release']['version'],
	'filename' => 'keyTable',
	'framework' => [
		'css' => true,
		'js' => false
	]
];

DT_Example::$components['responsive'] = [
	'path' => path_simplify( $dir_media.'/../extensions/Responsive' ),
	'release' => $versions['Responsive']['release']['version'],
	'filename' => 'responsive',
	'framework' => [
		'css' => true,
		'js' => true
	]
];

DT_Example::$components['rowgroup'] = [
	'path' => path_simplify( $dir_media.'/../extensions/RowGroup' ),
	'release' => $versions['RowGroup']['release']['version'],
	'filename' => 'rowGroup',
	'framework' => [
		'css' => true,
		'js' => false
	]
];

DT_Example::$components['rowreorder'] = [
	'path' => path_simplify( $dir_media.'/../extensions/RowReorder' ),
	'release' => $versions['RowReorder']['release']['version'],
	'filename' => 'rowReorder',
	'framework' => [
		'css' => true,
		'js' => false
	]
];

DT_Example::$components['scroller'] = [
	'path' => path_simplify( $dir_media.'/../extensions/Scroller' ),
	'release' => $versions['Scroller']['release']['version'],
	'filename' => 'scroller',
	'framework' => [
		'css' => true,
		'js' => false
	]
];

DT_Example::$components['select'] = [
	'path' => path_simplify( $dir_media.'/../extensions/Select' ),
	'release' => $versions['Select']['release']['version'],
	'filename' => 'select',
	'framework' => [
		'css' => true,
		'js' => false
	]
];

DT_Example::$components['searchbuilder'] = [
	'path' => path_simplify( $dir_media.'/../extensions/SearchBuilder' ),
	'release' => $versions['SearchBuilder']['release']['version'],
	'filename' => 'searchBuilder',
	'framework' => [
		'css' => true,
		'js' => true
	]
];

DT_Example::$components['searchpanes'] = [
	'path' => path_simplify( $dir_media.'/../extensions/SearchPanes' ),
	'release' => $versions['SearchPanes']['release']['version'],
	'filename' => 'searchPanes',
	'framework' => [
		'css' => true,
		'js' => true
	]
];

DT_Example::$components['staterestore'] = [
	'path' => path_simplify( $dir_media.'/../extensions/StateRestore' ),
	'release' => $versions['StateRestore']['release']['version'],
	'filename' => 'stateRestore',
	'framework' => [
		'css' => true,
		'js' => true
	]
];

if ( isset( $options['cdn'] ) ) {
	DT_Example::$lookup_libraries['css']['datetime'] = 'https://cdn.datatables.net/datetime/'.$versions['DateTime']['release']['version'].'/css/dataTables.dateTime.min.css';
	DT_Example::$lookup_libraries['js']['datetime'] = 'https://cdn.datatables.net/datetime/'.$versions['DateTime']['release']['version'].'/js/dataTables.dateTime.min.js';
}
else {
	DT_Example::$lookup_libraries['css']['datetime'] = path_simplify( $dir_media.'/../extensions/DateTime' ) . '/css/dataTables.dateTime.css';
	DT_Example::$lookup_libraries['js']['datetime'] = path_simplify( $dir_media.'/../extensions/DateTime' ) . '/js/dataTables.dateTime.js';
}

// Legacy extensions
if ( isset( $options['cdn'] ) ) {
	DT_Example::$lookup_libraries['css']['colvis']          = 'https://cdn.datatables.net/colvis/1.1.2/css/dataTables.colVis.css';
	DT_Example::$lookup_libraries['js' ]['colvis']          = 'https://cdn.datatables.net/colvis/1.1.2/js/dataTables.colVis.min.js';
	DT_Example::$lookup_libraries['css']['tabletools']      = 'https://cdn.datatables.net/tabletools/2.2.4/css/dataTables.tableTools.css';
	DT_Example::$lookup_libraries['js' ]['tabletools']      = 'https://cdn.datatables.net/tabletools/2.2.4/js/dataTables.tableTools.min.js';

	DT_Example::$lookup_libraries['js' ]['buttons-flash']   = 'https://cdn.datatables.net/buttons/'.$versions['Buttons']['release']['version'].'/js/buttons.flash.min.js';
	DT_Example::$lookup_libraries['js' ]['buttons-html5']   = 'https://cdn.datatables.net/buttons/'.$versions['Buttons']['release']['version'].'/js/buttons.html5.min.js';
	DT_Example::$lookup_libraries['js' ]['buttons-colvis']  = 'https://cdn.datatables.net/buttons/'.$versions['Buttons']['release']['version'].'/js/buttons.colVis.min.js';
	DT_Example::$lookup_libraries['js' ]['buttons-print']   = 'https://cdn.datatables.net/buttons/'.$versions['Buttons']['release']['version'].'/js/buttons.print.min.js';
	DT_Example::$lookup_libraries['js' ]['buttons-docgen']   = 'https://cdn.datatables.net/buttons/'.$versions['Buttons']['release']['version'].'/js/buttons.docgen.min.js';
}
else {
	DT_Example::$lookup_libraries['css']['colvis']          = path_simplify( $dir_media.'/../extensions/ColVis/css/dataTables.colVis.css' );
	DT_Example::$lookup_libraries['js' ]['colvis']          = path_simplify( $dir_media.'/../extensions/ColVis/js/dataTables.colVis.js' );
	DT_Example::$lookup_libraries['css']['tabletools']      = path_simplify( $dir_media.'/../extensions/TableTools/css/dataTables.tableTools.css' );
	DT_Example::$lookup_libraries['js' ]['tabletools']      = path_simplify( $dir_media.'/../extensions/TableTools/js/dataTables.tableTools.js' );

	DT_Example::$lookup_libraries['js' ]['buttons-flash']   = path_simplify( $dir_media.'/../extensions/Buttons/js/buttons.flash.js' );
	DT_Example::$lookup_libraries['js' ]['buttons-html5']   = path_simplify( $dir_media.'/../extensions/Buttons/js/buttons.html5.js' );
	DT_Example::$lookup_libraries['js' ]['buttons-print']   = path_simplify( $dir_media.'/../extensions/Buttons/js/buttons.print.js' );
	DT_Example::$lookup_libraries['js' ]['buttons-colvis']  = path_simplify( $dir_media.'/../extensions/Buttons/js/buttons.colVis.js' );
	DT_Example::$lookup_libraries['js' ]['buttons-docgen']  = path_simplify( $dir_media.'/../extensions/Buttons/js/buttons.docgen.js' );

}

// Styling libraries
// When updating these files, make sure you also update the `karma.config` tests
// file to match versions.
DT_Example::$lookup_libraries['js' ]['jquery']       = 'https://code.jquery.com/jquery-1.12.4.js';
DT_Example::$lookup_libraries['js' ]['jquery']       = 'https://code.jquery.com/jquery-3.5.1.slim.js';
DT_Example::$lookup_libraries['js' ]['jquery']       = 'https://code.jquery.com/jquery-3.5.1.js';
// DT_Example::$lookup_libraries['js' ]['jquery']       = 'https://cdnjs.cloudflare.com/ajax/libs/cash/8.1.0/cash.min.js';

DT_Example::$lookup_libraries['js' ]['bootstrap']    = 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js';
DT_Example::$lookup_libraries['css']['bootstrap']    = 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css';
DT_Example::$lookup_libraries['js' ]['bootstrap4']   = 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js|https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.2/js/bootstrap.min.js';
DT_Example::$lookup_libraries['css']['bootstrap4']   = 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.2/css/bootstrap.css';
DT_Example::$lookup_libraries['js' ]['bootstrap5']   = 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.1.3/js/bootstrap.bundle.min.js';
DT_Example::$lookup_libraries['css']['bootstrap5']   = 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.1.3/css/bootstrap.min.css';
DT_Example::$lookup_libraries['css']['bulma']        = 'https://cdnjs.cloudflare.com/ajax/libs/bulma/0.9.3/css/bulma.min.css';
DT_Example::$lookup_libraries['js' ]['foundation']   = 'https://cdnjs.cloudflare.com/ajax/libs/foundation/5.5.2/js/foundation.min.js';
DT_Example::$lookup_libraries['css']['foundation']   = 'https://cdnjs.cloudflare.com/ajax/libs/foundation/5.5.2/css/foundation.min.css';
DT_Example::$lookup_libraries['js' ]['foundation']   = 'https://cdnjs.cloudflare.com/ajax/libs/foundation/6.4.3/js/foundation.min.js';
DT_Example::$lookup_libraries['css']['foundation']   = 'https://cdnjs.cloudflare.com/ajax/libs/foundation/6.4.3/css/foundation.min.css';
DT_Example::$lookup_libraries['js' ]['jqueryui']     = 'https://code.jquery.com/ui/1.12.1/jquery-ui.js';
DT_Example::$lookup_libraries['css']['jqueryui']     = 'https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css';
DT_Example::$lookup_libraries['js' ]['material']     = 'https://cdnjs.cloudflare.com/ajax/libs/material-components-web/4.0.0/material-components-web.min.js';
DT_Example::$lookup_libraries['css']['material']     = 'https://cdnjs.cloudflare.com/ajax/libs/material-components-web/4.0.0/material-components-web.min.css';
DT_Example::$lookup_libraries['js' ]['semanticui']   = 'https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.8.8/semantic.min.js';
DT_Example::$lookup_libraries['css']['semanticui']   = 'https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.8.8/semantic.min.css';
DT_Example::$lookup_libraries['js' ]['uikit']        = 'https://cdnjs.cloudflare.com/ajax/libs/uikit/3.0.2/js/uikit.min.js';
DT_Example::$lookup_libraries['css']['uikit']        = 'https://cdnjs.cloudflare.com/ajax/libs/uikit/3.0.2/css/uikit.min.css';

DT_Example::$lookup_libraries['css']['font-awesome'] = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css';
DT_Example::$lookup_libraries['js']['jszip']         = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js';
DT_Example::$lookup_libraries['js']['pdfmake']       = 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/pdfmake.min.js';
DT_Example::$lookup_libraries['js']['vfsfonts']      = 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/vfs_fonts.js';
DT_Example::$lookup_libraries['js']['moment']        = 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.2/moment.min.js';
DT_Example::$lookup_libraries['js']['luxon']         = 'https://cdnjs.cloudflare.com/ajax/libs/luxon/2.3.1/luxon.min.js';
DT_Example::$lookup_libraries['css']['world-flags-sprite'] = 'https://github.com/downloads/lafeber/world-flags-sprite/flags32.css';
DT_Example::$lookup_libraries['js']['sparkline'] = 'https://cdnjs.cloudflare.com/ajax/libs/jquery-sparklines/2.1.2/jquery.sparkline.min.js';

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

		case "r":
		case "order":
			$dir_order = explode( ' ', $value );
			break;

		default:
			break;
	}
}

if ( stripos( $dir_input, 'Editor' ) ) {
	$dir_order = array(
		'simple',
		'advanced',
		'datatables',
		'dates',
		'extensions',
		'inline-editing',
		'bubble-editing',
		'api',
		'standalone',
		'styling',
		'plug-ins',
		'private'
	);

	$dir_names = array(
		'simple'          => 'Simple initialisation',
		'advanced'        => 'Advanced initialisation',
		'extensions'      => 'DataTables extensions',
		'dates'           => "Dates and time",
		'datatables'      => 'DataTables as an input',
		'bubble-editing'  => 'Bubble editing',
		'inline-editing'  => 'Inline editing',
		'api'             => 'API',
		'standalone'      => 'Standalone',
		'styling'         => 'Styling',
		'plug-ins'        => 'Plug-ins'
	);
}
else if ( stripos( $dir_input, 'Buttons' ) ) {
	$dir_order = array(
		'initialisation',
		'html5',
		'flash',
		'column_visibility',
		'print',
		'api',
		'split',
		'styling'
	);

	$dir_names = array(
		'initialisation'    => "Basic initialisation",
		'html5'             => "HTML 5 data export",
		'flash'             => "Flash data export",
		'column_visibility' => 'Column visibility',
		'print'             => 'Print',
		'api'               => 'API',
		'split'             => 'Split buttons',
		'styling'           => "Styling",
	);
}
else if ( stripos( $dir_input, 'ColReorder' ) ) {
	$dir_order = array(
		'initialisation',
		'integration',
		'styling'
	);

	$dir_names = array(
		'initialisation' => "Initialisation and options",
		'integration'    => "Integration with other DataTables extensions",
		'styling'        => "Styling"
	);
}
else if ( stripos( $dir_input, 'DateTime' ) ) {
	$dir_order = array(
		'initialisation',
		'integration'
	);

	$dir_names = array(
		'initialisation' => "Initialisation and options",
		'integration'    => "Integration"
	);
}
else if ( stripos( $dir_input, 'Responsive' ) ) {
	$dir_order = array(
		'initialisation',
		'display-types',
		'column-control',
		'child-rows',
		'styling'
	);

	$dir_names = array(
		'initialisation'  => "Basic initialisation",
		'display-control' => "Display control",
		'child-rows'      => "Child rows",
		'styling'         => "Styling"
	);
}
else if ( stripos( $dir_input, 'FixedHeader' ) ) {
	$dir_order = array(
		'options',
		'styling',
		'integration'
	);

	$dir_names = array(
		'options'     => "Initialisation and options",
		'styling'     => "Styling",
		'integration' => "Integration with other DataTables extensions"
	);
}
else if ( stripos( $dir_input, 'FixedColumns' ) ) {
	$dir_order = array(
		'initialisation',
		'integration',
		'styling'
	);

	$dir_names = array(
		'initialisation' => "Initialisation and options",
		'integration'    => "Integration with other DataTables extensions",
		'styling'        => "Styling"
	);
}
else if ( stripos( $dir_input, 'SearchBuilder' ) ) {
	$dir_order = array(
		'initialisation',
		'api',
		'customisation',
		'styling',
		'integration'
	);

	$dir_names = array(
		'initialisation' => 'Initialisation and options',
		'api' => 'API demonstrations',
		'customisation' => 'Customisation',
		'styling' => 'Styling',
		'integration' => 'Integration'
	);
}
else if ( stripos( $dir_input, 'SearchPanes' ) ) {
	$dir_order = array(
		'initialisation',
		'advanced',
		'customisation',
		'integration',
		'customFiltering',
		'styling',
		'performance'
	);

	$dir_names = array(
		'initialisation' => 'Initialisation and options',
		'advanced' => 'Advanced initialisation',
		'customisation' => 'Customisation',
		'integration' => 'Integration with other DataTables extensions',
		'customFiltering' => 'Creation of custom panes',
		'styling' => 'Styling',
		'performance' => 'Performance'
	);
}
else if ( stripos( $dir_input, 'StateRestore' ) ) {
	$dir_order = array(
		'initialisation',
		'advanced',
		'customisation',
		'integration',
		'customFiltering',
		'styling',
		'performance'
	);

	$dir_names = array(
		'initialisation' => 'Initialisation and options',
		'advanced' => 'Advanced initialisation',
		'customisation' => 'Customisation',
		'integration' => 'Integration with other DataTables extensions',
		'customFiltering' => 'Creation of custom panes',
		'styling' => 'Styling',
		'performance' => 'Performance'
	);
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




// Create the SQL files needed for the Ajax examples - need to create files for
// all of the database types supported by Editor
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
			"'".$json[$i]['office']."', ".
			    $json[$i]['sequence']." ".
		")";
	}

	$values = join( ",\n\t\t", $out );

	// MySQL style
	$str = <<<EOD
--
-- DataTables Ajax and server-side processing database (MySQL)
--

DROP TABLE IF EXISTS `datatables_demo`;

CREATE TABLE `datatables_demo` (
	`id`         int(10) NOT NULL auto_increment,
	`first_name` varchar(250) NOT NULL default '',
	`last_name`  varchar(250) NOT NULL default '',
	`position`   varchar(250) NOT NULL default '',
	`email`      varchar(250) NOT NULL default '',
	`office`     varchar(250) NOT NULL default '',
	`start_date` datetime default NULL,
	`age`        int(8),
	`salary`     int(8),
	`seq`        int(8),
	`extn`       varchar(8) NOT NULL default '',
	PRIMARY KEY  (`id`),
	INDEX (`seq`)
);

INSERT INTO `datatables_demo`
		( id, first_name, last_name, age, position, salary, start_date, extn, email, office, seq ) 
	VALUES
		$values;
EOD;
	file_put_contents( $out_dir.'/mysql.sql', $str );

	// Postgres style
	$next = count($json) + 1;
	$str = <<<EOD
--
-- DataTables Ajax and server-side processing database (Postgres)
--
DROP TABLE IF EXISTS datatables_demo;

CREATE TABLE datatables_demo (
	id         serial,
	first_name text NOT NULL default '',
	last_name  text NOT NULL default '',
	position   text NOT NULL default '',
	email      text NOT NULL default '',
	office     text NOT NULL default '',
	start_date timestamp without time zone default NULL,
	age        integer,
	salary     integer,
	seq        integer,
	extn       text NOT NULL default '',
	PRIMARY KEY (id)
);

INSERT INTO datatables_demo
		( id, first_name, last_name, age, position, salary, start_date, extn, email, office, seq ) 
	VALUES
		$values;

ALTER SEQUENCE datatables_demo_id_seq RESTART WITH {$next};
EOD;
	file_put_contents( $out_dir.'/postgres.sql', $str );

	// SQLServer style
	$str = <<<EOD
--
-- DataTables Ajax and server-side processing database (SQL Server)
--
IF OBJECT_ID('datatables_demo', 'U') IS NOT NULL
  DROP TABLE datatables_demo;

CREATE TABLE datatables_demo (
	id         int NOT NULL identity,
	first_name varchar(250) NOT NULL default '',
	last_name  varchar(250) NOT NULL default '',
	position   varchar(250) NOT NULL default '',
	email      varchar(250) NOT NULL default '',
	office     varchar(250) NOT NULL default '',
	start_date datetime default NULL,
	age        int,
	salary     int,
	seq        int,
	extn       varchar(8) NOT NULL default '',
	PRIMARY KEY (id)
);

SET IDENTITY_INSERT datatables_demo ON;

INSERT INTO datatables_demo
		( id, first_name, last_name, age, position, salary, start_date, extn, email, office, seq ) 
	VALUES
EOD;
	$out = [];
	for ( $i=0, $ien=count($json) ; $i<$ien ; $i++ ) {
		$out[] = "( ".
				$json[$i]['id'].", ".
			"'".$json[$i]['first_name']."', ".
			"'".$json[$i]['last_name']."', ".
				$json[$i]['age'].", ".
			"'".$json[$i]['position']."', ".
				$json[$i]['salary'].", ".
			"'".str_replace( '/', '', $json[$i]['start_date'])."', ".
				$json[$i]['extn'].", ".
			"'".$json[$i]['email']."', ".
			"'".$json[$i]['office']."', ".
				$json[$i]['sequence']." ".
		")";
	}

	$sqlServerValues = join( ",\n\t\t", $out );
	$str .= <<<EOD

		$sqlServerValues;

	SET IDENTITY_INSERT datatables_demo OFF;
EOD;

	file_put_contents( $out_dir.'/sqlserver.sql', $str );

	// SQLite style
	$str = <<<EOD
--
-- DataTables Ajax and server-side processing database (SQLite)
--
DROP TABLE IF EXISTS datatables_demo;

CREATE TABLE datatables_demo (
	id         integer primary key,
	first_name text NOT NULL default '',
	last_name  text NOT NULL default '',
	position   text NOT NULL default '',
	email      text NOT NULL default '',
	office     text NOT NULL default '',
	start_date timestamp default NULL,
	age        integer,
	salary     integer,
	seq        integer,
	extn       text NOT NULL default ''
);

INSERT INTO datatables_demo
		( id, first_name, last_name, age, position, salary, start_date, extn, email, office, seq ) 
	VALUES
EOD;
	$insert = [];
	for ( $i=0, $ien=count($json) ; $i<$ien ; $i++ ) {
		$insert[] = "\t\t( ".
			$json[$i]['id'].", ".
		"'".$json[$i]['first_name']."', ".
		"'".$json[$i]['last_name']."', ".
			$json[$i]['age'].", ".
		"'".$json[$i]['position']."', ".
			$json[$i]['salary'].", ".
		"'".date('Y-m-d', strtotime($json[$i]['start_date']))."', ".
			$json[$i]['extn'].", ".
		"'".$json[$i]['email']."', ".
		"'".$json[$i]['office']."', ".
			$json[$i]['sequence']." ".
		")";
	}

	$str = $str .implode( ",\n", $insert ). ';';

	file_put_contents( $out_dir.'/sqlite.sql', $str );

	// Oracle style
	$str = <<<EOD
--
-- DataTables Ajax and server-side processing database (Oracle)
--
BEGIN
	EditorDelObject('datatables_demo', 'TABLE');
	EditorDelObject('datatables_demo_seq', 'SEQUENCE');
END;
/

CREATE TABLE "datatables_demo" (
	"id" INT PRIMARY KEY NOT NULL,
	"first_name" NVARCHAR2(250),
	"last_name"  NVARCHAR2(250),
	"position"   NVARCHAR2(250),
	"email"      NVARCHAR2(250),
	"office"     NVARCHAR2(250),
	"start_date" DATE,
	"age"        INT,
	"salary"     INT,
	"seq"        INT,
	"extn"       NVARCHAR2(8)
);

CREATE SEQUENCE datatables_demo_seq;

CREATE OR REPLACE TRIGGER datatables_demo_on_insert
	BEFORE INSERT ON "datatables_demo"
	FOR EACH ROW
	BEGIN
		SELECT datatables_demo_seq.nextval
		INTO :new."id"
		FROM dual;
	END;
	/

EOD;

	for ( $i=0, $ien=count($json) ; $i<$ien ; $i++ ) {
		$str .= "INSERT INTO \"datatables_demo\" ".
			"( \"first_name\", \"last_name\", \"age\", \"position\", \"salary\", \"start_date\", \"extn\", \"email\", \"office\", \"seq\" ) ".
			"VALUES ";

		$str .= "( ".
			"'".$json[$i]['first_name']."', ".
			"'".$json[$i]['last_name']."', ".
			    $json[$i]['age'].", ".
			"'".$json[$i]['position']."', ".
			    $json[$i]['salary'].", ".
			"'".date('d-M-Y', strtotime($json[$i]['start_date']))."', ".
			    $json[$i]['extn'].", ".
			"'".$json[$i]['email']."', ".
			"'".$json[$i]['office']."', ".
			    $json[$i]['sequence']." ".
		");\n";
	}

	$str .= "\nCOMMIT;\n";

	file_put_contents( $out_dir.'/oracle.sql', $str );
	
		// Firebird 3 style
		$str = <<<EOD
	--
	-- DataTables Ajax and server-side processing database (Firebird 3)
	--
	CREATE TABLE "datatables_demo" (
		"id"         integer generated by default as identity primary key,
		"first_name" varchar(250) default '' not null,
		"last_name"  varchar(250) default '' not null,
		"position"   varchar(250) default '' not null,
		"email"      varchar(250) default '' not null,
		"office"     varchar(250) default '' not null,
		"start_date" timestamp default NULL,
		"age"        int,
		"salary"     int,
		"seq"        int,
		"extn"       varchar(8) default '' not null
	);

EOD;
	
		for ( $i=0, $ien=count($json) ; $i<$ien ; $i++ ) {
			$str .= "INSERT INTO \"datatables_demo\" ".
				"( \"first_name\", \"last_name\", \"age\", \"position\", \"salary\", \"start_date\", \"extn\", \"email\", \"office\", \"seq\" ) ".
				"VALUES ";
	
			$str .= "( ".
				"'".$json[$i]['first_name']."', ".
				"'".$json[$i]['last_name']."', ".
					$json[$i]['age'].", ".
				"'".$json[$i]['position']."', ".
					$json[$i]['salary'].", ".
				"'".date('d.M.Y', strtotime($json[$i]['start_date']))."', ".
					$json[$i]['extn'].", ".
				"'".$json[$i]['email']."', ".
				"'".$json[$i]['office']."', ".
					$json[$i]['sequence']." ".
			");\n";
		}
	
		file_put_contents( $out_dir.'/firebird.sql', $str );
}



// Create the JSON files needed for the Ajax examples
function json_files ( $out_dir )
{
	$out_dir = $out_dir.'/ajax/data';

	if ( ! is_dir( $out_dir ) ) {
		mkdir( $out_dir );
	}

	copy( dirname(__FILE__).'/data_50k.json', $out_dir.'/data_50k.txt');
	copy( dirname(__FILE__).'/data_10k.json', $out_dir.'/data_10k.txt');
	copy( dirname(__FILE__).'/data_5k.json', $out_dir.'/data_5k.txt');
	copy( dirname(__FILE__).'/data_1k.json', $out_dir.'/data_1k.txt');

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
			'id'         => $json[$i]['id'],
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

	// Salary without formatting
	$out = [];
	for ( $i=0, $ien=count($json) ; $i<$ien ; $i++ ) {
		$country = $json[$i]['office'];
		if ( $country === 'Singapore' ) {
			$country = 'Argentina';
		}
		$out[] = [
			'name' => $json[$i]['first_name'].' '.$json[$i]['last_name'],
			'position'   => $json[$i]['position'],
			'salary'     => $json[$i]['salary'],
			'start_date' => $json[$i]['start_date'],
			'office'     => $country,
			'extn'       => $json[$i]['extn']
		];
	}

	file_put_contents(
		$out_dir.'/objects_salary.txt',
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

	if ( $dh === false ) {
		echo "Warning: Can't read: $dir\n";
		return;
	}

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
		//if ( $a['type'] === 'file' && $b['type'] === 'file' ) {
		//	return 0;
		//}
		//else if ( $a['type'] === 'file' || $b['type'] === 'file' ) {
		//	return -1;
		//}
		//else {
			$idxA = array_search( $a['name'], $order );
			$idxB = array_search( $b['name'], $order );

			if ($idxA === $idxB) {
				return 0;
			}
			else if ($idxA < $idxB) {
				return -1;
			}
			return 1;
		//}
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
			if ( $examples[$i]['type'] === 'dir' && $examples[$i]['name'] !== 'private' ) {
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
	if ( ! $to ) {
		echo "Path - Empty to ($from)\n";
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

function file_get_contents_curl( $url ) {
	$ch = curl_init();

	curl_setopt( $ch, CURLOPT_AUTOREFERER, TRUE );
	curl_setopt( $ch, CURLOPT_HEADER, 0 );
	curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1 );
	curl_setopt( $ch, CURLOPT_URL, $url );
	curl_setopt( $ch, CURLOPT_FOLLOWLOCATION, TRUE );

	$data = curl_exec( $ch );
	curl_close( $ch );

	return $data;
}
