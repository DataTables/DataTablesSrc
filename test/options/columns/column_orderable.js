describe('columns.orderable option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Columns are searchable by default', async function() {
			$('#example').dataTable();
			await dt.clickHeader(2);
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Tiger Nixon');
		});

		dt.html('basic');
		it('Can disable sorting for one column', function() {
			$('#example').dataTable({
				columns: [null, null, { orderable: false }, null, null, null]
			});
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});

		it('Disabled column has no sorting class', function() {
			expect($('#example thead th:eq(2)').hasClass('dt-orderable-none')).toBe(true);
		});

		it('Not disabled columns do not have disabled class', function() {
			expect($('#example thead th:eq(1)').hasClass('dt-orderable-none')).toBe(false);
		});

		it('clicking on non-orderable column does nothing', async function() {
			await dt.clickHeader(2);
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});

		it('Other columns can still sort', async function() {
			await dt.clickHeader(3);
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Tatyana Fitzpatrick');
		});
	});

	describe('Check multiple columns', function() {
		dt.html('basic');
		it('Disable sorting on multiple columns - no sorting classes', function() {
			$('#example').dataTable({
				columns: [null, { orderable: false }, { orderable: false }, null, null, null]
			});
			expect($('#example thead th:eq(1)').hasClass('dt-orderable-none')).toBe(true);
			expect($('#example thead th:eq(2)').hasClass('dt-orderable-none')).toBe(true);

			expect($('example thead th:eq(1)').hasClass('dt-ordering-desc')).toBe(false);
			expect($('example thead th:eq(1)').hasClass('dt-ordering-asc')).toBe(false);
		});

		it('Sorting on disabled column 1 has no effect', async function() {
			await dt.clickHeader(1);
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});
		it('Second sort on disabled column 2 has no effect', async function() {
			await dt.clickHeader(2);
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});
		it('Sorting still works on other columns', async function() {
			await dt.clickHeader(3);
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

		it('clicking on non-orderable column does nothing', async function() {
			await dt.clickHeader(2);
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});

		it('Other columns can still sort', async function() {
			await dt.clickHeader(3);
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Tatyana Fitzpatrick');
		});
	});

	describe('Icons shown with user ordering disabled', function() {
		dt.html('basic');

		it('First column has icon', function() {
			$('#example').dataTable({
				columnDefs: [{ orderable: false, targets: '_all' }]
			});
			expect($('#example thead th').eq(0).hasClass('dt-ordering-asc')).toBe(true);
		});

		it('And "none" orderable class', function() {
			expect($('#example thead th').eq(0).hasClass('dt-orderable-none')).toBe(true);
		});

		it('And does not have orderable class', function() {
			expect($('#example thead th').eq(0).hasClass('dt-orderable-asc')).toBe(false);
		});

		it('Second column has only none class', function() {
			expect($('#example thead th').eq(1).hasClass('dt-orderable-asc')).toBe(false);
			expect($('#example thead th').eq(1).hasClass('dt-orderable-none')).toBe(true);
		});

		it('Changing sort moves the icon', function() {
			let table = $('#example').DataTable();
			table.column(3).order('asc').draw();

			expect($('#example thead th').eq(0).hasClass('dt-ordering-asc')).toBe(false);
			expect($('#example thead th').eq(3).hasClass('dt-ordering-asc')).toBe(true);
			expect($('#example thead th').eq(3).hasClass('dt-orderable-none')).toBe(true);
		});

		it('Does not draw if order disables', async function() {
			let table = $('#example').DataTable();
			let drawn = false;

			table.on('draw', function () {
				drawn = true;
			});

			await dt.clickHeader(2);

			expect(drawn).toBe(false);
		});
	});
});
