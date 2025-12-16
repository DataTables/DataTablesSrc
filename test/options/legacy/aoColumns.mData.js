describe('Legacy aoColumns.mData option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	dt.html('basic');

	it('Set with legacy parameter', function () {
		new DataTable('#example', {
			aoColumnDefs: [{
				target: 0,
				mData: 1
			}]
		});

		expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Accountant');
		expect($('#example tbody tr:eq(0) td:eq(1)').text()).toBe('Accountant');
		expect($('#example tbody tr:eq(0) td:eq(2)').text()).toBe('Tokyo');
	});

	// data / mData has lots more options, but this is just to prove that it can
	// be set by mData, not to check all functionality (which is done elsewhere)
});
