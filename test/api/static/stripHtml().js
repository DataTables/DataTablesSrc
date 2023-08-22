describe('Static method - util.stripHtml()', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function () {
		it('Exists and is a function', function () {
			expect(typeof $.fn.dataTable.util.stripHtml).toBe('function');
			expect(typeof DataTable.util.stripHtml).toBe('function');
		});
	});

	describe('Functional tests', function () {
		it('Strips HTML', function () {
			let str = DataTable.util.stripHtml('<a href="...">Link</a>');

			expect(str).toBe('Link');
		});

		it('Two parts', function () {
			let str = DataTable.util.stripHtml('<a href="...">1</a> <i>2</i>');

			expect(str).toBe('1 2');
		});

		it('Incomplete script', function () {
			let str = DataTable.util.stripHtml('123 <script 456');

			expect(str).toBe('123  456');
		});
	});

	describe('Custom formatter tests', function () {
		it('Set a formatter', function () {
			let ret = DataTable.util.stripHtml(function (str) {
				return str.replace('test', 'TEST');
			});

			expect(ret).toBe(undefined);
		});

		it('Runs custom formatter', function () {
			let str = DataTable.util.stripHtml('<a href="...">test</a>');

			expect(str).toBe('<a href="...">TEST</a>');
		});
	});
});
