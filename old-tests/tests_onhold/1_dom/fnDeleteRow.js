// DATA_TEMPLATE: dom_data
oTest.fnStart( "fnDeleteRow" );

$(document).ready( function () {
	/* Check the default */
	var oTable = $('#example').dataTable();
	var oSettings = oTable.fnSettings();
	
	oTest.fnTest( 
		"Check that the default data is sane",
		null,
		function () { return $('#example tbody td:eq(1)').text() == 'Firefox 1.0'; }
	);
	
	oTest.fnTest( 
		"Remove the first data row, and check that the search data has been updated",
		function () { oTable.fnDeleteRow( $('#example tbody tr')[0] ); },
		function () { return $('#example tbody td:eq(1)').text() == 'Firefox 1.5'; }
	);
	
	oTest.fnTest( 
		"Check that the info element has been updated",
		null,
		function () { return $('#example_info').html() == "Showing 1 to 10 of 56 entries"; }
	);
	
	
	
	oTest.fnComplete();
} );