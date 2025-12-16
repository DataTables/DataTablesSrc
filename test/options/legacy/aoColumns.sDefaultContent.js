describe('Legacy aoColumns.sDefaultContent option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	dt.html('basic');

	it('Set with legacy parameter', async function () {
		new DataTable('#example', {
			aoColumns: [
				null,
				{
					mData: null,
					sDefaultContent: '<button>Not set</button>'
				},
				null,
				null,
				null,
				null
			]
		});

		expect($('#example tbody button').length).toBe(10);
		expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		expect($('#example tbody tr:eq(0) td:eq(1) button').text()).toBe('Not set');
	});
});
