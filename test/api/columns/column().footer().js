//TK COLIN - this could do with some tidying up, this is just a repetition of the header tests
describe('columns - column().footer()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});
	function verifyFooter(footer, expectedText) {
		expect(footer instanceof HTMLTableCellElement).toBe(true);
		expect(footer.nodeName).toBe('TH');
		expect(footer.textContent).toBe(expectedText);
	}

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			let table = $('#example').DataTable();
			expect(typeof table.column().footer).toBe('function');
		});

		dt.html('basic');
		it('Returns a node', function() {
			let table = $('#example').DataTable();
			expect(table.column().footer() instanceof Node).toBe(true);
		});
	});

	describe('Check the behaviour', function() {
		dt.html('basic');
		it('One row in footer: Select first column return footer cell', function() {
			let table = $('#example').DataTable();
			verifyFooter(table.column(0).footer(), 'Name');
		});

		dt.html('basic');
		it('One row in footer: Select last column return footer cell', function() {
			let table = $('#example').DataTable();
			verifyFooter(table.column(-1).footer(), 'Salary');
		});

		/**
		 * note the footers currently don't respond orderCellsTop (only applied to headers)
		 * but have left in the following tests which will fail when this functionality
		 * is added
		 **/
		dt.html('two_footers');
		it('Two rows in footer: Selecting column returns bottom row', function() {
			let table = $('#example').DataTable();
			verifyFooter(table.column(0).footer(), 'Name');
		});

		dt.html('two_footers');
		it('Two rows in footer: Selecting last column returns bottom row', function() {
			let table = $('#example').DataTable();
			verifyFooter(table.column(-1).footer(), 'Salary');
		});

		dt.html('two_footers');
		it('orderCellsTop: true- Selecting first column returns top row', function() {
			let table = $('#example').DataTable({
				orderCellsTop: true
			});
			let returnData = table.column(0).footer();
			verifyFooter(table.column(0).footer(), 'Name');
		});

		dt.html('two_footers');
		it('orderCellsTop: true- Selecting last column returns top row', function() {
			let table = $('#example').DataTable({
				orderCellsTop: true
			});
			let returnData = table.column(-1).footer();
			verifyFooter(table.column(-1).footer(), 'Salary');
		});

		dt.html('basic');
		it('Scrolling table with footer', function() {
			let table = $('#example').DataTable({
				scrollY: '200px',
				scrollCollapse: true,
				paging: false
			});
			verifyFooter(table.column(0).footer(), 'Name');
		});

		dt.html('basic');
		it('Hidden column at initialisation', function() {
			let table = $('#example').DataTable({
				columnDefs: [
					{
						targets: [2],
						visible: false,
						searchable: false
					}
				]
			});
			verifyFooter(table.column(2).footer(), 'Office');
		});

		dt.html('basic');
		it('Hidden column at initialisation through API', function() {
			let table = $('#example').DataTable();
			table.column(2).visible(false);
			verifyFooter(table.column(2).footer(), 'Office');
		});
	});
});
