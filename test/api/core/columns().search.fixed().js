describe('core - search.fixed()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		let table;

		dt.html('basic');

		it('Exists and is a function', function() {
			table = $('#example').DataTable();

			expect(typeof table.columns().search.fixed).toBe('function');
		});
	});

	describe('No parameters', function() {
		let table;

		dt.html('basic');

		it('Returns API instance', function() {
			table = $('#example').DataTable();

			expect(table.columns().search.fixed() instanceof DataTable.Api).toBe(true);
		});

		it('Returns the keys of applied searches', function() {
			table.columns().search.fixed('test', () => true);
			table.columns().search.fixed('test2', () => true);

			expect(table.column(0).search.fixed() instanceof DataTable.Api).toBe(true);
			expect(table.column(0).search.fixed().toArray()).toEqual(['test', 'test2']);
		});
	});

	// Limited tests, since is it just the same as `column().search.fixed()` it
	// just applies the search to multiple columns
	describe('Set', function() {
		let table;

		dt.html('basic');

		it('Returns term that was set - string', function() {
			table = $('#example').DataTable();

			table.columns([0,1]).search.fixed('test', 'n').draw();

			expect($('#example tbody td').eq(0).text()).toBe('Ashton Cox');
			expect(table.page.info().recordsDisplay).toBe(25);
		});

		it('Was set on both columns', function() {
			expect(table.column(0).search.fixed('test')).toBe('n');
			expect(table.column(1).search.fixed('test')).toBe('n');
		});

		it('Can remove just one', function() {
			table.columns(0).search.fixed('test', null).draw();

			expect($('#example tbody td').eq(0).text()).toBe('Airi Satou');
			expect(table.page.info().recordsDisplay).toBe(42);
		});
	});
});
