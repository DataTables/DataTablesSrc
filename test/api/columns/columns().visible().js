// TK COLIN need to consider the second arg to visible - redrawCalculations - not covered here
describe('columns - column().visible()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			let table = $('#example').DataTable();
			expect(typeof table.columns().visible).toBe('function');
		});

		it('Getter returns an API instance', function() {
			var table = $('#example').DataTable();
			expect(table.columns().visible(true) instanceof $.fn.dataTable.Api).toBe(true);
		});

		it('Setter returns an API instance', function() {
			var table = $('#example').DataTable();
			expect(table.columns().visible(true) instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Getter', function() {
		dt.html('basic');
		it("Column visibility set by 'columns.visible' at init returns expected", function() {
			let table = $('#example').DataTable({
				columnDefs: [{ visible: false, targets: [0, 2] }]
			});
			expect(dt.isColumnHBFExpected(0, 'Position', 'Accountant')).toBe(true);
			expect(dt.areColumnsInvisible([0, 2])).toBe(true);
		});

		dt.html('basic');
		it('Column hidden at init and then made visible returns true', function() {
			let table = $('#example').DataTable({
				columnDefs: [{ visible: false, targets: [0, 2, 3] }]
			});
			table.columns([0, 2]).visible(true);
			expect(dt.isColumnHBFExpected(0, 'Name', 'Airi Satou')).toBe(true);
			expect(dt.areColumnsInvisible([3])).toBe(true);
		});
	});

	describe('Setter', function() {
		dt.html('basic');
		it('Hide a column (check header, body and footer nodes)', function() {
			let table = $('#example').DataTable();
			table.columns([0, 2]).visible(false);
			expect(dt.isColumnHBFExpected(0, 'Position', 'Accountant')).toBe(true);
			expect(dt.areColumnsInvisible([0, 2])).toBe(true);
		});

		dt.html('basic');
		it('Unhide a column (check header, body and footer nodes)', function() {
			let table = $('#example').DataTable({
				columnDefs: [{ visible: false, targets: [0, 3] }]
			});

			table.columns([0, 1]).visible(true);
			expect(dt.isColumnHBFExpected(0, 'Name', 'Airi Satou')).toBe(true);
			expect(dt.areColumnsInvisible([3])).toBe(true);
		});
	});

	describe('Getter tests with deferRender and AJAX', function() {
		dt.html('basic');
		it("Column visibility set by 'columns.visible' at init returns expected", function(done) {
			let table = $('#example').DataTable({
				ajax: '/base/test/data/data.txt',
				deferRender: true,
				columns: dt.getTestColumns(),
				columnDefs: [{ visible: false, targets: [0, 5] }],
				initComplete: function(settings, json) {
					expect(dt.isColumnHBFExpected(0, 'Position', 'Accountant')).toBe(true);
					expect(dt.areColumnsInvisible([0, 5])).toBe(true);
					done();
				}
			});
		});

		dt.html('basic');
		it('Column hidden at init and then made visible returns trues', function(done) {
			let table = $('#example').DataTable({
				ajax: '/base/test/data/data.txt',
				deferRender: true,
				columns: dt.getTestColumns(),
				columnDefs: [{ visible: false, targets: [0, 3, 4] }],
				initComplete: function(settings, json) {
					table.columns([0, 4]).visible(true);
					expect(dt.isColumnHBFExpected(0, 'Name', 'Airi Satou')).toBe(true);
					expect(dt.areColumnsInvisible([3])).toBe(true);
					done();
				}
			});
		});
	});

	describe('Getter tests with deferRender and AJAX', function() {
		dt.html('basic');
		it('Hide a column (check header, body and footer nodes)', function(done) {
			let table = $('#example').DataTable({
				ajax: '/base/test/data/data.txt',
				deferRender: true,
				columns: dt.getTestColumns(),
				initComplete: function(settings, json) {
					table.columns([0, 3, 2]).visible(false);
					expect(dt.isColumnHBFExpected(0, 'Position', 'Accountant')).toBe(true);
					expect(dt.areColumnsInvisible([0, 2, 3])).toBe(true);
					done();
				}
			});
		});

		dt.html('basic');
		it('Unhide a column (check header, body and footer nodes)', function(done) {
			let table = $('#example').DataTable({
				ajax: '/base/test/data/data.txt',
				deferRender: true,
				columns: dt.getTestColumns(),
				columnDefs: [{ visible: false, targets: [0, 1, 2, 5] }],
				initComplete: function(settings, json) {
					table.columns([0, 1, 2, 5]).visible(true);
					expect(dt.isColumnHBFExpected(0, 'Name', 'Airi Satou')).toBe(true);
					expect(dt.areColumnsInvisible([])).toBe(true);
					done();
				}
			});
		});
	});

	describe('Getter tests with footer removed', function() {
		dt.html('no_footer');
		it("Column visibility set by 'columns.visible' at init returns expected", function() {
			let table = $('#example').DataTable({
				columnDefs: [{ visible: false, targets: [0, 3, 5] }]
			});
			expect(dt.isColumnHBFExpected(0, 'Position', 'Accountant', '')).toBe(true);
			expect(dt.areColumnsInvisible([0, 3, 5])).toBe(true);
		});

		dt.html('no_footer');
		it('Column hidden at init and then made visible returns trues', function() {
			let table = $('#example').DataTable({
				columnDefs: [{ visible: false, targets: [2, 1, 0] }]
			});
			table.columns([2, 0]).visible(true);
			expect(dt.isColumnHBFExpected(0, 'Name', 'Airi Satou', '')).toBe(true);
			expect(dt.areColumnsInvisible([1])).toBe(true);
		});
	});

	describe('Setter tests with footer removed', function() {
		dt.html('no_footer');
		it('Hide a column (check header, body and footer nodes)', function() {
			let table = $('#example').DataTable();
			table.columns([0, 2, 3, 4]).visible(false);
			expect(dt.isColumnHBFExpected(0, 'Position', 'Accountant', '')).toBe(true);
			expect(dt.areColumnsInvisible([0, 2, 3, 4])).toBe(true);
		});

		dt.html('no_footer');
		it('Unhide a column (check header, body and footer nodes)', function() {
			let table = $('#example').DataTable({
				columnDefs: [{ visible: false, targets: [0] }]
			});
			table.columns(0).visible(true);
			expect(dt.isColumnHBFExpected(0, 'Name', 'Airi Satou', '')).toBe(true);
			expect(dt.areColumnsInvisible([])).toBe(true);
		});
	});

	function getScrollingTable(hideColumn = false) {
		colDefs = hideColumn ? [{ visible: false, targets: [0, 3, 5] }] : [];
		return $('#example').DataTable({
			scrollY: '200px',
			scrollCollapse: true,
			paging: false,
			columnDefs: colDefs
		});
	}

	describe('Getter tests with scrolling table ', function() {
		dt.html('basic');
		it("Column visibility set by 'columns.visible' at init returns expected", function() {
			let table = getScrollingTable(true);
			expect(dt.isColumnHBFExpected(0, 'Position', 'Accountant')).toBe(true);
			expect(dt.areColumnsInvisible([0, 3, 5])).toBe(true);
		});

		dt.html('basic');
		it('Column hidden at init and then made visible returns trues', function() {
			let table = getScrollingTable(true);
			table.columns([0, 5]).visible(true);
			expect(dt.isColumnHBFExpected(0, 'Name', 'Airi Satou')).toBe(true);
			expect(dt.areColumnsInvisible([3])).toBe(true);
		});
	});

	describe('Setter tests with scrolling table', function() {
		dt.html('basic');
		it('Hide a column (check header, body and footer nodes)', function() {
			let table = getScrollingTable();
			table.columns([0, 3, 5]).visible(false);
			expect(dt.isColumnHBFExpected(0, 'Position', 'Accountant')).toBe(true);
			expect(dt.areColumnsInvisible([0, 3, 5])).toBe(true);
		});

		dt.html('basic');
		it('Unhide a column (check header, body and footer nodes)', function() {
			let table = getScrollingTable(true);
			table.columns([0, 0]).visible(true);

			expect(dt.isColumnHBFExpected(0, 'Name', 'Airi Satou')).toBe(true);
			expect(dt.areColumnsInvisible([3, 5])).toBe(true);
		});
	});

	describe('Getter tests with scrolling table - no footer ', function() {
		dt.html('no_footer');
		it("Column visibility set by 'columns.visible' at init returns expected", function() {
			let table = getScrollingTable(true);
			expect(dt.isColumnHBFExpected(0, 'Position', 'Accountant', '')).toBe(true);
			expect(dt.areColumnsInvisible([0, 3, 5])).toBe(true);
		});

		dt.html('no_footer');
		it('Column hidden at init and then made visible returns trues', function() {
			let table = getScrollingTable(true);
			table.columns([0]).visible(true);
			expect(dt.isColumnHBFExpected(0, 'Name', 'Airi Satou', '')).toBe(true);
			expect(dt.areColumnsInvisible([3, 5])).toBe(true);
		});
	});

	describe('Setter tests with scrolling table - no footer ', function() {
		dt.html('no_footer');
		it('Hide a column (check header, body and footer nodes)', function() {
			let table = getScrollingTable();
			table.columns([0, 2, 3, 4, 5]).visible(false);
			expect(dt.isColumnHBFExpected(0, 'Position', 'Accountant', '')).toBe(true);
			expect(dt.areColumnsInvisible([0, 2, 3, 4, 5])).toBe(true);
		});

		dt.html('no_footer');
		it('Unhide a column (check header, body and footer nodes)', function() {
			let table = getScrollingTable(true);
			table.columns([0]).visible(true);
			expect(dt.isColumnHBFExpected(0, 'Name', 'Airi Satou', '')).toBe(true);
			expect(dt.areColumnsInvisible([3, 5])).toBe(true);
		});
	});
});
