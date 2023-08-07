describe('DOM option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Legacy dom option', function() {
		dt.html('basic');
		it('Is undefined', function() {
			expect(DataTable.defaults.dom).toBeUndefined();
		});
	});
});
