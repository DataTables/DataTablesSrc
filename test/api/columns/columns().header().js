describe('columns - columns().header()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	function verifyHeader(header, expected) {
		expect(header.count()).toBe(expected.length);

		for (let i = 0; i < header.count(); i++) {
			expect(header[i] instanceof HTMLTableCellElement).toBe(true);
			expect(header[i].nodeName).toBe('TH');
			expect(header[i].textContent).toBe(expected[i]);
		}
	}

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			let table = $('#example').DataTable();
			expect(typeof table.columns().header).toBe('function');
		});

		dt.html('basic');
		it('Returns an API instance', function() {
			let table = $('#example').DataTable();
			expect(table.columns().header() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Check the behaviour', function() {
		dt.html('basic');
		it('One row in header: Select first,second column returns header cell', function() {
			let table = $('#example').DataTable();
			let returnData = table.columns([0, -1]).header();

			verifyHeader(returnData, ['Name', 'Salary']);
		});

		dt.html('basic');
		it('One row in header: Select last column return header cell', function() {
			let table = $('#example').DataTable();
			let returnData = table.columns(-1).header();

			verifyHeader(returnData, ['Salary']);
		});

		dt.html('two_headers');
		it('Two rows in header: Selecting first and second column returns bottom rows', function() {
			let table = $('#example').DataTable();
			let returnData = table.columns([0, 1]).header();

			verifyHeader(returnData, ['Name1', 'Position1']);
		});

		dt.html('two_headers');
		it('Two rows in header: Selecting last column returns bottom row', function() {
			let table = $('#example').DataTable();
			let returnData = table.columns(-1).header();

			verifyHeader(returnData, ['Salary1']);
		});

		dt.html('two_headers');
		it('orderCellsTop: true- Selecting first column returns top row', function() {
			let table = $('#example').DataTable({
				orderCellsTop: true
			});
			let returnData = table.columns([0, 1]).header();
			verifyHeader(returnData, ['Name', 'Position']);
		});

		dt.html('two_headers');
		it('orderCellsTop: true- Selecting last column returns top row', function() {
			let table = $('#example').DataTable({
				orderCellsTop: true
			});
			let returnData = table.columns(-1).header();
			verifyHeader(returnData, ['Salary']);
		});

		dt.html('basic');
		it('Scrolling table with header', function() {
			let table = $('#example').DataTable({
				scrollY: '200px',
				scrollCollapse: true,
				paging: false
			});
			let returnData = table.columns(0).header();
			verifyHeader(returnData, ['Name']);
		});

		dt.html('basic');
		it('Hidden column at initialisation', function() {
			let table = $('#example').DataTable({
				columnDefs: [
					{
						targets: [0],
						visible: false,
						searchable: false
					}
				]
			});
			let returnData = table.columns([0, 2]).header();
			verifyHeader(returnData, ['Name', 'Office']);
		});

		dt.html('basic');
		it('Hidden column by API', function() {
			let table = $('#example').DataTable();
			table.column(2).visible(false);
			let returnData = table.columns([0, 2]).header();
			verifyHeader(returnData, ['Name', 'Office']);
		});
	});
});
