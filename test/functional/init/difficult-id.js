describe('Awkward id', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	dt.html('basic');

	// https://datatables.net/forums/discussion/78620
	it('DataTables can be initialised on an element with id characters that would normally be escaped', function() {
		var table = document.getElementById('example');

		table.id = 'concert:307.+media';

		new DataTable(table);

		// No JS errors occurred
		expect(true).toEqual(true);
		expect($('tbody td').eq(0).text()).toEqual('Airi Satou');
	});
});
