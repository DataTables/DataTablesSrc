describe('Legacy aoColumns.bVisible option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	dt.html('basic');

	it('Set with legacy parameter', async function () {
		new DataTable('#example', {
			aoColumnDefs: [{
				target: 1,
				bVisible: false
			}]
		});

		expect($('#example thead tr:eq(0) th').length).toBe(5);
		expect($('#example thead tr:eq(0) th:eq(0)').text()).toBe('Name');
		expect($('#example thead tr:eq(0) th:eq(1)').text()).toBe('Office');
		expect($('#example thead tr:eq(0) th:eq(2)').text()).toBe('Age');
		expect($('#example thead tr:eq(0) th:eq(3)').text()).toBe('Start date');
		expect($('#example thead tr:eq(0) th:eq(4)').text()).toBe('Salary');
	});
});
