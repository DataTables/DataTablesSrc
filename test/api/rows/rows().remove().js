// todo tests
// 1- Delete row, check deleted in DOM, memory and from Datatables chache
// 2- Test deleting all rows with a class, add class prior to multiple rows, check again if rows have been deleted properly.



describe( "rows- rows().remove()", function() {
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
