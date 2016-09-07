// todo tests
// - Confirm it exists and is a function
// - Confirm it returns an API instance (checking contents for the following tests)
// - One row in header:
//   - Select the first and last columns and get their header cells
//   - Select the third column and get its header cell
// - Two rows in header:
//   - Select the first and second columns and get their header cells - only bottom cell for those columns are returned
//   - Select the last column and get its header cell - only bottom cell for that column is returned
//   - Set `orderCellsTop: true` and repeat above two tests to check the top cell is returned
// - Test with a scrolling table
// - Hide columns - ensure that their header nodes can still be accessed with this method

describe( "columns- columns().header()", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Exists and is a function", function () {
			var table = $('#example').DataTable();
			expect(typeof table.columns().header).toBe('function');
		});
		dt.html( 'basic' );
		it("Returns an API instance", function () {
			var table = $('#example').DataTable();
			expect(table.columns().header() instanceof $.fn.dataTable.Api).toBe(true);
		});
		dt.html( 'basic' );
		it("One row in header: Select first,second column returns header cell", function () {
			var table = $('#example').DataTable();
			var returnData = table.columns([0,-1]).header();
			expect(
				returnData[0].nodeName == "TH" &&
				returnData[1].nodeName == "TH" &&
			 	returnData[0].textContent == "Name" &&
				returnData[1].textContent == "Salary").toBe(true);

		});
		dt.html( 'basic' );
		it("One row in header: Select last column return header cell", function () {
			var table = $('#example').DataTable();
			var returnData = table.columns(1).header();
			expect(returnData[0].nodeName == "TH" && returnData[0].textContent == "Position").toBe(true);
		});
		dt.html( 'two_headers' );
		it("Two rows in header: Selecting first and second column returns bottom rows", function () {
			var table = $('#example').DataTable();
			var returnData = table.columns([0,1]).header();
			expect(
				returnData[0].nodeName == "TH" &&
				returnData[1].nodeName == "TH" &&
				returnData[0].textContent == "Name1" &&
				returnData[1].textContent == "Position1").toBe(true);
		});
		dt.html( 'two_headers' );
		it("Two rows in header: Selecting last column returns bottom row", function () {
			var table = $('#example').DataTable();
			var returnData = table.columns(-1).header();
			expect(returnData[0].nodeName == "TH" && returnData[0].textContent == "Salary1").toBe(true);
		});
		dt.html( 'two_headers' );
		it("orderCellsTop: true- Selecting first column returns top row", function () {
			var table = $('#example').DataTable({
				"orderCellsTop": true
			});
			var returnData = table.columns([0,1]).header();
			expect(
				returnData[0].nodeName == "TH" &&
				returnData[1].nodeName == "TH" &&
				returnData[0].textContent == "Name" &&
				returnData[1].textContent == "Position").toBe(true);

		});
		dt.html( 'two_headers' );
		it("orderCellsTop: true- Selecting last column returns top row", function () {
			var table = $('#example').DataTable({
				"orderCellsTop": true
			});
			var returnData = table.columns(-1).header();
			expect(returnData[0].nodeName == "TH" && returnData[0].textContent == "Salary").toBe(true);
		});


		dt.html('basic');
		it("Scrolling table with header", function () {
			var table = $('#example').DataTable({
				"scrollY":        "200px",
				"scrollCollapse": true,
				"paging":         false
			});
			var returnData = table.columns(0).header();
			expect(returnData[0].nodeName == "TH" && returnData[0].textContent == "Name").toBe(true);
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
			var returnData = table.columns(0).header();
			expect(returnData[0].nodeName == "TH" && returnData[0].textContent == "Name").toBe(true);
		});
	});
});
