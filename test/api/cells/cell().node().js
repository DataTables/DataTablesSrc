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
		expect(table.cell(0, 0).node().textContent).toBe('Tiger Nixon');
		expect(table.cell(0, 5).node().textContent).toBe('$320,800');
	});

	it('Returns first and last cell of last row as expected', function() {
		var table = $('#example').DataTable();
		expect(table.cell(56, 0).node().textContent).toBe('Donna Snider');
		expect(table.cell(56, 5).node().textContent).toBe('$112,000');
	});

	dt.html('basic');

	it('Returns first cell as expected from before Datatables initialisation', function() {
		var oldcells = $('#example tbody td');
		var table = $('#example').DataTable();
		expect(table.cell(0, 0).node()).toBe(oldcells[0]);
	});
});
