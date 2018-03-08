describe('tables - table().footer()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			let table = $('#example').DataTable();
			expect(typeof table.table().footer).toBe('function');
		});

		it('Returns a footer node', function() {
			let table = $('#example').DataTable();
			let footer = table.table().footer();
			expect(footer instanceof HTMLTableSectionElement).toBe(true);
			expect(footer.nodeName.toUpperCase()).toBe('TFOOT');
		});
	});

	describe('Check the behaviour', function() {
		dt.html('basic');
		it('Returns the footer row', function() {
			let table = $('#example').DataTable();
			expect(table.table().footer()).toBe($('#example tfoot').get(0));
		});

		dt.html('basic');
		it('Returns the footer when scrollX enabled', function() {
			let table = $('#example').DataTable({
				scrollX: true
			});
			expect(table.table().footer()).toBe($('div.dataTables_scrollFoot tfoot').get(0));
		});

		dt.html('basic');
		it('Returns the footer when scrollY enabled', function() {
			let table = $('#example').DataTable({
				scrollY: true
			});
			expect(table.table().footer()).toBe($('div.dataTables_scrollFoot tfoot').get(0));
		});
	});
});
