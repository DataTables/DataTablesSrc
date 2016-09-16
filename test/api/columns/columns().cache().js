// todo tests
// - Confirm it exists and is a function
// - Confirm it returns an API instance
// - Select two columns and get cached search data
//   - Ensure that the array ordering is index based with the first column's data appearing first and then the second's data
// - Selecting different and a different number of columns for each test:
//   - Get cached order data (no orthogonal data)
//   - Get cached order data (orthogonal data using a renderer)
//   - Get cached order data (orthogonal data using HTML5 attributes)
//   - Get cached search data (no orthogonal data)
//   - Get cached search data (orthogonal data using a renderer)
//   - Get cached search data (orthogonal data using HTML5 attributes)
//   - Attempt to get cached ordering data for columns which haven't had ordering applied to them (should be undefined or null I think)
//   - Use `rows().data()` or `cell().data()` to update the data and check the cache is updated
//   - Use the DOM to update the row's data and then `rows().invalidate()` to check the cache has been updated

describe( "columns- columns().cache()", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Exists and is a function", function () {
			var table = $('#example').DataTable();
			expect(typeof table.columns().cache).toBe('function');
		});
		dt.html( 'basic' );
		it("Returns an API instance", function () {
			var table = $('#example').DataTable();
			expect(table.columns().cache() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

});
