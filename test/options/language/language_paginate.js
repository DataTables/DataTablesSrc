describe('language.paginate option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function () {
		dt.html('basic');

		it('language.paginate defaults', function () {
			let paging = DataTable.defaults.language.paginate;

			expect(paging.first).toBe('«');
			expect(paging.previous).toBe('‹');
			expect(paging.next).toBe('›');
			expect(paging.last).toBe('»');
		});

		it('Paginate defaults are in the DOM', function () {
			$('#example').dataTable({
				pagingType: 'full_numbers'
			});

			expect($('.dt-paging-button.first').html()).toBe('«');
			expect($('.dt-paging-button.previous').html()).toBe('‹');
			expect($('.dt-paging-button.next').html()).toBe('›');
			expect($('.dt-paging-button.last').html()).toBe('»');
		});

		it('Aria labels are set', function () {
			expect($('.dt-paging-button.first').attr('aria-label')).toBe('First');
			expect($('.dt-paging-button.previous').attr('aria-label')).toBe(
				'Previous'
			);
			expect($('.dt-paging-button.next').attr('aria-label')).toBe('Next');
			expect($('.dt-paging-button.last').attr('aria-label')).toBe('Last');
		});

		dt.html('basic');

		it('Paginate can be defined', function () {
			$('#example').dataTable({
				pagingType: 'full_numbers',
				language: {
					paginate: {
						first: 'unit1',
						previous: 'unit2',
						next: 'unit3',
						last: 'unit4'
					}
				}
			});

			expect($('.dt-paging-button.first').html()).toBe('unit1');
			expect($('.dt-paging-button.previous').html()).toBe('unit2');
			expect($('.dt-paging-button.next').html()).toBe('unit3');
			expect($('.dt-paging-button.last').html()).toBe('unit4');
		});
	});
});
