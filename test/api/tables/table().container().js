describe('tables- table().container()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		let table;
		it('Exists and is a function', function() {
			table = $('#example').DataTable();
			expect(typeof table.table().container).toBe('function');
		});
		it('Returns a node', function() {
			let node = table.table().container();
			expect(node instanceof HTMLElement).toBe(true);
			expect(node.nodeName.toUpperCase()).toBe('DIV');
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Returns the correct element', function() {
			let table = $('#example').DataTable();
			$(table.table().container()).addClass('unitTest');
			expect($('div.dataTables_wrapper').hasClass('unitTest')).toBe(true);
		});
	});
});
