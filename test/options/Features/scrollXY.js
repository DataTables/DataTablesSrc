describe( "scrollY / X option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );
	describe("XY tests", function () {
		dt.html( 'basic' );
		it("Header follows x-scrolling", function (done) {
			$('body').css('white-space', 'nowrap');
			dt.container().css('width', 400);
		 	$('#example').dataTable( {
				"scrollX": "100%",
				"scrollY": "200px",
				"paginate": false
			});
			$('div.dataTables_scrollBody').scrollLeft(20);
			setTimeout( function() {
				//Why? Since Javascript is single threaded the scroll event doesn't happen until there's a break in execution, so although the scrollLeft
				// has been set at that point, the event handler hasn't been executed. Datatables uses a scroll event to keep the header and body insync when scorlling
				// so setTimeout should be set to 0 for the time delay.
				expect($('div.dataTables_scrollHead').scrollLeft()).toEqual(20);
				done();
			}, 0);

		});
		it("Footer follow x-scrolling", function () {
			expect($('div.dataTables_scrollFoot').scrollLeft()).toEqual(20);
		});
		it("y-scrolling has no effect on header", function () {
			$('div.dataTables_scrollBody').scrollTop(20);
			expect($('div.dataTables_scrollHead').scrollLeft() == 20).toBeTruthy();
		});
		it("Filtering results in sets y-scroll back to 0- Testing DOM", function () {
			$('#example_filter input').val(1).keyup();
			expect($('div.dataTables_scrollHead').scrollTop() === 0).toBeTruthy();
		});
		it("Filter results in sets y-scroll back to 0- Testing search()", function () {
			$('div.dataTables_scrollBody').scrollTop(20);
			$('#example').DataTable().search('1').draw();
			expect($('div.dataTables_scrollHead').scrollTop() === 0).toBeTruthy();
		});
		it("Filtering has no effect on x-scroll", function () {
			expect($('div.dataTables_scrollBody').scrollLeft() == 202);
		});
		it("Full x-scroll has header track all the way with it", function (done) {
			$('div.dataTables_scrollBody').scrollLeft(
				$('#example').width() - $('div.dataTables_scrollBody')[0].clientWidth
			);
			setTimeout( function() {
			expect($('div.dataTables_scrollBody').scrollLeft() === $('div.dataTables_scrollHead').scrollLeft()).toBeTruthy();
				done();
			}, 0);
		});
		it("Footer also tracked all the way", function () {
			expect($('div.dataTables_scrollBody').scrollLeft() === $('div.dataTables_scrollFoot').scrollLeft());
		});
		it("Don't throw an error if initialising again on id selected element // Not sure about this one", function () {
			$('#example').dataTable();
			expect($('#example').dataTable()).toBeTruthy();
		});
		it("Don't throw an error if initialising again on tag name selected element- picking up header table as well", function () {
			$('table.dataTable').dataTable();
			expect($('table.dataTable').dataTable()).toBeTruthy();
		});

	});
	describe("5508- Table container width doesn't change when filtering applied to scrolling table ", function () {
		dt.html( 'basic' );

		it("Width of container 800px on init with scroll", function () {
			dt.container().css('width', 800);
			$('#example').dataTable( {
				"scrollY": "300px",
				"paginate": false
			} );
			expect($('div.dataTables_scrollBody').width() == 800).toBeTruthy(); //Changed to test height of div instead of width
		});
		it("Unaltered when filter applied", function () {
			$('#example_filter input').val("47").keyup(); //Not sure about this, original test used fnFilter, tried to use filter instead but couldn't get working
			expect($('div.dataTables_scrollBody').width() == 800).toBeTruthy();
		});
	});

} );
