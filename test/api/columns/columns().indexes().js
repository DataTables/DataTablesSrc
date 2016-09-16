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
		it("Returns column index (no hidden columns)", function () {
			var table = $('#example').DataTable();
			var result = table.columns().indexes();
			expect(result[0] === 0 && result[5] == 5).toBe(true);
		});
		dt.html( 'basic' );
		it("Returns column index (hidden columns)", function () {
			var table = $('#example').DataTable();
			table.columns().visible( false );
			var result = table.columns().indexes();
			expect(result[0] === 0 && result[5] == 5).toBe(true);
		});
		dt.html( 'basic' );
		it("Returns column index (hidden columns- with visible)", function () {
			var table = $('#example').DataTable();
			table.columns().visible( false );
			var result = table.columns().indexes();
			expect(result[0] === 0 && result[5] == 5).toBe(true);
		});


	});

});
