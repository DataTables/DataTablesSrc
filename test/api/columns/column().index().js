describe('columns - column().index()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');

		it('Exists and is a function', function() {
			var table = $('#example').DataTable();
			expect(typeof table.column().index).toBe('function');
		});

		it('Returns an integer', function() {
			var table = $('#example').DataTable();
			expect(Number.isInteger(table.column().index())).toBe(true);
		});
	});

	describe('Check behaviour', function() {
		dt.html('basic');

		it('Returns column index (no hidden columns)', function() {
			var table = $('#example').DataTable();

			expect(table.column(1).index()).toBe(1);
			expect(table.column(1).index('data')).toBe(1);
			expect(table.column(1).index('visible')).toBe(1);
		});

		dt.html('basic');

		it('Correct column index before hidden columns', function() {
			var table = $('#example').DataTable();

			table.column(2).visible(false);

			expect(table.column(1).index()).toBe(1);
			expect(table.column(1).index('data')).toBe(1);
			expect(table.column(1).index('visible')).toBe(1);
		});

		dt.html('basic');

		it('Correct column index on hidden columns', function() {
			var table = $('#example').DataTable();

			table.column(1).visible(false);

			expect(table.column(1).index()).toBe(1);
			expect(table.column(1).index('data')).toBe(1);
			expect(table.column(1).index('visible')).toBe(null);
		});

		dt.html('basic');

		it('Correct column index after hidden columns', function() {
			var table = $('#example').DataTable();

			table.column(1).visible(false);

			expect(table.column(2).index()).toBe(2);
			expect(table.column(2).index('data')).toBe(2);
			expect(table.column(2).index('visible')).toBe(1);
		});
	});
});
