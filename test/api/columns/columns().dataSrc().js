// todo tests
// - Confirm it exists and is a function
// - Confirm it returns an API instance
//   - Even if only a single column is selected
// - Create a table which uses the following for various columns (you might need to create multiple tables)
//   - Integer (array based tables)
//   - Function
//   - String (object based tables)
// - Select multiple columns and confirm that the data source for each selected column is:
//   - e.g. if `columns.data` is not set it should return an integer (array based tables)
//   - if `columns.data` is a string it should return that string
//   - if `columns.data` is a function it should return that function, etc
describe( "columns- columns().dataSrc()", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Exists and is a function", function () {
			var table = $('#example').DataTable();
			expect(typeof table.columns().dataSrc).toBe('function');
		});
		dt.html( 'basic' );
		it("Returns an API instance", function () {
			var table = $('#example').DataTable();
			expect(table.columns().dataSrc() instanceof $.fn.dataTable.Api).toBe(true);
		});

	});

});
