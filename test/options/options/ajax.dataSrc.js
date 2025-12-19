
// These tests only testing the loading of data, not the functionality
// once it has been loaded.
describe('ajax.dataSrc option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;

	describe('Functional tests', function() {
		dt.html('empty');

		it('Flat array', function(done) {
			table = $('#example').DataTable({
				ajax: {
					url: '/base/test/data/flat.txt',
					dataSrc: ''
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
					expect($('tbody tr:first-child td:first-child').text()).toBe('Airi Satou');
					done();
				}
			});
		});

		dt.html('empty');

		it('Function', function(done) {
			table = $('#example').DataTable({
				ajax: {
					url: '/base/test/data/data.txt',
					dataSrc: function (json) {
						return json.data;
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
					expect($('tbody tr:first-child td:first-child').text()).toBe('Airi Satou');
					done();
				}
			});
		});

		dt.html('empty');

		it('Object - string', function(done) {
			table = $('#example').DataTable({
				ajax: {
					url: '/base/test/data/flat.txt',
					dataSrc: {
						data: ''
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
					expect($('tbody tr:first-child td:first-child').text()).toBe('Airi Satou');
					done();
				}
			});
		});

		dt.html('empty');

		it('Object - function', function(done) {
			table = $('#example').DataTable({
				ajax: {
					url: '/base/test/data/data.txt',
					dataSrc: {
						data: function (json) {
							return json.data;
						}
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
					expect($('tbody tr:first-child td:first-child').text()).toBe('Airi Satou');
					done();
				}
			});
		});

		dt.html('empty');

		it('Object - SSP mapping - strings', function(done) {
			table = $('#example').DataTable({
				ajax: {
					url: '/base/test/data/ssp.txt',
					dataSrc: {
						data: 'records',
						draw: 'cnt',
						recordsTotal: 'total',
						recordsFiltered: 'filtered'
					}
				},
				serverSide: true,
				columns: [
					{ data: 'name' },
					{ data: 'position' },
					{ data: 'office' },
					{ data: 'age' },
					{ data: 'start_date' },
					{ data: 'salary' }
				],
				initComplete: function() {
					expect($('tbody tr:first-child td:first-child').text()).toBe('Ashton Cox');
					done();
				}
			});
		});

		dt.html('empty');

		it('Object - SSP mapping - functions', function(done) {
			table = $('#example').DataTable({
				ajax: {
					url: '/base/test/data/ssp.txt',
					dataSrc: {
						data: function (json) {
							return json.records;
						},
						draw: function (json) {
							return json.cnt;
						},
						recordsTotal: function (json) {
							return json.total;
						},
						recordsFiltered: function (json) {
							return json.filtered;
						}
					}
				},
				serverSide: true,
				columns: [
					{ data: 'name' },
					{ data: 'position' },
					{ data: 'office' },
					{ data: 'age' },
					{ data: 'start_date' },
					{ data: 'salary' }
				],
				initComplete: function() {
					expect($('tbody tr:first-child td:first-child').text()).toBe('Ashton Cox');
					done();
				}
			});
		});
	});
});
