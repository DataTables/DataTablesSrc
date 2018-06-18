describe('columns - column().nodes()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	function checkNodes(nodes, length) {
		expect(nodes.count()).toBe(length);
		for (let i = 0; i < length; i++) {
			expect(nodes[i] instanceof HTMLElement).toBe(true);
		}
	}

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			let table = $('#example').DataTable();
			expect(typeof table.column().nodes).toBe('function');
		});

		dt.html('basic');
		it('Returns an API instance', function() {
			let table = $('#example').DataTable();
			expect(table.column().nodes() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Check DOM behaviour', function() {
		dt.html('basic');
		it('Return data contains 1d array of correct length', function() {
			let table = $('#example').DataTable();
			checkNodes(table.column(1).nodes(), 57);
		});

		dt.html('basic');
		it('Returned data is for correct column', function() {
			let table = $('#example').DataTable();
			expect(table.column(1).nodes()[0].textContent).toBe('Accountant');
		});
	});

	describe('Check AJAX behaviour', function() {
		dt.html('empty');
		it('AJAX sourced table with deferRender- Is it a function', function(done) {
			let table = $('#example').DataTable({
				ajax: '/base/test/data/data.txt',
				deferRender: true,
				columns: [
					{ data: 'name' },
					{ data: 'position' },
					{ data: 'office' },
					{ data: 'age' },
					{ data: 'start_date' },
					{ data: 'salary' }
				],
				initComplete: function(settings, json) {
					expect(typeof table.column().nodes).toBe('function');
					done();
				}
			});
		});
		dt.html('empty');
		it('AJAX sourced table with deferRender - Returns an API instance', function(done) {
			let table = $('#example').DataTable({
				ajax: '/base/test/data/data.txt',
				columns: [
					{ data: 'name' },
					{ data: 'position' },
					{ data: 'office' },
					{ data: 'age' },
					{ data: 'start_date' },
					{ data: 'salary' }
				],
				initComplete: function(settings, json) {
					expect(table.column().nodes() instanceof $.fn.dataTable.Api).toBe(true);
					done();
				}
			});
		});
		dt.html('empty');
		it('AJAX sourced table with deferRender - Return data contains array of correct length', function(done) {
			let table = $('#example').DataTable({
				ajax: '/base/test/data/data.txt',
				columns: [
					{ data: 'name' },
					{ data: 'position' },
					{ data: 'office' },
					{ data: 'age' },
					{ data: 'start_date' },
					{ data: 'salary' }
				],
				initComplete: function(settings, json) {
					checkNodes(table.column(1).nodes(), 57);
					done();
				}
			});
		});
		dt.html('empty');
		it('AJAX sourced table with deferRender - Returned data is for correct column', function(done) {
			let table = $('#example').DataTable({
				ajax: '/base/test/data/data.txt',
				columns: [
					{ data: 'name' },
					{ data: 'position' },
					{ data: 'office' },
					{ data: 'age' },
					{ data: 'start_date' },
					{ data: 'salary' }
				],
				initComplete: function(settings, json) {
					expect(table.column(1).nodes()[0].textContent).toBe('Accountant');
					done();
				}
			});
		});
	});
});
