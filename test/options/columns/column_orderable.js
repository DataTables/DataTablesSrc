describe('columns.orderable option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Columns are searchable by default', function() {
			$('#example').dataTable();
			$('#example thead th:eq(2)').click();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Cedric Kelly');
		});

		dt.html('basic');
		it('Can disable sorting for one column', function() {
			$('#example').dataTable({
				columns: [null, null, { orderable: false }, null, null, null]
			});
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});

		it('Disabled column has no sorting class', function() {
			expect($('#example thead th:eq(2)').hasClass('sorting_disabled')).toBe(true);
		});

		it('Not disabled columns do not have disabled class', function() {
			expect($('#example thead th:eq(1)').hasClass('sorting_disabled')).toBe(false);
		});

		it('clicking on non-orderable column does nothing', function() {
			$('#example thead th:eq(2)').click();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});

		it('Other columns can still sort', function() {
			$('#example thead th:eq(3)').click();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Tatyana Fitzpatrick');
		});
	});

	describe('Check multiple columns', function() {
		dt.html('basic');
		it('Disable sorting on multiple columns - no sorting classes', function() {
			$('#example').dataTable({
				columns: [null, { orderable: false }, { orderable: false }, null, null, null]
			});
			expect($('#example thead th:eq(1)').hasClass('sorting_disabled')).toBe(true);
			expect($('#example thead th:eq(2)').hasClass('sorting_disabled')).toBe(true);

			expect($('example thead th:eq(1)').hasClass('sorting_desc')).toBe(false);
			expect($('example thead th:eq(1)').hasClass('sorting_asc')).toBe(false);
		});

		it('Sorting on disabled column 1 has no effect', function() {
			$('#example thead th:eq(1)').click();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});
		it('Second sort on disabled column 2 has no effect', function() {
			$('#example thead th:eq(2)').click();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});
		it('Sorting still works on other columns', function() {
			$('#example thead th:eq(3)').click();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Tatyana Fitzpatrick');
		});
	});

	describe('Check columnDefs', function() {
		dt.html('basic');
		it('Can set with columnDefs', function() {
			$('#example').dataTable({
				columnDefs: [{ orderable: false, targets: 2 }]
			});
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});

		it('clicking on non-orderable column does nothing', function() {
			$('#example thead th:eq(2)').click();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});

		it('Other columns can still sort', function() {
			$('#example thead th:eq(3)').click();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Tatyana Fitzpatrick');
		});
	});
});
