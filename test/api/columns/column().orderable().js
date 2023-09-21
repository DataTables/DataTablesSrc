describe('columns - column().orderable()', function() {
	let table;

	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('No parameters', function() {
		dt.html('basic');

		it('Exists and is a function', function() {
			table = $('#example').DataTable({
				columns: [
					null,
					{ orderable: false },
					{ orderable: false },
					{ orderable: false },
					null,
					{ orderable: true }
				]
			});
			expect(typeof table.column().orderable).toBe('function');
		});

		it('Getter returns a boolean value', function() {
			expect(typeof table.column(0).orderable()).toBe('boolean');
		});

		it('Returns true for enabled', function() {
			expect(table.column(0).orderable()).toBe(true);
		});

		it('Returns false for disabled', function() {
			expect(table.column(1).orderable()).toBe(false);
		});

		it('Returns true for already enabled', function() {
			expect(table.column(5).orderable()).toBe(true);
		});
	});

	describe('Direction', function() {
		dt.html('basic');

		it('Exists and is a function', function() {
			table = $('#example').DataTable({
				columns: [
					null,
					null,
					{ orderSequence: ['asc', ''] },
					{ orderSequence: ['desc', 'asc', ''] },
					{ orderSequence: ['desc'] },
					null
				]
			});
			expect(typeof table.column().orderable).toBe('function');
		});

		it('Getter returns a API value', function() {
			expect(table.column(0).orderable(true) instanceof DataTable.Api).toBe(true);
		});

		it('Default column', function() {
			expect(table.column(0).orderable(true).toArray()).toEqual(['asc', 'desc', '']);
		});

		it('Custom col 1', function() {
			expect(table.column(2).orderable(true).toArray()).toEqual(['asc', '']);
		});

		it('Custom col 2', function() {
			expect(table.column(3).orderable(true).toArray()).toEqual(['desc', 'asc', '']);
		});

		it('Custom col 3', function() {
			expect(table.column(4).orderable(true).toArray()).toEqual(['desc']);
		});
	});
});
