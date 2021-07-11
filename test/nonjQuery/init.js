describe('nonjQuery - init', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	dt.html('basic');
	it('No options', function () {
		let table = new DataTable('#example');
		expect(table.rows().count()).toBe(57);
		expect($('tbody tr').length).toBe(10);
	});

	dt.html('basic');
	it('Options', function () {
		let table = new DataTable('#example', {paging: false});
		expect(table.rows().count()).toBe(57);
		expect($('tbody tr').length).toBe(57);
	});
});
