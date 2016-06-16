// DATA_TEMPLATE: empty_table
oTest.fnStart( "API selectors with deferRender enabled" );


$(document).ready( function () {
	var table = $('#example').DataTable( {
		deferRender: true,
		ajax: "../../../examples/ajax/data/arrays.txt"
	} );
	
	oTest.fnWaitTest(
		"rows().nodes(), no selector, returns 10 nodes",
		null,
		function () { return table.rows().nodes().length === 10; }
	);

	oTest.fnTest(
		"rows().nodes(), class defined selector, returns 5 nodes",
		null,
		function () { return table.rows('.odd').nodes().length === 5; }
	);

	oTest.fnTest(
		"rows().nodes(), class not defined selector, returns 0 nodes",
		null,
		function () { return table.rows('.nothere').nodes().length === 0; }
	);

	
	oTest.fnTest(
		"column(0).nodes(), returns 10 nodes",
		null,
		function () { return table.column(0).nodes().length === 10; }
	);


	oTest.fnTest(
		"cells().nodes(), no selector, returns 60 nodes",
		null,
		function () { return table.cells().nodes().length === 60; }
	);

	oTest.fnTest(
		"cells().nodes(), class defined selector, returns 0 nodes",
		null,
		function () { return table.cells('.sorting_1').nodes().length === 10; }
	);

	oTest.fnTest(
		"cells().nodes(), class not defined selector, returns 0 nodes",
		null,
		function () { return table.cells('.nothere').nodes().length === 0; }
	);
	
	
	oTest.fnComplete();
} );