// todo tests
// - Confirm it exists and is a function
// - Confirm it returns a node
// - One row in header:
//   - Select the first column and get its header cell
//   - Select the last column and get its header cell
// - Two rows in header:
//   - Select the first column and get its header cell - only bottom cell for that column is returned
//   - Select the last column and get its header cell - only bottom cell for that column is returned
//   - Set `orderCellsTop: true` and repeat above two tests to check the top cell is returned
// - Test with a scrolling table
// - Hide a column - ensure that its header node can still be accessed with this method

describe( "columns- column().header()", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Exists and is a function", function () {
			var table = $('#example').DataTable();
			expect(typeof table.column().header).toBe('function');
		});
		dt.html( 'basic' );
		it("Returns an API instance", function () {
			var table = $('#example').DataTable();
			expect(table.column().header() instanceof Node).toBe(true);
		});
		dt.html( 'basic' );
		it("One row in header: Select first column return header cell", function () {
			var table = $('#example').DataTable();
			var returnData = table.column(0).header();
			expect(returnData.nodeName == "TH" && returnData.textContent == "Name").toBe(true);
		});
		dt.html( 'basic' );
		it("One row in header: Select last column return header cell", function () {
			var table = $('#example').DataTable();
			var returnData = table.column(-1).header();
			expect(returnData.nodeName == "TH" && returnData.textContent == "Salary").toBe(true);
		});
		dt.html( 'two_headers' );
		it("Two rows in header: Selecting column returns bottom row", function () {
			var table = $('#example').DataTable();
			var returnData = table.column(0).header();
			expect(returnData.nodeName == "TH" && returnData.textContent == "Name1").toBe(true);
		});
		dt.html( 'two_headers' );
		it("Two rows in header: Selecting last column returns bottom row", function () {
			var table = $('#example').DataTable();
			var returnData = table.column(-1).header();
			expect(returnData.nodeName == "TH" && returnData.textContent == "Salary1").toBe(true);
		});
		dt.html( 'two_headers' );
		it("orderCellsTop: true- Selecting first column returns top row", function () {
			var table = $('#example').DataTable({
				"orderCellsTop": true
			});
			var returnData = table.column(0).header();
			expect(returnData.nodeName == "TH" && returnData.textContent == "Name").toBe(true);

		});
		dt.html( 'two_headers' );
		it("orderCellsTop: true- Selecting last column returns top row", function () {
			var table = $('#example').DataTable({
				"orderCellsTop": true
			});
			var returnData = table.column(-1).header();
			expect(returnData.nodeName == "TH" && returnData.textContent == "Salary").toBe(true);
		});


		dt.html('basic');
		it("Scrolling table with header", function () {
			var table = $('#example').DataTable({
				"scrollY":        "200px",
				"scrollCollapse": true,
				"paging":         false
			});
			var returnData = table.column(0).header();
			expect(returnData.nodeName == "TH" && returnData.textContent == "Name").toBe(true);
		});
		dt.html( 'basic' );
		it("Hidden column", function () {
			var table = $('#example').DataTable({
				"columnDefs": [
					{
						"targets": [ 0 ],
						"visible": false,
						"searchable": false
					}
				]
			});
			var returnData = table.column(0).header();
			expect(returnData.nodeName == "TH" && returnData.textContent == "Name").toBe(true);
		});

	});

});
