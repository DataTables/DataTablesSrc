// todo tests
// - Confirm it exists and is a function
// - Confirm it returns an API instance
//   - Even if only a single column is selected
// - Create a table which uses the following for various columns (you might need to create multiple tables)
//   - Integer (array based tables)
//   - Function
//   - String (object based tables)
// - Select multiple columns and confirm that the data source for each selected column is:
//   - e.g. if `columns.data` is not set it should return an integer (array based tables)
//   - if `columns.data` is a string it should return that string
//   - if `columns.data` is a function it should return that function, etc
var dataSet = [
    [ 2016, 37],
	[ 2016, 27],
	[ 2016, 23],
	[ 2016, 19],
	[ 2016, 43],
	[ 2016, 76],
];
describe( "columns- columns().dataSrc()", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Exists and is a function", function () {
			var table = $('#example').DataTable();
			expect(typeof table.columns().dataSrc).toBe('function');
		});
		dt.html( 'basic' );
		it("Returns an API instance", function () {
			var table = $('#example').DataTable();
			expect(table.columns().dataSrc() instanceof $.fn.dataTable.Api).toBe(true);
		});
		dt.html( 'basic' );
		it("Returns an API instance- 1 column selected", function () {
			var table = $('#example').DataTable();
			expect(table.columns(1).dataSrc() instanceof $.fn.dataTable.Api).toBe(true);
		});
		dt.html( 'currency' );
		it("If columns.data is not set it should return an integer (array based table)", function () {
			var table = $('#example').DataTable({
				data: dataSet,
				columns: [
					{title: "Name"},
					{title: "Age"}
				]
			});
			var result = table.columns().dataSrc();
			expect(typeof result[0]).toBe('number');
		});
		dt.html( 'currency');
		it("Returns a function, when using a function set in columnDefs.data", function () {
			var count = 0;
			var table = $('#example').DataTable({
				"data": dataSet,
				"columnDefs": [ {
					"targets": 1,
					"data": function (row, type, val, meta){
						count = val + count;
						return count;
					}
				}]
			});
			var result = table.columns(1).dataSrc();
			expect(typeof result[0]).toBe('function');
		});
		dt.html( 'empty' );
		it("Returns string when using string in column (object based table)", function (done) {
			var table = $('#example').DataTable({
				"ajax": '/base/test/data/data.txt',
				columns: [
					{ data: "name" },
					{ data: "position" },
					{ data: "office" },
					{ data: "age" },
					{ data: "start_date" },
					{ data: "salary" }
				],
				initComplete: function ( settings, json ) {
					var result = table.columns(1).dataSrc();
					expect(typeof result[0]).toBe('string');
					done();
				}
			});

		});

	});

});
