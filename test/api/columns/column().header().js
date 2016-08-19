// todo tests
// - Confirm it exists and is a function
// - Confirm it returns a node
// - One row in header:
//   - Select the first column and get its header cell
//   - Select the last column and get its header cell
// - Two rows in header:
//   - Select the first column and get its header cell - only bottom cell for that column is returned
//   - Select the last column and get its header cell - only bottom cell for that column is returned
//   - Set `orderCellsTop: true` and repeat above two tests to check the top cell is returned
// - Test with a scrolling table
// - Hide a column - ensure that its header node can still be accessed with this method

describe( "columns- column().header()", function() {
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
