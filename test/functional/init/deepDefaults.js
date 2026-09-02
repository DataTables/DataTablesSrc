describe('Empty DataTable', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	dt.html('basic');

	// https://datatables.net/forums/discussion/81904
	it('DataTables can be initialised without anything in the columns', function () {
		DataTable.util.object.assignDeepObjects(DataTable.defaults, {
			layout: {
				topEnd: null,
				bottomEnd: null
			},
			column: {
				orderSequence: ['asc', 'desc']
			}
		});

		const table = new DataTable('#example');
	});

	// layout check
	it('Length changing div exists', function () {
		expect($('.dt-length')[0]).not.toBeUndefined();
	});

	it('Filtering div not present', function () {
		expect($('.dt-search')[0]).toBeUndefined();
	});

	it('Information div exists', function () {
		expect($('.dt-info')[0]).not.toBeUndefined();
	});

	it('Pagination div not present', function () {
		expect($('.dt-paging')[0]).toBeUndefined();
	});

	// order sequence
	it('Sorting (first click) on numeric column', async function () {
		await dt.clickHeader(3);
		expect($('#example tbody td:eq(3)').html()).toBe('19');
	});

	it('Sorting (second click) on numeric column', async function () {
		await dt.clickHeader(3);
		expect($('#example tbody td:eq(3)').html()).toBe('66');
	});

	it('Sorting (third click) on numeric column results in asc again, due to the default', async function () {
		await dt.clickHeader(3);
		expect($('#example tbody td:eq(3)').html()).toBe('19');
	});
});
