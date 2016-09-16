// todo tests
// 1- Has exactly one param and that is of type string, accepts values of only 'search'  and 'cache'
// 2- Data returned for both types is what we expect
// - Confirm it exists and is a function
// - Confirm it returns an API instance

describe( "rows- row().cache()", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Exists and is a function", function () {
			var table = $('#example').DataTable();
			expect(typeof table.row().cache).toBe('function');
		});
		dt.html( 'basic' );
		it("Returns an API instance", function () {
			var table = $('#example').DataTable();
			expect(table.row().cache( 'search' ) instanceof $.fn.dataTable.Api).toBe(true);
		});

		dt.html( 'basic' );
		it("Get cached order data (no orthogonal data)", function () {
			var table = $('#example').DataTable();
			$('#example thead th:eq(0)').click();
			var test = table.column(0).cache( 'order' );
			expect(test[0] === "zorita serrano").toBe(true);
		});


	});

});
