describe('stateLoadParams Option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Default should not be true', function() {
			$('#example').dataTable();
			expect($.fn.dataTable.defaults.fnStateLoadParams).not.toBe(true);
			//$.fn.DataTable.defaults
		});

		dt.html('basic');
		it('Correct arguments passed to callback function', function() {
			let cbSettings = false;
			let table = $('#example').DataTable({
				stateSave: true,
				stateLoadParams: function(settings, data) {
					expect(arguments.length).toBe(2);
					expect(settings.hasOwnProperty('nTable')).toBe(true);
					expect(typeof data).toBe('object');
					cbSettings = settings;
				}
			});
			expect(cbSettings).toBe(table.settings()[0]);
		});

		dt.html('basic');
		it('Does nothing if stateSave not enabled', function() {
			let called = false;
			let table = $('#example').DataTable({
				stateLoadParams: function(settings, data) {
					called = true;
				}
			});
			table.state.save();
			expect(called).toBe(false);
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
		it('Callback not called if no data before', function() {
			let called = false;
			let table = $('#example').DataTable({
				stateLoadParams: function(settings, data) {
					called = true;
				}
			});
			table.state.save();
			expect(called).toBe(false);
		});

		dt.html('basic');
		it('Ensure test value is not there before we add it', function() {
			let table = $('#example').DataTable({
				stateSave: true,
				stateLoadParams: function(settings, data) {
					expect(data.unitTest).toBe(undefined);
				}
			});
			expect(table.state().unitTest).toBe(undefined);
		});

		dt.html('basic');
		it('Save something', function() {
			let table = $('#example').DataTable({
				stateSave: true,
				stateSaveParams: function(settings, data) {
					data.unitTest = true;
				}
			});
			table.state.save();
			expect(table.state().unitTest).toBe(true);
		});

		dt.html('basic');
		it('Save something', function() {
			let table = $('#example').DataTable({
				stateSave: true,
				stateLoadParams: function(settings, data) {
					expect(data.unitTest).toBe(true);
				}
			});
		});
	});
});
