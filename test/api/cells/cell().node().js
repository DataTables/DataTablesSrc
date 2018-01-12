describe('cells - cell().node()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	dt.html('basic');

	it('Exists and is a function', function() {
		var table = $('#example').DataTable();
		expect(typeof table.cell().node).toBe('function');
	});

	it('Returns an object of HTMLTableCellElement type', function() {
		var table = $('#example').DataTable();
		expect(table.cell().node() instanceof HTMLTableCellElement).toBe(true);
	});

	it('Returns first and last cell of first row as expected', function() {
		var table = $('#example').DataTable();
		expect(table.cell(0, 0).node().innerText).toBe('Tiger Nixon');
		expect(table.cell(0, table.columns().count() - 1).node().innerText).toBe('$320,800');
	});

	it('Returns first and last cell of last row as expected', function() {
		var table = $('#example').DataTable();
		expect(table.cell(table.rows().count() - 1, 0).node().innerText).toBe('Donna Snider');
		expect(table.cell(table.rows().count() - 1, table.columns().count() - 1).node().innerText).toBe('$112,000');
	});

	dt.html('basic');

	it('Returns first cell as expected from before Datatables initialisation', function() {
		var oldcells = $('#example tbody td');
		var table = $('#example').DataTable();
		expect(table.cell(0, 0).node()).toBe(oldcells[0]);
	});
});
