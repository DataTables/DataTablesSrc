describe('serverSide option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check Default', function() {
		dt.html('basic');
		it('serverSide disabled by default', function() {
			$('#example').dataTable();
			expect($.fn.dataTable.defaults.bServerSide).toBe(false);
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Server-side processing enabled', function(done) {
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
					expect(table.page.info().recordsTotal).toBe(5000);
					done();
				}
			});
		});

		dt.html('basic');
		it('Server-side processing disabled', function(done) {
			let table = $('#example').DataTable({
				processing: true,
				serverSide: false,
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
					expect(table.page.info().recordsTotal).toBe(0);
					done();
				}
			});
		});
	});
});
