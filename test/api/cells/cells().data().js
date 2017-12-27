// todo tests
// - Confirm it exists and is a function
// - Getter:
//   - Ensure that the data from the cell is returned
//   - Use a renderer for a column, make sure that it is the data and not the rendered value that is returned
// Colin Setter
describe('cells- cells().data()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');

		it('Exists and is a function', function() {
			var table = $('#example').DataTable();
			expect(typeof table.cell().data).toBe('function');
		});
	});

	describe('Check the getter', function() {
		dt.html('basic');

		it('Basic check on a cell', function() {
			var table = $('#example').DataTable();
			expect(table.cell(2,0).data()).toBe('Ashton Cox');
		});
	});
});
