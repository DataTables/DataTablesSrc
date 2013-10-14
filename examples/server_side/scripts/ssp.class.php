<?php


class SSP {
	/* 
	 * Paging
	 */
	static function limit ( $request, $columns )
	{
		$limit = '';

		if ( isset($request['start']) && $request['length'] != -1 ) {
			$limit = "LIMIT ".intval($request['start']).", ".intval($request['length']);
		}

		return $limit;
	}


	/*
	 * Ordering
	 */
	static function order ( $request, $columns )
	{
		$order = '';

		if ( isset($request['sort']) && count($request['sort']) ) {
			$orderBy = array();

			for ( $i=0, $ien=count($request['sort']) ; $i<$ien ; $i++ ) {
				$columnIdx = intval($request['sort'][$i]['column']);

				if ( $request['columns'][$columnIdx]['sortable'] == 'true' ) {
					$dir = $request['sort'][$i]['dir'] === 'asc' ?
						'ASC' :
						'DESC';

					$orderBy[] = '`'.$columns[ $columnIdx ].'` '.$dir;
				}
			}

			$order = 'ORDER BY '.implode(', ', $orderBy);
		}

		return $order;
	}


	/* 
	 * Filtering
	 * NOTE this does not match the built-in DataTables filtering which does it
	 * word by word on any field. It's possible to do here performance on large
	 * databases would be very poor
	 */
	static function filter ( $request, $columns, &$bindings )
	{

		$globalFilter = array();
		$columnFilter = array();

		if ( isset($request['filter']) && $request['filter']['value'] != '' ) {
			$str = $request['filter']['value'];

			for ( $i=0, $ien=count($columns) ; $i<$ien ; $i++ ) {
				$column = $request['columns'][$i];

				if ( $column['searchable'] == 'true' ) {
					$binding = bind( $bindings, '%'.$str.'%', PDO::PARAM_STR );
					$globalFilter[] = "`".$columns[$i]."` LIKE ".$binding;
				}
			}
		}

		// Individual column filtering
		for ( $i=0, $ien=count($columns) ; $i<$ien ; $i++ ) {
			$column = $request['columns'][$i];
			$str = $column['filter']['value'];

			if ( $column['searchable'] == 'true' && $str != '' ) {
				$binding = bind( $bindings, '%'.$str.'%', PDO::PARAM_STR );
				$columnFilter[] = "`".$columns[$i]."` LIKE ".$binding;
			}
		}

		// Combine the filters into a single string
		$where = '';

		if ( count( $globalFilter ) ) {
			$where = '('.implode(' OR ', $globalFilter).')';
		}

		if ( count( $columnFilter ) ) {
			$where = $where === '' ?
				implode(' AND ', $globalFilter) :
				$where .' AND '. implode(' AND ', $globalFilter);
		}

		if ( $where !== '' ) {
			$where = 'WHERE '.$where;
		}

		return $where;
	}


	static function fatal ( $msg )
	{
		echo json_encode( array( 
			"sError" => $msg
		) );

		exit(0);
	}


	static function bind ( &$a, $val, $type )
	{
		$key = ':binding_'.count( $a );

		$a[] = array(
			'key' => $key,
			'val' => $val,
			'type' => $type
		);

		return $key;
	}


	static function sql_connect ( $sql_details )
	{
		try {
			$db = @new PDO(
				"mysql:host={$sql_details['host']};dbname={$sql_details['db']}",
				$sql_details['user'],
				$sql_details['pass'],
				array( PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION )
			);
		}
		catch (PDOException $e) {
			fatal_error(
				"An error occurred while connecting to the database. ".
				"The error reported by the server was: ".$e->getMessage()
			);
		}

		return $db;
	}


	static function sql_exec ( $db, $bindings, $sql=null )
	{
		// Argument shifting
		if ( $sql === null ) {
			$sql = $bindings;
		}

		$stmt = $db->prepare( $sql );
		//echo $sql;

		// Bind parameters
		if ( is_array( $bindings ) ) {
			for ( $i=0, $ien=count($bindings) ; $i<$ien ; $i++ ) {
				$binding = $bindings[$i];
				$stmt->bindValue( $binding['key'], $binding['val'], $binding['type'] );
			}
		}

		// Execute
		try {
			$stmt->execute();
		}
		catch (PDOException $e) {
			fatal_error( "An SQL error occurred: ".$e->getMessage() );
		}

		// Return all
		return $stmt->fetchAll();
	}
}

