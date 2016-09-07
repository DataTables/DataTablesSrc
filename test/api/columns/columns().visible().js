// todo tests
// - Confirm it exists and is a function
// - Always returns an API instance
// - Getter
//   - Will contain a boolean value for each of the selected columns. Consider:
//   - Column hidden by `columns.visible` at init returns false
//   - Column not hidden by `columns.visible` at init returns true
//   - Column hidden by API returns false
//   - Column hidden at init and then made visible returns true
// - Setter
//   - `false` will hide selected columns (check header, body and footer nodes)
//   - `true` will make selected columns visible (check header, body and footer nodes)
//   - Repeat the above with:
//     - `deferRender` and an Ajax sourced table
//     - A table with no footer
//     - A scrolling table with header and footer
//     - A scrolling table with no footer

describe( "columns- columns().visible()", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Exists and is a function", function () {
			var table = $('#example').DataTable();
			expect(typeof table.column().visible).toBe('function');
		});

		//Getter
		dt.html( 'basic' );
		it("Will return a boolean value", function () {
			var table = $('#example').DataTable();
			var test = table.column().visible();
			expect(typeof(test) == 'boolean').toBe(true);
		});
		dt.html( 'basic' );
		it("Columns hidden by 'columns.visible' at init returns false", function () {
			var table = $('#example').DataTable({
				"columnDefs": [
					{ "visible": false, "targets": 0 }
				]
			});
			var test = table.column().visible();
			expect(test).toBe(false);
		});
		dt.html( 'basic' );
		it("Columns not hidden by 'columns.visible' at init returns true", function () {
			var table = $('#example').DataTable({
				"columnDefs": [
					{ "visible": false, "targets": 0 }
				]
			});
			var test = table.column(1).visible();
			expect(test).toBe(true);
		});
		dt.html( 'basic' );
		it("Column hidden at init and then made visible returns trues", function () {
			var table = $('#example').DataTable({
				"columnDefs": [
					{ "visible": false, "targets": 0 }
				]
			});
			table.column(0).visible(true);
			expect($('#example tbody tr:eq(0) td:eq(0)').html() == "Airi Satou").toBe(true);
		});
		//Setter
		dt.html( 'basic' );
		it("`false` will hide a column (check header, body and footer nodes)", function () {
			var table = $('#example').DataTable();
			table.column(0).visible(false);
			expect(
				$('#example thead th:eq(0)').html() !== "Name" &&
				$('#example tbody tr:eq(0) td:eq(0)').html() !== "Airi Satou" &&
				$('#example tfoot th:eq(0)').html() !== "Name").toBe(true);
		});
		dt.html( 'basic' );
		it("`false` will hide a column (check header, body and footer nodes)", function () {
			var table = $('#example').DataTable({
				"columnDefs": [
					{ "visible": false, "targets": 0 }
				]
			});
			table.column(0).visible(true);
			expect(
				$('#example thead th:eq(0)').html() == "Name" &&
				$('#example tbody tr:eq(0) td:eq(0)').html() == "Airi Satou" &&
				$('#example tfoot th:eq(0)').html() == "Name").toBe(true);
		});

		//Ajax
	});

	describe("Repeated with deferRender and AJAX", function () {
		dt.html( 'empty' );
		it("Exists and is a function", function (done) {
			table = $('#example').DataTable( {
				ajax: '/base/test/data/data.txt',
				deferRender: true,
				columns: [
					{ data: "name" },
					{ data: "position" },
					{ data: "office" },
					{ data: "extn" },
					{ data: "start_date" },
					{ data: "salary" }
				],
				initComplete: function ( settings, json ) {

					done();
				}
			} );

		});
		dt.html( 'basic' );
		it("Exists and is a function", function (done) {
			table = $('#example').DataTable( {
				ajax: '/base/test/data/data.txt',
				deferRender: true,
				columns: [
					{ data: "name" },
					{ data: "position" },
					{ data: "office" },
					{ data: "extn" },
					{ data: "start_date" },
					{ data: "salary" }
				],
				initComplete: function ( settings, json ) {
					expect(typeof table.column().visible).toBe('function');
					done();
				}
			} );

		});

		//Getter
		dt.html( 'basic' );
		it("Will return a boolean value", function (done) {
			table = $('#example').DataTable( {
				ajax: '/base/test/data/data.txt',
				deferRender: true,
				columns: [
					{ data: "name" },
					{ data: "position" },
					{ data: "office" },
					{ data: "extn" },
					{ data: "start_date" },
					{ data: "salary" }
				],
				initComplete: function ( settings, json ) {
					var test = table.column().visible();
					expect(typeof(test) == 'boolean').toBe(true);
					done();
				}
			} );

		});
		dt.html( 'basic' );
		it("Columns hidden by 'columns.visible' at init returns false", function (done) {
			table = $('#example').DataTable( {
				ajax: '/base/test/data/data.txt',
				deferRender: true,
				columns: [
					{ data: "name" },
					{ data: "position" },
					{ data: "office" },
					{ data: "extn" },
					{ data: "start_date" },
					{ data: "salary" }
				],
				"columnDefs": [
					{ "visible": false, "targets": 0 }
				],
				initComplete: function ( settings, json ) {
					var test = table.column().visible();
					expect(test).toBe(false);
					done();
				}
			} );
		});

		dt.html( 'basic' );
		it("Columns not hidden by 'columns.visible' at init returns true", function (done) {
			table = $('#example').DataTable( {
				ajax: '/base/test/data/data.txt',
				deferRender: true,
				columns: [
					{ data: "name" },
					{ data: "position" },
					{ data: "office" },
					{ data: "extn" },
					{ data: "start_date" },
					{ data: "salary" }
				],
				"columnDefs": [
					{ "visible": false, "targets": 0 }
				],
				initComplete: function ( settings, json ) {
					var test = table.column(1).visible();
					expect(test).toBe(true);
					done();
				}
			} );

		});
		dt.html( 'basic' );
		it("Column hidden at init and then made visible returns trues", function (done) {
			table = $('#example').DataTable( {
				ajax: '/base/test/data/data.txt',
				deferRender: true,
				columns: [
					{ data: "name" },
					{ data: "position" },
					{ data: "office" },
					{ data: "extn" },
					{ data: "start_date" },
					{ data: "salary" }
				],
				"columnDefs": [
					{ "visible": false, "targets": 0 }
				],
				initComplete: function ( settings, json ) {
					table.column(0).visible(true);
					expect($('#example tbody tr:eq(0) td:eq(0)').html() == "Airi Satou").toBe(true);
					done();
				}
			} );
		});
		//Setter
		dt.html( 'basic' );
		it("`false` will hide a column (check header, body and footer nodes)", function (done) {
			table = $('#example').DataTable( {
				ajax: '/base/test/data/data.txt',
				deferRender: true,
				columns: [
					{ data: "name" },
					{ data: "position" },
					{ data: "office" },
					{ data: "extn" },
					{ data: "start_date" },
					{ data: "salary" }
				],
				initComplete: function ( settings, json ) {
					table.column(0).visible(false);
					expect(
						$('#example thead th:eq(0)').html() !== "Name" &&
						$('#example tbody tr:eq(0) td:eq(0)').html() !== "Airi Satou" &&
						$('#example tfoot th:eq(0)').html() !== "Name").toBe(true);
					done();
				}
			} );


		});
		dt.html( 'basic' );
		it("`false` will hide a column (check header, body and footer nodes)", function (done) {
			table = $('#example').DataTable( {
				ajax: '/base/test/data/data.txt',
				deferRender: true,
				columns: [
					{ data: "name" },
					{ data: "position" },
					{ data: "office" },
					{ data: "extn" },
					{ data: "start_date" },
					{ data: "salary" }
				],
				"columnDefs": [
					{ "visible": false, "targets": 0 }
				],
				initComplete: function ( settings, json ) {
					table.column(0).visible(true);
					expect(
						$('#example thead th:eq(0)').html() == "Name" &&
						$('#example tbody tr:eq(0) td:eq(0)').html() == "Airi Satou" &&
						$('#example tfoot th:eq(0)').html() == "Name").toBe(true);
					done();
				}
			} );

		});
	});
	describe("Tests footer removed", function () {
		dt.html( 'no_footer' );
		it("Exists and is a function", function () {
			var table = $('#example').DataTable();
			expect(typeof table.column().visible).toBe('function');
		});

		//Getter
		dt.html( 'no_footer' );
		it("Will return a boolean value", function () {
			var table = $('#example').DataTable();
			var test = table.column().visible();
			expect(typeof(test) == 'boolean').toBe(true);
		});
		dt.html( 'no_footer' );
		it("Columns hidden by 'columns.visible' at init returns false", function () {
			var table = $('#example').DataTable({
				"columnDefs": [
					{ "visible": false, "targets": 0 }
				]
			});
			var test = table.column().visible();
			expect(test).toBe(false);
		});
		dt.html( 'no_footer' );
		it("Columns not hidden by 'columns.visible' at init returns true", function () {
			var table = $('#example').DataTable({
				"columnDefs": [
					{ "visible": false, "targets": 0 }
				]
			});
			var test = table.column(1).visible();
			expect(test).toBe(true);
		});
		dt.html( 'no_footer' );
		it("Column hidden at init and then made visible returns trues", function () {
			var table = $('#example').DataTable({
				"columnDefs": [
					{ "visible": false, "targets": 0 }
				]
			});
			table.column(0).visible(true);
			expect($('#example tbody tr:eq(0) td:eq(0)').html() == "Airi Satou").toBe(true);
		});
		//Setter
		dt.html( 'no_footer' );
		it("`false` will hide a column (check header, body and footer nodes)", function () {
			var table = $('#example').DataTable();
			table.column(0).visible(false);
			expect(
				$('#example thead th:eq(0)').html() !== "Name" &&
				$('#example tbody tr:eq(0) td:eq(0)').html() !== "Airi Satou" &&
				$('#example tfoot th:eq(0)').html() !== "Name").toBe(true);
		});
		dt.html( 'no_footer' );
		it("`false` will hide a column (check header, body )", function () {
			var table = $('#example').DataTable({
				"columnDefs": [
					{ "visible": false, "targets": 0 }
				]
			});
			table.column(0).visible(true);
			expect(
				$('#example thead th:eq(0)').html() == "Name" &&
				$('#example tbody tr:eq(0) td:eq(0)').html() == "Airi Satou").toBe(true);
		});
	});
	describe("Tests with scrolling table ", function () {
		dt.html( 'basic' );
		it("Exists and is a function", function () {
			var table = $('#example').DataTable({
				"scrollY":        "200px",
				"scrollCollapse": true,
				"paging":         false
			});
			expect(typeof table.column().visible).toBe('function');
		});

		//Getter
		dt.html( 'basic' );
		it("Will return a boolean value", function () {
			var table = $('#example').DataTable({
				"scrollY":        "200px",
				"scrollCollapse": true,
				"paging":         false
			});
			var test = table.column().visible();
			expect(typeof(test) == 'boolean').toBe(true);
		});
		dt.html( 'basic' );
		it("Columns hidden by 'columns.visible' at init returns false", function () {
			var table = $('#example').DataTable({
				"scrollY":        "200px",
				"scrollCollapse": true,
				"paging":         false,
				"columnDefs": [
					{ "visible": false, "targets": 0 }
				]
			});
			var test = table.column().visible();
			expect(test).toBe(false);
		});
		dt.html( 'basic' );
		it("Columns not hidden by 'columns.visible' at init returns true", function () {
			var table = $('#example').DataTable({
				"scrollY":        "200px",
				"scrollCollapse": true,
				"paging":         false,
				"columnDefs": [
					{ "visible": false, "targets": 0 }
				]
			});
			var test = table.column(1).visible();
			expect(test).toBe(true);
		});
		dt.html( 'basic' );
		it("Column hidden at init and then made visible returns trues", function () {
			var table = $('#example').DataTable({
				"scrollY":        "200px",
				"scrollCollapse": true,
				"paging":         false,
				"columnDefs": [
					{ "visible": false, "targets": 0 }
				]
			});
			table.column(0).visible(true);
			expect($('#example tbody tr:eq(0) td:eq(0)').html() == "Airi Satou").toBe(true);
		});
		//Setter
		dt.html( 'basic' );
		it("`false` will hide a column (check header, body and footer nodes)", function () {
			var table = $('#example').DataTable({
				"scrollY":        "200px",
				"scrollCollapse": true,
				"paging":         false
			});
			table.column(0).visible(false);
			expect(
				$('#example thead th:eq(0)').html() !== "Name" &&
				$('#example tbody tr:eq(0) td:eq(0)').html() !== "Airi Satou" &&
				$('#example tfoot th:eq(0)').html() !== "Name").toBe(true);
		});
		dt.html( 'basic' );
		it("`false` will hide a column (check header, body and footer nodes)", function () {
			var table = $('#example').DataTable({
				"scrollY":        "200px",
				"scrollCollapse": true,
				"paging":         false,
				"columnDefs": [
					{ "visible": false, "targets": 0 }
				]
			});
			table.column(0).visible(true);
			expect(
				$('#example thead th:eq(0)').text() == "Name" &&
				$('#example tbody tr:eq(0) td:eq(0)').text() == "Airi Satou" &&
				$('#example tfoot th:eq(0)').text() == "Name").toBe(true);
		});
	});
	describe("Tests with scrolling table- no footer ", function () {
		dt.html( 'no_footer' );
		it("Exists and is a function", function () {
			var table = $('#example').DataTable({
				"scrollY":        "200px",
				"scrollCollapse": true,
				"paging":         false
			});
			expect(typeof table.column().visible).toBe('function');
		});

		//Getter
		dt.html( 'no_footer' );
		it("Will return a boolean value", function () {
			var table = $('#example').DataTable({
				"scrollY":        "200px",
				"scrollCollapse": true,
				"paging":         false
			});
			var test = table.column().visible();
			expect(typeof(test) == 'boolean').toBe(true);
		});
		dt.html( 'no_footer' );
		it("Columns hidden by 'columns.visible' at init returns false", function () {
			var table = $('#example').DataTable({
				"scrollY":        "200px",
				"scrollCollapse": true,
				"paging":         false,
				"columnDefs": [
					{ "visible": false, "targets": 0 }
				]
			});
			var test = table.column().visible();
			expect(test).toBe(false);
		});
		dt.html( 'no_footer' );
		it("Columns not hidden by 'columns.visible' at init returns true", function () {
			var table = $('#example').DataTable({
				"scrollY":        "200px",
				"scrollCollapse": true,
				"paging":         false,
				"columnDefs": [
					{ "visible": false, "targets": 0 }
				]
			});
			var test = table.column(1).visible();
			expect(test).toBe(true);
		});
		dt.html( 'no_footer' );
		it("Column hidden at init and then made visible returns trues", function () {
			var table = $('#example').DataTable({
				"scrollY":        "200px",
				"scrollCollapse": true,
				"paging":         false,
				"columnDefs": [
					{ "visible": false, "targets": 0 }
				]
			});
			table.column(0).visible(true);
			expect($('#example tbody tr:eq(0) td:eq(0)').html() == "Airi Satou").toBe(true);
		});
		//Setter
		dt.html( 'no_footer' );
		it("`false` will hide a column (check header, body and footer nodes)", function () {
			var table = $('#example').DataTable({
				"scrollY":        "200px",
				"scrollCollapse": true,
				"paging":         false
			});
			table.column(0).visible(false);
			expect(
				$('#example thead th:eq(0)').html() !== "Name" &&
				$('#example tbody tr:eq(0) td:eq(0)').html() !== "Airi Satou" &&
				$('#example tfoot th:eq(0)').html() !== "Name").toBe(true);
		});
		dt.html( 'no_footer' );
		it("`false` will hide a column (check header, body and footer nodes)", function () {
			var table = $('#example').DataTable({
				"scrollY":        "200px",
				"scrollCollapse": true,
				"paging":         false,
				"columnDefs": [
					{ "visible": false, "targets": 0 }
				]
			});
			table.column(0).visible(true);
			expect(
				$('#example thead th:eq(0)').text() == "Name" &&
				$('#example tbody tr:eq(0) td:eq(0)').text() == "Airi Satou").toBe(true);
		});
	});

});
