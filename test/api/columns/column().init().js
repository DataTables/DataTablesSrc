describe('columns- column().init()', function() {
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
			
			expect(typeof table.column().init).toBe('function');
		});

		it('Returns an object', function() {
			expect(typeof table.column(0).init()).toBe('object');
		});

		it('Options on one column', function() {
			expect(table.column(1).init().test1).toBe(true);
			expect(table.column(2).init().test2).toBe(true);
		});

		it('Options do not leak', function() {
			expect(table.column(1).init().test2).toBe(undefined);
			expect(table.column(2).init().test1).toBe(undefined);
		});

		it('Shared options are available', function() {
			expect(table.column(1).init().test3).toBe(true);
			expect(table.column(2).init().test3).toBe(true);
		});
	});
});
