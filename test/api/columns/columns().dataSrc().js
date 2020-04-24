describe('columns- columns().dataSrc()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			table = $('#example').DataTable();
			expect(typeof table.columns().dataSrc).toBe('function');
		});
		it('Returns an API instance', function() {
			expect(table.columns().dataSrc() instanceof $.fn.dataTable.Api).toBe(true);
		});
		it('Returns an API instance- 1 column selected', function() {
			expect(table.columns(1).dataSrc() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Functional tests', function() {
		let dataSet = [[2016, 37], [2016, 27], [2016, 23], [2016, 19], [2016, 43], [2016, 76]];

		dt.html('currency');
		it('If columns.data is not set it should return an integer (array based table)', function() {
			table = $('#example').DataTable({
				data: dataSet,
				columns: [{ title: 'Name' }, { title: 'Age' }]
			});
			expect(typeof table.columns().dataSrc()[0]).toBe('number');
		});

		dt.html('currency');
		it('Returns a function, when using a function set in columnDefs.data', function() {
			var count = 0;
			table = $('#example').DataTable({
				data: dataSet,
				columnDefs: [
					{
						targets: 1,
						data: function(row, type, val, meta) {
							return ++count;
						}
					}
				]
			});
			expect(typeof table.columns(1).dataSrc()[0]).toBe('function');
		});

		dt.html('empty');
		it('Returns string when using string in column (object based table)', function(done) {
			var table = $('#example').DataTable({
				ajax: '/base/test/data/data.txt',
				columns: [
					{ data: 'name' },
					{ data: 'position' },
					{ data: 'office' },
					{ data: 'age' },
					{ data: 'start_date' },
					{ data: 'salary' }
				],
				initComplete: function(settings, json) {
					var result = table.columns([1, 3]).dataSrc();
					expect(result[0]).toBe('position');
					expect(result[1]).toBe('age');
					done();
				}
			});
		});
	});
});
