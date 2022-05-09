// TK COLIN could do with some multi-table tests
describe('tables - tables().nodes()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			let table = $('#example').DataTable();
			expect(typeof table.tables().nodes).toBe('function');
		});

		dt.html('basic');
		it('Returns an API instance', function() {
			let table = $('#example').DataTable();
			expect(table.tables().nodes() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Check the behaviour', function() {
		dt.html('basic');
		it('Check correct return', function() {
			let table = $('#example').DataTable();
			let nodes = table.tables().nodes();

			expect(nodes.count()).toBe(1);
			expect(nodes[0].id).toBe('example');
		});
		dt.html('basic');

		// TK COLIN - following two tests are somewhat artificial without additional tables
		it('Correct access to table node through the API', function() {
			let table = $('#example').DataTable();
			$(table.tables('#example').nodes()).addClass('myTest');

			let nodes = table.tables('.myTest').nodes();

			expect(nodes.count()).toBe(1);
			$(table.table().node()).addClass('myTest');
			expect($(table.table('.myTest').node())[0].id).toBe('example');
		});

		dt.html('basic');
		it('Correct access to table node through the DOM', function() {
			let table = $('#example').DataTable();
			$(table.tables('#example').nodes()).addClass('myTest');

			expect($('.myTest')[0].id).toBe('example');
		});
	});
});
