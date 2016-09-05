// todo tests
// - Confirm it exists and is a function
// - Returns an API index
// - Return column index (no hidden columns)
// - Return column index (with hidden columns)
describe( "columns- columns().indexes()", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Exists and is a function", function () {
			var table = $('#example').DataTable();
			expect(typeof table.columns().indexes).toBe('function');
		});
		dt.html( 'basic' );
		it("Returns an API instance", function () {
			var table = $('#example').DataTable();
			expect(table.columns().indexes() instanceof $.fn.dataTable.Api).toBe(true);
		});

	});

});
