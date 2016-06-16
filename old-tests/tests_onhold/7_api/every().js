// DATA_TEMPLATE: dom_data
oTest.fnStart( "Every method validation" );

$(document).ready( function () {
	var test = 0;
	var table = $('#example').DataTable();

	oTest.fnTest( 
		"rows().every() will iterate for every row",
		function () {
			test = 0;

			table.rows().every( function () {
				test++;
			} );
		},
		function () { return test === 57; }
	);

	oTest.fnTest( 
		"rows().every() will iterate for every row - to filter set",
		function () {
			test = 0;

			table.search( 'net' ).draw();
			table.rows( { search: 'applied' } ).every( function () {
				test++;
			} );
		},
		function () { return test === 13; }
	);



	oTest.fnTest( 
		"columns().every() will iterate for every column",
		function () {
			test = 0;

			table.search('').draw();
			table.columns().every( function () {
				test++;
			} );
		},
		function () { return test === 5; }
	);

	oTest.fnTest( 
		"columns().every() will iterate for every columns, regardless of options",
		function () {
			test = 0;

			table.search( 'net' ).draw();
			table.columns( { search: 'applied' } ).every( function () {
				test++;
			} );
		},
		function () { return test === 5; }
	);

	oTest.fnTest( 
		"columns().every()'s execution context has the selector options applied",
		function () {
			test = 0;

			table.columns( { search: 'applied' } ).every( function () {
				test = this.nodes().length;
			} );
		},
		function () { return test === 13; }
	);



	oTest.fnTest( 
		"cells().every() will iterate for every cell",
		function () {
			test = 0;

			table.search('').draw();
			table.cells().every( function () {
				test++;
			} );
		},
		function () { return test === 57*5; }
	);

	oTest.fnTest( 
		"cells().every() will iterate for only filtered cells for options",
		function () {
			test = 0;

			table.search( 'net' ).draw();
			table.cells( { search: 'applied' } ).every( function () {
				test++;
			} );
		},
		function () { return test === 5*13; }
	);
	
	
	oTest.fnComplete();
} );