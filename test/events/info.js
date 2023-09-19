describe('core - events - info', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;
	let params;

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Called when table is initialized and displayed', function() {
			table = $('#example')
				.on('info.dt', function() {
					params = arguments;
				})
				.DataTable();

			expect(params.length).toBe(4);
		});

		it('Called with expected parameters', function() {
			expect(params[0] instanceof $.Event).toBe(true);
			expect(params[1]).toBe(table.settings()[0]);
			expect(params[2]).toBe($('div.dt-info')[0]);
			expect(params[3]).toBe('Showing 1 to 10 of 57 entries');
		});
		it('Has a DT API instance on the event object', function () {
			expect(params[0].dt instanceof DataTable.Api).toBe(true);
		});

		it('Called on page change', function() {
			table.page(1).draw(false);

			expect(params[0] instanceof $.Event).toBe(true);
			expect(params[1]).toBe(table.settings()[0]);
			expect(params[2]).toBe($('div.dt-info')[0]);
			expect(params[3]).toBe('Showing 11 to 20 of 57 entries');
		});
	});
});
