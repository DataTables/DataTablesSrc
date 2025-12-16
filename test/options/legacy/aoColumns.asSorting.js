describe('Legacy aoColumns.asSorting option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	dt.html('basic');

	it('Set with legacy parameter', async function () {
		new DataTable('#example', {
			aoColumnDefs: [
				{
					target: 3,
					asSorting: ['asc', 'desc']
				}
			]
		});

		expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('33');
		await dt.clickHeader(3);
		expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('19');
		await dt.clickHeader(3);
		expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('66');
		await dt.clickHeader(3);
		expect($('#example tbody tr:eq(0) td:eq(3)').text()).toBe('19');
	});
});
