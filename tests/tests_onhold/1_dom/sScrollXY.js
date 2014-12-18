// DATA_TEMPLATE: dom_data
oTest.fnStart( "sScrollX / Y" );


$(document).ready( function () {
	// Force some x scrolling
	$('body').css('white-space', 'nowrap');
	$('#container').css('width', '400px');

	var oTable = $('#example').dataTable( {
		"sScrollX": "100%",
		"sScrollY": "200px",
		"bPaginate": false
	} );
	
	oTest.fnWaitTest( 
		"Header follows x-scrolling",
		function () { $('div.dataTables_scrollBody').scrollLeft(20); },
		function () { return $('div.dataTables_scrollHead').scrollLeft() == 20; }
	);
	
	oTest.fnWaitTest( 
		"Footer follows x-scrolling",
		null,
		function () { return $('div.dataTables_scrollFoot').scrollLeft() == 20; }
	);
	
	oTest.fnWaitTest( 
		"y-scrolling has no effect on header",
		function () { $('div.dataTables_scrollBody').scrollTop(20); },
		function () { return $('div.dataTables_scrollHead').scrollLeft() == 20; }
	);
	
	oTest.fnWaitTest( 
		"Filtering results in sets y-scroll back to 0",
		function () { oTable.fnFilter('1') },
		function () { return $('div.dataTables_scrollBody').scrollTop() == 0; }
	);
	
	oTest.fnWaitTest( 
		"Filtering has no effect on x-scroll",
		null,
		function () { return $('div.dataTables_scrollBody').scrollLeft() == 20; }
	);
	
	oTest.fnWaitTest( 
		"Full x-scroll has header track all the way with it",
		function () {
			$('div.dataTables_scrollBody').scrollLeft(
				$('#example').width() - $('div.dataTables_scrollBody')[0].clientWidth
			);
		},
		function () { return $('div.dataTables_scrollBody').scrollLeft() == $('div.dataTables_scrollHead').scrollLeft(); }
	);
	
	oTest.fnTest( 
		"Footer also tracked all the way",
		null,
		function () { return $('div.dataTables_scrollBody').scrollLeft() == $('div.dataTables_scrollFoot').scrollLeft(); }
	);
	
	oTest.fnTest( 
		"Don't throw an error if initialising again on id selected element",
		function () {
			$('#example').dataTable();
		},
		function () { return true; }
	);
	
	oTest.fnTest( 
		"Don't throw an error if initialising again on tag name selected element - picking up header table as well",
		function () {
			$('table.dataTable').dataTable();
		},
		function () { return true; }
	);

	
	
	oTest.fnComplete();
} );