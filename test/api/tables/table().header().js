describe('tables - table().header()', function() {
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

		it('Returns a header node', function() {
			let table = $('#example').DataTable();
			let header = table.table().header();
			expect(header instanceof HTMLTableSectionElement).toBe(true);
			expect(header.nodeName.toUpperCase()).toBe('THEAD');
		});
	});

	describe('Check the behaviour', function() {
		dt.html('basic');
		it('Returns the header row', function() {
			let table = $('#example').DataTable();
			expect(table.table().header()).toBe($('#example thead').get(0));
		});

		dt.html('basic');
		it('Returns the header when scrollX enabled', function() {
			let table = $('#example').DataTable({
				scrollX: true
			});
			expect(table.table().header()).toBe($('div.dataTables_scrollHead thead').get(0));
		});

		dt.html('basic');
		it('Returns the header when scrollY enabled', function() {
			let table = $('#example').DataTable({
				scrollY: true
			});
			expect(table.table().header()).toBe($('div.dataTables_scrollHead thead').get(0));
		});
	});
});
