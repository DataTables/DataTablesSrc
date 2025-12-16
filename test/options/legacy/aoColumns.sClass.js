describe('Legacy aoColumns.sClass option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	dt.html('basic');

	it('Set with legacy parameter', async function () {
		new DataTable('#example', {
			aoColumnDefs: [{
				target: 1,
				sClass: 'test'
			}]
		});

		expect($('#example tbody tr:eq(0) td:eq(0)').hasClass('test')).toBe(false);
		expect($('#example tbody tr:eq(0) td:eq(1)').hasClass('test')).toBe(true);
		expect($('#example tbody tr:eq(0) td:eq(2)').hasClass('test')).toBe(false);

		expect($('#example tbody tr:eq(1) td:eq(0)').hasClass('test')).toBe(false);
		expect($('#example tbody tr:eq(1) td:eq(1)').hasClass('test')).toBe(true);
		expect($('#example tbody tr:eq(1) td:eq(2)').hasClass('test')).toBe(false);
	});
});
