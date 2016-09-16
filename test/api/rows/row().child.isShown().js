// todo tests
// 1- Dom test- first child rows hidden
// 2- DOM test- child rows visible
// 3- DOM Test- no child rows
// 4- returned value is bool type


describe( "rows- row().child.isShown()", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Exists and is a function", function () {
			var table = $('#example').DataTable();
			expect(typeof table.row().child.isShown).toBe('function');
		});
		dt.html( 'basic' );
		it("Returns an API instance", function () {
			var table = $('#example').DataTable();
			expect(table.row().child.isShown() ).toBe(false);
		});

	});

});
