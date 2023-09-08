describe('nonjQuery - events', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let event = '';
	let table;
	let order = 0;
	let page = 0;

	dt.html('basic');
	it('No options', function () {
		table = new DataTable('#example');

		table
			.on('order', function () {
				event = 'Order';
				order++;
			})
			.on('search', function () {
				event = 'Search';
			})
			.on('page', function () {
				event = 'Page';
				page++;
			});

		expect(event).toBe('');
	});
	it('Order', function () {
		// A draw will trigger a search as well
		table.order(1).draw();
		expect(event).toBe('Search');
		expect(order).toBe(1);
	});
	it('Search', function () {
		table.search('a');
		expect(event).toBe('Search');
	});
	it('Page', function () {
		table.search('').draw();
		table.page(2);
		expect(page).toBe(1);
		expect(event).toBe('Page');
	});
});
