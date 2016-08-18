// todo tests
// 
// - Check it exists and is a function
// - returns API instance (although it is redundant since the table is now "dead")
// - Using destroy() removes all extra html elements and leaves blank table with data
// - Parameter 1:
//   - `undefined` - removes all extra html elements and leaves blank table with data
//   - `true` - removes the table from the DOM entirely
//   - `false` - leaves the table in the DOM, but removed all enhancements
//   - `false` - uses `$().remove()` - test by adding a custom event to the table before destroy and checking if it is still attached to the table after calling `destroy`
describe( "core- destroy()", function() {
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
