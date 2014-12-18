// DATA_TEMPLATE: js_data
oTest.fnStart( "Filtering works with non-string data" );


$(document).ready( function () {
	var data = [
		{
			"name": "Tiger Nixon",
			"position": "",
			"salary": "$320,800",
			"start_date": "2011\/04\/25",
			"office": false,
			"extn": "5421"
		},
		{
			"name": "Garrett Winters",
			"position": "Accountant",
			"salary": "$170,750",
			"start_date": "2011\/07\/25",
			"office": true,
			"extn": "8422"
		},
		{
			"name": "Ashton Cox",
			"position": "Junior Technical Author",
			"salary": "$86,000",
			"start_date": "2009\/01\/12",
			"office": null,
			"extn": "1562"
		},
		{
			"name": "Cedric Kelly",
			"position": "Senior Javascript Developer",
			"salary": "$433,060",
			"start_date": "2012\/03\/29",
			"office": "Edinburgh",
			"extn": "6224"
		}
	];

	var table = $('#example').DataTable( {
		columns: [
			{ data: 'name' },
			{ data: 'position' },
			{ data: 'salary' },
			{ data: 'start_date' },
			{ data: 'office' }
		],
		data: data
	} );


	oTest.fnTest( 
		"Initial load",
		null,
		function () { return $('#example tbody tr:eq(0) td:eq(0)').html() == 'Ashton Cox'; }
	);

	oTest.fnTest( 
		"Column string search",
		function () { table.column( -1 ).search( 'Edinburgh' ).draw(); },
		function () { return $('#example tbody tr:eq(0) td:eq(0)').html() == 'Cedric Kelly'; }
	);

	oTest.fnTest( 
		"Column false search",
		function () { table.column( -1 ).search( false ).draw(); },
		function () { return $('#example tbody tr:eq(0) td:eq(0)').html() == 'Tiger Nixon'; }
	);

	oTest.fnTest( 
		"Column true search",
		function () { table.column( -1 ).search( true ).draw(); },
		function () { return $('#example tbody tr:eq(0) td:eq(0)').html() == 'Garrett Winters'; }
	);

	// null is converted to `''` for the filter data but `null` for the search so no matches
	oTest.fnTest( 
		"Column null search",
		function () { table.column( -1 ).search( null ).draw(); },
		function () { return $('#example tbody tr:eq(0) td:eq(0)').html() == 'No matching records found'; }
	);

	oTest.fnTest( 
		"String search",
		function () {
			table.column( -1 ).search( '' ); // clear column search
			table.search( 'Edinburgh' ).draw();
		},
		function () { return $('#example tbody tr:eq(0) td:eq(0)').html() == 'Cedric Kelly'; }
	);

	oTest.fnTest( 
		"false search",
		function () { table.search( false ).draw(); },
		function () { return $('#example tbody tr:eq(0) td:eq(0)').html() == 'Tiger Nixon'; }
	);

	oTest.fnTest( 
		"true search",
		function () { table.search( true ).draw(); },
		function () { return $('#example tbody tr:eq(0) td:eq(0)').html() == 'Garrett Winters'; }
	);

	// null is converted to `''` for the filter data but `null` for the search so no matches
	oTest.fnTest( 
		"null search",
		function () { table.search( null ).draw(); },
		function () { return $('#example tbody tr:eq(0) td:eq(0)').html() == 'No matching records found'; }
	);
	
	oTest.fnComplete();
} );