describe( "pageType Option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Check simple numbers paging is the default", function () {
			$('#example').dataTable( );
			expect($('#example').DataTable.settings[0].sPaginationType == 'simple_numbers').toBe(true);
		});
		it("Check class is applied", function () {
			expect($('#example_paginate').hasClass('paging_simple_numbers')).toBe(true);
		});
		it("8 A elements are in the wrapper for test data", function () {
			expect($('#example_paginate a').length == 8).toBe(true);
		});
		it("We have the previous button", function () {
			expect(document.getElementById('example_previous')).toBeTruthy();
		});
		it("We have the next button", function () {
			expect(document.getElementById('example_next')).toBeTruthy();
		});
		it("Previous button is disabled", function () {
			expect($('#example_previous').hasClass('disabled')).toBe(true);
		});
		it("Next button is enabled", function () {
			expect($('#example_next').hasClass('disabled')).toBe(false);
		});
		//Tests for paging are done in dt-zero_config.test.js
	});
	describe("Full buttons paging", function () {
		dt.html( 'basic' );
		it("Can enabled full numbers paging", function () {
			$('#example').dataTable( {
				"pagingType": "full_numbers"
			});
			expect($('#example').DataTable.settings[0].sPaginationType == "full_numbers").toBe(true);
		});
		it("Check full numbers class is applied", function () {
			expect($('#example_paginate').hasClass("paging_full_numbers")).toBe(true);
		});
		it("Jump to last page", function () {
			$('#example_last').click();
			expect(document.getElementById('example_info').innerHTML == "Showing 51 to 57 of 57 entries").toBe(true);
		});
		it("Go to two pages previous", function () {
			$('#example_previous').click();
			$('#example_previous').click();
			expect(document.getElementById('example_info').innerHTML == "Showing 31 to 40 of 57 entries").toBe(true);
		});
		it("Next (second last) page", function () {
			$('#example_next').click();
			expect(document.getElementById('example_info').innerHTML == "Showing 41 to 50 of 57 entries").toBe(true);
		});
		it("Jump to first page", function () {
			$('#example_first').click();
			expect(document.getElementById('example_info').innerHTML == "Showing 1 to 10 of 57 entries").toBe(true);
		});
	});


});
