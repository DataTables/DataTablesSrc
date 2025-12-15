describe('Legacy aoSearchCols option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check Default', function () {
		dt.html('basic');

		it('Set with legacy parameter', function () {
			let table = new DataTable('#example', {
				aoSearchCols: [null, { sSearch: 'Accountant' }, null, null, null, null]
			});

			expect(table.page.info().recordsDisplay).toBe(2);
		});
	});
});
