//TK COLIN - this could do with some tidying up, this is just a repetition of the header tests
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
			verifyFooter(table.columns([0, -1]).footer(), ['Name', 'Salary']);
		});

		dt.html('basic');
		it('One row in footer: Select second column return footer cell', function() {
			let table = $('#example').DataTable();
			verifyFooter(table.columns(1).footer(), ['Position']);
		});

		/**
		 * note the footers currently don't respond orderCellsTop (only applied to headers)
		 * but have left in the following tests which will fail when this functionality
		 * is added
		 **/
		dt.html('two_footers');
		it('Two rows in footer: Selecting column returns bottom row', function() {
			let table = $('#example').DataTable();
			verifyFooter(table.columns([0, 2]).footer(), ['Name', 'Office']);
		});

		dt.html('two_footers');
		it('Two rows in footer: Selecting last column returns bottom row', function() {
			let table = $('#example').DataTable();
			verifyFooter(table.columns(-1).footer(), ['Salary']);
		});

		dt.html('two_footers');
		it('orderCellsTop: true- Selecting first column returns top row', function() {
			let table = $('#example').DataTable({
				orderCellsTop: true
			});
			let returnData = table.column(0).footer();
			verifyFooter(table.columns(0).footer(), ['Name']);
		});

		dt.html('two_footers');
		it('orderCellsTop: true- Selecting last column returns top row', function() {
			let table = $('#example').DataTable({
				orderCellsTop: true
			});
			let returnData = table.column(-1).footer();
			verifyFooter(table.columns(-1).footer(), ['Salary']);
		});

		dt.html('no_footer');
		it('One row in footer: Select last column return footer cell', function() {
			let table = $('#example').DataTable();
			let returnData = table.columns().footer();

			expect(returnData.count()).toBe(6);
			for (let i = 0; i < 6; i++) {
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
			let table = $('#example').DataTable();
			table.column(2).visible(false);
			let returnData = table.columns([2, 3]).footer();
			verifyFooter(returnData, ['Office', 'Age']);
		});
	});
});
