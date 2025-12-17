describe('language.searchRecords option ', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function () {
		dt.html('basic');

		it('Default value', function () {
			expect(DataTable.defaults.language.searchPlaceholder).toBe('');
		});


		it('Default value being used', function () {
			$('#example').dataTable();

			expect($('div.dt-search input').attr('placeholder')).toBe('');
		});

		dt.html('basic');

		it('Set searchPlaceholder- check option', function () {
			$('#example').dataTable({
				language: {
					searchPlaceholder: 'Search records'
				}
			});

			expect($('div.dt-search input').attr('placeholder')).toBe('Search records');
		});

		dt.html('basic');

		it('Set search input with no label- just the placeholder', function () {
			$('#example').dataTable({
				language: {
					search: '_INPUT_',
					searchPlaceholder: 'Search...'
				}
			});

			expect($('div.dt-search input').attr('placeholder')).toBe('Search...');
		});
	});
});
