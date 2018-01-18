describe('columns - column().header()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	function verifyHeader(header, expectedText) {
		expect(header instanceof HTMLTableCellElement).toBe(true);
		expect(header.nodeName).toBe('TH');
		expect(header.textContent).toBe(expectedText);
	}

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			let table = $('#example').DataTable();
			expect(typeof table.column().header).toBe('function');
		});

		dt.html('basic');
		it('Returns a node', function() {
			let table = $('#example').DataTable();
			expect(table.column().header() instanceof Node).toBe(true);
		});
	});

	describe('Check the behaviour', function() {
		dt.html('basic');
		it('One row in header: Select first column return header cell', function() {
			let table = $('#example').DataTable();
			verifyHeader(table.column(0).header(), 'Name');
		});

		dt.html('basic');
		it('One row in header: Select last column return header cell', function() {
			let table = $('#example').DataTable();
			verifyHeader(table.column(-1).header(), 'Salary');
		});

		dt.html('two_headers');
		it('Two rows in header: Selecting column returns bottom row', function() {
			let table = $('#example').DataTable();
			verifyHeader(table.column(0).header(), 'Name1');
		});

		dt.html('two_headers');
		it('Two rows in header: Selecting last column returns bottom row', function() {
			let table = $('#example').DataTable();
			verifyHeader(table.column(-1).header(), 'Salary1');
		});

		dt.html('two_headers');
		it('orderCellsTop: true- Selecting first column returns top row', function() {
			let table = $('#example').DataTable({
				orderCellsTop: true
			});
			let returnData = table.column(0).header();
			verifyHeader(table.column(0).header(), 'Name');
		});

		dt.html('two_headers');
		it('orderCellsTop: true- Selecting last column returns top row', function() {
			let table = $('#example').DataTable({
				orderCellsTop: true
			});
			let returnData = table.column(-1).header();
			verifyHeader(table.column(-1).header(), 'Salary');
		});

		dt.html('basic');
		it('Scrolling table with header', function() {
			let table = $('#example').DataTable({
				scrollY: '200px',
				scrollCollapse: true,
				paging: false
			});
			verifyHeader(table.column(0).header(), 'Name');
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
			verifyHeader(table.column(2).header(), 'Office');
		});

		dt.html('basic');
		it('Hidden column at initialisation through API', function() {
			let table = $('#example').DataTable();
			table.column(2).visible(false);
			verifyHeader(table.column(2).header(), 'Office');
		});
	});
});
