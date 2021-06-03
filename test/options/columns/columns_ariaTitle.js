describe('columns.ariaTitle option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the option', function () {
		dt.html('basic');
		it('Defaults', function () {
			$('#example').dataTable({
				columnDefs: [
					{targets: 0, ariaTitle: 'test1'},
					{targets: 1, title: 'test2'},
					{targets: 2, ariaTitle: 'test3a', title: 'test3t'}
				]
			});

			expect($('thead th:eq(3)').attr('aria-label')).toBe('Age: activate to sort column ascending');
			expect($('thead th:eq(3)').text()).toBe('Age');
		});
		it('Just ariaTitle', function () {
			expect($('thead th:eq(0)').attr('aria-label')).toBe('test1: activate to sort column descending');
			expect($('thead th:eq(0)').text()).toBe('Name');
		});
		it('Just ariaTitle', function () {
			expect($('thead th:eq(1)').attr('aria-label')).toBe('test2: activate to sort column ascending');
			expect($('thead th:eq(1)').text()).toBe('test2');
		});
		it('Both ariaTitle and title', function () {
			expect($('thead th:eq(2)').attr('aria-label')).toBe('test3a: activate to sort column ascending');
			expect($('thead th:eq(2)').text()).toBe('test3t');
		});
	});
});
