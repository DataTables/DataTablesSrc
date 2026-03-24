describe('serverSide option', function () {
	function standardData(data, cb) {
		var out = [];

		for (
			let i = data.start, iLen = data.start + data.length;
			i < iLen;
			i++
		) {
			out.push([
				i + '-1',
				i + '-2',
				i + '-3',
				i + '-4',
				i + '-5',
				i + '-6'
			]);
		}

		setTimeout(function () {
			cb({
				draw: data.draw,
				data: out,
				recordsTotal: 5000,
				recordsFiltered: 5000
			});
		}, 50);
	}

	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check Default', function () {
		dt.html('basic');

		it('serverSide disabled by default', function () {
			$('#example').dataTable();
			expect(DataTable.defaults.serverSide).toBe(false);
		});
	});

	describe('Functional tests', function () {
		dt.html('basic');

		it('Server-side processing enabled', function (done) {
			let table = $('#example').DataTable({
				processing: true,
				serverSide: true,
				ajax: function (data, callback, settings) {
					standardData(data, callback);
				},
				initComplete: function (setting, json) {
					expect(table.page.info().recordsTotal).toBe(5000);
					done();
				}
			});
		});

		dt.html('basic');

		it('Server-side processing disabled', function (done) {
			let table = $('#example').DataTable({
				processing: true,
				serverSide: false,
				ajax: function (data, callback, settings) {
					standardData(data, callback);
				},
				initComplete: function (setting, json) {
					expect(table.page.info().recordsTotal).toBe(0);
					done();
				}
			});
		});

		dt.html('empty');

		it('Empty record set - loading message', function (done) {
			$('#example').DataTable({
				ajax: function (data, cb) {
					setTimeout(function () {
						cb({
							draw: data.draw,
							recordsTotal: 0,
							recordsFiltered: 0,
							data: []
						});
					}, 100);
				},
				processing: true,
				serverSide: true,
				initComplete: function (setting, json) {
					setTimeout(function () {
						// Then no data
						expect($('tbody').text()).toBe(
							'No data available in table'
						);
						done();
					}, 100);
				}
			});

			// Loading initially
			expect($('tbody').text()).toBe('Loading...');
		});

		dt.html('empty');

		it('API with removed rows', function (done) {
			var table = $('#example').DataTable({
				ajax: function (data, callback) {
					setTimeout(function () {
						standardData(data, callback);
					}, 100);
				},
				processing: true,
				serverSide: true,
				initComplete: function (setting, json) {
					table.row(1).remove();

					table.rows().every(function () {
						expect(this.child.isShown()).toBe(false);
					});

					done();
				}
			});
		});
	});

	describe('Parameter tests', function () {
		let answer;
		let test = function () {};
		let table;

		dt.html('basic');

		it('draw parameter is 1 on first run', function (done) {
			test = data => {
				expect(data.draw).toBe(1);
			};

			table = $('#example').DataTable({
				ajax: function (data, callback) {
					test(data);
					standardData(data, callback);
				},
				processing: true,
				serverSide: true,
				initComplete: function (setting, json) {
					done();
				}
			});
		});

		it('draw parameter is 2 on second run', function (done) {
			test = data => {
				expect(data.draw).toBe(2);
			};

			table
				.one('draw', () => {
					done();
				})
				.draw();
		});

		it('draw parameter is 3 on third run', function (done) {
			test = data => {
				expect(data.draw).toBe(3);
			};

			table
				.one('draw', () => {
					done();
				})
				.draw();
		});

		it('search parameter is empty', function (done) {
			test = data => {
				expect(data.search.value).toBe('');
			};

			table
				.one('draw', () => {
					done();
				})
				.draw();
		});

		it('search parameter passed', function (done) {
			test = data => {
				expect(data.search.value).toBe('test');
			};

			table
				.search('test')
				.one('draw', () => {
					done();
				})
				.draw();
		});

		it('search as a function is given as function', function (done) {
			test = data => {
				expect(data.search.value).toBe('function');
			};

			table
				.search(() => true)
				.one('draw', () => {
					done();
				})
				.draw();
		});

		it('revert search back to an empty string', function (done) {
			test = data => {
				expect(data.search.value).toBe('');
			};

			table
				.search('')
				.one('draw', () => {
					done();
				})
				.draw();
		});
	});
});
