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

describe('columns - columns().footer()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	function verifyFooter(footer, expected) {
		expect(footer.count()).toBe(expected.length);

		for (let i = 0; i < footer.count(); i++) {
			expect(footer[i] instanceof HTMLTableCellElement).toBe(true);
			expect(footer[i].nodeName).toBe('TH');
			expect(footer[i].textContent).toBe(expected[i]);
		}
	}

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			let table = $('#example').DataTable();
			expect(typeof table.columns().footer).toBe('function');
		});

		dt.html('basic');
		it('Returns an API instance', function() {
			let table = $('#example').DataTable();
			expect(table.columns().footer() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Check the behaviour', function() {
		dt.html('basic');
		it('One row in footer: Select first and second columns return footer cells', function() {
			let table = $('#example').DataTable();
			let returnData = table.columns([0, -1]).footer();

			verifyFooter(returnData, ['Name', 'Salary']);
		});

		dt.html('basic');
		it('One row in footer: Select second column return footer cell', function() {
			let table = $('#example').DataTable();
			let returnData = table.columns(1).footer();
			verifyFooter(returnData, ['Position']);
		});

		dt.html('two_footers');
		it('Two rows in footer: Select first and third column return footer cell', function() {
			let table = $('#example').DataTable();
			let returnData = table.columns([0, 2]).footer();
			verifyFooter(returnData, ['Name', 'Office']);
		});

		dt.html('two_footers');
		it('One row in footer: Select last column return footer cell', function() {
			let table = $('#example').DataTable();
			let returnData = table.columns(-1).footer();
			verifyFooter(returnData, ['Salary']);
		});

		dt.html('no_footer');
		it('One row in footer: Select last column return footer cell', function() {
			let table = $('#example').DataTable();
			let returnData = table.columns().footer();

			expect(returnData.count()).toBe(6);
			for (let i = 0; i < 6; i++ ) {
				expect(returnData[i]).toBe(null);
			}
		});

		dt.html('basic');
		it('Scrolling table with footer', function() {
			let table = $('#example').DataTable({
				scrollY: '200px',
				scrollCollapse: true,
				paging: false
			});
			let returnData = table.columns(0).footer();
			verifyFooter(returnData, ['Name']);
		});

		dt.html('basic');
		it('Hidden column at initialisation', function() {
			let table = $('#example').DataTable({
				columnDefs: [
					{
						targets: [2, 3],
						visible: false,
						searchable: false
					}
				]
			});
			let returnData = table.columns([2, 3]).footer();
			verifyFooter(returnData, ['Office', 'Age']);
		});

		dt.html('basic');
		it('Hidden column by API', function() {
			let table = $('#example').DataTable({
				columnDefs: [
					{
						targets: [2, 3],
						visible: false,
						searchable: false
					}
				]
			});
			let returnData = table.columns([2, 3]).footer();
			verifyFooter(returnData, ['Office', 'Age']);
		});
	});
});
