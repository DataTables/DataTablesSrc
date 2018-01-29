// todo tests
// - Check it exists and is a function
// - Returns ordering of table. Should test with multiple types of ordering set on table and check against what we would expect the returned array to look like
// - Sets ordering of table Correctly
//   - Table is not redrawn until draw() is called
//   - But order() as a getter before draw() returns the new order
// - Ensure that order can be applied to multiple tables when the API instance has multiple tables in its context
// - As a setter multi-dimentational sorting can be specified as:
//   - Multiple arguments
//   - A single 2D array
// - As a setter it returns an API instance (for both multiple arguments and single 2D array)
// TK COLIN - look at order by type (date/string/integer/boolean/etc)
describe( "core- order()", function() {
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
