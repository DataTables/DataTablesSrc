describe('Legacy aoColumns.sName option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	dt.html('basic');

	it('Set with legacy parameter', async function () {
		let table = new DataTable('#example', {
			aoColumns: [
				{ sName: 'name' },
				{ sName: 'position' },
				{ sName: 'office' },
				{ sName: 'age' },
				{ sName: 'startdate' },
				{ sName: 'salary' }
			]
		});
		expect(table.column('position:name').data()[0]).toBe('Accountant');
	});
});
