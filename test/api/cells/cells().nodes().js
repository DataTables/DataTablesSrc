describe('cells - cells().nodes()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');

		it('Exists and is a function', function() {
			let table = $('#example').DataTable();
			expect(typeof table.cells().nodes).toBe('function');
		});

		it('Returns an API instance', function() {
			let table = $('#example').DataTable();
			expect(table.cells().nodes(function() {}) instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Check the behaviour', function() {
		function checkNodes(nodes, length) {
			expect(nodes.count()).toBe(length);

			for (let i = 0; i < length; i++) {
				expect(nodes[i] instanceof HTMLElement).toBe(true);
			}
		}
		dt.html('basic');

		it('A single node can be returned', function() {
			let table = $('#example').DataTable();
			node = table.cells(2, 0).nodes();

			checkNodes(node, 1);
			expect(node[0].textContent).toBe('Ashton Cox');
		});

		dt.html('basic');

		it('A row of nodes can be returned', function() {
			let table = $('#example').DataTable();
			$(table.cells(3, '*').nodes()).addClass('myTest');
			checkNodes(table.cells('.myTest').nodes(), 6);
		});

		dt.html('basic');

		it('A column of nodes can be returned', function() {
			let table = $('#example').DataTable();
			$(table.cells('*', 2).nodes()).addClass('myTest');
			checkNodes(table.cells('.myTest').nodes(), 57);
		});

		dt.html('basic');

		it('All nodes can be returned', function() {
			let table = $('#example').DataTable();
			$(table.cells().nodes()).addClass('myTest');
			checkNodes(table.cells('.myTest').nodes(), 57 * 6);
		});
	});
});
