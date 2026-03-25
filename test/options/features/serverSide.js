describe('serverSide option', function () {
	function standardData(data, cb) {
		var out = [];

		for (
			let i = data.start, iLen = data.start + data.length;
			i < iLen;
			i++
		) {
			out.push({
				a: i + '-1',
				b: i + '-2',
				c: i + '-3',
				d: i + '-4',
				e: i + '-5',
				f: i + '-6'
			});
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
				},
				columns: [
					{ data: 'a' },
					{ data: 'b' },
					{ data: 'c' },
					{ data: 'd' },
					{ data: 'e' },
					{ data: 'f' }
				]
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
				},
				columns: [
					{ data: 'a' },
					{ data: 'b' },
					{ data: 'c' },
					{ data: 'd' },
					{ data: 'e' },
					{ data: 'f' }
				]
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
				},
				columns: [
					{ data: 'a' },
					{ data: 'b' },
					{ data: 'c' },
					{ data: 'd' },
					{ data: 'e' },
					{ data: 'f' }
				]
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
				},
				columns: [
					{ data: 'a' },
					{ data: 'b' },
					{ data: 'c' },
					{ data: 'd' },
					{ data: 'e' },
					{ data: 'f' }
				]
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
				},
				columns: [
					{ data: 'a' },
					{ data: 'b', searchable: false },
					{ data: 'c', orderable: false },
					{ data: 'd' },
					{ data: 'e' },
					{ data: 'f', name: 'isF' }
				]
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

		it('start parameter is 0', function (done) {
			test = data => {
				expect(data.start).toBe(0);
			};

			table
				.one('draw', () => {
					done();
				})
				.draw();
		});

		it('second page start parameter is 10', function (done) {
			test = data => {
				expect(data.start).toBe(10);
			};

			table
				.page('next')
				.one('draw', () => {
					done();
				})
				.draw(false);
		});

		it('third page start parameter is 20', function (done) {
			test = data => {
				expect(data.start).toBe(20);
			};

			table
				.page('next')
				.one('draw', () => {
					done();
				})
				.draw(false);
		});

		it('a full draw will set it back to 0', function (done) {
			test = data => {
				expect(data.start).toBe(0);
			};

			table
				.one('draw', () => {
					done();
				})
				.draw();
		});

		it('length parameter is 10', function (done) {
			test = data => {
				expect(data.length).toBe(10);
			};

			table
				.one('draw', () => {
					done();
				})
				.draw();
		});

		it('length parameter set to 25', function (done) {
			test = data => {
				expect(data.length).toBe(25);
			};

			table.page
				.len(25)
				.one('draw', () => {
					done();
				})
				.draw();
		});

		it('length parameter back to 10', function (done) {
			test = data => {
				expect(data.length).toBe(10);
			};

			table.page
				.len(10)
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

		it('fixed search is included', function (done) {
			test = data => {
				expect(data.search.fixed.length).toBe(1);
				expect(data.search.fixed[0].name).toBe('name');
				expect(data.search.fixed[0].term).toBe('test');
			};

			table.search
				.fixed('name', 'test')
				.one('draw', () => {
					done();
				})
				.draw();
		});

		it('second fixed search data is included', function (done) {
			test = data => {
				expect(data.search.fixed.length).toBe(2);
				expect(data.search.fixed[0].name).toBe('name');
				expect(data.search.fixed[0].term).toBe('test');
				expect(data.search.fixed[1].name).toBe('name2');
				expect(data.search.fixed[1].term).toBe('function');
			};

			table.search
				.fixed('name2', () => true)
				.one('draw', () => {
					done();
				})
				.draw();
		});

		it('remove fixed search', function (done) {
			test = data => {
				expect(data.search.fixed.length).toBe(0);
			};

			table.search
				.fixed('name', null)
				.search.fixed('name2', null)
				.one('draw', () => {
					done();
				})
				.draw();
		});

		it('order', function (done) {
			test = data => {
				expect(data.order).toEqual([
					{
						column: 0,
						dir: 'asc',
						name: ''
					}
				]);
			};

			table
				.one('draw', () => {
					done();
				})
				.draw();
		});

		it('order - different column', function (done) {
			test = data => {
				expect(data.order).toEqual([
					{
						column: 2,
						dir: 'desc',
						name: ''
					}
				]);
			};

			table
				.order([2, 'desc'])
				.one('draw', () => {
					done();
				})
				.draw();
		});

		it('order - multiple columns', function (done) {
			test = data => {
				expect(data.order).toEqual([
					{
						column: 1,
						dir: 'asc',
						name: ''
					},
					{
						column: 3,
						dir: 'desc',
						name: ''
					}
				]);
			};

			table
				.order([
					[1, 'asc'],
					[3, 'desc']
				])
				.one('draw', () => {
					done();
				})
				.draw();
		});

		it('column - data', function (done) {
			test = data => {
				expect(data.columns.length).toBe(6);
				expect(data.columns[0].data).toBe('a');
				expect(data.columns[1].data).toBe('b');
			};

			table
				.one('draw', () => {
					done();
				})
				.draw();
		});

		it('column - name', function (done) {
			test = data => {
				expect(data.columns[0].name).toBe('');
				expect(data.columns[1].name).toBe('');
				expect(data.columns[5].name).toBe('isF');
			};

			table
				.one('draw', () => {
					done();
				})
				.draw();
		});

		it('column - orderable', function (done) {
			test = data => {
				expect(data.columns[0].orderable).toBe(true);
				expect(data.columns[1].orderable).toBe(true);
				expect(data.columns[2].orderable).toBe(false);
			};

			table
				.one('draw', () => {
					done();
				})
				.draw();
		});

		it('column - searchable', function (done) {
			test = data => {
				expect(data.columns[0].searchable).toBe(true);
				expect(data.columns[1].searchable).toBe(false);
				expect(data.columns[2].searchable).toBe(true);
			};

			table
				.one('draw', () => {
					done();
				})
				.draw();
		});

		it('column - no search term', function (done) {
			test = data => {
				expect(data.columns[0].search.value).toBe('');
			};

			table
				.one('draw', () => {
					done();
				})
				.draw();
		});

		it('column - string search term', function (done) {
			test = data => {
				expect(data.columns[0].search.value).toBe('test');
			};

			table
				.column(0)
				.search('test')
				.one('draw', () => {
					done();
				})
				.draw();
		});

		it('column - multiple column search terms', function (done) {
			test = data => {
				expect(data.columns[0].search.value).toBe('test');
				expect(data.columns[1].search.value).toBe('');
				expect(data.columns[2].search.value).toBe('');
				expect(data.columns[3].search.value).toBe('T2');
			};

			table
				.column(3)
				.search('T2')
				.one('draw', () => {
					done();
				})
				.draw();
		});

		it('column - function search term', function (done) {
			test = data => {
				expect(data.columns[0].search.value).toBe('function');
				expect(data.columns[1].search.value).toBe('');
				expect(data.columns[2].search.value).toBe('');
				expect(data.columns[3].search.value).toBe('T2');
			};

			table
				.column(0)
				.search(() => true)
				.one('draw', () => {
					done();
				})
				.draw();
		});

		it('column - back to no searches', function (done) {
			test = data => {
				expect(data.columns[0].search.value).toBe('');
				expect(data.columns[1].search.value).toBe('');
				expect(data.columns[2].search.value).toBe('');
				expect(data.columns[3].search.value).toBe('');
			};

			table
				.column(0)
				.search('')
				.column(3)
				.search('')
				.one('draw', () => {
					done();
				})
				.draw();
		});

		it('column - no fixed search', function (done) {
			test = data => {
				expect(data.columns[0].search.fixed).toEqual([]);
				expect(data.columns[1].search.fixed).toEqual([]);
			};

			table
				.one('draw', () => {
					done();
				})
				.draw();
		});

		it('column - one column fixed search', function (done) {
			test = data => {
				expect(data.columns[0].search.fixed).toEqual([]);
				expect(data.columns[1].search.fixed).toEqual([
					{
						name: 'A',
						term: 'testA'
					}
				]);
			};

			table
				.column(1)
				.search.fixed('A', 'testA')
				.one('draw', () => {
					done();
				})
				.draw();
		});

		it('column - one column, two fixed searches', function (done) {
			test = data => {
				expect(data.columns[0].search.fixed).toEqual([]);
				expect(data.columns[1].search.fixed).toEqual([
					{
						name: 'A',
						term: 'testA'
					},
					{
						name: 'B',
						term: 'testB'
					}
				]);
			};

			table
				.column(1)
				.search.fixed('B', 'testB')
				.one('draw', () => {
					done();
				})
				.draw();
		});

		it('column - twos columns, fixed searches with function', function (done) {
			test = data => {
				expect(data.columns[0].search.fixed).toEqual([]);
				expect(data.columns[1].search.fixed).toEqual([
					{
						name: 'A',
						term: 'testA'
					},
					{
						name: 'B',
						term: 'testB'
					}
				]);
				expect(data.columns[4].search.fixed).toEqual([
					{
						name: 'C',
						term: 'function'
					}
				]);
			};

			table
				.column(4)
				.search.fixed('C', () => true)
				.one('draw', () => {
					done();
				})
				.draw();
		});

		it('column - twos columns, fixed searches with function', function (done) {
			test = data => {
				expect(data.columns[0].search.fixed).toEqual([]);
				expect(data.columns[1].search.fixed).toEqual([]);
				expect(data.columns[4].search.fixed).toEqual([]);
			};

			table
				.column(1)
				.search.fixed('A', null)
				.column(1)
				.search.fixed('B', null)
				.column(4)
				.search.fixed('C', null)
				.one('draw', () => {
					done();
				})
				.draw();
		});
	});
});
