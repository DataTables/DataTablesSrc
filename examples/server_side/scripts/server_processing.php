<?php

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Easy set variables
 */

// DB table to use
$table = 'datatables-demo';

// Indexed column (used for fast and accurate table cardinality)
$primaryKey = 'id';

// Array of database columns which should be read and sent back to DataTables.
// Use a space where you want to insert a non-database field (for example a
// counter or static image)
$columns = array(
	'first_name',
	'last_name',
	'position',
	'office',
	'start_date',
	'salary'
);

$sql_details = array(
	'user' => '',
	'pass' => '',
	'db'   => '',
	'host' => ''
);


// REMOVE THIS BLOCK - used for DataTables test environment only!
$file = $_SERVER['DOCUMENT_ROOT'].'/datatables/mysql.php';
if ( is_file( $file ) ) {
	include( $file );
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * If you just want to use the basic configuration for DataTables with PHP
 * server-side, there is no need to edit below this line.
 *
 * It should be noted that this script could be made far more modular
 */

require( 'ssp.class.php' );
$bindings = array();
$db = SSP::sql_connect( $sql_details );

/*
 * Build the SQL query string from the request
 */
$limit = SSP::limit( $_GET, $columns );
$order = SSP::order( $_GET, $columns );
$where = SSP::filter( $_GET, $columns, $bindings );


/*
 * SQL queries
 */

// Main query to actually get the data
$data = SSP::sql_exec( $db, $bindings,
	"SELECT SQL_CALC_FOUND_ROWS `".implode("`, `", $columns)."`
	 FROM `$table`
	 $where
	 $order
	 $limit"
);

// Data set length after filtering
$resFilterLength = SSP::sql_exec( $db,
	"SELECT FOUND_ROWS()"
);
$recordsFiltered = $resFilterLength[0][0];

// Total data set length
$resTotalLength = SSP::sql_exec( $db,
	"SELECT COUNT(`{$primaryKey}`)
	 FROM   `$table`"
);
$recordsTotal = $resTotalLength[0][0];


/*
 * Output
 */
$output = array(
	"draw"            => intval( $_GET['draw'] ),
	"recordsTotal"    => intval( $recordsTotal ),
	"recordsFiltered" => intval( $recordsFiltered ),
	"data" => array()
);

for ( $i=0, $ien=count($data) ; $i<$ien ; $i++ ) {
	$row = array();

	for ( $j=0, $jen=count($columns) ; $j<$jen ; $j++ ) {
		$column = $columns[$j];

		// Formatting of data for specific columns
		switch ( $columns[$j] ) {
			case 'salary':
				$row[] = '$'.number_format($data[$i]['salary']);
				break;

			case 'start_date':
				$row[] = date( 'jS M y', strtotime($data[$i]['start_date']));
				break;

			default:
				$row[] = $data[$i][ $columns[$j] ];
				break;
		}
	}

	$output['data'][] = $row;
}

echo json_encode( $output );

