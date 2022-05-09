// TK todo tests
// - Test when table is hidden on load make sure calcs match what we expect
// - Change length of data in one columns and check new widths are correct

describe('columns- columns.adjust()', function() {
	let table;
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			table = $('#example').DataTable();
			expect(typeof table.columns.adjust).toBe('function');
		});

		it('Returns an API instance', function() {
			expect(table.columns.adjust() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Table hidden on load has bad size', function() {
			$('#dt-test-loader-container').hide();

			table = $('#example').DataTable({
				scrollY: 200
			});

			$('#dt-test-loader-container').show();

			expect($(table.table().header()).width()).toBeLessThan($(table.table().body()).width());
		});
		it('Adjusting columns sorts it out', function() {
			table.columns.adjust();

			expect($(table.table().header()).width()).toBe($(table.table().body()).width());
		});
		it('Adding long text causes a wordwrap', function() {
			table
				.cell(2, 3)
				.data('this is the test case')
				.draw();

			expect($(table.row(2).node()).height()).toBeGreaterThan($(table.row(3).node()).height());
		});
		it('Adjust columns sorts out wordwrap', function() {
			table.columns.adjust();

			expect($(table.row(2).node()).height()).toBe($(table.row(3).node()).height());
		});
	});
});
