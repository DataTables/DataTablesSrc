describe('ordering option ', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Default should be set to true', function() {
			$('#example').dataTable();
			expect($.fn.dataTable.defaults.bSort).toBe(true);
		});
		it('Default sorting is enabled', function() {
			expect($('#example thead th:eq(0)').hasClass('sorting_asc')).toBe(true);
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Column ordering can be disabled', function() {
			$('#example').dataTable({
				ordering: false
			});
			expect($('#example thead th:eq(0)').hasClass('sorting_disabled')).toBe(true);
		});
		it('Try activate sorting via DOM when disabled', function() {
			$('#example thead th:eq(0)').click();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Tiger Nixon');
		});
		it('Try activate sorting via DOM- when disabled (second click)', function() {
			$('#example thead th:eq(0)').click();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Tiger Nixon');
		});

		dt.html('basic');
		it('Enabling ordering allows sorting', function() {
			$('#example').dataTable({
				ordering: true
			});
			expect($('#example thead th:eq(0)').hasClass('sorting_asc')).toBe(true);
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});
		it("'sorting_desc' is added as a class when a column is clicked on", function() {
			$('#example thead th:eq(0)').click();
			expect($('#example thead th:eq(0)').hasClass('sorting_desc')).toBe(true);
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Zorita Serrano');
		});
		it("'sorting_asc' is added as a class when a column is clicked on", function() {
			$('#example thead th:eq(0)').click();
			expect($('#example thead th:eq(0)').hasClass('sorting_asc')).toBe(true);
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});
	});
});
