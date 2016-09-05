// todo tests
// - Confirm it exists and is a function
// - Confirm it returns an API instance
// - Select a column - ensure that the API instance contains the nodes for that column and returned API instance is the right length (obviously don't check every single node!)
// - Test using Ajax sourced table with deferRender

describe( "columns- column().nodes()", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Exists and is a function", function () {
			var table = $('#example').DataTable();
			expect(typeof table.column().nodes).toBe('function');
		});
		dt.html( 'basic' );
		it("Returns an API instance", function () {
			var table = $('#example').DataTable();
			expect(table.column().nodes() instanceof $.fn.dataTable.Api).toBe(true);
		});
		dt.html( 'basic' );
		it("Return data contains 1d array of correct length(57)", function () {
			var table = $('#example').DataTable();
			var test = table.column(1).nodes();
			expect(test.length === 57).toBe(true);
		});
		dt.html( 'basic' );
		it("Returned data is for correct column", function () {
			var table = $('#example').DataTable();
			var test = table.column(1).nodes();
			expect(test[0].nodeName == "TD" && test[0].textContent == "Accountant").toBe(true);
		});
	});

});
