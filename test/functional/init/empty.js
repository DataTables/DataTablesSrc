describe('Empty DataTable', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	dt.html('no-columns');

	it('DataTables can be initialised without anything in the columns', function() {
		$('#test').DataTable();

		// No JS errors occurred
		expect(true).toEqual(true);
	});
});
