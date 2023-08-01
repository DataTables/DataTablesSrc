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

			expect($('#example thead th').eq(0).attr('aria-label')).toBe('NameORDER-REVERSE');
			expect($('#example thead th').eq(1).attr('aria-label')).toBe('PositionORDER-DO');
		});

		it('Language aria orderable remove', async function() {
			await dt.clickHeader(0);
			expect($('#example thead th').eq(0).attr('aria-label')).toBe('NameORDER-REMOVE');
			expect($('#example thead th').eq(1).attr('aria-label')).toBe('PositionORDER-DO');
		});

		it('Language aria orderable reassign', async function() {
			await dt.clickHeader(0);
			expect($('#example thead th').eq(0).attr('aria-label')).toBe('NameORDER-DO');
			expect($('#example thead th').eq(1).attr('aria-label')).toBe('PositionORDER-DO');
		});

		it('Language aria orderable and ordered again', async function() {
			await dt.clickHeader(0);
			expect($('#example thead th').eq(0).attr('aria-label')).toBe('NameORDER-REVERSE');
			expect($('#example thead th').eq(1).attr('aria-label')).toBe('PositionORDER-DO');
		});
	});
});
