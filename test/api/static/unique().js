describe('Static method - util.unique()', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function () {
		it('Exists and is a function', function () {
			expect(typeof $.fn.dataTable.util.unique).toBe('function');
			expect(typeof DataTable.util.unique).toBe('function');
		});
	});

	describe('Functional tests', function () {
		it('Numbers', function () {
			let arr = DataTable.util.unique([1, 1, 2, 3, 3]);

			expect(arr).toEqual([1, 2, 3]);
		});

		it('Strings', function () {
			let arr = DataTable.util.unique(['my', 'life', 'my', 'has']);

			expect(arr).toEqual(['my', 'life', 'has']);
		});

		it('Objects', function () {
			let o1 = {a:1};
			let o2 = {b:1};
			let o3 = {c:1};
			let arr = DataTable.util.unique([o1, o2, o1, o3]);

			expect(arr).toEqual([o1, o2, o3]);
		});

		it('Mixed', function () {
			let o1 = {a:1};
			let arr = DataTable.util.unique([o1, 1, 1, 'my', 1, o1, 'my', 'life']);

			expect(arr).toEqual([o1, 1, 'my', 'life']);
		});
	});
});
