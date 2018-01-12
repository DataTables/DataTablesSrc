describe('rows - row().index()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');

		it('Exists and is a function', function() {
			var table = $('#example').DataTable();
			expect(typeof table.row().index).toBe('function');
		});

		it('Returns Integer instance', function() {
			var table = $('#example').DataTable();
			expect(Number.isInteger(table.row(0).index())).toBe(true);
		});
	});

	describe('Check behaviour', function() {
		dt.html('basic');

		it('Correct row index', function() {
			var table = $('#example').DataTable();
			expect(table.row(2).index()).toBe(2);
		});
	});
});
