describe('rows - rows().nodes()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	function checkNodes(nodes, length) {
		expect(nodes.count()).toBe(length);
		for (let i = 0; i < length; i++) {
			expect(nodes[i] instanceof HTMLTableRowElement).toBe(true);
		}
	}

	function checkNodeContent(node, expected) {
		expect(node.textContent.trim().split('\n')[0]).toBe(expected);
	}

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			let table = $('#example').DataTable();
			expect(typeof table.rows().nodes).toBe('function');
		});

		dt.html('basic');
		it('Returns an API instance', function() {
			let table = $('#example').DataTable();
			expect(table.rows().nodes() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Check API behaviour', function() {
		dt.html('basic');
		it('Returns an array of HTML elements', function() {
			let table = $('#example').DataTable();
			let nodes = table.rows(0).nodes();

			checkNodes(nodes, 1);
			checkNodeContent(nodes[0], 'Tiger Nixon');
		});

		dt.html('basic');
		it('Returns all rows', function() {
			let table = $('#example').DataTable();
			let nodes = table.rows().nodes();

			checkNodes(nodes, 57);
			checkNodeContent(nodes[0], 'Airi Satou');
			checkNodeContent(nodes[56], 'Zorita Serrano');
		});

		dt.html('basic');
		it('Correct rows assigned class on current page', function() {
			let table = $('#example').DataTable();
			$(table.rows([2, 3]).nodes()).addClass('myTest');

			let nodes = table.rows('.myTest').nodes();

			checkNodes(nodes, 2);
			checkNodeContent(nodes[0], 'Ashton Cox');
			checkNodeContent(nodes[1], 'Cedric Kelly');
		});

		dt.html('basic');
		it('Correct rows assigned class on different page', function() {
			let table = $('#example').DataTable();
			$(table.rows([0, 2]).nodes()).addClass('myTest');

			let nodes = table.rows('.myTest').nodes();

			checkNodes(nodes, 2);
			checkNodeContent(nodes[0], 'Ashton Cox');
			checkNodeContent(nodes[1], 'Tiger Nixon');
		});

		dt.html('basic');
		it('Classes can be added and removed', function() {
			let table = $('#example').DataTable();
			$(table.rows([1, 2]).nodes()).addClass('myTest');
			expect(
				table
					.rows('.myTest')
					.nodes()
					.count()
			).toBe(2);

			$(table.rows([1, 2]).nodes()).removeClass('myTest');
			expect(
				table
					.rows('.myTest')
					.nodes()
					.count()
			).toBe(0);
		});
	});

	describe('Check DOM access', function() {
		dt.html('basic');
		it('Correct DOM rows assigned class on current page', function() {
			let table = $('#example').DataTable();
			$(table.rows([2, 3]).nodes()).addClass('myTest');

			let nodes = $('.myTest');

			expect(nodes.length).toBe(2);
			checkNodeContent(nodes[0], 'Ashton Cox');
			checkNodeContent(nodes[1], 'Cedric Kelly');
		});

		dt.html('basic');
		it('Correct DOM rows assigned class only on current page', function() {
			let table = $('#example').DataTable();
			$(table.rows([0, 2]).nodes()).addClass('myTest');

			let nodes = $('.myTest');

			expect(nodes.length).toBe(1);
			checkNodeContent(nodes[0], 'Ashton Cox');
		});

		dt.html('basic');
		it('Correct DOM rows assigned class only on scrolling table', function() {
			let table = $('#example').DataTable({
				scrollY: '200px',
				scrollCollapse: true,
				paging: false
			});

			$(table.rows([0, 2]).nodes()).addClass('myTest');

			let nodes = $('.myTest');

			expect(nodes.length).toBe(2);
			checkNodeContent(nodes[0], 'Ashton Cox');
			checkNodeContent(nodes[1], 'Tiger Nixon');
		});
	});
});
