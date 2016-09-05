// todo tests
// - Confirm it exists and is a function
// - Confirm it returns an API instance (checking contents for the following tests)
// - One row in footer:
//   - Select the first and last columns and get its footer cells
//   - Select the second column only and get its footer cell
// - Two rows in footer:
//   - Select the first and third columns and get their footer cell - only first cells for those columns are in the result
//   - Select the last column and get its footer cell - only first cell for that column is returned
// - Test with no footer, make sure null is returned for all columns
// - Test with a scrolling table that has a footer
// - Hide columns - ensure that their footer nodes can still be accessed with this method

describe( "columns- columns().footer()", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Exists and is a function", function () {
			var table = $('#example').DataTable();
			expect(typeof table.columns().footer).toBe('function');
		});
		dt.html( 'basic' );
		it("Returns an API instance", function () {
			var table = $('#example').DataTable();
			expect(table.columns().footer() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

});
