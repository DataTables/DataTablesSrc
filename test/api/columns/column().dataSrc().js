describe('columns- column().dataSrc()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			let table = $('#example').DataTable();
			expect(typeof table.column().dataSrc).toBe('function');
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Check all columns when array based', function() {
			let table = $('#example').DataTable();

			for (let i = 0; i < 6; i++) {
				expect(table.column(i).dataSrc()).toBe(i);
			}
		});

		dt.html('empty');
		it('Returns correct element when object based', function(done) {
			let columns = dt.getTestColumns();
			let table = $('#example').DataTable({
				ajax: '/base/test/data/data.txt',
				columns: columns,
				initComplete: function(settings, json) {
					for (let i = 0; i < 6; i++) {
						expect(table.column(i).dataSrc()).toBe(columns[i].data);
					}
					done();
				}
			});
		});

		dt.html('currency');
		it('Returns a function, when using a function set in columnDefs.data', function() {
			let count = 0;
			let dataSet = [[2016, 37], [2016, 27], [2016, 23], [2016, 19], [2016, 43], [2016, 76]];

			let table = $('#example').DataTable({
				data: dataSet,
				columnDefs: [
					{
						targets: 1,
						data: function() {
							return count++;
						}
					}
				]
			});
			expect(typeof table.column(1).dataSrc()).toBe('function');
		});

		dt.html('empty');
		it('When null data source', function(done) {
			let columns = dt.getTestColumns();
			columns[2].data = null;
			columns[2].defaultContent = 'unit test';

			let table = $('#example').DataTable({
				ajax: '/base/test/data/data.txt',
				columns: columns,
				initComplete: function(settings, json) {
					for (let i = 0; i < 6; i++) {
						expect(table.column(i).dataSrc()).toBe(columns[i].data);
					}
					done();
				}
			});
		});
	});
});
