describe('core - ajax', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	dt.html('basic');
	it('Enure namespace object exists on the API instance', function() {
		expect(typeof $('#example').DataTable().ajax).toBe('object');
	});
});
