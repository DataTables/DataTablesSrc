describe('ajax option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;

	describe('Functional tests', function() {
		dt.html('empty');
		it('String to file', function(done) {
			table = $('#example').DataTable({
				ajax: '/base/test/data/data.txt',
				columns: [
					{ data: 'name' },
					{ data: 'position' },
					{ data: 'office' },
					{ data: 'age' },
					{ data: 'start_date' },
					{ data: 'salary' }
				],
				initComplete: function() {
					expect($('tbody tr:eq(2) td:eq(0)').text()).toBe('Ashton Cox');
					done();
				}
			});
		});

		dt.html('empty');
		it('Object', function(done) {
			table = $('#example').DataTable({
				ajax: {
					url: '/base/test/data/data.txt'
				},
				columns: [
					{ data: 'name' },
					{ data: 'position' },
					{ data: 'office' },
					{ data: 'age' },
					{ data: 'start_date' },
					{ data: 'salary' }
				],
				initComplete: function() {
					expect($('tbody tr:eq(2) td:eq(0)').text()).toBe('Ashton Cox');
					done();
				}
			});
		});

		dt.html('empty');
		it('Function', function(done) {
			table = $('#example').DataTable({
				ajax: function(data, callback, settings) {
					var out = [];

					for (let i = 0; i < 57; i++) {
						out.push([i + '-1', i + '-2', i + '-3', i + '-4', i + '-5', i + '-6']);
					}

					setTimeout(function() {
						callback({
							data: out
						});
					}, 50);
				},
				initComplete: function(setting, json) {
					expect($('tbody tr:eq(2) td:eq(0)').text()).toBe('10-1');
					expect(table.page.info().recordsTotal).toBe(57);
					done();
				}
			});
		});
	});
});
