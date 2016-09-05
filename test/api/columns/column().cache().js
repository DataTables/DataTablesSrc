// todo tests
// - Confirm it exists and is a function
// - Confirm it returns an API instance
// - Get cached order data (no orthogonal data)
// - Get cached order data (orthogonal data using a renderer)
// - Get cached order data (orthogonal data using HTML5 attributes)
// - Get cached search data (no orthogonal data)
// - Get cached search data (orthogonal data using a renderer)
// - Get cached search data (orthogonal data using HTML5 attributes)
// - Attempt to get cached ordering data for columns which haven't had ordering applied to them (should be undefined or null I think)
// - Use `rows().data()` or `cell().data()` to update the data and check the cache is updated
// - Use the DOM to update the row's data and then `rows().invalidate()` to check the cache has been updated

describe( "columns- column().cache()", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Exists and is a function", function () {
			var table = $('#example').DataTable();
			expect(typeof table.column().cache).toBe('function');
		});
		dt.html( 'basic' );
		it("Returns an API instance", function () {
			var table = $('#example').DataTable();
			expect(table.column().cache( 'search' ) instanceof $.fn.dataTable.Api).toBe(true);
		});
		//Order tests
		dt.html( 'basic' );
		it("Get cached order data (no orthogonal data)", function () {
			var table = $('#example').DataTable();
			$('#example thead th:eq(0)').click(); //flip around the sorting on column 0 so we know the ordering is working and being cached
			var test = table.column(0).cache( 'order' );
		
			expect(test[0] === "zorita serrano").toBe(true);
		});


		//Search tests
		dt.html( 'basic' );
		it("Get cached order data (no orthogonal data)", function () {
			var table = $('#example').DataTable();
			table.search('Zorita').draw();

			//$('#example_filter input').val('Zorita').keyup(); //flip around the sorting on column 0 so we know the ordering is working and being cached
			var test = table.column(0).cache( 'search' );

			//expect(test[0] === "zorita serrano").toBe(true);
		});
	});

});
