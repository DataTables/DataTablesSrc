// todo tests
// 1- Select first row, make sure the correct <tr> element has been returned
// 2- Add a class to a row using row().node() to select the row, then make sure its been added to the correct row in DOM.



describe( "rows- row().node()", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Default should be null", function () {
				});

	});

});
