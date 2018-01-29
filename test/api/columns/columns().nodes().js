describe('columns- columns().nodes()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	function checkNodes(nodes, length) {
		expect(nodes.length).toBe(length);
		for (let i = 0; i < length; i++) {
			expect(nodes[i] instanceof HTMLTableCellElement).toBe(true);
		}
	}

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			let table = $('#example').DataTable();
			expect(typeof table.columns().nodes).toBe('function');
		});

		dt.html('basic');
		it('Returns an API instance', function() {
			let table = $('#example').DataTable();
			expect(table.columns().nodes() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Check the behaviour', function() {
		dt.html('basic');
		it('Returned single column', function() {
			let table = $('#example').DataTable();
			checkNodes(table.columns(1).nodes()[0], 57);
		});

		dt.html('basic');
		it('Returned data contains 2d array', function() {
			let table = $('#example').DataTable();
			let nodes = table.columns([1, 2]).nodes();
			checkNodes(nodes[0], 57);
			checkNodes(nodes[1], 57);
		});

		dt.html('basic');
		it('Returned data is for the correct column', function() {
			let table = $('#example').DataTable();
			let nodes = table.columns([0, 1]).nodes();
			expect(nodes[0][2].textContent).toBe('Ashton Cox');
			expect(nodes[1][2].textContent).toBe('Junior Technical Author');
		});
	});
});
