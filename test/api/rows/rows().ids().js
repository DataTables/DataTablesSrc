describe('rows - row().id()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;
	let ids;

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			table = $('#example').DataTable();
			expect(typeof table.rows().ids).toBe('function');
		});
		it('Returns API instance', function() {
			expect(table.rows().ids() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('No ID set and no param', function() {
			table = $('#example').DataTable();
			ids = table.rows().ids();

			expect(ids.count()).toBe(57);
			expect(ids[0]).toBe('undefined');
		});
		it('No ID set and true param', function() {
			ids = table.rows().ids(true);
			expect(ids[0]).toBe('#undefined');
		});
		it('No ID set and false param', function() {
			ids = table.rows().ids(false);
			expect(ids[0]).toBe('undefined');
		});

		dt.html('empty');
		it('ID set and no param', function(done) {
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
				rowId: 'name',
				initComplete: function(settings, json) {
					ids = table.rows([0, 2]).ids();
					expect(ids.count()).toBe(2);
					expect(ids[0]).toBe('Tiger Nixon');
					done();
				}
			});
		});
		it('ID set and true param', function() {
			ids = table.rows([0, 2]).ids(true);
			expect(ids[0]).toBe('#Tiger Nixon');
		});
		it('ID set and false param', function() {
			ids = table.rows([0, 2]).ids(false);
			expect(ids[0]).toBe('Tiger Nixon');
		});
	});
});
