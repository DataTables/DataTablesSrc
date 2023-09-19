describe('core - events - search', function() {
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
			table.on('search.dt', function() {
				params = arguments;
				firstCell = $('tbody tr:eq(0) td:eq(0)').text();
			});

			table.search('cox').draw(false);

			expect(firstCell).toBe('Airi Satou');
			expect($('tbody tr:last td:eq(0)').text()).toBe('Ashton Cox');
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

			$('body').on('search.dt', function () {
				bubbled = true;
			});

			table.search('cox1').draw(false);

			expect(bubbled).toBe(false);
		});
	});

	describe('Functional tests', function() {
		let count = 0;
		let length;
		dt.html('basic');
		it('Called on initial draw', function() {
			table = $('#example')
				.on('search.dt', function() {
					count++;
				})
				.DataTable();
			expect(count).toBe(1);
		});
		it('Called when API searches', function() {
			table.search('cox');
			expect(count).toBe(2);
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});
		it('Called when draw shows the filter', function() {
			table.draw(false);
			expect(count).toBe(3);
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Ashton Cox');
		});
		it('Called when search cleared', function() {
			table.search('').draw(false);
			expect(count).toBe(5);
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});
		it('Called when column search', function() {
			table
				.column(0)
				.search('cox')
				.draw(false);
			expect(count).toBe(7);
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Ashton Cox');
		});
		it('Called when column search cleared', function() {
			table
				.column(0)
				.search('')
				.draw(false);
			expect(count).toBe(9);
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});
		it('Called just once when user searches', function() {
			$('div.dt-search input')
				.val('cox')
				.keyup();
			expect(count).toBe(10);
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Ashton Cox');
		});

		it('A search action does not trigger an order event', async function() {
			let order = false;

			table.on('order', () => {
				order = true;
			});

			$('div.dt-search input')
				.val('airi')
				.keyup();

			expect(order).toBe(false); // event didn't trigger
		});
	});
});
