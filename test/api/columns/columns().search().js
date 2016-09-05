// todo tests
// - Confirm it exists and is a function
// - Returns an API instance
// - Getter:
//   - Confirm it will contain the search values (when set by API)
//   - Confirm it will contain the search values (when set by searchCols)
//   - Confirm it will contain the search values (mixed)
// - Setter:
//   - Will apply the same search sting to all selected columns (select 0, 1, 2 and all columns)
//   - Is not regex by default
//   - Is smart search by default
//   - Is case insensitive by default
//   - Can set a regex search
//   - Can disable smart search
//   - Can enable case sensitively


describe( "columns- columns().search()", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Exists and is a function", function () {
			var table = $('#example').DataTable();
			expect(typeof table.columns().order).toBe('function');
		});
		dt.html( 'basic' );
		it("Returns an API instance", function () {
			var table = $('#example').DataTable();
			expect(table.columns().order() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

});
