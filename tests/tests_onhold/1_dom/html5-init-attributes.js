// DATA_TEMPLATE: dom_data
oTest.fnStart( "HTML 5 data-* attributes as initialisation options" );


$(document).ready( function () {
	// Add attributes - using DOM methods to prevent any possible jQuery overlap
	var table = $('#example')[0];
	table.setAttribute( 'data-page-length', 25 );
	table.setAttribute( 'data-order', '[[ 1, "asc" ]]' );
	table.setAttribute( 'data-scrollY', 300 );

	var cols = $('#example thead th');
	cols[3].setAttribute( 'data-orderable', 'false' );
	cols[2].setAttribute( 'data-class-name', 'unitTest' );

	var dt = $('#example').DataTable();

	oTest.fnTest( 
		"Page length is 25",
		null,
		function () {
			return $('#example tbody tr').length === 25;
		}
	);

	oTest.fnTest( 
		"Ordering is by column 1 asc",
		null,
		function () {
			return $('#example tbody tr:eq(0) td:eq(1)').text() === 'All others';
		}
	);

	oTest.fnTest( 
		"Column idx 3 cannot be sorted",
		function () {
			return $('#example thead th:eq(3)').click();
		},
		function () {
			return $('#example tbody tr:eq(0) td:eq(1)').text() === 'All others';
		}
	);

	oTest.fnTest( 
		"Column idx 0 can be sorted",
		function () {
			return $('#example thead th:eq(0)').click();
		},
		function () {
			return $('#example tbody tr:eq(0) td:eq(0)').text() === 'Gecko';
		}
	);

	oTest.fnTest( 
		"Column idx 2 has as class name assigned",
		null,
		function () {
			return $('#example tbody tr td.unitTest').length == 25;
		}
	);
	
	
	oTest.fnComplete();
} );