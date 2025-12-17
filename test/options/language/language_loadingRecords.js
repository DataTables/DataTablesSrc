describe('language.loadingRecords option ', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function () {
		dt.html('empty');

		it("Default is 'No data available in table' ", function () {
			expect(DataTable.defaults.language.loadingRecords).toBe('Loading...');
		});
	});
});
