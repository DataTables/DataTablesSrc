describe('Empty DataTable', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	dt.html('basic');

	it('DataTables can be initialised with an extra column', function() {
		new DataTable('#example', {
			columns: [
				null,
				null,
				null,
				null,
				null,
				null,
				{ title: 'Title', defaultContent: 'Content' }
			]
		});

		// No JS errors occurred
		expect(true).toEqual(true);
	});

	it('Last title contains set title', function() {
		expect($('thead tr:first-child th:last-child').text()).toBe('Title');
	});

	it('Last column contains default content', function() {
		expect($('tbody tr:first-child td:last-child').text()).toBe('Content');
	});

	it('And first column is as expected', function() {
		expect($('thead tr:first-child th:first-child').text()).toBe('Name');
		expect($('tbody tr:first-child td:first-child').text()).toBe('Airi Satou');
	});
});
