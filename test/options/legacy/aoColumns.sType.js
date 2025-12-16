describe('Legacy aoColumns.sType option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	dt.html('basic');

	it('Set with legacy parameter', async function () {
		let table = new DataTable('#example', {
			aoColumnDefs: [{
				target: 1,
				sType: 'html'
			}]
		});

		expect(table.column(0).type()).toBe('string');
		expect(table.column(1).type()).toBe('html');
		expect(table.column(2).type()).toBe('string');
	});
});
