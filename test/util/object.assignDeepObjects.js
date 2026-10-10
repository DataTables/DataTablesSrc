describe('util.object.assignDeepObjects', function () {
	dt.libs({
		js: ['datatables'],
		css: ['datatables']
	});

	dt.html('empty');

	it('No prototype pollution', function () {
		DataTable.util.object.assignDeepObjects({}, JSON.parse('{"__proto__":{"polluted":"YES"}}'));

		expect({}.polluted).toBe(undefined);
	});
});
