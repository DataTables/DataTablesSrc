describe('orderCellsTop option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});
	describe('Check the defaults', function() {
		dt.html('basic');
		it('disabled by default- Using 1 row in header', function() {
			expect($.fn.dataTable.defaults.bSortCellsTop).toBe(false);
		});
		it('Disabled by default- Using 2 rows in header', function() {
			$('#example thead').append(
				'<tr><th>Name1</th><th>Position1</th><th>Office1</th><th>Age1</th><th>Start date1</th><th>Salary1</th></tr>'
			);
			let table = $('#example').DataTable();

			expect($('#example thead tr:eq(0) th:eq(0)').hasClass('sorting_asc')).toBe(false);
			expect($('#example thead tr:eq(1) th:eq(0)').hasClass('sorting_asc')).toBe(true);
			expect($(table.column(0).header()).text()).toBe('Name1');
		});

		dt.html('basic');
		it('Can be turned on- Using 2 rows in header', function() {
			$('#example thead').append(
				'<tr><th>Name1</th><th>Position1</th><th>Office1</th><th>Age1</th><th>Start date1</th><th>Salary1</th></tr>'
			);
			let table = $('#example').DataTable({
				orderCellsTop: true
			});

			expect($('#example thead tr:eq(0) th:eq(0)').hasClass('sorting_asc')).toBe(true);
			expect($('#example thead tr:eq(1) th:eq(0)').hasClass('sorting_asc')).toBe(false);
			expect($(table.column(0).header()).text()).toBe('Name');
		});
	});

	describe('Check when using 3 rows in header', function() {
		dt.html('basic');
		it('Disabled by default- Using 3 rows in header', function() {
			$('#example thead').append(
				'<tr><th>Name1</th><th>Position1</th><th>Office1</th><th>Age1</th><th>Start date1</th><th>Salary1</th></tr>'
			);
			$('#example thead').append(
				'<tr><th>Name2</th><th>Position2</th><th>Office2</th><th>Age2</th><th>Start date2</th><th>Salary2</th></tr>'
			);
			let table = $('#example').DataTable();

			expect($('#example thead tr:eq(0) th:eq(0)').hasClass('sorting_asc')).toBe(false);
			expect($('#example thead tr:eq(1) th:eq(0)').hasClass('sorting_asc')).toBe(false);
			expect($('#example thead tr:eq(2) th:eq(0)').hasClass('sorting_asc')).toBe(true);
			expect($(table.column(0).header()).text()).toBe('Name2');
		});

		dt.html('basic');
		it('Can be turned on- Using 3 rows in header', function() {
			$('#example thead').append(
				'<tr><th>Name1</th><th>Position1</th><th>Office1</th><th>Age1</th><th>Start date1</th><th>Salary1</th></tr>'
			);
			$('#example thead').append(
				'<tr><th>Name2</th><th>Position2</th><th>Office2</th><th>Age2</th><th>Start date2</th><th>Salary2</th></tr>'
			);
			let table = $('#example').DataTable({
				orderCellsTop: true
			});

			expect($('#example thead tr:eq(0) th:eq(0)').hasClass('sorting_asc')).toBe(true);
			expect($('#example thead tr:eq(1) th:eq(0)').hasClass('sorting_asc')).toBe(false);
			expect($('#example thead tr:eq(2) th:eq(0)').hasClass('sorting_asc')).toBe(false);
			expect($(table.column(0).header()).text()).toBe('Name');
		});
	});

	describe('Ignored when using ColSpan- 2 rows', function() {
		dt.html('basic');
		it('Disabled by default when using ColSpan- 2 rows', function() {
			$('#example thead').prepend('<tr><th colspan="3">HR Information</th><th colspan="3">Contact</th></tr>');
			let table = $('#example').DataTable();

			expect($('#example thead tr:eq(0) th:eq(0)').hasClass('sorting_asc')).toBe(false);
			expect($('#example thead tr:eq(1) th:eq(0)').hasClass('sorting_asc')).toBe(true);
			expect($(table.column(0).header()).text()).toBe('Name');
		});

		dt.html('basic');
		it('Enabled when using ColSpan- 2 rows', function() {
			$('#example thead').prepend('<tr><th colspan="3">HR Information</th><th colspan="3">Contact</th></tr>');
			let table = $('#example').DataTable({
				orderCellsTop: true
			});

			expect($('#example thead tr:eq(0) th:eq(0)').hasClass('sorting_asc')).toBe(false);
			expect($('#example thead tr:eq(1) th:eq(0)').hasClass('sorting_asc')).toBe(true);
			expect($(table.column(0).header()).text()).toBe('Name');
		});
	});

	describe('When using RowSpan', function() {
		dt.html('basic');
		it('Disabled by default when using RowSpan (first column, 2 rows)', function() {
			$('#example thead').prepend(
				'<tr><th rowspan="2">Name</th><th>Position</th><th>Office</th><th>Age</th><th>Start date</th><th>Salary</th></tr>'
			);
			$('#example thead tr:eq(1)').remove();
			$('#example thead').append(
				'<tr><th>Position1</th><th>Office1</th><th>Age1</th><th>Start date1</th><th>Salary1</th></tr>'
			);
			let table = $('#example').DataTable();

			expect($('#example thead tr:eq(0) th').hasClass('sorting_asc')).toBe(true);
			expect($(table.column(0).header()).text()).toBe('Name');
		});

		dt.html('basic');
		it('Enabled when using RowSpan (first column, 2 rows)', function() {
			$('#example thead').prepend(
				'<tr><th rowspan="2">Name</th><th>Position</th><th>Office</th><th>Age</th><th>Start date</th><th>Salary</th></tr>'
			);
			$('#example thead tr:eq(1)').remove();
			$('#example thead').append(
				'<tr><th>Position1</th><th>Office1</th><th>Age1</th><th>Start date1</th><th>Salary1</th></tr>'
			);
			let table = $('#example').DataTable({
				orderCellsTop: true
			});

			expect($('#example thead tr:eq(0) th').hasClass('sorting_asc')).toBe(true);
			expect($(table.column(0).header()).text()).toBe('Name');
		});

		dt.html('basic');
		it('Disabled by default when using RowSpan (second column, 2 rows)', function() {
			$('#example thead').prepend(
				'<tr><th>Name</th><th rowspan="2">Position</th><th>Office</th><th>Age</th><th>Start date</th><th>Salary</th></tr>'
			);
			$('#example thead tr:eq(1)').remove();
			$('#example thead').append('<tr><th>Name1</th><th>Office1</th><th>Age1</th><th>Start date1</th><th>Salary1</th></tr>');
			let table = $('#example').DataTable();

			expect($('#example thead tr:eq(0) th:eq(0)').hasClass('sorting_asc')).toBe(false);
			expect($('#example thead tr:eq(1) th:eq(0)').hasClass('sorting_asc')).toBe(true);
			expect($(table.column(0).header()).text()).toBe('Name1');
		});

		dt.html('basic');
		it('Enabled when using RowSpan (second column, 2 rows)', function() {
			$('#example thead').prepend(
				'<tr><th>Name</th><th rowspan="2">Position</th><th>Office</th><th>Age</th><th>Start date</th><th>Salary</th></tr>'
			);
			$('#example thead tr:eq(1)').remove();
			$('#example thead').append('<tr><th>Name1</th><th>Office1</th><th>Age1</th><th>Start date1</th><th>Salary1</th></tr>');
			let table = $('#example').DataTable({
				orderCellsTop: true
			});

			expect($('#example thead tr:eq(0) th:eq(0)').hasClass('sorting_asc')).toBe(true);
			expect($('#example thead tr:eq(1) th:eq(0)').hasClass('sorting_asc')).toBe(false);
			expect($(table.column(0).header()).text()).toBe('Name');
		});
	});
});
