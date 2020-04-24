describe('Static method - versionCheck()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			expect(typeof $.fn.dataTable.versionCheck).toBe('function');
		});
		it('Returns a boolean', function() {
			expect(typeof $.fn.dataTable.versionCheck('1.0.0')).toBe('boolean');
		});
	});

	describe('Functional tests', function() {
		dt.html('two_tables');
		it('Check a recent version - true', function() {
			expect($.fn.dataTable.versionCheck('1.10.10')).toBe(true);
		});
		it('Check a future version - false', function() {
			expect($.fn.dataTable.versionCheck('100.10.10')).toBe(false);
		});
	});
});
