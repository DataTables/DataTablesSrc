describe('columns- column().data()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');

		it('Exists and is a function', function() {
			let table = $('#example').DataTable();
			expect(typeof table.column().data).toBe('function');
		});

		dt.html('basic');
		it('Returns an API instance', function() {
			let table = $('#example').DataTable();
			expect(table.column().data() instanceof $.fn.dataTable.Api).toBe(true);
		});

		dt.html('basic');
		it('Data is returned for selected column only.', function() {
			let table = $('#example').DataTable();
			let testData = table.column(0).data();

			expect(testData.count()).toBe(57);
			expect(testData[0]).toBe('Airi Satou');
			expect(testData[2]).toBe('Ashton Cox');
			expect(testData[56]).toBe('Zorita Serrano');
		});
	});
});
