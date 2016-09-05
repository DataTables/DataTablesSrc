// todo tests
// - Confirm it exists and is a function- done
// - Returns an API instance - done
// - Make sure the rows we select are iterated over only.
// - Ensure that the callback function is executed in the scope of an API instance which has the column's index in its data set (and only that column index)

describe( "columns- columns().every()", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Exists and is a function", function () {
			var table = $('#example').DataTable();
			expect(typeof table.columns().every).toBe('function');
		});
		dt.html( 'basic' );
		it("Returns an API instance", function () {
			var table = $('#example').DataTable();
			var n = 0;
			expect(table.columns().every( function(){n++;}) instanceof $.fn.dataTable.Api).toBe(true);
		});

		//Need a hand with this test

		dt.html( 'basic' );
		it("Every column selected is interated upon", function () {
			var table = $('#example').DataTable();
			var n = -1;
			table.columns().every( function() {
				n++;
			});
			expect(n).toBe(5);
		});
		dt.html( 'basic' );
		it("Each API has the colum index in its dataset", function () {
			var that= "";
			var table = $('#example').DataTable();
			table.columns().every( function() {
				that = this;
				that = that[0][0]; //that[0][0] is accessing the value of the index of a column
			});
			expect(that === 5).toBe(true);
		});
	});

});
