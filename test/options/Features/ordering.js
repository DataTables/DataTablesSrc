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
			expect($('#example thead th:eq(0)').hasClass('dt-ordering-asc')).toBe(true);
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Column ordering can be disabled', function() {
			$('#example').dataTable({
				ordering: false
			});
			expect($('#example thead th:eq(0)').hasClass('dt-orderable-none')).toBe(true);
		});
		it('Try activate sorting via DOM when disabled', async function() {
			await dt.clickHeader(0);
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Tiger Nixon');
		});
		it('Try activate sorting via DOM- when disabled (second click)', async function() {
			await dt.clickHeader(0);
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Tiger Nixon');
		});

		dt.html('basic');
		it('Enabling ordering allows sorting', function() {
			$('#example').dataTable({
				ordering: true
			});
			expect($('#example thead th:eq(0)').hasClass('dt-ordering-asc')).toBe(true);
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});
		it("'dt-ordering-desc' is added as a class when a column is clicked on", async function() {
			await dt.clickHeader(0);
			expect($('#example thead th:eq(0)').hasClass('dt-ordering-desc')).toBe(true);
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Zorita Serrano');
		});
		it("'dt-ordering-asc' is added as a class when a column is clicked on", async function() {
			await dt.clickHeader(0); // reset sort
			await dt.clickHeader(0); // asc sort
			expect($('#example thead th:eq(0)').hasClass('dt-ordering-asc')).toBe(true);
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});
	});

	// https://github.com/DataTables/DataTablesSrc/issues/288
	describe('Hide columns with sorting disabled', function() {
		let table;

		dt.html('basic');

		it('Initialise DataTable', function () {
			table = $('#example').DataTable({
				ordering: false
			});

			expect(1).toBe(1);
		});

		it('Hide columns - no JS error and header as expected', function () {
			table.columns([2, 3]).visible(false);

			expect($('thead').text().trim()).toBe('NamePositionStart dateSalary');
		});
	});
});
