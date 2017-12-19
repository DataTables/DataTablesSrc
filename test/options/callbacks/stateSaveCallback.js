describe('stateSavecallback Option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	// TK COLIN verify tests: unsure of how to write some tests for this
	describe('Check the defaults', function() {
		dt.html('basic');
		it('Default should not be true', function() {
			$('#example').dataTable();
			expect($.fn.dataTable.defaults.fnStateSaveCallback).not.toBe(true);
			//$.fn.DataTable.defaults
		});
		dt.html('basic');
		it('2 arguments passed', function() {
			test = 0;
			$('#example').dataTable({
				stateSave: true,
				stateSaveCallback: function(settings, data) {
					test = 2;
				}
			});
			$('#example_filter input')
				.val('London')
				.keyup(); //remove once stateSave is saving on first draw
			expect(test).toBe(2);
		});

		dt.html('basic');
		it('First argument is the settings object', function() {
			test = false;
			$('#example').dataTable({
				stateSave: true,
				stateSaveCallback: function(settings, data) {
					test = settings;
				}
			});
			$('#example_filter input')
				.val('London')
				.keyup(); //remove once stateSave is saving on first draw
			expect(test == $.fn.dataTableSettings[0]).toBe(true);
		});
		
		dt.html('basic');
		it('Second argument is the data object and we can ensure a search value is saved', function() {
			test = false;
			$('#example').dataTable({
				stateSave: true,
				stateSaveCallback: function(settings, data) {
					test = data.search.search;
				}
			});
			$('#example_filter input')
				.val('London')
				.keyup();
			expect(test == 'London').toBe(true);
		});
	});
});
