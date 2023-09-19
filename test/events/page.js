describe('core - events - page', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;
	let params;

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Called before the draw', function() {
			let firstCell;

			table = $('#example').DataTable();
			table.on('page.dt', function() {
				params = arguments;
				firstCell = $('tbody tr:eq(0) td:eq(0)').text();
			});

			table.page(1).draw(false);

			expect(firstCell).toBe('Airi Satou');
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Charde Marshall');
		});
		it('Called with expected parameters', function() {
			expect(params.length).toBe(2);
			expect(params[0] instanceof $.Event).toBe(true);
			expect(params[1]).toBe(table.settings()[0]);
		});
		it('Has a DT API instance on the event object', function () {
			expect(params[0].dt instanceof DataTable.Api).toBe(true);
		});
		it('Does not bubble', function () {
			var bubbled = false;

			$('body').on('page.dt', function () {
				bubbled = true;
			});

			table.page(0).draw(false);

			expect(bubbled).toBe(false);
		});
	});

	describe('Functional tests', function() {
		let count = 0;
		dt.html('basic');
		it('Not called on initial draw', function() {
			table = $('#example').on('page.dt', function() {
				count++;
			}).DataTable();
			expect(count).toBe(0);
		});
		it('Called when API changes the page', function() {
			table.page(2).draw(false);
			expect(count).toBe(1);
		});
		it('Not called when API changes page length', function() {
			table.page.len(25).draw(false);
			expect(count).toBe(1);
		});
		it('Called when user changes page', function() {
			$('.dt-paging-button:eq(3)').click();
			expect(count).toBe(2);
		});
	});
});
