describe('core - page()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			expect(typeof $('#example').DataTable().page).toBe('function');
		});

		it('Getter returns an integer', function() {
			let table = $('#example').DataTable();
			expect(Number.isInteger(table.page())).toBe(true);
		});

		it('Setter returns an API instance', function() {
			let table = $('#example').DataTable();
			expect(table.page(1) instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Check the getter behaviour', function() {
		dt.html('basic');
		it('Starts on page 0', function() {
			let table = $('#example').DataTable();
			expect(table.page()).toBe(0);
		});

		dt.html('basic');
		it('Report last page', function() {
			let table = $('#example').DataTable();
			table.page('last').draw(false);
			expect(table.page()).toBe(5);
		});

		dt.html('basic');
		it('Report correctly if starting off first page', function() {
			let table = $('#example').DataTable({
				displayStart: 45
			});
			expect(table.page()).toBe(4);
		});
	});

	describe('Check the setter behaviour', function() {
		dt.html('basic');
		it('Move page numerically', function() {
			let table = $('#example').DataTable();
			table.page(2).draw(false);
			expect(table.page()).toBe(2);
		});

		it('Move page with next', function() {
			let table = $('#example').DataTable();
			table.page('next').draw(false);
			expect(table.page()).toBe(3);
		});

		it('Move page with previous', function() {
			let table = $('#example').DataTable();
			table.page('previous').draw(false);
			expect(table.page()).toBe(2);
		});

		it('Move page with first', function() {
			let table = $('#example').DataTable();
			table.page(2).draw(false);
			expect(table.page()).toBe(2);
		});

		it('Move page with last', function() {
			let table = $('#example').DataTable();
			table.page(2).draw(false);
			expect(table.page()).toBe(2);
		});

		it('Bad numeric page reverts to first page ', function() {
			let table = $('#example').DataTable();
			table.page(10).draw(false);
			expect(table.page()).toBe(0);
		});
	});
});
