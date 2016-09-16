// todo tests
// - Confirm it exists and is a function
// - Confirm it returns an API instance (checking contents for the following tests)
// - One row in footer:
//   - Select the first and last columns and get its footer cells
//   - Select the second column only and get its footer cell
// - Two rows in footer:
//   - Select the first and third columns and get their footer cell - only first cells for those columns are in the result
//   - Select the last column and get its footer cell - only first cell for that column is returned
// - Test with no footer, make sure null is returned for all columns
// - Test with a scrolling table that has a footer
// - Hide columns - ensure that their footer nodes can still be accessed with this method

describe( "columns- columns().footer()", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Exists and is a function", function () {
			var table = $('#example').DataTable();
			expect(typeof table.columns().footer).toBe('function');
		});
		dt.html( 'basic' );
		it("Returns an API instance", function () {
			var table = $('#example').DataTable();
			expect(table.columns().footer() instanceof $.fn.dataTable.Api).toBe(true);
		});
		dt.html( 'basic' );
		it("One row in footer: Select first and last columns return footer cells", function () {
			var table = $('#example').DataTable();
			var returnData = table.columns([0,-1]).footer();
			expect(
				returnData[0].nodeName == "TH" &&
				returnData[1].nodeName == "TH" &&
			 	returnData[0].textContent == "Name" &&
				returnData[1].textContent == "Salary").toBe(true);
		});
		dt.html( 'basic' );
		it("One row in footer: Select second column return footer cell", function () {
			var table = $('#example').DataTable();
			var returnData = table.columns(1).footer();
			expect(returnData[0].nodeName == "TH" && returnData[0].textContent == "Position").toBe(true);
		});
		dt.html( 'two_footers' );
		it("Two rows in footer: Select last column return footer cell", function () {
			var table = $('#example').DataTable();
			var returnData = table.columns([0,2]).footer();
			expect(
				returnData[0].nodeName == "TH" &&
				returnData[1].nodeName == "TH" &&
				returnData[0].textContent == "Name" &&
				returnData[1].textContent == "Office").toBe(true);
		});
		dt.html( 'two_footers' );
		it("One row in footer: Select last column return footer cell", function () {
			var table = $('#example').DataTable();
			var returnData = table.columns(-1).footer();
			expect(returnData[0].nodeName == "TH" && returnData[0].textContent == "Salary").toBe(true);
		});
		dt.html( 'no_footer' );
		it("One row in footer: Select last column return footer cell", function () {
			var table = $('#example').DataTable();
			var returnData;
			var result = true;
			for( var x = 0; x<6; x++){
				returnData = table.columns(x).footer();
				if(returnData[0] !== null){
					result = false;
					return result;
				}
			}
			expect(result).toBe(true);
		});
		dt.html('basic');
		it("Scrolling table with footer", function () {
			var table = $('#example').DataTable({
				"scrollY":        "200px",
				"scrollCollapse": true,
				"paging":         false
			});
			var returnData = table.columns(0).footer();
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
			var returnData = table.columns(0).footer();
			expect(returnData[0].nodeName == "TH" && returnData[0].textContent == "Name").toBe(true);
		});
	});

});
