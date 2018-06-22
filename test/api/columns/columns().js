// todo tests
// Exists and is a function
// Will return an API instance
// - No arguments
//   - Will select all columns
//   - Hide a column - still selects all columns
// - Single argument - selector
//   - Can select all columns with '*'
//   - Can select a single column
//   - Can select a single column using an integer
//   - Can select a column based on the visible index
//     - With column index 1 hidden, select 0:visIdx and 1:visIdx (to get columns 0 and 2)
//     - With column index 1 hidden, select 0:visible and 1:visible (as above)
//   - Can select columns using `:name` selector
//   - Can select columns using jQuery selector:
//     - Class name
//     - Index
//     - :not selector
//   - Can select columns using cell header nodes
//   - Can select columns using a function
//     - Select column index 0
//     - Select columns with even indexes
//   - Can select using a jQuery instance that contains cell header nodes
//   - Can select using an array with combinations of the above (make these up as you go)
// - Single argument - modifier
//   - Select a single column with order: index and use `columns().data()` - ensure the data is in index order
//   - Select a single column with order: current and use `columns().data()` - ensure the data is in displayed order
//   - Select a single column with page: current and use `columns().data()` - ensure data given for only the current page and with the current order
//   - Apply a search to the table
//     - Select a single column with search: current and use `columns().data()` - ensure data given is the filtered data only
// - Two arguments - selector and modifier
//   - Can select two columns using indexes with `order: applied` - confirm data is in expected order
//   - Can select columns using a class selector and `page: current` confirm expected data
//   - Can select columns using nodes with `search: current` - confirm expected data


