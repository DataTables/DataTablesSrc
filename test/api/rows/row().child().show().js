describe('rows - row().child().show()', function() {
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
			expect(typeof table.row(2).child().show).toBe('function');
		});
		it('Returns API instance', function() {
			expect(
				table
					.row(2)
					.child(true)
					.show() instanceof $.fn.dataTable.Api
			).toBe(true);
		});
		it('Returns API instance (if chained)', function() {
			expect(
				table
					.row(2)
					.child('TEST')
					.show() instanceof $.fn.dataTable.Api
			).toBe(true);
		});
	});

	describe('Functional tests', function() {
		let table;

		dt.html('basic');
		it('Show when chained to create', function() {
			table = $('#example').DataTable();
			table
				.row(2)
				.child('TEST')
				.show();
			expect($('#example tbody tr:eq(3) td:eq(0)').text()).toBe('TEST');
			expect($('#example tbody tr').length).toBe(11);
		});

		dt.html('basic');
		it('Show when not visible', function() {
			table = $('#example').DataTable();
			table.row(2).child('TEST');
			table
				.row(2)
				.child(true)
				.show();
			expect($('#example tbody tr:eq(3) td:eq(0)').text()).toBe('TEST');
			expect($('#example tbody tr').length).toBe(11);
		});

		dt.html('basic');
		it('Show when already visible', function() {
			table = $('#example').DataTable();
			table
				.row(2)
				.child('TEST')
				.show();
			table
				.row(2)
				.child(true)
				.show();
			expect($('#example tbody tr:eq(3) td:eq(0)').text()).toBe('TEST');
			expect($('#example tbody tr').length).toBe(11);
		});
	});
});
