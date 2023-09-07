describe('core - events - order', function() {
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
			table.on('order.dt', function() {
				params = arguments;
				firstCell = $('tbody tr:eq(0) td:eq(0)').text();
			});

			table.order([0, 'desc']).draw(false);

			expect(firstCell).toBe('Airi Satou');
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Zorita Serrano');
		});
		it('Called with expected parameters', function() {
			expect(params.length).toBe(3);
			expect(params[0] instanceof $.Event).toBe(true);
			expect(params[1]).toBe(table.settings()[0]);
			expect(typeof params[2]).toBe('object');
		});
		it('Has a DT API instance on the event object', function () {
			expect(params[0].dt instanceof DataTable.Api).toBe(true);
		});
		it('Does not bubble', function () {
			var bubbled = false;

			$('body').on('order.dt', function () {
				bubbled = true;
			});

			table.order([1, 'desc']).draw(false);

			expect(bubbled).toBe(false);
		});
	});

	describe('Functional tests', function() {
		let count = 0;

		dt.html('basic');
		it('Called on initial draw', function() {
			table = $('#example')
				.on('order.dt', function() {
					count++;
					params = arguments;
				})
				.DataTable();
			expect(count).toBe(1);
		});
		it('Called when API changes order', function() {
			table.order([2, 'asc']).draw(false);
			expect(count).toBe(2);
			expect(params[2][0].src).toBe(2);
			expect(params[2][0].dir).toBe('asc');
		});
		it('Called once API changes order with two dimensions', function() {
			table.order([[3, 'asc'], [4, 'desc']]).draw(false);
			expect(count).toBe(3);
			expect(params[2][0].src).toBe(3);
			expect(params[2][0].dir).toBe('asc');
			expect(params[2][1].src).toBe(4);
			expect(params[2][1].dir).toBe('desc');
		});
		it('Called when user changes order', async function() {
			await dt.clickHeader(2);
			expect(count).toBe(4);
			expect(params[2][0].src).toBe(2);
			expect(params[2][0].dir).toBe('asc');
		});

		it('Click on ordering header does not trigger a search event', async function() {
			let search = false;

			table.on('search', () => {
				search = true;
			});

			await dt.clickHeader(3);
			expect(search).toBe(false); // event didn't trigger
		});
	});
});
