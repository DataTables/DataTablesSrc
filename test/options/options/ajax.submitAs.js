
// These tests only testing the loading of data, not the functionality
// once it has been loaded.
describe('ajax.submitAs option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;

	describe('Functional tests', function() {
		dt.html('empty');

		it('Default - http parameters', function(done) {
			let data;

			table = $('#example').DataTable({
				ajax: {
					url: '/base/test/data/flat.txt',
					dataSrc: '',
					data: {
						testA: 1,
						testB: 2
					},
					type: 'POST',
					beforeSend: function () {
						data = this.data;
					}
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
					expect(typeof data).toBe('string');
					expect(data).toBe('testA=1&testB=2');

					done();
				}
			});
		});

		dt.html('empty');

		it('json data', function(done) {
			let data;

			table = $('#example').DataTable({
				ajax: {
					url: '/base/test/data/flat.txt',
					dataSrc: '',
					data: {
						testA: 1,
						testB: 2
					},
					type: 'POST',
					submitAs: 'json',
					beforeSend: function () {
						data = this.data;
					}
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
					expect(typeof data).toBe('string');
					expect(data).toBe('{"testA":1,"testB":2}');

					done();
				}
			});
		});
	});
});