describe( 'columns- columns() -solo', function() {
	var table;

	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	dt.html( 'basic' );

	it( 'jQuery selector with a comma is not split', function () {
		table = $('#example').DataTable();

		var cols = table.columns( ':first-child, :last-child' ).header().to$();

		expect( cols.length ).toBe( 2 );
		expect( cols.eq(0).text() ).toBe( 'Name' );
		expect( cols.eq(1).text() ).toBe( 'Salary' );
	} );

	it( 'jQuery selector with a comma is not split, with not selector', function () {
		var cols = table.columns( ':not(:first-child,:last-child)' ).header().to$();

		expect( cols.length ).toBe( 4 );
		expect( cols.eq(0).text() ).toBe( 'Position' );
		expect( cols.eq(1).text() ).toBe( 'Office' );
		expect( cols.eq(2).text() ).toBe( 'Age' );
		expect( cols.eq(3).text() ).toBe( 'Start date' );
	} );
	dt.html( 'basic' );
	it("Exists and is a function", function () {
		var table = $('#example').DataTable();
		expect(typeof table.columns).toBe('function');
	});
	dt.html( 'basic' );
	it("Returns an API instance", function () {
		var table = $('#example').DataTable();
		expect(table.columns() instanceof $.fn.dataTable.Api).toBe(true);
	});
	//No arguments
	dt.html( 'basic' );
	it("No arguments- will select all columns", function () {
		var table = $('#example').DataTable();
		var result = table.columns();
		expect(result[0]).toEqual([0, 1, 2, 3, 4, 5]);
	});
	dt.html( 'basic' );
	it("No arguments- hide first column, still selects all columns", function () {
		var table = $('#example').DataTable({
			"columnDefs": [
				{
					"targets": [ 0 ],
					"visible": false
				}
			]
		});
		var result = table.columns();
		expect(result[0]).toEqual([0, 1, 2, 3, 4, 5]);
	});

	dt.html( 'basic' );
	it("Single arguments-  Can select all columns with '*'", function () {
		var table = $('#example').DataTable();
		var result = table.columns('*');
		expect(result[0]).toEqual([0, 1, 2, 3, 4, 5]);
	});

	dt.html( 'basic' );
	it("Single arguments-  Can select a single column using an integer", function () {
		var table = $('#example').DataTable();
		var result = table.columns(1);
		expect(result[0][0]).toBe(1);
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
		var result = table.columns('0:visIdx');
		var result2 = table.columns('1:visIdx');
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
		var result = table.columns('0:visible');
		var result2 = table.columns('1:visible');

		expect(result[0][0]).toBe(0);
		expect(result2[0][0]).toBe(2);
	});
	dt.html( 'basic' );
	it("Single arguments-  Can select a column name selector", function () {
		var table = $('#example').DataTable({
			"columnDefs": [
				{ "name": "Name",   "targets": 0 }
			]
		});
		var result = table.columns('Name:name');
		expect(result[0][0]).toBe(0);
	});

	dt.html( 'basic' );
	it("Single arguments-  Can select a column 'jQuery' classname selector", function () {
		var table = $('#example').DataTable({
			"columnDefs": [
				{ "name": "Name",   "targets": 0 }
			]
		});
		var result = table.columns('.sorting_asc');
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
		var result = table.columns(function(idx, data, node){
			return '#example thead th:eq(0)';
		});
		var result2 = table.columns(function(idx, data, node){
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
		var result = table.columns({order:'current'} ).data();
		expect(result[0][0]).toBe("Airi Satou");
	});
	dt.html( 'basic' );
	it("Single argument- modifier- 'order: index'", function () {
		var table = $('#example').DataTable({
			"columnDefs": [
				{ "name": "Name",   "targets": 0 }
			]
		});
		var result = table.columns({order:'index'} ).data();
		expect(result[0][0]).toBe("Tiger Nixon");
	});
	dt.html( 'basic' );
	it("Single argument- modifier-  'order: current'", function () {
		var table = $('#example').DataTable({
			"columnDefs": [
				{ "name": "Name",   "targets": 0 }
			]
		});
		var result = table.columns({order:'current'} ).data();
		expect(result[0][0]).toBe("Airi Satou");
	});
	dt.html( 'basic' );
	it("Single argument- modifier-  'page: current' & Correct length", function () {
		var table = $('#example').DataTable({
			"columnDefs": [
				{ "name": "Name",   "targets": 0 }
			]
		});
		var result = table.columns({page:'current'} ).data();
		// console.log(Object.keys(result).length);  //Ask about this. How to get length of data not the whole object.
		// console.log(result);
		expect(result[0][0]).toBe("Airi Satou");
	});
	dt.html( 'basic' );
	it("Single argument- modifier- 'search: applied' Applied search, only filtered data is returned", function () {
		var table = $('#example').DataTable({
			"columnDefs": [
				{ "name": "Name",   "targets": 0 }
			]
		});
		$('div.dataTables_filter input').val('Accountant').keyup();
		var result = table.columns({search:'applied'} ).data(); //There is no 'search: current' used applied instead
		expect(result[0][0]).toBe("Airi Satou");
		expect(result[0][1]).toBe("Garrett Winters");
	});
			dt.html( 'basic' );
	it("Two arguments - selector and modifier- Can select single columns using index with `order: applied` - confirm data is in expected order", function () {
		var table = $('#example').DataTable({
			"columnDefs": [
				{ "name": "Name",   "targets": 0 }
			]
		});
		var result = table.columns( 0, {order:'applied'} ).data();
		expect(result[0][0]).toBe("Airi Satou");
	});
	dt.html( 'basic' );
	it("Two arguments - selector and modifier-  - Can select column using a class selector and `page: current` confirm expected data", function () {
		var table = $('#example').DataTable({
			"columnDefs": [
				{ "name": "Name",   "targets": 0 }
			]
		});
		var result = table.columns( '.sorting_asc', {page:'current'} ).data();
		expect(result[0][0]).toBe("Airi Satou");
	});
	dt.html( 'basic' );
	it("Two arguments - selector and modifier- Can select column using node with `search: current` - confirm expected data", function () {
		var table = $('#example').DataTable({
			"columnDefs": [
				{ "name": "Name",   "targets": 0 }
			]
		});
		$('div.dataTables_filter input').val('Accountant').keyup();
		var result = table.columns( '#example thead th:eq(0)', {search:'applied'} ).data();
		expect(result[0][0]).toBe("Airi Satou");
	});
} );
