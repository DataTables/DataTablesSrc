describe('rows - rows().remove()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			let table = $('#example').DataTable();
			expect(typeof table.rows().remove).toBe('function');
		});

		it('Returns API instance', function() {
			let table = $('#example').DataTable();
			expect(table.rows().remove() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Deleting a non-existing row gives no row id in return', function() {
			let table = $('#example').DataTable();
			let removed = table.rows([100, 1000]).remove();
			expect(removed.length).toBe(1);
			expect(removed[0].length).toBe(0);
		});

		// Manuscript case #485 raised to flag the odd row indexes being returned
		dt.html('basic');
		it('Deleting existing rows gives row ids in return', function() {
			let table = $('#example').DataTable();
			let removed = table.rows([5, 8]).remove();
			expect(removed[0].length).toBe(2);
			expect(removed[0][0]).toBe(5);
			expect(removed[0][1]).toBe(7);
		});

		dt.html('basic');
		it('Deleting some existing rows gives existing row ids in return', function() {
			let table = $('#example').DataTable();
			let removed = table.rows([15, 2000]).remove();
			expect(removed.length).toBe(1);
			expect(removed[0].length).toBe(1);
			expect(removed[0][0]).toBe(15);
		});

		dt.html('basic');
		it('Deleting single rows (without array) gives row id in return', function() {
			let table = $('#example').DataTable();
			let removed = table.rows(11).remove();
			expect(removed[0].length).toBe(1);
			expect(removed[0][0]).toBe(11);
		});

		dt.html('basic');
		it('Deleting single rows (with array) gives row id in return', function() {
			let table = $('#example').DataTable();
			let removed = table.rows([11]).remove();
			expect(removed[0].length).toBe(1);
			expect(removed[0][0]).toBe(11);
		});

		dt.html('basic');
		it('Deleted row remains in DOM until the draw', function() {
			let table = $('#example').DataTable();
			table.rows([2]).remove();
			expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('Ashton Cox');
		});

		dt.html('basic');
		it('Deleted row removed from DOM after draw', function() {
			let table = $('#example').DataTable();
			table
				.rows([2])
				.remove()
				.draw();
			expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('Bradley Greer');
		});

		dt.html('basic');
		it('Deleted row removed from cache before the draw', function() {
			let table = $('#example').DataTable();
			expect(table.row(2).cache()[0]).toBe('ashton cox');
			table.rows([2]).remove();
			expect(table.row(2).cache()[0]).toBe('cedric kelly');
		});

		function isRemoved(toRemove) {
			let table = $('#example').DataTable();
			let expectedText = 'Showing 0 to 0 of 0 entries (filtered from ' + (57 - toRemove.length) + ' total entries)';
			let passed = true;

			toRemove.forEach(function(person) {
				table.search(person).draw();
				if (expectedText !== $('div.dataTables_info').text()) {
					passed = false;
				}
			});
			return passed;
		}

		// Manuscript case #485 raised to flag the odd row indexes being returned
		dt.html('basic');
		it('Deleting rows (with class) gives row id in return', function() {
			let table = $('#example').DataTable();
			let toRemove = table
				.cells('.odd', 0)
				.data()
				.toArray();
			let removed = table
				.rows('.odd')
				.remove()
				.draw();
			expect(removed[0].length).toBe(5);
			// #485 expect(JSON.stringify(removed[0])).toBe('[4,2,27,42,50]');
			expect(JSON.stringify(removed[0])).toBe('[3,2,25,39,46]');
			expect(isRemoved(toRemove)).toBe(true);
		});
	});
});
