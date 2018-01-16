describe('cells - cell().index()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');

		it('Exists and is a function', function() {
			var table = $('#example').DataTable();
			expect(typeof table.cell().index).toBe('function');
		});

		it('Returns an object of Object type containing three integers', function() {
			var table = $('#example').DataTable();
			var index = table.cell().index();

			expect(typeof index).toBe('object');
			expect(Object.keys(index).length).toBe(3);
			expect(Number.isInteger(index.row)).toBe(true);
			expect(Number.isInteger(index.column)).toBe(true);
			expect(Number.isInteger(index.columnVisible)).toBe(true);
		});
	});

	describe('Returns correct information for hidden columns', function() {
		dt.html('basic');

		it('Returns correct information before hidden column', function() {
			var table = $('#example').DataTable();

			table.column(1).visible(false);

			var index = table.cell(0, 0).index();

			expect(index.row).toBe(0);
			expect(index.column).toBe(0);
			expect(index.columnVisible).toBe(0);
		});

		dt.html('basic');

		it('Returns correct information for hidden column', function() {
			var table = $('#example').DataTable();

			table.column(1).visible(false);

			var index = table.cell(0, 1).index();

			expect(index.row).toBe(0);
			expect(index.column).toBe(1);
			expect(index.columnVisible).toBe(null);
		});

		dt.html('basic');

		it('Returns correct information after hidden column', function() {
			var table = $('#example').DataTable();

			table.column(1).visible(false);

			var index = table.cell(0, 2).index();

			expect(index.row).toBe(0);
			expect(index.column).toBe(2);
			expect(index.columnVisible).toBe(1);
		});
	});
});
