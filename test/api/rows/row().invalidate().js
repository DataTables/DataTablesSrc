// todo tests
// 1- Update data in datasource then use this method to update data, read DOM to see if data is actually updated
// 2- 1 parameter of stype string that can take 3 vaues auto,data and dom.
// 3- Test using an external object, updating that object then rereading the datasource



describe( "rows- row().invalidate()", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Exists and is a function", function () {
			var table = $('#example').DataTable();
			expect(typeof table.row().invalidate).toBe('function');
		});
		dt.html( 'basic' );
		it("Returns API instance", function () {
			var table = $('#example').DataTable();
			expect(table.row(0).invalidate() instanceof $.fn.dataTable.Api).toBe(true);
		});
		dt.html( 'basic' );
		it("Use jQuery to modify row contents, then invalidate the row held.", function () {
			var table = $('#example').DataTable();
		});
	});

});
