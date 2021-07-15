describe('rows - row().child.hide()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		let table;
		dt.html('basic');
		it('Ensure its a function', function() {
			table = $('#example').DataTable();
			expect(typeof table.row(2).child.hide).toBe('function');
		});
		it('Returns API instance (even if no child)', function() {
			expect(table.row(2).child.hide() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Functional tests', function() {
		let table;
		dt.html('basic');
		it('Hide when hidden', function() {
			table = $('#example').DataTable();
			table.row(2).child('TEST');
			table.row(2).child.hide();
			expect($('#example tbody tr').length).toBe(10);
		});

		dt.html('basic');
		it('Hide when visible', function() {
			table = $('#example').DataTable();
			table
				.row(2)
				.child('TEST')
				.show();
			table.row(2).child.hide();
			expect($('#example tbody tr').length).toBe(10);
		});

		dt.html('basic');
		it('Hide when child does not exist', function() {
			table = $('#example').DataTable();
			table.row(2).child.hide();
			expect($('#example tbody tr').length).toBe(10);
		});
	});
});
