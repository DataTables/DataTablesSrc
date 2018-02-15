// todo tests
// 1- node returned is <thead> for the header. Add class and then check DOM to see if correct node was selected.

describe('tables - table().header()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			let table = $('#example').DataTable();
			expect(typeof table.table().header).toBe('function');
		});

		dt.html('basic');
		it('Returns a header node', function() {
			let table = $('#example').DataTable();
			let header = table.table().header();
			expect(header instanceof HTMLTableSectionElement).toBe(true);
			expect(header.nodeName).toBe('THEAD');
		});
	});

	describe('Check the behaviour', function() {
		dt.html('basic');
		it('Returns the header row', function() {
			let table = $('#example').DataTable();
			let header = table.table().header();
			expect(header.children[0].children[0].innerHTML).toBe('Name');
		});

		dt.html('basic');
		it('Check DOM for jQuery assigned class', function() {
			let table = $('#example').DataTable();
			let header = table.table().header();
			$(header).addClass('ourTest');
			let domClass = document.getElementsByClassName('ourTest');
			expect(domClass.length).toBe(1);
			expect(domClass[0].nodeName).toBe('THEAD');
		});
	});
});
