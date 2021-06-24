describe('nonjQuery - ajax', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	dt.html('basic');
	it('No options', function (done) {
		let table = new DataTable('#example', {
			ajax: function(d, cb) {
				fetch('/base/test/data/data.txt')
				.then(response => response.json())
                .then(data => cb(data));
			},
			columns: [
				{data: 'name'},
				{data: 'position'},
				{data: 'office'},
				{data: 'age'},
				{data: 'start_date'},
				{data: 'salary'}
			],
			initComplete: function() {
				expect(table.rows().count()).toBe(57);
				expect($('tbody tr').length).toBe(10);
				done();
			}
		});
	});

	dt.html('basic');
	it('No options', function (done) {
		let table = new DataTable('#example', {
			ajax: function(d, cb) {
				fetch('/base/test/data/data.txt')
				.then(response => response.json())
                .then(data => cb(data));
			},
			columns: [
				{data: 'name'},
				{data: 'position'},
				{data: 'office'},
				{data: 'age'},
				{data: 'start_date'},
				{data: 'salary'}
			],
			paging: false,
			initComplete: function() {
				expect(table.rows().count()).toBe(57);
				expect($('tbody tr').length).toBe(57);
				done();
			}
		});
	});
});
