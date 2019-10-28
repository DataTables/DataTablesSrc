describe('rows - row().id()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			table = $('#example').DataTable();
			expect(typeof table.row().id).toBe('function');
		});
		it('Returns string', function() {
			expect(typeof table.row().id()).toBe('string');
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('No ID set and no param', function() {
			table = $('#example').DataTable();
			expect(table.row(0).id()).toBe('undefined');
		});
		it('No ID set and true param', function() {
			expect(table.row(0).id(true)).toBe('#undefined');
		});
		it('No ID set and false param', function() {
			expect(table.row(0).id(false)).toBe('undefined');
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
					expect(table.row(0).id()).toBe('Tiger Nixon');
					done();
				}
			});
		});
		it('ID set and true param', function() {
			expect(table.row(0).id(true)).toBe('#Tiger Nixon');
		});
		it('ID set and false param', function() {
			expect(table.row(0).id(false)).toBe('Tiger Nixon');
		});
	});
});
