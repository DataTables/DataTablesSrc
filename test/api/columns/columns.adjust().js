// todo tests
// - Confirm it exists and is a function
// - Always returns an API instance
// - Test when table is hidden on load make sure calcs match what we expect
// - Change length of data in one columns and check new widths are correct


describe( "columns- columns.adjust()", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Exists and is a function", function () {
			var table = $('#example').DataTable();
			expect(typeof table.columns.adjust).toBe('function');
		});
		dt.html( 'basic' );
		it("Returns an API instance", function () {
			var table = $('#example').DataTable();
			expect(table.columns.adjust() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

});
