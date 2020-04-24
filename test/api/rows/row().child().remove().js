describe('rows - row().child().remove()', function() {
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
			expect(typeof table.row(2).child().remove).toBe('function');
		});
		it('Returns API instance', function() {
			table.row(2).child('TEST');
			expect(
				table
					.row(2)
					.child(true)
					.remove() instanceof $.fn.dataTable.Api
			).toBe(true);
		});
		it('Returns API instance (if chained)', function() {
			expect(
				table
					.row(2)
					.child('TEST')
					.remove() instanceof $.fn.dataTable.Api
			).toBe(true);
		});
	});

	describe('Functional tests', function() {
		let table;
		dt.html('basic');
		it('Remove when not visible', function() {
			table = $('#example').DataTable();
			table.row(2).child('TEST');
			table
				.row(2)
				.child(true)
				.remove();
			expect(table.row(2).child()).toBe(undefined);
		});

		dt.html('basic');
		it('Remove when visible', function() {
			table = $('#example').DataTable();
			table
				.row(2)
				.child('TEST')
				.show();
			table
				.row(2)
				.child(true)
				.remove();
			expect(table.row(2).child()).toBe(undefined);
		});

		dt.html('basic');
		it('Remove when visible (but removed by child)', function() {
			table = $('#example').DataTable();
			table
				.row(2)
				.child('TEST')
				.show();
			table
				.row(2)
				.child(false)
				.remove();
			expect(table.row(2).child()).toBe(undefined);
		});

		dt.html('basic');
		it('Remove when chained to the creation', function() {
			table = $('#example').DataTable();
			table
				.row(2)
				.child('TEST')
				.remove();
			expect(table.row(2).child()).toBe(undefined);
		});
	});
});
