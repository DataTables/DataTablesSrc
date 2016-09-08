// todo tests
// Exists and is a function
// Will return an API instance
// - No arguments
//   - Will select the first column
//   - Hide first column - still selects first columns (i.e. index 0)
// - Single argument - selector
//   - Can select first column with '*'
//   - Can select a single column
//   - Can select a single column using an integer
//   - Can select a single column indexed from the right using a negative integer
//   - Can select a column based on the visible index
//     - With column index 1 hidden, select 0:visIdx and 1:visIdx (to get columns 0 and 2)
//     - With column index 1 hidden, select 0:visible and 1:visible (as above)
//   - Can select column using `:name` selector
//   - Can select column using jQuery selector:
//     - Class name
//     - Index
//     - :not selector
//   - Can select column using cell header nodes
//   - Can select column using a function
//     - Select column index 0
//     - Select column index 1
//   - Can select using a jQuery instance that contains cell header node
// - Single argument - modifier
//   - Select a single column with order: index and use `columns().data()` - ensure the data is in index order
//   - Select a single column with order: current and use `columns().data()` - ensure the data is in displayed order
//   - Select a single column with page: current and use `columns().data()` - ensure data given for only the current page and with the current order
//   - Apply a search to the table
//     - Select a single column with search: current and use `columns().data()` - ensure data given is the filtered data only
// - Two arguments - selector and modifier
//   - Can select single columns using index with `order: applied` - confirm data is in expected order
//   - Can select column using a class selector and `page: current` confirm expected data
//   - Can select column using node with `search: current` - confirm expected data


