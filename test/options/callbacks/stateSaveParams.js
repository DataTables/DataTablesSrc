describe('stateSaveParams Option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Default should be not configured', function() {
			expect($.fn.dataTable.defaults.fnStateSaveParams).toBe(null);
		});

		dt.html('basic');
		it('Correct arguments passed to callback function', function() {
			let cbSettings = false;
			let table = $('#example').DataTable({
				stateSave: true,
				stateSaveParams: function(settings, data) {
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
            let seen = false; 
            let table = $('#example').DataTable({
				stateSaveParams: function(settings, data) {
					seen = true;
				}
			});
			table.state.save();
			expect(seen).toBe(true);
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
		it('Ensure value is saved', function() {
			let table = $('#example').DataTable({
				stateSave: true,
				stateSaveParams: function(settings, data) {
					data.unitTest = true;
				}
			});
			table.state.save();
			expect(table.state().unitTest).toBe(true);
		});
	});
});
