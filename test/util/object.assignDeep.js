describe('util.object.assignDeep', function () {
	dt.libs({
		js: ['datatables'],
		css: ['datatables']
	});

	dt.html('empty');

	it('No prototype pollution', function () {
		DataTable.util.object.assignDeep({}, JSON.parse('{"__proto__":{"polluted":"YES"}}'));

		expect({}.polluted).toBe(undefined);
	});
});
