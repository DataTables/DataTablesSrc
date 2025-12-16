describe('Legacy aoColumns.sTitle option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	dt.html('basic');

	it('Set with legacy parameter', async function () {
		let table = new DataTable('#example', {
			aoColumns: [null, { sTitle: 'unit test' }, null, null, null, null]
		});

		let nNodes = $('#example thead th');

		expect(nNodes[0].textContent).toBe('Name');
		expect(nNodes[1].textContent).toBe('unit test');
		expect(nNodes[2].textContent).toBe('Office');
		expect(nNodes[3].textContent).toBe('Age');
		expect(nNodes[4].textContent).toBe('Start date');
		expect(nNodes[5].textContent).toBe('Salary');
	});
});
