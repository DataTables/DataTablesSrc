// todo tests - write the tests...

describe('ColinTest', function() {
	var table;
	var row;

	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	dt.html('basic');

	it('modifier - row index of 1, no data match', function() {
		table = $('#example').DataTable();

		// This will leave row index 4 in the display
		table.search('air').draw();

		var d = table.row(1, { search: 'applied' }).data();
		expect(d).toBe(undefined);
	});

	it('modifier - row index of 0, no data match', function() {
		var d = table.row(0, { search: 'applied' }).data();
		expect(d).toBe(undefined);
	});

	it('modifier - row index of 4, data match', function() {
		var d = table.row(4, { search: 'applied' }).data();
		expect(d[0]).toBe('Airi Satou');
	});

	// GH #994
	dt.html('basic');

	it('Selecting a row as a jQuery instance', function() {
		table = $('#example').DataTable();

		table
			.clear()
			.row.add([0, 1, 2, 3, 4, 5])
			.draw();

		row = $('#example tbody tr');

		expect(table.row(row).node()).toBe(row[0]);
	});

	it('Delete the row from the table', function() {
		table.clear().draw();
		expect(table.rows().count()).toBe(0);
	});

	it('Selecting by save jQuery variable does not return the row', function() {
		expect(table.row(row).length).toBe(0);
		expect(table.row(row).node()).toBe(null);
	});

	// colin's stuff
	dt.html('basic');

	it('Select top row and see if Airi COLIN', function() {
		table = $('#example').DataTable();
		console.log('fred');

		var myrow = table.row(':eq(0)', { order: 'current' }).data();
		expect(myrow[0]).toBe('Airi Satou');
	});
});
