// todo tests
// - Confirm it exists and is a function
// - Hide column indexes
// - Using `fromVisible`
//   - Convert visible index 0 to data
//   - Convert visible index 1 to data (repeat for the number of visible columns in the table)
//   - Repeat the above for `toData` - should be identical results
// - Using `fromData`
//   - Convert data index 0 to visible index
//   - Convert data index 1 to visible index (repeat for number of columns in the table) - should be null for hidden columns
//   - Repeat the above for `toVisible`

describe( "columns- column.index()", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Exists and is a function", function () {
			var table = $('#example').DataTable();
			expect(typeof table.column().index).toBe('function');
		});
		dt.html( 'basic' );
		it("Hide column- check data index", function () {
			var table = $('#example').DataTable();
			table.column( 0 ).visible( false );
			var idx = table.column( 1 ).index();
			expect(idx === 1).toBe(true);
		});
		dt.html( 'basic' );
		it("Hide column- check visible index", function () {
			var table = $('#example').DataTable();
			table.column( 0 ).visible( false );
			var idx = table.column( 1 ).index( 'visible');
			expect(idx === 0).toBe(true);
		});
	});

});
