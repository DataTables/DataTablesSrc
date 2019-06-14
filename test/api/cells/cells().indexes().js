describe('cells - cells().indexes()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			table = $('#example').DataTable();
			expect(typeof table.cells().indexes).toBe('function');
		});
		it('Returns an API instance', function() {
			expect(table.cells().indexes() instanceof $.fn.dataTable.Api).toBe(true);
		});
		it('Returns an object containing three integers', function() {
			let cellIdx = table.cells(0, 0).indexes()[0];

			expect(Object.keys(cellIdx).length).toBe(3);

			expect(Number.isInteger(cellIdx.row)).toBe(true);
			expect(Number.isInteger(cellIdx.column)).toBe(true);
			expect(Number.isInteger(cellIdx.columnVisible)).toBe(true);
		});
	});

	describe('Check behaviour', function() {
		dt.html('basic');
		it('Correct cell indexes when no columns hidden', function() {
			table = $('#example').DataTable();

			$(table.row(2).node()).addClass('selected');
			let cellIdx = table.cells('.selected', '*').indexes();

			expect(cellIdx.length).toBe(6);

			for (let i = 0; i < table.columns().count(); i++) {
				expect(cellIdx[i].row).toBe(2);
				expect(cellIdx[i].column).toBe(i);
				expect(cellIdx[i].columnVisible).toBe(i);
			}
		});
		it('Correct indexes if one column is hidden', function() {
			$(table.row(2).node()).addClass('selected');
			table.column(1).visible(false);

			let cellIdx = table.cells('.selected', '*').indexes();
			let columnVisible = null;

			expect(cellIdx.length).toBe(6);

			for (let i = 0; i < table.columns().count(); i++) {
				expect(cellIdx[i].row).toBe(2);
				expect(cellIdx[i].column).toBe(i);

				columnVisible = i == 1 ? null : i < 1 ? i : i - 1;
				expect(cellIdx[i].columnVisible).toBe(columnVisible);
			}
		});
	});
});
