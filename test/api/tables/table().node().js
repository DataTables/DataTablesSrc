// TK COLIN could do with some multi-table tests
describe('tables- table().node()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			let table = $('#example').DataTable();
			expect(typeof table.table().node).toBe('function');
		});

		dt.html('basic');
		it('Returns an HTML element', function() {
			let table = $('#example').DataTable();
			expect(table.table().node() instanceof HTMLTableElement).toBe(true);
		});
	});

	describe('Check the behaviour', function() {
		dt.html('basic');
		it('Correct access to table node through the API', function() {
			let table = $('#example').DataTable();
			$(table.table().node()).addClass('myTest');
			expect($(table.table('.myTest').node())[0].id).toBe('example');
		});

		dt.html('basic');
		it('Correct access to table node through the DOM', function() {
			let table = $('#example').DataTable();
			$(table.table().node()).addClass('myTest');
			expect($('.myTest')[0].id).toBe('example');
		});
	});
});
