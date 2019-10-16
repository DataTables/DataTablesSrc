// This could do with some refactoring at some point, as both tests are the same
describe('performance', function() {
	dt.libs({
		js: ['jquery', 'datatables11018'],
		css: ['datatables11018']
	});

	let table;
	let columns = 30;
	let rows = 2500;
	let runs = 15;

	dt.html('empty_no_header');
	it('Check this is the old version', function() {
		expect($.fn.dataTable.version).toBe('1.10.18');
	});
	it('Create the table', function() {
		let header = '';
		for (let i = 0; i < columns; i++) {
			header += '<th>' + i + '</th>';
		}
		$('#example').append('<thead><tr>' + header + '</tr></thead>');

		let data = [];
		for (let i = 0; i < rows; i++) {
			let line = [];
			for (j = 0; j < columns; j++) {
				line.push(i + '-' + j);
			}
			data.push(line);
		}

		table = $('#example').DataTable({
			data: data
		});

		expect(table.page.info().recordsTotal).toBe(rows);
	});
	// Repeat the tests
	for (let i = 0; i < runs; i++) {
		it('Do something in the browser', function() {
			table.order([0, 'desc']).draw();
		});
		it('Cells - order [' + i + ']', function() {
			var rowIndexes = table
				.rows(null, { order: 'applied' })
				.indexes()
				.toArray();
			var cells = table.cells(rowIndexes, null, { order: 'applied' });

			expect(table.page.info().recordsTotal).toBe(rows);
		});
		it('Do something in the browser to stop timeout', function() {
			table.order([0, 'asc']).draw();
		});
		it('Cells - search [' + i + ']', function() {
			var rowIndexes = table
				.rows(null, { order: 'applied' })
				.indexes()
				.toArray();
			var cells = table.cells(rowIndexes, null, { search: 'applied' });

			expect(table.page.info().recordsTotal).toBe(rows);
		});
		it('Do something in the browser to stop timeout', function() {
			table.order([0, 'desc']).draw();
		});
		it('Columns [' + i + ']', function() {
			var columnIndexes = table
				.columns({ order: 'applied' })
				.indexes()
				.toArray();
			var cells = table.cells(columnIndexes, null, { order: 'applied' });

			expect(table.page.info().recordsTotal).toBe(rows);
		});
		it('Do something in the browser', function() {
			table.order([0, 'asc']).draw();
		});
	}
});
