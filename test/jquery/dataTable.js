describe('nonjQuery - ajax', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	it('jQuery present', function () {
		expect(window.jQuery).not.toBeUndefined();
		expect(window.$).not.toBeUndefined();
		expect(DataTable.use('jq')).toBe(window.jQuery);
	});

	dt.html('basic');

	it('Initialise a table', function () {
		$('#example').dataTable();

		expect($('#example tbody td:eq(0)').html()).toBe('Airi Satou');
	});

	it('Returns a jQuery instance', function () {
		expect($('#example').dataTable() instanceof jQuery).toBe(true);
	});

	it('`api()` function exists', function () {
		expect(typeof $('#example').dataTable().api).toBe('function');
	});

	it('`api()` returns an API instance', function () {
		expect($('#example').dataTable().api() instanceof DataTable.Api).toBe(
			true
		);
	});

	it('`api()` settings is as expected', function () {
		let api = $('#example').dataTable().api();

		expect(api.settings().length).toBe(1);
		expect(api.settings()[0]).toBe(DataTable.settings[0]);
	});

	it('Can use the API return', function () {
		let api = $('#example').dataTable().api();
		let pages = api.page.info().pages;

		expect(pages).toBe(6);
	});
});
