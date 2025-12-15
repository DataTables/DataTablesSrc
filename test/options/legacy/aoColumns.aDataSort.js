describe('Legacy aoColumns.aDataSort option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check Default', function () {
		dt.html('basic');

		it('Column index by default', async function () {
			new DataTable('#example');
			
			await dt.clickHeader(1);
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Garrett Winters');
		});

		dt.html('basic');

		it('Set with legacy parameter', async function () {
			new DataTable('#example', {
				aoColumnDefs: [{
					target: 1,
					aDataSort: [2, 0]
				}]
			});

			await dt.clickHeader(1);
			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Cedric Kelly');
		});
	});
});
