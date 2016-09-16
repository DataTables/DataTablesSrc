// todo tests
// 1- Start with child rows visible, call this method and then check via dom if rows are hidden
// 2- Start with child rows hidden, call this, should still be hidden.
// - Confirm it exists and is a function
// - Confirm it returns an API instance

describe( "rows- row().child.hide()", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Exists and is a function", function () {
			var table = $('#example').DataTable();
			expect(typeof table.row().child.hide).toBe('function');
		});
		dt.html( 'basic' );
		it("Returns an API instance", function () {
			var table = $('#example').DataTable();
			expect(table.row().child.hide() instanceof $.fn.dataTable.Api).toBe(true);
		});

	});

});
