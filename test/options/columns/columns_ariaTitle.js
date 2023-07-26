describe('columns.ariaTitle option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the option', function () {
		dt.html('basic_wide');
		it('Defaults', function () {
			$('thead th:eq(4)').attr('aria-label', 'test4');
			$('thead th:eq(5)').attr('aria-label', 'test5a');
			$('thead th:eq(6)').attr('aria-label', 'test6a');
			$('thead th:eq(7)').attr('aria-label', 'test7a');

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

			expect($('thead th:eq(3)').attr('aria-label')).toBe('Office: activate to sort column ascending');
			expect($('thead th:eq(3)').text()).toBe('Office');
		});
		it('Just ariaTitle', function () {
			expect($('thead th:eq(0)').attr('aria-label')).toBe('test1: activate to sort column descending');
			expect($('thead th:eq(0)').text()).toBe('First name');
		});
		it('Just ariaTitle', function () {
			expect($('thead th:eq(1)').attr('aria-label')).toBe('test2: activate to sort column ascending');
			expect($('thead th:eq(1)').text()).toBe('test2');
		});
		it('Both ariaTitle and title', function () {
			expect($('thead th:eq(2)').attr('aria-label')).toBe('test3o: activate to sort column ascending');
			expect($('thead th:eq(2)').text()).toBe('test3t');
		});
		it('Just aria-label', function () {
			expect($('thead th:eq(4)').attr('aria-label')).toBe('test4: activate to sort column ascending');
			expect($('thead th:eq(4)').text()).toBe('Age');
		});
		it('Both ariaTitle and aria-label', function () {
			expect($('thead th:eq(5)').attr('aria-label')).toBe('test5o: activate to sort column ascending');
			expect($('thead th:eq(5)').text()).toBe('Start date');
		});
		it('Both aria-label and title', function () {
			expect($('thead th:eq(6)').attr('aria-label')).toBe('test6a: activate to sort column ascending');
			expect($('thead th:eq(6)').text()).toBe('test6t');
		});
		it('ariaTitle, aria-label, and title', function () {
			expect($('thead th:eq(7)').attr('aria-label')).toBe('test7o: activate to sort column ascending');
			expect($('thead th:eq(7)').text()).toBe('test7t');
		});
	});
});
