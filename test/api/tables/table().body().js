describe('tables - table().body()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		let table;
		it('Exists and is a function', function() {
			table = $('#example').DataTable();
			expect(typeof table.table().body).toBe('function');
		});
		it('Returns an API instance', function() {
			expect(table.table().body() instanceof HTMLElement).toBe(true);
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			let table = $('#example').DataTable();
			$(table.table().body()).addClass('unitTest');
			expect($('#example tbody').hasClass('unitTest')).toBe(true);
		});
	});	
});
