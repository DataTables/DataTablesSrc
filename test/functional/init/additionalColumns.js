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


	dt.html('empty');

	it('Ajax - DataTables can be initialised with an extra column', function(done) {
		new DataTable('#example', {
			columns: [
				{ data: 'name' },
				{ data: 'position' },
				{ data: 'office' },
				{ data: 'start_date' },
				{ data: 'salary' },
				{ data: 'age'},
				{ data: 'age', visible: false},
			],
			ajax: "/base/test/data/data.txt",
			columnDefs: [
			  {targets: '.id'}
			],
			initComplete: function () {
				// No JS errors occurred
				expect(true).toEqual(true);
				done();
			}
		});
	});

	it('Data as expected', function() {
		expect($('thead tr:first-child th:first-child').text()).toBe('Name');
		expect($('tbody tr:first-child td:first-child').text()).toBe('Airi Satou');
	});

	it('Last column not visible', function() {
		expect($('thead tr:first-child th').length).toBe(6);
		expect($('tbody tr:first-child td').length).toBe(6);
	});
});
