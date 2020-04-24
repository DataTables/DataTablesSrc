describe('tables - tables().footer()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			let table = $('#example').DataTable();
			expect(typeof table.tables().footer).toBe('function');
		});

		it('Returns an API instance', function() {
			let table = $('#example').DataTable();
			let footer = table.tables().footer();
			expect(footer instanceof $.fn.dataTable.Api).toBe(true);
			expect(footer[0].nodeName.toUpperCase()).toBe('TFOOT');
		});
	});

	describe('Check the behaviour with one table', function() {
		dt.html('basic');
		it('Returns the footer row', function() {
			let table = $('#example').DataTable();
			expect(table.tables().footer()[0]).toBe($('#example tfoot').get(0));
		});

		it('Returns single footer row', function() {
			let table = $('#example').DataTable();
			expect(
				table
					.tables()
					.footer()
					.count()
			).toBe(1);
		});

		dt.html('basic');
		it('Returns the footer when scrollX enabled', function() {
			let table = $('#example').DataTable({
				scrollX: true
			});
			expect(table.tables().footer()[0]).toBe($('div.dataTables_scrollFoot tfoot').get(0));
		});

		dt.html('basic');
		it('Returns the footer when scrollY enabled', function() {
			let table = $('#example').DataTable({
				scrollY: true
			});
			expect(table.tables().footer()[0]).toBe($('div.dataTables_scrollFoot tfoot').get(0));
		});
	});

	describe('Check the behaviour with two tables', function() {
		dt.html('two_tables');
		it('Returns two footer rows', function() {
			let tables = $('table').DataTable();
			expect(
				tables
					.tables()
					.footer()
					.count()
			).toBe(2);
		});

		dt.html('two_tables');
		it('Returns the footer rows', function() {
			let tables = $('table').DataTable();
			expect(tables.tables().footer()[0]).toBe($('#example_one tfoot').get(0));
			expect(tables.tables().footer()[1]).toBe($('#example_two tfoot').get(0));
		});

		dt.html('two_tables');
		it('Returns the footer when scrollX enabled', function() {
			let tables = $('table').DataTable({
				scrollX: true
			});
			expect(tables.tables().footer()[0]).toBe($('div.dataTables_scrollFoot tfoot').get(0));
			expect(tables.tables().footer()[1]).toBe($('div.dataTables_scrollFoot tfoot').get(1));
		});

		dt.html('two_tables');
		it('Returns the footer when scrollY enabled', function() {
			let tables = $('table').DataTable({
				scrollY: true
			});
			expect(tables.tables().footer()[0]).toBe($('div.dataTables_scrollFoot tfoot').get(0));
			expect(tables.tables().footer()[1]).toBe($('div.dataTables_scrollFoot tfoot').get(1));
		});
	});
});
