// todo tests
// - Confirm it exists and is a function
// - Confirm it returns an API instance (checking contents for the following tests)
// - One row in header:
//   - Select the first and last columns and get their header cells
//   - Select the third column and get its header cell
// - Two rows in header:
//   - Select the first and second columns and get their header cells - only bottom cell for those columns are returned
//   - Select the last column and get its header cell - only bottom cell for that column is returned
//   - Set `orderCellsTop: true` and repeat above two tests to check the top cell is returned
// - Test with a scrolling table
// - Hide columns - ensure that their header nodes can still be accessed with this method

describe( "columns- columns().header()", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Exists and is a function", function () {
			var table = $('#example').DataTable();
			expect(typeof table.columns().header).toBe('function');
		});
		dt.html( 'basic' );
		it("Returns an API instance", function () {
			var table = $('#example').DataTable();
			expect(table.columns().header() instanceof $.fn.dataTable.Api).toBe(true);
		});	});

});
