// todo tests
// 1- GET using DOM sourced data- Make sure returned data is an array
// 2- GET using JSON data- Make sure returned data is an objects
// 3- SET- only one param and is of type array or object (run two tests one using an array and another using an object)


describe( "rows- row().data()", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {

		dt.html( 'basic' );
		it("Exists and is a function", function () {
			var table = $('#example').DataTable();
			expect(typeof table.row().data).toBe('function');
		});
		dt.html( 'basic' );
		it("Returns Array instance", function () {
			var table = $('#example').DataTable();
			expect(table.row().data() instanceof Array).toBe(true);
		});
		dt.html( 'basic' );
		it("Get- DOM Sourced Data", function () {
			var table = $('#example').DataTable();
			var result = table.row(0).data();
			expect(Array.isArray(result)).toBe(true);
		});

		dt.html( 'empty' );
		it("GET using JSON Data- returned data is in object", function (done) {
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
					var result = table.row(0).data();
					expect(typeof result === 'object').toBe(true);
					done();
				}
			});

		});
		dt.html( 'basic' );
		it("SET- only one param", function () {
			var table = $('#example').DataTable();
			var input = ["Tiger Nixon1", "System Architect", "Edinburgh", "61", "2011/04/25", "$320,800"];
			$('#example_filter input').val('Tiger').keyup();
			table.row(0).data(input);
			expect($('#example tbody tr:eq(0) td:eq(0)').html() === "Tiger Nixon1").toBe(true);
		});
	});

});
