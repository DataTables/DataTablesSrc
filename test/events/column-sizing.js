describe('core - events - column-sizing', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;
	let params;
	let count = 0;

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Called during initialisation', function() {
			table = $('#example')
				.on('column-sizing.dt', function() {
					params = arguments;
					count++;
				})
				.DataTable();

			expect(count).toBe(1);
		});

		it('Called with expected parameters', function() {
			table.columns.adjust();
			expect(count).toBe(2);
			expect(params.length).toBe(2);
			expect(params[0] instanceof $.Event).toBe(true);
			expect(params[1]).toBe(table.settings()[0]);
		});
		it('Has a DT API instance on the event object', function () {
			expect(params[0].dt instanceof DataTable.Api).toBe(true);
		});
		it('Does not bubble', function () {
			var bubbled = false;

			$('body').on('column-sizing.dt', function () {
				bubbled = true;
			});

			table.columns.adjust();

			expect(bubbled).toBe(false);
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Called on initial draw', function() {
			count = 0;
			table = $('#example')
				.on('column-sizing.dt', function() {
					count++;
				})
				.DataTable();

			expect(count).toBe(1);
		});
		it('Called when column made invisible', function() {
			table.column(1).visible(false);
			expect(count).toBe(2);
		});
		it('Called when column made visible', function() {
			table.column(1).visible(true);
			expect(count).toBe(3);
		});
	});
});
