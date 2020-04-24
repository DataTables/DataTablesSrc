describe('core - events - preXhr', function() {
	// TK COLIN should look at doing serverSide tests here - as param[2] will contain stuff to test
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;
	let count = 0;
	let params;
	let firstCell;

	function checkResults(cnt, name) {
		expect(cnt).toBe(count);
		expect(name).toBe(firstCell);
		count = 0;
		firstCell = '';
	}

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Called before data loaded', function(done) {
			table = $('#example')
				.on('preXhr.dt', function() {
					count++;
					params = arguments;
					firstCell = $('tbody tr:eq(0) td:eq(0)').text();
				})
				.DataTable({
					columns: dt.getTestColumns(),
					ajax: '/base/test/data/data.txt',
					initComplete: function(settings, json) {
						checkResults(1, 'Loading...');
						done();
					}
				});
		});
		it('Called with expected parameters', function() {
			expect(params.length).toBe(3);
			expect(params[0] instanceof $.Event).toBe(true);
			expect(params[1]).toBe(table.settings()[0]);
			expect(params[2]).toEqual({});
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Not called when no Ajax', function() {
			table = $('#example')
				.on('preXhr.dt', function() {
					count++;
					firstCell = $('tbody tr:eq(0) td:eq(0)').text();
				})
				.DataTable();
			checkResults(0, '');
		});

		dt.html('empty');
		it('Load ajax data into an empty table', function(done) {
			count = 0;
			table = $('#example')
				.on('preXhr.dt', function() {
					count++;
					firstCell = $('tbody tr:eq(0) td:eq(0)').text();
				})
				.DataTable({
					columns: dt.getTestColumns(),
					ajax: '/base/test/data/data.txt',
					initComplete: function(settings, json) {
						checkResults(1, 'Loading...');
						done();
					}
				});
		});
		it('Called on ajax reload', function(done) {
			table.ajax.reload(function callback() {
				checkResults(1, 'Airi Satou');
				done();
			});
		});
	});
});
