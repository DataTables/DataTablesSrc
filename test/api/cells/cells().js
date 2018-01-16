// todo tests
// - Confirm it exists and is a function
// - Confirm it returns an API method
// - Select cells using just a cell selector
//   - no selector (all cells)
//   - string selector (jQuery)
//   - node
//   - function
//   - jQuery instance
//   - object ({row:i, column:j})
//   - Array with combinations of the above
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

describe('cells: cells()', function() {
	var table;

	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	dt.html('basic');

	it('', function() {});

	// it('A single node can be returned', function() {
	// 	let table = $('#example').DataTable();
	// 	node = table.cells(dt.testRow, dt.testColumnName).nodes();

	// 	expect(node.count()).toBe(1);
	// 	expect(node[0].innerText).toBe(dt.testRowData[dt.testColumnName]);
	// });

	// dt.html('basic');

	// it('A row of nodes can be returned', function() {
	// 	let table = $('#example').DataTable();
	// 	$(table.cells(3, '*').nodes()).addClass('myTest');
	// 	expect(table.cells('.myTest').count()).toBe(dt.testColumnCount);
	// });

	// dt.html('basic');

	// it('A column of nodes can be returned', function() {
	// 	let table = $('#example').DataTable();
	// 	$(table.cells('*', 2).nodes()).addClass('myTest');
	// 	expect(table.cells('.myTest').count()).toBe(dt.testRowCount);
	// });

	// dt.html('basic');

	// it('All nodes can be returned', function() {
	// 	let table = $('#example').DataTable();
	// 	$(table.cells().nodes()).addClass('myTest');
	// 	expect(table.cells('.myTest').count()).toBe(dt.testRowCount * dt.testColumnCount);
	// });
});
