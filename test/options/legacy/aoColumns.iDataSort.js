describe('Legacy aoColumns.iDataSort option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

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
				iDataSort: 2
			}]
		});

		await dt.clickHeader(1);
		expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Tiger Nixon');
	});
});
