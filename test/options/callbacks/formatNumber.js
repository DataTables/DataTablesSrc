describe( "displayStart Option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Check default is 0", function () {

		});
		it("Check row 0 is first record by default", function () {
			$('#example').dataTable( );
			expect($('#example_info').html() == "Showing 1 to 10 of 57 entries").toBeTruthy();
		});
	});

});
