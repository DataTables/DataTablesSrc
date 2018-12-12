describe('deferRender option', function() {
	let table;
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check Default', function() {
		it('Is disabled by default', function() {
			expect($.fn.dataTable.defaults.bDeferRender).toBe(false);
		});
	});

	function checkNodes(cells, rows) {
		expect(
			table
				.cells()
				.nodes()
				.count()
		).toBe(cells);
		expect(
			table
				.rows()
				.nodes()
				.count()
		).toBe(rows);
	}

	describe('Functional tests - disabled', function() {
		dt.html('empty');
		it('All nodes present after initialisation', function(done) {
			table = $('#example').DataTable({
				ajax: '/base/test/data/data.txt',
				deferRender: false,
				columns: [
					{ data: 'name' },
					{ data: 'position' },
					{ data: 'office' },
					{ data: 'age' },
					{ data: 'start_date' },
					{ data: 'salary' }
				],
				initComplete: function(settings, json) {
					checkNodes(342, 57);
					done();
				}
			});
		});
	});

	describe('Functional tests - enabled', function() {
		dt.html('empty');
		it('Only displayed nodes are created', function(done) {
			table = $('#example').DataTable({
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
					checkNodes(60, 10);
					done();
				}
			});
		});
		it('On next page 10 more rows are created', function() {
			table.page('next').draw(false);
			checkNodes(120, 20);
		});
		it('Jumping back to first page, no more rows are created', function() {
			table.page('previous').draw(false);
			checkNodes(120, 20);
		});
		it('Jumping to last page will not render all rows', function() {
			table.page('last').draw(false);
			checkNodes(162, 27);
		});
		it("Jumping back to first page again doesn't create more", function() {
			table.page('first').draw(false);
			checkNodes(162, 27);
		});
		it('Filtering will create only those required', function() {
			table.search('m').draw();
			checkNodes(186, 31);
		});
		it('Ordering will only create those required', function() {
			table.order([0, 'desc']).draw();
			checkNodes(222, 37);
		});
	});
});
