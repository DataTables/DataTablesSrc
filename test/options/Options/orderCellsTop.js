describe('orderCellsTop option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});
	//default only sorting on bottom, turned on top one, test with 3 rows and tests with rowspan
	describe('Check the defaults', function() {
		// dt.html( 'basic' );
		it('disabled by default- Using 1 row in header', function() {
			//could you also add a check for which cell `column().header()` returns in the orderCellsTop option please?
			$('#example').dataTable();
			expect($.fn.dataTable.defaults.bSortCellsTop).toBe(false);
		});
		dt.html('basic');
		it('Disabled by default- Using 2 rows in header', function() {
			$('#example thead').append(
				'<tr><th>Name</th><th>Position</th><th>Office</th><th>Age</th><th>Start date</th><th>Salary</th></tr>'
			);
			$('#example').dataTable();

			expect($('#example thead tr:eq(1) th:eq(0)').hasClass('sorting_asc')).toBe(true);
			expect($('#example thead tr:eq(0) th:eq(0)').hasClass('sorting_asc')).toBe(false);
		});
		dt.html('basic');
		it('Can be turned on- Using 2 rows in header', function() {
			$('#example thead').append(
				'<tr><th>Name</th><th>Position</th><th>Office</th><th>Age</th><th>Start date</th><th>Salary</th></tr>'
			);

			$('#example').dataTable({
				orderCellsTop: true
			});

			expect($('#example thead tr:eq(0) th:eq(0)').hasClass('sorting_asc')).toBe(true);
			expect($('#example thead tr:eq(1) th:eq(0)').hasClass('sorting_asc')).toBe(false);
		});
	});

	describe('Check when using 3 rows in header', function() {
		dt.html('basic');
		it('Disabled by default- Using 3 rows in header', function() {
			$('#example thead').append(
				'<tr><th>Name</th><th>Position</th><th>Office</th><th>Age</th><th>Start date</th><th>Salary</th></tr>'
			);
			$('#example thead').append(
				'<tr><th>Name</th><th>Position</th><th>Office</th><th>Age</th><th>Start date</th><th>Salary</th></tr>'
			);
			$('#example').dataTable();

			expect($('#example thead tr:eq(2) th:eq(0)').hasClass('sorting_asc')).toBe(true);
			expect($('#example thead tr:eq(1) th:eq(0)').hasClass('sorting_asc')).toBe(false);
			expect($('#example thead tr:eq(0) th:eq(0)').hasClass('sorting_asc')).toBe(false);
		});
		dt.html('basic');
		it('Can be turned on- Using 3 rows in header', function() {
			$('#example thead').append(
				'<tr><th>Name</th><th>Position</th><th>Office</th><th>Age</th><th>Start date</th><th>Salary</th></tr>'
			);
			$('#example thead').append(
				'<tr><th>Name</th><th>Position</th><th>Office</th><th>Age</th><th>Start date</th><th>Salary</th></tr>'
			);
			$('#example').dataTable({
				orderCellsTop: true
			});

			expect($('#example thead tr:eq(0) th:eq(0)').hasClass('sorting_asc')).toBe(true);
			expect($('#example thead tr:eq(1) th:eq(0)').hasClass('sorting_asc')).toBe(false);
			expect($('#example thead tr:eq(2) th:eq(0)').hasClass('sorting_asc')).toBe(false);
		});
	});

	describe('Test when using ColSpan- 2 rows', function() {
		dt.html('basic');
		it('Disabled by default when using ColSpan- 2 rows', function() {
			$('#example thead').prepend('<tr><th colspan="3">HR Information</th><th colspan="3">Contact</th></tr>');
			$('#example thead tr:eq(1)').remove();
			$('#example thead').append(
				'<tr><th>Name</th><th>Position</th><th>Office</th><th>Age</th><th>Start date</th><th>Salary</th></tr>'
			);
			$('#example').dataTable();

			expect($('#example thead tr:eq(0) th:eq(0)').hasClass('sorting_asc')).toBe(false);
			expect($('#example thead tr:eq(1) th:eq(0)').hasClass('sorting_asc')).toBe(true);
		});
		dt.html('basic');
		it('Enabled when using ColSpan- 2 rows', function() {
			$('#example thead').prepend('<tr><th colspan="3">HR Information</th><th colspan="3">Contact</th></tr>');
			$('#example thead tr:eq(1)').remove();
			$('#example thead').append(
				'<tr><th>Name</th><th>Position</th><th>Office</th><th>Age</th><th>Start date</th><th>Salary</th></tr>'
			);
			$('#example').dataTable({
				orderCellsTop: true
			});

			expect($('#example thead tr:eq(0) th:eq(0)').hasClass('sorting_asc')).toBe(false);
			expect($('#example thead tr:eq(1) th:eq(0)').hasClass('sorting_asc')).toBe(true);
		});
	});
});
