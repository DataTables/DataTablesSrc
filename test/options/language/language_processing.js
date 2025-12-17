describe('language.processing option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');

		it('Default value', function () {
			expect(DataTable.defaults.language.processing).toBe('');
		});

		it("Processing language is empty by default ", function() {
			$('#example').dataTable({
				processing: true
			});

			expect($('div.dt-processing').text()).toBe('');
		});

		dt.html('basic');

		it('Processing language can be defined', function() {
			$('#example').dataTable({
				processing: true,
				language: {
					processing: 'unit test'
				}
			});

			expect($('div.dt-processing').text()).toBe('unit test');
		});
	});
});
