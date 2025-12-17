describe('language.emptyTable option ', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function () {
		dt.html('empty');

		it("Default value", function () {
			expect(DataTable.defaults.language.emptyTable).toBe('No data available in table');
		});

		it("Default is used", function () {
			$('#example').dataTable();

			expect($('#example > tbody > tr > td').html()).toBe('No data available in table');
		});
		
		dt.html('empty');
		
		it('Can we change the value of emptyTable- check option', function () {
			$('#example').dataTable({
				language: {
					emptyTable: 'test case'
				}
			});

			expect($('#example > tbody > tr > td').html()).toBe('test case');
		});
	});
});
