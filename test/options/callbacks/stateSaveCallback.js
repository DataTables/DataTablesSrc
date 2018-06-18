// TK COLIN add tests when multiple tables active on the page
describe('stateSavecallback Option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Default should not be true', function() {
			$('#example').dataTable();
			expect($.fn.dataTable.defaults.fnStateSaveCallback).not.toBe(true);
		});

		dt.html('basic');
		it('Correct arguments passed to callback function', function() {
			let called = false;
			let table = $('#example').DataTable({
				stateSave: true,
				stateSaveCallback: function(settings, data) {
					expect(arguments.length).toBe(2);
					expect(settings.hasOwnProperty('nTable')).toBe(true);
					expect(typeof data).toBe('object');
					called = true;
				}
			});
			expect(called).toBe(true);
		});

		dt.html('basic');
		it('First argument is the settings object', function() {
			let test = false;
			let table = $('#example').DataTable({
				stateSave: true,
				stateSaveCallback: function(settings, data) {
					let api = new $.fn.dataTable.Api(settings);
					test = settings;
					expect(api.rows().count()).toBe(57);
				}
			});
			expect(test == $.fn.dataTableSettings[0]).toBe(true);
		});

		dt.html('basic');
		it('Callback function not called if stateSave disabled', function() {
			let called = false;
			let table = $('#example').DataTable({
				stateSave: false,
				stateSaveCallback: function(settings, data) {
					called = true;
				}
			});
			expect(called).toBe(false);
		});

		dt.html('basic');
		it('Callback function not called if stateSave not specified (default is off)', function() {
			let called = false;
			let table = $('#example').DataTable({
				stateSaveCallback: function(settings, data) {
					called = true;
				}
			});
			expect(called).toBe(false);
		});
	});

	describe('Check the validity of the saved data', function() {
		// No need to check if callback was actually called, those tests performed above
		// Clear down save state before proceeding (otherwise old stuff may be lurking that will affect us)
		dt.html('basic');
		it('Clear state save', function() {
			let table = $('#example').DataTable();
			table.state.clear();
		});

		dt.html('basic');
		it('Saved time is sensible', function() {
			let table = $('#example').DataTable({
				stateSave: true,
				stateSaveCallback: function(settings, data) {
					// time should be within a couple of seconds
					expect(Date.now() < data.time + 2 * 1000).toBe(true);
				}
			});
			table.page(1).draw();
		});

		dt.html('basic');
		it('Start position is sensible', function() {
			let start = 0;
			let table = $('#example').DataTable({
				stateSave: true,
				stateSaveCallback: function(settings, data) {
					start = data.start;
				}
			});
			table.page(2).draw(false);
			expect(start).toBe(20);
		});

		dt.html('basic');
		it('Page length is sensible', function() {
			let pageLength = 0;
			let table = $('#example').DataTable({
				stateSave: true,
				stateSaveCallback: function(settings, data) {
					pageLength = data.length;
				}
			});
			table.page.len(15).draw();
			expect(pageLength).toBe(15);
		});

		dt.html('basic');
		it('Order is sensible', function() {
			let order = 0;
			let table = $('#example').DataTable({
				stateSave: true,
				stateSaveCallback: function(settings, data) {
					order = data.order;
				}
			});
			table
				.columns([1, 2])
				.order('desc')
				.draw();

			expect(order.length).toBe(2);
			expect(order[0][0]).toBe(1);
			expect(order[0][1]).toBe('desc');
			expect(order[1][0]).toBe(2);
			expect(order[1][1]).toBe('desc');
		});

		dt.html('basic');
		it('Search is sensible', function() {
			let search = 0;
			let table = $('#example').DataTable({
				stateSave: true,
				stateSaveCallback: function(settings, data) {
					search = data.search;
				}
			});
			table.search('Cox', true, false, true).draw();
			expect(search.search).toBe('Cox');
			expect(search.smart).toBe(false);
			expect(search.regex).toBe(true);
			expect(search.caseInsensitive).toBe(true);
		});

		function checkColumn(data, visible, search, smart, regex, caseInsensitive) {
			if (
				data.visible == visible &&
				data.search.search == search &&
				data.search.smart == smart &&
				data.search.regex == regex &&
				data.search.caseInsensitive == caseInsensitive
			) {
				return true;
			}

			return false;
		}

		dt.html('basic');
		it('Columns are sensible', function() {
			let columns = 0;
			let table = $('#example').DataTable({
				stateSave: true,
				stateSaveCallback: function(settings, data) {
					columns = data.columns;
				}
			});
			table.columns([3, 5]).visible(false);
			table
				.columns([1, 4])
				.search('Cox', true, false, true)
				.draw();

			expect(checkColumn(columns[0], true, '', true, false, true)).toBe(true);
			expect(checkColumn(columns[1], true, 'Cox', false, true, true)).toBe(true);
			expect(checkColumn(columns[2], true, '', true, false, true)).toBe(true);
			expect(checkColumn(columns[3], false, '', true, false, true)).toBe(true);
			expect(checkColumn(columns[4], true, 'Cox', false, true, true)).toBe(true);
			expect(checkColumn(columns[5], false, '', true, false, true)).toBe(true);
		});
	});
});
