// todo tests
// - Check it exists and is a function
// - Check it returns an API instance
// - Check it triggers a save
// - Check that when reloaded the table will reflect this saved state

describe('core - state.save()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			expect(typeof $('#example').DataTable().state.save).toBe('function');
		});

		it('Returns an object', function() {
			let table = $('#example').DataTable();
			expect(table.state.save() instanceof $.fn.dataTable.Api).toBe(true);
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
		it('State save does initiate a stateSaveCallback', function() {
			let inTest = false;
			let pageLength = 0;

			let table = $('#example').DataTable({
				stateSave: true,
				stateSaveCallback: function(settings, data) {
					if (inTest) {
						// stops the update from an automatic stave save
						pageLength = data.length;
					}
				}
			});

			table.page.len(15).draw();
			expect(pageLength).toBe(0);

			inTest = true;
			table.state.save();
			expect(pageLength).toBe(15);
		});

		dt.html('basic');
		it('Save state for reloading', function() {
			let table = $('#example').DataTable({
				stateSave: true
			});

			// note page() doesn't initiate a save - only the draw() does
			table.page(1);
			table.state.save();
			expect(table.page()).toBe(1);
		});

		dt.html('basic');
		it('Save state loads', function() {
			let table = $('#example').DataTable({
				stateSave: true
			});
			expect(table.page()).toBe(1);
		});

		dt.html('basic');
		it('Ensure no errors if stateSave not enabled', function() {
			let table = $('#example').DataTable({
				stateSave: false
			});
			table.state.save();
			expect(table.page.info().start).toBe(0);
		});
	});
});
