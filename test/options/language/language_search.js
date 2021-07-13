describe('language.search option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;

	describe('Check the defaults', function() {
		dt.html('basic');
		it("Search language is 'Search:' by default ", function() {
			table = $('#example').DataTable();
			expect(table.settings()[0].oLanguage.sSearch).toBe('Search:');
		});
		it('A label input is used', function() {
			expect($('label', table.settings()[0].aanFeatures.f[0]).length).toBe(1);
		});
		it('Search language default is in the DOM', function() {
			expect($('label', table.settings()[0].aanFeatures.f[0]).text()).toBe('Search:');
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Search language can be defined', function() {
			table = $('#example').DataTable({
				language: {
					search: 'unit test'
				}
			});
			expect($('div.dataTables_filter').text()).toBe('unit test');
		});

		dt.html('basic');
		it('Blank search has no (separator) inserted', function() {
			$('#example').dataTable({
				language: {
					search: ''
				}
			});
			expect($('div.dataTables_filter').text()).toBe('');
		});
	});
});
