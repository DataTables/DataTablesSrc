describe('rows - row().child.isShown()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		let table;
		dt.html('basic');
		it('Ensure its a function', function() {
			table = $('#example').DataTable();
			expect(typeof table.row(2).child.isShown).toBe('function');
		});
		it('Returns boolean', function() {
			expect(typeof table.row(2).child.isShown()).toBe('boolean');
		});
	});

	describe('Functional tests', function() {
		let table;
		dt.html('basic');
		it('No child', function() {
			table = $('#example').DataTable();
			expect(table.row(2).child.isShown()).toBe(false);
		});
		it('Child not shown', function() {
			table.row(2).child('TEST');
			expect(table.row(2).child.isShown()).toBe(false);
		});
		it('Child shown', function() {
			table.row(2).child(true);
			expect(table.row(2).child.isShown()).toBe(true);
		});	
		it('Child hidden', function() {
			table.row(2).child.hide();
			expect(table.row(2).child.isShown()).toBe(false);
		});	
		it('Child remove', function() {
			table.row(2).child.remove();
			expect(table.row(2).child.isShown()).toBe(false);
		});						
	});
});
