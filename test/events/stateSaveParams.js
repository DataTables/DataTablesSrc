describe('core - events - stateSaveParams', function() {
	// TK COLIN this is pretty much the same as stateLoaded - so could do some refactoring here.
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;
	let count = 0;
	let params;
	let firstCell;

	describe('Check the defaults', function() {
		// Clear down save state before proceeding (otherwise old stuff may be lurking that will affect us)
		dt.html('basic');
		it('Clear state save', function() {
			let table = $('#example').DataTable();
			table.state.clear();
		});

		dt.html('basic');
		it('Create a saved state', function() {
			let table = $('#example').DataTable({
				stateSave: true
			});
			table.state.save();
		});

		dt.html('basic');
		it('Called during initialisation', function() {
			table = $('#example')
				.on('stateSaveParams.dt', function() {
					params = arguments;
					count++;
				})
				.DataTable({
					stateSave: true
				});

			expect(count).toBe(1);
		});
		it('Called with expected parameters', function() {
			expect(params.length).toBe(3);
			expect(params[0] instanceof $.Event).toBe(true);
			expect(params[1]).toBe(table.settings()[0]);
			expect(typeof params[2]).toBe('object');
			expect(params[2].length).toBe(10);
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Not called if no stateSave', function() {
			count = 0;
			table = $('#example')
				.on('stateSaveParams.dt', function() {
					params = arguments;
					count++;
				})
				.DataTable({
					stateSave: false
				});

			expect(count).toBe(0);
		});
		dt.html('basic');
		it('Called if stateSave', function() {
			count = 0;
			table = $('#example')
				.on('stateSaveParams.dt', function() {
					params = arguments;
					count++;
				})
				.DataTable({
					stateSave: true
				});

			expect(count).toBe(1);
		});
		it('Called if state saved', function() {
			table.state.save();
			expect(count).toBe(2);
			expect(params[2].start).toBe(0);
		});
		it('Called if state implicitly saved', function() {
			table.page(2).draw(false);
			expect(count).toBe(3);
			expect(params[2].start).toBe(20);
		});
	});
});
