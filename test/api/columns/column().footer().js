// todo tests
// - Confirm it exists and is a function
// - Confirm it returns a node
// - One row in footer:
//   - Select the first column and get its footer cell
//   - Select the last column and get its footer cell
// - Two rows in footer:
//   - Select the first column and get its footer cell - only first cell for that column is returned
//   - Select the last column and get its footer cell - only first cell for that column is returned
// - Test with no footer, make sure null is returned for all columns
// - Test with a scrolling table that has a footer
// - Hide a column - ensure that its footer node can still be accessed with this method

describe( "columns- column().footer()", function() {
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
