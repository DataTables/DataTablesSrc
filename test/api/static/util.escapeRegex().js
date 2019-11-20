describe('Static method - util.escapeRegex()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			expect(typeof $.fn.dataTable.util.escapeRegex).toBe('function');
		});
		it('Return value is correct', function() {
			expect(typeof $.fn.dataTable.util.escapeRegex('test')).toBe('string');
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('No regexes', function() {
			expect($.fn.dataTable.util.escapeRegex('test')).toBe('test');
		});
		it('Simple regexes', function() {
			expect($.fn.dataTable.util.escapeRegex('(test)')).toBe('\\(test\\)');
		});
		it('Complex regexes', function() {
			expect($.fn.dataTable.util.escapeRegex('.*[]')).toBe('\\.\\*\\[\\]');
		});
		it('Complexer regexes', function() {
			expect($.fn.dataTable.util.escapeRegex('([test].*)')).toBe('\\(\\[test\\]\\.\\*\\)');
		});
	});
});
