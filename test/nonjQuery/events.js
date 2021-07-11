describe('nonjQuery - events', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let event = '';
	let table;

	dt.html('basic');
	it('No options', function () {
		table = new DataTable('#example');

		table
			.on('order', function () {
				event = 'Order';
			})
			.on('search', function () {
				event = 'Search';
			})
			.on('page', function () {
				event = 'Page';
			});

		expect(event).toBe('');
	});
	it('Order', function () {
		table.order(1).draw();
		expect(event).toBe('Order');
	});
	it('Search', function () {
		table.search('a');
		expect(event).toBe('Search');
	});
	it('Page', function () {
		table.page(2);;
		expect(event).toBe('Page');
	});
});
