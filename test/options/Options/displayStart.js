describe( "displayStart Option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Check row 0 is first record by default", function () {
			$('#example').dataTable( );
			expect($('#example_info').html() == "Showing 1 to 10 of 57 entries").toBeTruthy();
		});
	});

	describe("Check when enabled", function () {
		it("First row is 20", function () {
			$('#example').dataTable({
				"displayStart": 20,
				"destroy": true
			});
			expect($('#example_info').html() == "Showing 21 to 30 of 57 entries").toBeTruthy();
		});

	});
});
