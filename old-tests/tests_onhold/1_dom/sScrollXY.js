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
		function () { $('div.dt-scroll-body').scrollLeft(20); },
		function () { return $('div.dt-scroll-head').scrollLeft() == 20; }
	);
	
	oTest.fnWaitTest( 
		"Footer follows x-scrolling",
		null,
		function () { return $('div.dt-scroll-foot').scrollLeft() == 20; }
	);
	
	oTest.fnWaitTest( 
		"y-scrolling has no effect on header",
		function () { $('div.dt-scroll-body').scrollTop(20); },
		function () { return $('div.dt-scroll-head').scrollLeft() == 20; }
	);
	
	oTest.fnWaitTest( 
		"Filtering results in sets y-scroll back to 0",
		function () { oTable.fnFilter('1') },
		function () { return $('div.dt-scroll-body').scrollTop() == 0; }
	);
	
	oTest.fnWaitTest( 
		"Filtering has no effect on x-scroll",
		null,
		function () { return $('div.dt-scroll-body').scrollLeft() == 20; }
	);
	
	oTest.fnWaitTest( 
		"Full x-scroll has header track all the way with it",
		function () {
			$('div.dt-scroll-body').scrollLeft(
				$('#example').width() - $('div.dt-scroll-body')[0].clientWidth
			);
		},
		function () { return $('div.dt-scroll-body').scrollLeft() == $('div.dt-scroll-head').scrollLeft(); }
	);
	
	oTest.fnTest( 
		"Footer also tracked all the way",
		null,
		function () { return $('div.dt-scroll-body').scrollLeft() == $('div.dt-scroll-foot').scrollLeft(); }
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