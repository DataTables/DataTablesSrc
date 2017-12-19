// TK todo tests
// - Confirm it exists and is a function
// - Confirm it returns API instance
// - Select a single column and confirm that the data is returned for that column
// - Select two columns and confirm the data is returned for those two columns
// - Select all columns and confirm the data is returned for all columns
// - Test with both array based tables and object based tables
describe( "columns- columns().data()", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Exists and is a function", function () {
			var table = $('#example').DataTable();
			expect(typeof table.columns().data).toBe('function');
		});

		dt.html( 'basic' );

		it("Returns an API instance", function () {
			var table = $('#example').DataTable();
			expect(table.columns().data() instanceof $.fn.dataTable.Api).toBe(true);
		});

		dt.html( 'basic' );

		it("Data is returned for selected column only.", function () {
			var table = $('#example').DataTable();
			var testData = table.columns(0).data();

			expect(testData[0][0] == "Airi Satou" && testData[0][10] == "Charde Marshall").toBe(true);
		});

		dt.html( 'basic' );

		it("Data is returned for two columns.", function () {
			var table = $('#example').DataTable();
			var testData = table.columns([0,1]).data();

			expect(
				testData[0][0] == "Airi Satou" &&
				testData[0][10] == "Charde Marshall" &&
				testData[1][0] == "Accountant" &&
				testData[1][9] == "Senior Javascript Developer").toBe(true);
		});
		dt.html( 'basic' );
		it("Data is returned for all columns.", function () {
			var table = $('#example').DataTable();
			var testData = table.columns().data();

			expect(
				testData[0][0] == "Airi Satou" &&
				testData[1][1] == "Chief Executive Officer (CEO)" &&
				testData[2][2] == "San Francisco" &&
				testData[3][3] == "41" &&
				testData[4][4] == "2011/06/07" &&
				testData[5][5] == "$372,000").toBe(true);
		});

	});

	describe("Repeated with AJAX based table", function () {

				//AJAX
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
							expect(typeof table.columns().data).toBe('function');
							done();
						}
					} );

				});
				dt.html( 'empty' );
				it("Returns an API instance", function (done) {
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
							expect(table.columns().data() instanceof $.fn.dataTable.Api).toBe(true);
							done();
						}
					} );

				});
				dt.html( 'empty' );
				it("Data is returned for selected column only.", function (done) {
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
							var testData = table.columns().data();
							
							expect(testData[0][0] == "Airi Satou" && testData[0][10] == "Charde Marshall").toBe(true);
							done();
						}
					} );

				});
				dt.html( 'empty' );
				it("Data is returned for two columns.", function (done) {
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
							var testData = table.columns([0,1]).data();
							expect(
								testData[0][0] == "Airi Satou" &&
								testData[0][10] == "Charde Marshall" &&
								testData[1][0] == "Accountant" &&
								testData[1][9] == "Senior Javascript Developer").toBe(true);
							done();
						}
					} );

				});
				dt.html( 'empty' );
				it("Data is returned for all columns.", function (done) {
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
							var testData = table.columns().data();
							
							expect(
								testData[0][0] == "Airi Satou" &&
								testData[1][1] == "Chief Executive Officer (CEO)" &&
								testData[2][2] == "San Francisco" &&
								testData[3][3] == "2558" &&
								testData[4][4] == "2011/06/07" &&
								testData[5][5] == "$372,000").toBe(true);
							done();
						}
					} );
				});
	});

});
