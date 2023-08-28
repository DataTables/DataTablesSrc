describe('columns- columns().init()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Basics', function() {
		let table;

		dt.html('basic');

		it('Exists and is a function', function() {
			table = $('#example').DataTable({
				columnDefs: [
					{
						target: 1,
						test1: true
					},
					{
						target: 2,
						test2: true
					},
					{
						targets: '_all',
						test3: true
					}
				]
			});
			
			expect(typeof table.columns().init).toBe('function');
		});

		it('Returns an API instance', function() {
			expect(table.columns().init() instanceof DataTable.Api).toBe(true);
		});

		it('Options on one column', function() {
			let opts = table.columns().init();

			expect(opts[1].test1).toBe(true);
			expect(opts[2].test2).toBe(true);
		});

		it('Options do not leak', function() {
			let opts = table.columns().init();

			expect(opts[1].test2).toBe(undefined);
			expect(opts[2].test1).toBe(undefined);
		});

		it('Shared options are available', function() {
			let opts = table.columns().init();

			expect(opts[1].test3).toBe(true);
			expect(opts[2].test3).toBe(true);
		});
	});
});
