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

			expect($('.dt-paging-button.next').attr('aria-label')).toBe('Next');
			expect($('.dt-paging-button.previous').attr('aria-label')).toBe('Previous');
			expect($('.dt-paging-button.first').attr('aria-label')).toBe('First');
			expect($('.dt-paging-button.last').attr('aria-label')).toBe('Last');
			expect($('.dt-paging-button[data-dt-idx=0]').attr('aria-label')).toBeUndefined();
			expect($('.dt-paging-button[data-dt-idx=1]').attr('aria-label')).toBeUndefined();
		});

		dt.html('basic');
		it('Pagination number aria label', function() {
			$('#example').DataTable({
				language: {
					aria: {
						paginate: {
							number: 'Jump to page: '
						}
					}
				}
			});

			expect($('.dt-paging-button.next').attr('aria-label')).toBe('Next');
			expect($('.dt-paging-button.previous').attr('aria-label')).toBe('Previous');
			expect($('.dt-paging-button.first').attr('aria-label')).toBe('First');
			expect($('.dt-paging-button.last').attr('aria-label')).toBe('Last');
			expect($('.dt-paging-button[data-dt-idx=0]').attr('aria-label')).toBe('Jump to page: 1');
			expect($('.dt-paging-button[data-dt-idx=1]').attr('aria-label')).toBe('Jump to page: 2');
		});

		dt.html('basic');
		it('Language aria orderable', async function() {
			$('#example').DataTable({
				language: {
					aria: {
						orderable: 'ORDER-DO',
						orderableReverse: 'ORDER-REVERSE',
						orderableRemove: 'ORDER-REMOVE',
					}
				}
			});

			expect($('#example thead th span:last-child').eq(0).attr('aria-label')).toBe('NameORDER-REVERSE');
			expect($('#example thead th span:last-child').eq(1).attr('aria-label')).toBe('PositionORDER-DO');
		});

		it('Language aria orderable remove', async function() {
			await dt.clickHeader(0);
			expect($('#example thead th span:last-child').eq(0).attr('aria-label')).toBe('NameORDER-REMOVE');
			expect($('#example thead th span:last-child').eq(1).attr('aria-label')).toBe('PositionORDER-DO');
		});

		it('Language aria orderable reassign', async function() {
			await dt.clickHeader(0);
			expect($('#example thead th span:last-child').eq(0).attr('aria-label')).toBe('NameORDER-DO');
			expect($('#example thead th span:last-child').eq(1).attr('aria-label')).toBe('PositionORDER-DO');
		});

		it('Language aria orderable and ordered again', async function() {
			await dt.clickHeader(0);
			expect($('#example thead th span:last-child').eq(0).attr('aria-label')).toBe('NameORDER-REVERSE');
			expect($('#example thead th span:last-child').eq(1).attr('aria-label')).toBe('PositionORDER-DO');
		});
	});
});
