// todo tests
// - Confirm it exists and is a function
// - Confirm it returns API instance
// - Select a single column and confirm that the data is returned for that column

describe('columns- column().data()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');

		it('Exists and is a function', function() {
			var table = $('#example').DataTable();
			expect(typeof table.column().data).toBe('function');
		});
		
		dt.html('basic');
		it('Returns an API instance', function() {
			var table = $('#example').DataTable();
			expect(table.column().data() instanceof $.fn.dataTable.Api).toBe(true);
		});
		
		dt.html('basic');
		it('Data is returned for selected column only.', function() {
			var table = $('#example').DataTable();
			var testData = table.column(0).data();
			expect(testData[0] == 'Airi Satou' && testData[10] == 'Charde Marshall').toBe(true);
		});
	});
});