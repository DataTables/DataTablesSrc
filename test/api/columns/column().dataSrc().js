// todo tests
// - Confirm it exists and is a function
// - Create a table which uses the following for various columns (you might need to create multiple tables)
//   - Integer (array based tables)
//   - Function
//   - String (object based tables)
// - For each column confirm that this method returns the data source for that column
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
describe( "columns- column().dataSrc()", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Exists and is a function", function () {
			var table = $('#example').DataTable();
			expect(typeof table.column().dataSrc).toBe('function');
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
			expect(typeof table.column(1).dataSrc()).toBe('number');
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
			expect(typeof table.column(1).dataSrc()).toBe('function');
		});
		dt.html( 'empty' );
		it("Returns string when using string in column (object based table)", function (done) {
			var table = $('#example').DataTable({
				"ajax": '/base/test/data/data.txt',
				columns: [
					{ data: "name" },
					{ data: "position" },
					{ data: "office" },
					{ data: "extn" },
					{ data: "start_date" },
					{ data: "salary" }
				],
				initComplete: function ( settings, json ) {
					expect(typeof table.column(1).dataSrc()).toBe('string');
					done();
				}
			});

		});

	});

});
