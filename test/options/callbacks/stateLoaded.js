describe('stateLoaded Option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		// Clear down save state before proceeding (otherwise old stuff may be lurking that will affect us)
		dt.html('basic');
		it('Clear state save', function() {
			let table = $('#example').DataTable();
			table.state.clear();
		});

		dt.html('basic');
		it('Default should not be true', function() {
			$('#example').dataTable();
			expect($.fn.dataTable.defaults.fnStateLoaded).toBe(null);
		});

		dt.html('basic');
		it('Does nothing if stateSave not enabled', function() {
			let called = false;
			let table = $('#example').DataTable({
				stateLoaded: function(settings, data) {
					called = true;
				}
			});
			table.state.save();
			expect(called).toBe(false);
		});

		dt.html('basic');
		it('Correct arguments passed to callback function', function() {
			let called = false;
			let table = $('#example').DataTable({
				stateSave: true,
				stateLoaded: function(settings, data) {
					expect(arguments.length).toBe(2);
					expect(settings.hasOwnProperty('nTable')).toBe(true);
					expect(typeof data).toBe('object');
					called = true;
				}
			});
			expect(called).toBe(false);
		});

		dt.html('basic');
		it('Correct settings passed to callback function', function() {
			let cbSettings = false;
			let table = $('#example').DataTable({
				stateSave: true,
				stateLoaded: function(settings, data) {
					cbSettings = settings;
				}
			});
			expect(cbSettings).toBe(table.settings()[0]);
		});
	});

	describe('Functional tests', function() {
		let stateSaveData = null;

		dt.html('basic');
		it('Get a stateSAve data object', function() {
			let table = $('#example').DataTable({
				stateSave: true,
				stateSaveCallback: function(settings, data) {
					stateSaveData = data;
				}
			});
			table.state.save();
			expect(stateSaveData).not.toBeNull();
		});

		dt.html('basic');
		it('Called last after other stateSave callbacks', function() {
			let order = [];
			let table = $('#example').DataTable({
				stateSave: true,
				stateLoadParams: function(settings, data) {
					order.push("stateLoadParams");
				},
				stateLoadCallback: function(settings, callback) {
					order.push("stateLoadCallback");
					return stateSaveData;
				},
				stateLoaded: function(settings, data) {
					order.push("stateLoaded");
				}
			});
			expect(JSON.stringify(order)).toBe(JSON.stringify(['stateLoadCallback', 'stateLoadParams', 'stateLoaded']));
		});
	});
});
