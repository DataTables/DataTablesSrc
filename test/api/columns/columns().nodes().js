// todo tests
// - Confirm it exists and is a function- done
// - Confirm it returns an API instance - done
// - Data is returned as a 2D array
// - Returned data includes td nodes


describe( "columns- columns().nodes()", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {

		dt.html( 'basic' );
		it("Exists and is a function", function () {
			var table = $('#example').DataTable();
			expect(typeof table.columns().nodes).toBe('function');
		});
		dt.html( 'basic' );
		it("Returns an API instance", function () {
			var table = $('#example').DataTable();
			expect(table.columns().nodes() instanceof $.fn.dataTable.Api).toBe(true);
		});
		dt.html( 'basic' );
		it("Return data contains 2d array", function () {
			var table = $('#example').DataTable();
			var test = table.columns(1).nodes();
			expect(Array.isArray(test[0])).toBe(true);
		});
		it("Returned data is a <td> node", function () {
			var table = $('#example').DataTable();
			var test = table.columns(1).nodes().flatten().to$();
			expect(test[0].nodeName).toBe('TD');
		});
	});

});
