describe('toJQuery()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;
	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			table = $('#example').DataTable();
			expect(typeof table.toJQuery).toBe('function');
		});
		it('Returns API instance', function() {
			expect(typeof table.toJQuery()).toBe('object');
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		let table;
		it('Single cell', function() {
			table = $('#example').DataTable();
			table
				.cell(2, 2)
				.nodes()
				.toJQuery()
				.addClass('unitTest');
			expect($('tbody tr:eq(2) td:eq(2)').hasClass('unitTest')).toBe(true);
			expect($('td.unitTest').length).toBe(1);
		});

		dt.html('basic');
		it('Several cells', function() {
			table = $('#example').DataTable();
			table
				.cells([{ row: 2, column: 2 }, { row: 3, column: 1 }])
				.nodes()
				.toJQuery()
				.addClass('unitTest');
			expect($('tbody tr:eq(2) td:eq(2)').hasClass('unitTest')).toBe(true);
			expect($('td.unitTest').length).toBe(2);
		});

		dt.html('basic');
		it('Single column', function() {
			table = $('#example').DataTable();
			table
				.column(2)
				.nodes()
				.toJQuery()
				.addClass('unitTest');
			expect($('tbody tr:eq(2) td:eq(2)').hasClass('unitTest')).toBe(true);
			expect($('td.unitTest').length).toBe(10);
		});

		dt.html('basic');
		it('Several columns', function() {
			table = $('#example').DataTable();
			table
				.columns([2, 3])
				.nodes()
				.flatten()
				.toJQuery()
				.addClass('unitTest');
			expect($('tbody tr:eq(2) td:eq(2)').hasClass('unitTest')).toBe(true);
			expect($('td.unitTest').length).toBe(20);
		});

		dt.html('basic');
		it('Single row', function() {
			table = $('#example').DataTable();
			table
				.row(2)
				.nodes()
				.toJQuery()
				.addClass('unitTest');
			expect($('tbody tr:eq(2)').hasClass('unitTest')).toBe(true);
			expect($('tr.unitTest').length).toBe(1);
		});

		dt.html('basic');
		it('Several row', function() {
			table = $('#example').DataTable();
			table
				.rows([2, 3])
				.nodes()
				.toJQuery()
				.addClass('unitTest');
			expect($('tbody tr:eq(2)').hasClass('unitTest')).toBe(true);
			expect($('tr.unitTest').length).toBe(2);
		});
	});
});
