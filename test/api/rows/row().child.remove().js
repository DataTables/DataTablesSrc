describe('rows - row().child.remove()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		let table;
		dt.html('basic');
		it('Ensure its a function', function() {
			table = $('#example').DataTable();
			table.row(2).child('TEST');
			expect(typeof table.row(2).child.remove).toBe('function');
		});
		it('Returns API instance (even if no child)', function() {
			expect(table.row(2).child.remove() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Functional tests', function() {
		let table;
		dt.html('basic');
		it('Remove when not visible', function() {
			table = $('#example').DataTable();
			table.row(2).child('TEST');
			table.row(2).child.remove();
			expect(table.row(2).child()).toBe(undefined);
		});

		dt.html('basic');
		it('Remove when not visible', function() {
			table = $('#example').DataTable();
			table
				.row(2)
				.child('TEST')
				.show();
			table.row(2).child.remove();
			expect(table.row(2).child()).toBe(undefined);
		});
	});
});
