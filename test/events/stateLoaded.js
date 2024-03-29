describe('core - events - stateLoaded', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;
	let count = 0;
	let params;
	let firstCell;

	describe('Check the defaults', function() {
		var bubbled = false;

		// Clear down saved state before proceeding (otherwise old stuff may be lurking that will affect us)
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
			$('body').on('stateLoaded.dt', function () {
				bubbled = true;
			});

			table = $('#example')
				.on('stateLoaded.dt', function() {
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
		it('Has a DT API instance on the event object', function () {
			expect(params[0].dt instanceof DataTable.Api).toBe(true);
		});
		it('Does not bubble', function () {
			expect(bubbled).toBe(false);
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Not called if no stateSave', function() {
			count = 0;
			table = $('#example')
				.on('stateLoaded.dt', function() {
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
				.on('stateLoaded.dt', function() {
					params = arguments;
					count++;
				})
				.DataTable({
					stateSave: true
				});

			expect(count).toBe(1);
		});
		it('Not called if state saved', function() {
			table.state.save();
			expect(count).toBe(1);
		});
	});
});
