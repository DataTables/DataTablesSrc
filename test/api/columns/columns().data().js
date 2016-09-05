// todo tests
// - Confirm it exists and is a function
// - Confirm it returns API instance
// - Select a single column and confirm that the data is returned for that column
// - Select two columns and confirm the data is returned for those two columns
// - Select all columns and confirm the data is returned for all columns
// - Test with both array based tables and object based tables
describe( "columns- columns().data()", function() {
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
