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

			// Note: below line disabled due to DD-795
			// expect(firstCell).toBe('Airi Satou');
			expect(firstCell).toBe('Zorita Serrano');
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Zorita Serrano');
		});
		it('Called with expected parameters', function() {
			// DD-794 raised as there should be only 3 params (note docs need updating)
			expect(params.length).toBe(4);
			expect(params[0] instanceof $.Event).toBe(true);
			expect(params[1]).toBe(table.settings()[0]);
			expect(typeof params[2]).toBe('object');
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
		it('Called when user changes order', function() {
			$('thead tr th:eq(2)').click();
			expect(count).toBe(4);
			expect(params[2][0].src).toBe(2);
			expect(params[2][0].dir).toBe('asc');
		});
	});
});