describe( "columns- column() (solo)", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Exists and is a function", function () {
			var table = $('#example').DataTable();
			expect(typeof table.column).toBe('function');
		});
		dt.html( 'basic' );
		it("Returns an API instance", function () {
			var table = $('#example').DataTable();
			expect(table.column() instanceof $.fn.dataTable.Api).toBe(true);
		});
		//No arguments
		dt.html( 'basic' );
		it("No arguments- will select the first column", function () {
			var table = $('#example').DataTable();
			var result = table.column();
			expect(result[0][0]).toBe(0);
		});
		dt.html( 'basic' );
		it("No arguments- hide first column, still selects first column (ie index 0)", function () {
			var table = $('#example').DataTable({
				"columnDefs": [
					{
						"targets": [ 0 ],
						"visible": false
					}
				]
			});
			var result = table.column();
			expect(result[0][0]).toBe(0);
		});

		dt.html( 'basic' );
		it("Single arguments-  Can select first column with '*'", function () {
			var table = $('#example').DataTable();
			var result = table.column('*');
			expect(result[0][0]).toBe(0);
		});
		dt.html( 'basic' );
		it("Single arguments-  Can select a single column using an integer", function () {
			var table = $('#example').DataTable();
			var result = table.column(1);
			expect(result[0][0]).toBe(1);
		});
		dt.html( 'basic' );
		it("Single arguments-  Can select a single column indexed from the right using a negative integer", function () {
			var table = $('#example').DataTable();
			var result = table.column(-1);
			expect(result[0][0]).toBe(5);
		});
		dt.html( 'basic' );
		it("Single arguments-  Can select a column based on the visible index", function () {
			var table = $('#example').DataTable({
				"columnDefs": [
					{
						"targets": [ 1 ],
						"visible": false
					}
				]
			});
			var result = table.column('0:visIdx');
			var result2 = table.column('1:visIdx');
			expect(result[0][0]).toBe(0);
			expect(result2[0][0]).toBe(2);
		});
		dt.html( 'basic' );
		it("Single arguments-  Can select a column based on the visible index- test 2", function () {
			var table = $('#example').DataTable({
				"columnDefs": [
					{
						"targets": [ 1 ],
						"visible": false
					}
				]
			});
			var result = table.column('0:visible');
			var result2 = table.column('1:visible');
			expect(result[0][0]).toBe(0);
			expect(result2[0][0]).toBe(2);
		});

		dt.html( 'basic' );
		it("Single arguments-  Can select a column 'jQuery' classname selector", function () {
			var table = $('#example').DataTable({
				"columnDefs": [
					{ "name": "Name",   "targets": 0 }
				]
			});
			var result = table.column('.sorting_asc');
			expect(result[0][0]).toBe(0);
		});

		dt.html( 'basic' );
		it("Single arguments-  Can select a column header node", function () {
			var table = $('#example').DataTable({
				"columnDefs": [
					{ "name": "Name",   "targets": 0 }
				]
			});
			var result = table.column('#example thead th:eq(0)');
			expect(result[0][0]).toBe(0);
		});
		dt.html( 'basic' );
		it("Single arguments-  Can select a column using function", function () { // need help with this
			var table = $('#example').DataTable({
				"columnDefs": [
					{ "name": "Name",   "targets": 0 }
				]
			});
			var result = table.column(function(idx, data, node){
				return '#example thead th:eq(0)';
			});
			var result2 = table.column(function(idx, data, node){
				return '#example thead th:eq(3)';
			});
			expect(result[0][0]).toBe(0);
		});

		dt.html( 'basic' );
		it("Single argument- modifier-  Can select a column header node", function () {
			var table = $('#example').DataTable({
				"columnDefs": [
					{ "name": "Name",   "targets": 0 }
				]
			});
			var result = table.column({order:'current'} ).data();
			expect(result[0]).toBe("Airi Satou");
		});
		dt.html( 'basic' );
		it("Single argument- modifier- 'order: index'", function () {
			var table = $('#example').DataTable({
				"columnDefs": [
					{ "name": "Name",   "targets": 0 }
				]
			});
			var result = table.column({order:'index'} ).data();
			expect(result[0]).toBe("Tiger Nixon");
		});
		dt.html( 'basic' );
		it("Single argument- modifier-  'order: current'", function () {
			var table = $('#example').DataTable({
				"columnDefs": [
					{ "name": "Name",   "targets": 0 }
				]
			});
			var result = table.column({order:'current'} ).data();
			expect(result[0]).toBe("Airi Satou");
		});
		dt.html( 'basic' );
		it("Single argument- modifier-  'page: current' & Correct length", function () {
			var table = $('#example').DataTable({
				"columnDefs": [
					{ "name": "Name",   "targets": 0 }
				]
			});
			var result = table.column({page:'current'} ).data();
			// console.log(Object.keys(result).length);  //Ask about this. How to get length of data not the whole object.
			// console.log(result);
			expect(result[0]).toBe("Airi Satou");
		});
		dt.html( 'basic' );
		it("Single argument- modifier- 'search: applied' Applied search, only filtered data is returned", function () {
			var table = $('#example').DataTable({
				"columnDefs": [
					{ "name": "Name",   "targets": 0 }
				]
			});
			$('#example_filter input').val('Accountant').keyup();
			var result = table.column({search:'applied'} ).data(); //There is no 'search: current' used applied instead
			expect(result[0]).toBe("Airi Satou");
			expect(result[1]).toBe("Garrett Winters");
		});
				dt.html( 'basic' );
		it("Two arguments - selector and modifier- Can select single columns using index with `order: applied` - confirm data is in expected order", function () {
			var table = $('#example').DataTable({
				"columnDefs": [
					{ "name": "Name",   "targets": 0 }
				]
			});
			var result = table.column( 0, {order:'applied'} ).data();
			expect(result[0]).toBe("Airi Satou");
		});
		dt.html( 'basic' );
		it("Two arguments - selector and modifier-  - Can select column using a class selector and `page: current` confirm expected data", function () {
			var table = $('#example').DataTable({
				"columnDefs": [
					{ "name": "Name",   "targets": 0 }
				]
			});
			var result = table.column( '.sorting_asc', {page:'current'} ).data();
			expect(result[0]).toBe("Airi Satou");
		});
		dt.html( 'basic' );
		it("Two arguments - selector and modifier- Can select column using node with `search: current` - confirm expected data", function () {
			var table = $('#example').DataTable({
				"columnDefs": [
					{ "name": "Name",   "targets": 0 }
				]
			});
			$('#example_filter input').val('Accountant').keyup();
			var result = table.column( '#example thead th:eq(0)', {search:'applied'} ).data();
			expect(result[0]).toBe("Airi Satou");
		});
	});

});
