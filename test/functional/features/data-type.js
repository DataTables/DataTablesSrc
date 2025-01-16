describe('Data type detection', function () {
	var table;
	var data = [];

	for (var i = 0; i < 100; i++) {
		data.push(
			[
				'a', // plain string
				i, // number
				'<div>' + i + '</div>', // HTML number
				'2020-01-01', // Date
				'c' + i, // String
				'<div>d' + i + '</div>'
			] // HTML
		);
	}

	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	dt.html('empty');

	it('Types detected as expected', function () {
		table = new DataTable('#example', {
			data: data
		});

		expect(table.column(0).type()).toBe('string');
		expect(table.column(1).type()).toBe('num');
		expect(table.column(2).type()).toBe('html-num');
		expect(table.column(3).type()).toBe('date');
		expect(table.column(4).type()).toBe('string');
		expect(table.column(5).type()).toBe('html');
	});

	dt.html('empty');

	it('Types detected when search and ordering disabled', function () {
		table = new DataTable('#example', {
			data: data,
			searching: false,
			ordering: false
		});

		expect(table.column(0).type()).toBe('string');
		expect(table.column(1).type()).toBe('num');
		expect(table.column(2).type()).toBe('html-num');
		expect(table.column(3).type()).toBe('date');
		expect(table.column(4).type()).toBe('string');
		expect(table.column(5).type()).toBe('html');
	});

	// Data types after an invalidation
	// https://github.com/DataTables/ColReorder/issues/90
	dt.html('empty');

	it('Type detected as expected on start up', function () {
		table = new DataTable('#example', {
			data: data
		});

		expect(table.column(3).type()).toBe('date');
	});

	it('Invalidate data causes type to be null', function () {
		table.cell(0, 3).invalidate('data');

		// Note need, to check the internal value, as `column().type()` will resolve the
		// type
		expect(table.settings()[0].aoColumns[3].sType).toBe(null);
	});

	it('Ordering by the column resolves type', async function () {
		await dt.clickHeader(3);

		expect(table.settings()[0].aoColumns[3].sType).toBe('date');
	});
});
