describe('columns - columns().orderable()', function() {
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
			expect(typeof table.columns().orderable).toBe('function');
		});

		it('Getter returns a boolean value', function() {
			expect(table.columns().orderable(true) instanceof DataTable.Api).toBe(true);
		});

		it('Returns expected values', function() {
			var all = table.columns().orderable().toArray();

			expect(all.length).toBe(6);
			expect(all).toEqual([
				true,
				false,
				false,
				false,
				true,
				true
			]);
		});

		it('Selected columns', function() {
			var part = table.columns([0, 2]).orderable().toArray();

			expect(part.length).toBe(2);
			expect(part).toEqual([
				true,
				false
			]);
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
			expect(typeof table.columns().orderable).toBe('function');
		});

		it('Single column', function() {
			var part = table.columns(0).orderable(true).toArray();

			expect(part.length).toBe(1);
			expect(part).toEqual([['asc', 'desc', '']]);
		});

		it('Two columns', function() {
			var part = table.columns([2, 3]).orderable(true).toArray();

			expect(part.length).toBe(2);
			expect(part).toEqual([
				['asc', ''],
				['desc', 'asc', ''],
			]);
		});
	});
});
