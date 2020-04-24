describe('tables - tables().header()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			let table = $('#example').DataTable();
			expect(typeof table.table().header).toBe('function');
		});

		it('Returns an API instance', function() {
			let table = $('#example').DataTable();
			let header = table.tables().header();
			expect(header instanceof $.fn.dataTable.Api).toBe(true);
			expect(header[0].nodeName.toUpperCase()).toBe('THEAD');
		});
	});

	describe('Check the behaviour with one table', function() {
		dt.html('basic');
		it('Returns the header row', function() {
			let table = $('#example').DataTable();
			expect(table.tables().header()[0]).toBe($('#example thead').get(0));
		});

		it('Returns single header row', function() {
			let table = $('#example').DataTable();
			expect(
				table
					.tables()
					.header()
					.count()
			).toBe(1);
		});

		dt.html('basic');
		it('Returns the header when scrollX enabled', function() {
			let table = $('#example').DataTable({
				scrollX: true
			});
			expect(table.tables().header()[0]).toBe($('div.dataTables_scrollHead thead').get(0));
		});

		dt.html('basic');
		it('Returns the header when scrollY enabled', function() {
			let table = $('#example').DataTable({
				scrollY: true
			});
			expect(table.tables().header()[0]).toBe($('div.dataTables_scrollHead thead').get(0));
		});
	});

	describe('Check the behaviour with two tables', function() {
		dt.html('two_tables');
		it('Returns two header rows', function() {
			let tables = $('[id^=example]').DataTable();
			expect(
				tables
					.tables()
					.header()
					.count()
			).toBe(2);
		});

		dt.html('two_tables');
		it('Returns the header rows', function() {
			let tables = $('[id^=example]').DataTable();
			expect(tables.tables().header()[0]).toBe($('#example_one thead').get(0));
			expect(tables.tables().header()[1]).toBe($('#example_two thead').get(0));
		});

		dt.html('two_tables');
		it('Returns the header when scrollX enabled', function() {
			let tables = $('[id^=example]').DataTable({
				scrollX: true
			});
			expect(tables.tables().header()[0]).toBe($('div.dataTables_scrollHead thead').get(0));
			expect(tables.tables().header()[1]).toBe($('div.dataTables_scrollHead thead').get(1));
		});

		dt.html('two_tables');
		it('Returns the header when scrollY enabled', function() {
			let tables = $('[id^=example]').DataTable({
				scrollY: true
			});
			expect(tables.tables().header()[0]).toBe($('div.dataTables_scrollHead thead').get(0));
			expect(tables.tables().header()[1]).toBe($('div.dataTables_scrollHead thead').get(1));
		});
	});
});
