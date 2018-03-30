describe('rows - row().remove()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			let table = $('#example').DataTable();
			expect(typeof table.row().remove).toBe('function');
		});

		it('Returns API instance', function() {
			let table = $('#example').DataTable();
			expect(table.row().remove() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Deleting a non-existing row gives no row id in return', function() {
			let table = $('#example').DataTable();
			expect(table.row(100).remove().length).toBe(0);
		});

		it('Deleting a row gives row id in return', function() {
			let table = $('#example').DataTable();
			expect(table.row(3).remove()[0][0]).toBe(3);
		});

		dt.html('basic');
		it('Deleted row remains in DOM until the draw', function() {
			let table = $('#example').DataTable();
			table.row(2).remove();
			expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('Ashton Cox');
		});

		dt.html('basic');
		it('Deleted row removed after the draw', function() {
			let table = $('#example').DataTable();
			table.row(2).remove().draw();
			expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('Bradley Greer');
		});

		dt.html('basic');
		it('Deleted row removed from cache before the draw', function() {
			let table = $('#example').DataTable();
			expect(table.row(2).cache()[0]).toBe('ashton cox');
			table.row(2).remove();
			expect(table.row(2).cache()[0]).toBe('cedric kelly');
		});
	});
});
