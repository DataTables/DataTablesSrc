describe('core - clear()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		it('Exists and is a function', function() {
			expect(typeof $('#example').DataTable().clear).toBe('function');
		});

		it('Returns an API instance', function() {
			expect(
				$('#example')
					.DataTable()
					.clear() instanceof $.fn.dataTable.Api
			).toBe(true);
		});
	});

	describe('Functional tests', function() {
		var table;
		dt.html('basic');
		it('Removes all rows from the table', function() {
			table = $('#example').DataTable();
			table.clear();
			expect(table.rows().count()).toBe(0);
		});

		it('Rows are displayed until the draw()', function() {
			expect($('#example tbody tr').length).toBe(10);
		});

		it('Rows are removed after the draw()', function() {
			table.draw();
			expect($('#example tbody tr').text()).toBe('No data available in table');
		});

		dt.html('basic');
		it('Can add new rows before the draw()', function() {
			table = $('#example').DataTable();
			table
				.clear()
				.row.add([1, 2, 3, 4, 5, 6])
				.draw();
			expect(table.rows().count()).toBe(1);
		});

		dt.html('basic');
		it('Calling twice means the second is a NOOP', function() {
			table = $('#example').DataTable();
			table
				.clear()
				.clear()
				.draw();
			expect(table.rows().count()).toBe(0);
			expect($('#example tbody tr').text()).toBe('No data available in table');
		});

		dt.html('basic');
		it('Does nothing if serverSide enabled', function(done) {
			// bit of a dummy test, this shouldn't really be called anyway, but verify it's
			// not doing something too silly
			let table = $('#example').DataTable({
				processing: true,
				serverSide: true,
				ajax: function(data, callback, settings) {
					var out = [];

					for (let i = data.start, ien = data.start + data.length; i < ien; i++) {
						out.push([i + '-1', i + '-2', i + '-3', i + '-4', i + '-5', i + '-6']);
					}

					setTimeout(function() {
						callback({
							draw: data.draw,
							data: out,
							recordsTotal: 5000,
							recordsFiltered: 5000
						});
					}, 50);
				},
				initComplete: function(setting, json) {
					table
						.clear()
						.one('draw', function () {
							expect(table.rows().count()).toBe(10);
							done();
						})
						.draw(true);
				}
			});
		});
	});
});
