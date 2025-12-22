describe('Empty DataTable', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	dt.html('no-columns');

	it('DataTables can be initialised without anything in the columns', function() {
		$('#test').DataTable();

		// No JS errors occurred
		expect(true).toEqual(true);
	});

	it('Node order is correct', function() {
		let nodes = $('#test').children();

		expect(nodes[0].nodeName.toLowerCase()).toBe('colgroup');
		expect(nodes[1].nodeName.toLowerCase()).toBe('thead');
		expect(nodes[2].nodeName.toLowerCase()).toBe('tfoot');
		expect(nodes[3].nodeName.toLowerCase()).toBe('tbody');
	});
});
