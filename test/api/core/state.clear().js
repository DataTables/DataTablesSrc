describe('core - state.clear()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			expect(typeof $('#example').DataTable().state.clear).toBe('function');
		});

		it('Returns an API instance', function() {
			let table = $('#example').DataTable();
			expect(table.state.clear() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Functional tests', function() {
		// Clear down save state before proceeding (otherwise old stuff may be lurking that will affect us)
		dt.html('basic');
		it('Clear state save', function() {
			let table = $('#example').DataTable();
			table.state.clear();
		});

		dt.html('basic');
		it('Ensure theres a valid saved state', function() {
			let table = $('#example').DataTable({
				stateSave: true
			});
			table.page(2).draw(false);
			expect(table.page.info().start).toBe(20);
		});

		dt.html('basic');
		it('Ensure saved state is as expected', function() {
			let table = $('#example').DataTable({
				stateSave: true
			});
			expect(table.page.info().start).toBe(20);
			table.state.clear();
		});

		dt.html('basic');
		it('Ensure saved state now cleared', function() {
			let table = $('#example').DataTable({
				stateSave: true
			});
			expect(table.page.info().start).toBe(0);
		});

		dt.html('basic');
		it('Ensure no errors if stateSave not enabled', function() {
			let table = $('#example').DataTable({
				stateSave: false
			});
			table.state.clear();
			expect(table.page.info().start).toBe(0);
		});
	});
});
