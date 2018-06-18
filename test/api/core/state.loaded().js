describe('core - state.loaded()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			expect(typeof $('#example').DataTable().state.loaded).toBe('function');
		});

		it('Returns an object', function() {
			let table = $('#example').DataTable();
			expect(typeof table.state.loaded()).toBe('object');
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
		it('No loaded state if stateSave not enabled', function() {
			let table = $('#example').DataTable({
				stateSave: false
			});
			expect(table.state.loaded()).toBe(null);
		});

		dt.html('basic');
		it('No loaded state if stateSave enabled for first time', function() {
			let table = $('#example').DataTable({
				stateSave: true
			});
			expect(table.state.loaded()).toBe(null);
		});

		dt.html('basic');
		it('Loaded state after stateSave enabled for first time', function() {
			let table = $('#example').DataTable({
				stateSave: true
			});
			expect(table.state.loaded().time > 0).toBe(true);
		});

		dt.html('basic');
		it('Loaded state does not return current state', function() {
			let table = $('#example').DataTable({
				stateSave: true
			});
			table.page(2).draw(false);
			expect(table.state.loaded().start).toBe(0);
		});

		dt.html('basic');
		it('Loaded state return state of saved table', function() {
			let table = $('#example').DataTable({
				stateSave: true
			});
			table.page(0).draw(true);
			expect(table.state.loaded().start).toBe(20);
		});
	});
});
