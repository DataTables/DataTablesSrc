// DATA_TEMPLATE: empty_table
oTest.fnStart( "Cell invalidation" );


$(document).ready( function () {
	var t = $('#example').DataTable( {
		ajax: "../../../examples/ajax/data/arrays.txt"
	} );
	
	oTest.fnWaitTest( 
		"Cell 1 html is as expected",
		null,
		function () { return $(t.cell(':eq(0)', 0).node()).text() == 'Airi Satou'; }
	);

	oTest.fnTest( 
		"Cell 1 data is as expected",
		null,
		function () { return t.cell(':eq(0)', 0).data() == 'Airi Satou'; }
	);
	
	oTest.fnTest( 
		"Cell 2 html is as expected",
		null,
		function () { return $(t.cell(':eq(0)', 1).node()).text() == 'Accountant'; }
	);

	oTest.fnTest( 
		"Cell 2 data is as expected",
		null,
		function () { return t.cell(':eq(0)', 1).data() == 'Accountant'; }
	);
	
	oTest.fnTest( 
		"Cell 3 html is as expected",
		null,
		function () { return $(t.cell(':eq(0)', 2).node()).text() == 'Tokyo'; }
	);

	oTest.fnTest( 
		"Cell 3 data is as expected",
		null,
		function () { return t.cell(':eq(0)', 2).data() == 'Tokyo'; }
	);


	oTest.fnTest( 
		"Modify the HTML in cell 2 - cell data hasn't changed",
		function () { $('#example tbody tr:eq(0) td:eq(1)').html('html write'); },
		function () { return t.cell(':eq(0)', 1).data() == 'Accountant'; }
	);

	oTest.fnTest( 
		"Modify the data in cell 1 - html updates",
		function () { t.cell(':eq(0)', 0).data('allan'); },
		function () { return $(t.cell(':eq(0)', 0).node()).text() == 'allan'; }
	);

	oTest.fnTest( 
		"And cell 2's content hasn't changed",
		null,
		function () { return $(t.cell(':eq(0)', 1).node()).text() == 'html write'; }
	);

	oTest.fnTest( 
		"And cell 2's data hasn't changed",
		null,
		function () { return t.cell(':eq(0)', 1).data() == 'Accountant'; }
	);


	oTest.fnTest( 
		"HTML write to cell 3 - data doesn't change",
		function () { $('#example tbody tr:eq(0) td:eq(2)').html('lottie'); },
		function () { return t.cell(':eq(0)', 2).data() == 'Tokyo'; }
	);

	oTest.fnTest( 
		"Data invalidate cell 3 - data value written to the DOM",
		function () { t.cell(':eq(0)', 2).invalidate(); },
		function () { return $(t.cell(':eq(0)', 2).node()).text() == 'Tokyo'; }
	);

	oTest.fnTest( 
		"And data matches",
		null,
		function () { return t.cell(':eq(0)', 2).data() == 'Tokyo'; }
	);

	oTest.fnTest( 
		"And cell 2's content hasn't changed",
		null,
		function () { return $(t.cell(':eq(0)', 1).node()).text() == 'html write'; }
	);

	oTest.fnTest( 
		"And cell 2's data hasn't changed",
		null,
		function () { return t.cell(':eq(0)', 1).data() == 'Accountant'; }
	);


	oTest.fnTest( 
		"DOM invalidate cell 2 - data has changed",
		function () { t.cell(':eq(0)', 1).invalidate('dom'); },
		function () { return t.cell(':eq(0)', 1).data() == 'html write'; }
	);


	oTest.fnTest( 
		"Change data directly for cell 1 - html not updated",
		function () { t.row(':eq(0)').data()[0] = 'archie'; },
		function () { return $(t.cell(':eq(0)', 0).node()).text() == 'allan'; }
	);

	oTest.fnTest( 
		"Data invalidate cell 1 - data written to dom",
		function () { t.cell(':eq(0)', 0).invalidate(); },
		function () { return $(t.cell(':eq(0)', 0).node()).text() == 'archie'; }
	);

	oTest.fnTest( 
		"Change data directly for cell 1 - again html not updated",
		function () { t.row(':eq(0)').data()[0] = 'lottie'; },
		function () { return $(t.cell(':eq(0)', 0).node()).text() == 'archie'; }
	);

	oTest.fnTest( 
		"HTML invalidate cell 1 - data read from HTML",
		function () { t.cell(':eq(0)', 0).invalidate('dom'); },
		function () { return t.cell(':eq(0)', 0).data() == 'archie'; }
	);

	oTest.fnTest( 
		"And cell content remains",
		null,
		function () { return $(t.cell(':eq(0)', 0).node()).text() == 'archie'; }
	);


	
	oTest.fnComplete();
} );