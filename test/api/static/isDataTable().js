describe('Static method - isDataTable()', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;

	describe('Check the defaults', function () {
		dt.html('basic');
		it('Exists and is a function', function () {
			expect(typeof $.fn.dataTable.isDataTable).toBe('function');
			expect(typeof DataTable.isDataTable).toBe('function');
		});
		it('Returns a boolean', function () {
			expect(typeof $.fn.dataTable.isDataTable()).toBe('boolean');
			expect(typeof DataTable.isDataTable()).toBe('boolean');
		});
	});

	describe('Functional tests (with both DataTable and $.fn.dataTable)', function () {
		dt.html('basic');
		it('Returns false before initialisation', function () {
			expect($.fn.dataTable.isDataTable($('#example'))).toBe(false);
			expect(DataTable.isDataTable($('#example'))).toBe(false);
		});
		it('Accepts a DataTable table node', function () {
			table = $('#example').DataTable();
			expect($.fn.dataTable.isDataTable($('#example'))).toBe(true);
			expect(DataTable.isDataTable($('#example'))).toBe(true);
		});
		it('Other nodes return false', function () {
			expect($.fn.dataTable.isDataTable($('th').get(0))).toBe(false);
			expect($.fn.dataTable.isDataTable($('td').get(0))).toBe(false);
			expect($.fn.dataTable.isDataTable($('div').get(0))).toBe(false);
			expect(DataTable.isDataTable($('th').get(0))).toBe(false);
			expect(DataTable.isDataTable($('td').get(0))).toBe(false);
			expect(DataTable.isDataTable($('div').get(0))).toBe(false);
		});
		it('Can accept a jQuery selector', function () {
			expect($.fn.dataTable.isDataTable('table.dataTable')).toBe(true);
			expect($.fn.dataTable.isDataTable('div')).toBe(false);
			expect(DataTable.isDataTable('table.dataTable')).toBe(true);
			expect(DataTable.isDataTable('div')).toBe(false);
		});
		it('Can accept a DataTable API instance', function () {
			expect($.fn.dataTable.isDataTable(table)).toBe(true);
			expect($.fn.dataTable.isDataTable(1)).toBe(false);
			expect(DataTable.isDataTable(table)).toBe(true);
			expect(DataTable.isDataTable(1)).toBe(false);
		});

		dt.html('basic');
		it('Returns true for the header in a scrolling table', function () {
			table = $('#example').DataTable({
				scrollY: 200
			});

			var scrollingTable = $(table.table().header()).closest('table');
			expect($.fn.dataTable.isDataTable(scrollingTable)).toBe(true);
		});
		it('Returns true for the body in a scrolling table', function () {
			var scrollingTable = $(table.table().body()).closest('table');
			expect($.fn.dataTable.isDataTable(scrollingTable)).toBe(true);
		});
		it('Returns true for the footer in a scrolling table', function () {
			var scrollingTable = $(table.table().footer()).closest('table');
			expect($.fn.dataTable.isDataTable(scrollingTable)).toBe(true);
		});
	});
});
