describe('Ordering columns which are hidden', function () {
	var table;

	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	dt.html('basic');

	it('Load DataTable', function () {
		table = $('#example').DataTable();

		expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		expect(table.column(0).header().classList).toContain('dt-ordering-asc');
		expect(table.column(1).header().classList).not.toContain('dt-ordering-asc');
	});

	it('Order by hidden column', function () {
		table.column(1).visible(false);
		table.order([1, 'asc']).draw();

		expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Garrett Winters');
	});

	it('Header cell classes are as expected', function () {
		expect(table.column(0).header().classList).not.toContain('dt-ordering-asc');
		expect(table.column(1).header().classList).toContain('dt-ordering-asc');
	});
});
