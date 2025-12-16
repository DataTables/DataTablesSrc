describe('Legacy aoColumns.mRender option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	dt.html('basic');

	it('Set with legacy parameter', function () {
		new DataTable('#example', {
			aoColumnDefs: [{
				target: 0,
				mRender: function (data) {
					return data + ' (TEST)';
				}
			}]
		});

		expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou (TEST)');
		expect($('#example tbody tr:eq(0) td:eq(1)').text()).toBe('Accountant');

		expect($('#example tbody tr:eq(1) td:eq(0)').text()).toBe('Angelica Ramos (TEST)');
		expect($('#example tbody tr:eq(1) td:eq(1)').text()).toBe('Chief Executive Officer (CEO)');
	});
});
