describe('Static method - util.diacritics()', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function () {
		it('Exists and is a function', function () {
			expect(typeof $.fn.dataTable.util.diacritics).toBe('function');
			expect(typeof DataTable.util.diacritics).toBe('function');
		});
	});

	describe('Functional tests', function () {
		it('Removes diacritics', function () {
			let str = DataTable.util.diacritics('Crème Brulée');

			expect(str).toBe('Creme Brulee');
		});

		it('Can append', function () {
			let str = DataTable.util.diacritics('Crème Brulée', true);

			expect(str).toBe('Crème Brulée Creme Brulee');
		});
	});

	describe('Custom formatter tests', function () {
		it('Set a formatter', function () {
			let ret = DataTable.util.diacritics(function (str, append) {
				return str.toLowerCase();
			});

			expect(ret).toBe(undefined);
		});

		it('Runs custom formatter', function () {
			let str = DataTable.util.diacritics('Crème Brulée');

			expect(str).toBe('crème brulée');
		});
	});
});
