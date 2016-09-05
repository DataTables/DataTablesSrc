// todo tests
// - Confirm it exists and is a function
// - Confirm it returns a node
// - One row in footer:
//   - Select the first column and get its footer cell
//   - Select the last column and get its footer cell
// - Two rows in footer:
//   - Select the first column and get its footer cell - only first cell for that column is returned
//   - Select the last column and get its footer cell - only first cell for that column is returned
// - Test with no footer, make sure null is returned for all columns
// - Test with a scrolling table that has a footer
// - Hide a column - ensure that its footer node can still be accessed with this method

describe( "columns- column().footer()", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Exists and is a function", function () {
			var table = $('#example').DataTable();
			expect(typeof table.column().footer).toBe('function');
		});
		dt.html( 'basic' );
		it("Returns an API instance", function () {
			var table = $('#example').DataTable();
			expect(table.column().footer() instanceof Node).toBe(true);
		});
		dt.html( 'basic' );
		it("One row in footer: Select first column return footer cell", function () {
			var table = $('#example').DataTable();
			var returnData = table.column(0).footer();
			expect(returnData.nodeName == "TH" && returnData.textContent == "Name").toBe(true);
		});
		dt.html( 'basic' );
		it("One row in footer: Select last column return footer cell", function () {
			var table = $('#example').DataTable();
			var returnData = table.column(-1).footer();
			expect(returnData.nodeName == "TH" && returnData.textContent == "Salary").toBe(true);
		});
		dt.html( 'two_footers' );
		it("Two rows in footer: Select last column return footer cell", function () {
			var table = $('#example').DataTable();
			var returnData = table.column(0).footer();
			expect(returnData.nodeName == "TH" && returnData.textContent == "Name").toBe(true);
		});
		dt.html( 'two_footers' );
		it("One row in footer: Select last column return footer cell", function () {
			var table = $('#example').DataTable();
			var returnData = table.column(-1).footer();
			expect(returnData.nodeName == "TH" && returnData.textContent == "Salary").toBe(true);
		});
		dt.html( 'no_footer' );
		it("One row in footer: Select last column return footer cell", function () {
			var table = $('#example').DataTable();
			var returnData = table.column(0).footer();
			expect(returnData).toBe(null);
		});
		dt.html('basic');
		it("Scrolling table with footer", function () {
			var table = $('#example').DataTable({
				"scrollY":        "200px",
				"scrollCollapse": true,
				"paging":         false
			});
			var returnData = table.column(0).footer();
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
			var returnData = table.column(0).footer();
			expect(returnData.nodeName == "TH" && returnData.textContent == "Name").toBe(true);
		});

	});

});
