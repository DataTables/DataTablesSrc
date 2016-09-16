// todo tests
// 1- GET- return row ID, check it matches value set in rowId option
// 2- only one param and is type bool
// 3- Append a hash to row id then check we can select it using a selector.


describe( "rows- row().id()", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Exists and is a function", function () {
			var table = $('#example').DataTable();
			expect(typeof table.row().id).toBe('function');
		});
		dt.html( 'basic' );
		it("Returns String or Undefined instance", function () {
			var table = $('#example').DataTable();
			expect(table.row(0).id()).toBe('undefined');
		});
		dt.html( 'empty' );
		it("Return row id and matches rowId option", function (done) {
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
				rowId: 'name',
				initComplete: function ( settings, json ) {
					var result = table.row(0).id();
					expect(result === "Tiger Nixon").toBe(true);
					done();
				}
			});
		});
		dt.html( 'empty' );
		it("Append hash, select", function (done) {
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
				rowId: 'name',
				initComplete: function ( settings, json ) {
					var result = table.row(0).id(true);
					expect(result === "#Tiger Nixon").toBe(true);
					done();
				}
			});
		});
	});

});
