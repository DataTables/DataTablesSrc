describe('Static method - util.escapeHtml()', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function () {
		it('Exists and is a function', function () {
			expect(typeof $.fn.dataTable.util.escapeHtml).toBe('function');
			expect(typeof DataTable.util.escapeHtml).toBe('function');
		});
	});

	describe('Functional tests', function () {
		it('Encode HTML', function () {
			let str = DataTable.util.escapeHtml('<a href="...">Link</a>');

			expect(str).toBe('&lt;a href=&quot;...&quot;&gt;Link&lt;/a&gt;');
		});

		it('With script tag', function () {
			let str = DataTable.util.escapeHtml('<script>alert("Hi");</script>');

			expect(str).toBe('&lt;script&gt;alert(&quot;Hi&quot;);&lt;/script&gt;');
		});
	});

	describe('Custom formatter tests', function () {
		it('Set a formatter', function () {
			let ret = DataTable.util.escapeHtml(function (str) {
				return str.replace('test', 'TEST');
			});

			expect(ret).toBe(undefined);
		});

		it('Runs custom formatter', function () {
			let str = DataTable.util.escapeHtml('<a href="...">test</a>');

			expect(str).toBe('<a href="...">TEST</a>');
		});
	});
});
