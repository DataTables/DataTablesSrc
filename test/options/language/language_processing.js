describe('language.processing option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');

		it("Processing language is empty by default ", function() {
			$('#example').dataTable({
				processing: true
			});
			expect(
				$('#example')
					.DataTable()
					.settings()[0].oLanguage.sProcessing
			).toBe('');
		});

		it('Processing language default is in the DOM ', function() {
			expect($('div.dataTables_processing').text()).toBe('');
		});

		dt.html('basic');

		it('Processing language can be defined', function() {
			$('#example').dataTable({
				processing: true,
				language: {
					processing: 'unit test'
				}
			});
			expect(
				$('#example')
					.DataTable()
					.settings()[0].oLanguage.sProcessing
			).toBe('unit test');
		});

		it('Processing language definition is in the DOM', function() {
			expect($('div.dataTables_processing').text()).toBe('unit test');
		});
	});
});
