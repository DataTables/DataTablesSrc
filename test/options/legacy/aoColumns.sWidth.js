describe('Legacy aoColumns.sWidth option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	dt.html('basic');

	it('Set with legacy parameter', function () {
		new DataTable('#example', {
			autoWidth: false,
			aoColumns: [null, { sWidth: '40%' }, null, null, null, null]
		});
		expect($('#example colgroup col')[1].style.width).toBe('40%');
	});
});
