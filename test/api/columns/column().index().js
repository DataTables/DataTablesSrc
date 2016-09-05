// todo tests
// - Confirm it exists and is a function
// - Return column index (no hidden columns)
// - Return column index (with hidden columns)

describe( "columns- column().index()", function() {
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
		it("Returns column index (no hidden columns)", function () {
			var table = $('#example').DataTable();
			expect(table.column(0).index()).toBe(0);
		});
		dt.html( 'basic' );
		it("Returns column index (hidden columns)", function () {
			var table = $('#example').DataTable();
			table.column( 0 ).visible( false );
			expect(table.column(1).index()).toBe(1);
		});
		dt.html( 'basic' );
		it("Returns column index (hidden columns- with visible)", function () {
			var table = $('#example').DataTable();
			table.column( 0 ).visible( false );
			expect(table.column(1).index('visible')).toBe(0);
		});

	});

});
