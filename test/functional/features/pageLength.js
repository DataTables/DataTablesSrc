// Lots of tests elsewhere for the general behaviour. This tests specifics

describe('Page length - feature', function () {
	var table;
	var Dom;

	function matches(val, options) {
		expect(parseInt(Dom.s('.dt-length select').val())).toBe(val);

		expect(
			Dom.s('.dt-length select option').mapTo(el => parseInt(el.value))
		).toEqual(options);
	}

	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	dt.html('basic');

	it('Load DataTable', function () {
		Dom = DataTable.Dom;
		table = new DataTable('#example');

		matches(10, [10, 25, 50, 100]);
	});

	it('Switch to an available value', function () {
		table.page.len(25).draw();

		matches(25, [10, 25, 50, 100]);
	});

	it('Switch to a not available value in first place', function () {
		table.page.len(9).draw();

		matches(9, [9, 10, 25, 50, 100]);
	});

	it('Switch back to an available value - removes tmp value', function () {
		table.page.len(10).draw();

		matches(10, [10, 25, 50, 100]);
	});

	it('Switch to a not available value in second place', function () {
		table.page.len(12).draw();

		matches(12, [10, 12, 25, 50, 100]);
	});

	it('Switch to a not available value in third place', function () {
		table.page.len(43).draw();

		matches(43, [10, 25, 43, 50, 100]);
	});

	it('Switch to a not available value in fourth place', function () {
		table.page.len(51).draw();

		matches(51, [10, 25, 50, 51, 100]);
	});

	it('Switch to a not available value in last place', function () {
		table.page.len(110).draw();

		matches(110, [10, 25, 50, 100, 110]);
	});

	it('Switch back to an available value - removes tmp value', function () {
		table.page.len(10).draw();

		matches(10, [10, 25, 50, 100]);
	});
});
