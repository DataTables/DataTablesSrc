describe('language.aria option ', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Can we set pagination aria controls different from normal paginate', function() {
			$('#example').DataTable({
				pagingType: 'full',
				language: {
					paginate: {
						first: '«',
						previous: '‹',
						next: '›',
						last: '»'
					},
					aria: {
						paginate: {
							first: 'First',
							previous: 'Previous',
							next: 'Next',
							last: 'Last'
						}
					}
				}
			});

			expect($('.paginate_button.next').attr('aria-label')).toBe('Next');
			expect($('.paginate_button.previous').attr('aria-label')).toBe('Previous');
			expect($('.paginate_button.first').attr('aria-label')).toBe('First');
			expect($('.paginate_button.last').attr('aria-label')).toBe('Last');
		});

		dt.html('basic');
		it('Language aria sortAsc', function() {
			$('#example').DataTable({
				pagingType: 'full',
				language: {
					aria: {
						sortAscending: 'test case'
					}
				}
			});
			$('#example thead th:eq(0)').click();
			expect($('#example thead th:eq(0)').attr('aria-label')).toBe('Nametest case');
		});
		dt.html('basic');
		it('Language Aria sortDesc', function() {
			$('#example').DataTable({
				pagingType: 'full',
				language: {
					aria: {
						sortDescending: 'test case1'
					}
				}
			});

			expect($('#example thead th:eq(0)').attr('aria-label')).toBe('Nametest case1');
		});
	});
});
