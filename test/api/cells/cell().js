// todo tests
// - Confirm it exists and is a function
// - Confirm it returns an API method
// - Select a cell using just a cell selector
//   - no selector (all cells)
//   - string selector (jQuery)
//   - node
//   - function
//   - jQuery instance
//   - object ({row:i, column:j})
//   - Array with combinations of the above
//   - Ensure that if the selector matches multiple cells, only a single cell is actually selected
// - Select cells with only a selector modifier
//   - order
//   - search
//   - page
// - Select cells using a cell selector and a selector modifier
//   - various mixes of the above
// - Select cells using a row and column selector
//   - Various combinations of row and column selectors
//   - Ensure that the selectors are cumulative
// - Select cells using row and column selectors with selector modifier

describe('cells: cell()', function() {
	var table;

	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('modifier - page', function() {
		dt.html('basic');

		it('Row / column cell selector off page without modifier', function() {
			table = $('#example').DataTable();

			let d = table.cell(19, 0).data();
			expect(d).toBe('Dai Rios');
		});

		it('Row / column cell selector off page with modifier', function() {
			let d = table.cell(19, 0, { page: 'current' }).data();
			expect(d).toBe(undefined);
		});

		it('Index cell selector off page without modifier', function() {
			let d = table.cell({ row: 19, column: 1 }).data();
			expect(d).toBe('Personnel Lead');
		});

		it('Index cell selector off page with modifier', function() {
			let d = table.cell({ row: 19, column: 1 }, { page: 'current' }).data();
			expect(d).toBe(undefined);
		});
	});
});
