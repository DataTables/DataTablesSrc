describe('Legacy aoColumns.bSearchable option', function () {
	let table;

	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	dt.html('basic');

	it('Set with legacy parameter - can still search enabled columns', function () {
		table = new DataTable('#example', {
			aoColumnDefs: [{
				target: 1,
				bSearchable: false
			}]
		});

		table.search('cedric').draw();
		expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Cedric Kelly');
	});

	it('But cannot search on search disabled column', function () {
		table.search('software engineer').draw();
		expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('No matching records found');
	});
});
