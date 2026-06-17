describe('nonjQuery - init', function () {
	dt.libs({
		js: ['datatables'],
		css: ['datatables']
	});

	it('Runs without jQuery', function () {
		expect(window.jQuery).toBeUndefined();
		expect(window.$).toBeUndefined();
		expect(DataTable.use('jq')).toBe(null);
	});

	dt.html('basic');
	it('No options', function () {
		let table = new DataTable('#example');
		expect(table.rows().count()).toBe(57);
		expect(DataTable.Dom.s('#example tbody tr').length).toBe(10);
	});

	dt.html('basic');
	it('Options', function () {
		let table = new DataTable('#example', {paging: false});
		expect(table.rows().count()).toBe(57);
		expect(DataTable.Dom.s('#example tbody tr').length).toBe(57);
	});
});
