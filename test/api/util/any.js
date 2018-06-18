describe('any()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			let table = $('#example').DataTable();
			expect(typeof table.any).toBe('function');
		});

		it('Returns API instance', function() {
			let table = $('#example').DataTable();
			expect(typeof table.any()).toBe('boolean');
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('1D array true', function() {
			let table = $('#example').DataTable();
			expect(table.row(2).any()).toBe(true);
		});
		it('1D array false', function() {
			let table = $('#example').DataTable();
			expect(table.row(62).any()).toBe(false);
		});
		it('2D array true', function() {
			let table = $('#example').DataTable();
			expect(table.rows([3, 4]).any()).toBe(true);
		});
		it('2D array false', function() {
			let table = $('#example').DataTable();
			expect(table.rows([63, 64]).any()).toBe(false);
        });
        it('2D array mixed', function() {
			let table = $('#example').DataTable();
			expect(table.rows([6,64]).any()).toBe(true);
		});  
	});
});
