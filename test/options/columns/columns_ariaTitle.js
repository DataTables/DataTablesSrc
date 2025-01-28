describe('columns.ariaTitle option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the option', function () {
		dt.html('basic_wide');
		it('Defaults', function () {
			$('#example').dataTable({
				columnDefs: [
					{targets: 0, ariaTitle: 'test1'},
					{targets: 1, title: 'test2'},
					{targets: 2, ariaTitle: 'test3o', title: 'test3t'},
					{targets: 5, ariaTitle: 'test5o'},
					{targets: 6, title: 'test6t'},
					{targets: 7, ariaTitle: 'test7o', title: 'test7t'}
				]
			});

			expect($('thead th:eq(3) span:last-child').attr('aria-label')).toBe('Office: Activate to sort');
			expect($('thead th:eq(3)').text()).toBe('Office');
		});
		it('Just ariaTitle', function () {
			expect($('thead th:eq(0) span:last-child').attr('aria-label')).toBe('test1: Activate to invert sorting');
			expect($('thead th:eq(0)').text()).toBe('First name');
		});
		it('Just ariaTitle', function () {
			expect($('thead th:eq(1) span:last-child').attr('aria-label')).toBe('test2: Activate to sort');
			expect($('thead th:eq(1)').text()).toBe('test2');
		});
		it('Both ariaTitle and title', function () {
			expect($('thead th:eq(2) span:last-child').attr('aria-label')).toBe('test3o: Activate to sort');
			expect($('thead th:eq(2)').text()).toBe('test3t');
		});
		it('Just aria-label', function () {
			expect($('thead th:eq(4) span:last-child').attr('aria-label')).toBe('Age: Activate to sort');
			expect($('thead th:eq(4)').text()).toBe('Age');
		});
		it('Both ariaTitle and aria-label', function () {
			expect($('thead th:eq(5) span:last-child').attr('aria-label')).toBe('test5o: Activate to sort');
			expect($('thead th:eq(5)').text()).toBe('Start date');
		});
		it('Both aria-label and title', function () {
			expect($('thead th:eq(6) span:last-child').attr('aria-label')).toBe('test6t: Activate to sort');
			expect($('thead th:eq(6)').text()).toBe('test6t');
		});
		it('ariaTitle, aria-label, and title', function () {
			expect($('thead th:eq(7) span:last-child').attr('aria-label')).toBe('test7o: Activate to sort');
			expect($('thead th:eq(7)').text()).toBe('test7t');
		});
	});
});
