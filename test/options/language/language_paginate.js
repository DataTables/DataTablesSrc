describe('language.paginate option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('language.paginate defaults', function() {
			$('#example').dataTable({
				pagingType: 'full_numbers'
			});
			table = $('#example')
				.DataTable()
				.settings()[0].oLanguage.oPaginate;
			expect(table.sFirst).toBe('First');
			expect(table.sPrevious).toBe('Previous');
			expect(table.sNext).toBe('Next');
			expect(table.sLast).toBe('Last');
		});
		it('Paginate defaults are in the DOM', function() {
			expect($('.paginate_button.first').html()).toBe('First');
			expect($('.paginate_button.previous').html()).toBe('Previous');
			expect($('.paginate_button.next').html()).toBe('Next');
			expect($('.paginate_button.last').html()).toBe('Last');
		});
		dt.html('basic');
		it('Paginate can be defined', function() {
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
			table = $('#example')
				.DataTable()
				.settings()[0].oLanguage.oPaginate;
			expect(table.sFirst).toBe('unit1');
			expect(table.sPrevious).toBe('unit2');
			expect(table.sNext).toBe('unit3');
			expect(table.sLast).toBe('unit4');
		});
		it('paginate definition are in the dom', function() {
			expect($('.paginate_button.first').html()).toBe('unit1');
			expect($('.paginate_button.previous').html()).toBe('unit2');
			expect($('.paginate_button.next').html()).toBe('unit3');
			expect($('.paginate_button.last').html()).toBe('unit4');
		});
	});
});
