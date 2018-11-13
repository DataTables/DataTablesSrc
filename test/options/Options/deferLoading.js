describe( "deferLoading option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );


	describe('Check Default', function() {
		dt.html('basic');
		it('deferLoading disabled by default', function() {
			$('#example').dataTable();
			expect($.fn.dataTable.defaults.iDeferLoading).toBe(null);
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Single number (rows)', function(done) {
			let table = $('#example').DataTable({
				deferLoading: 33,
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
					expect($('div.dataTables_info').text()).toBe('Showing 1 to 10 of 33 entries');
					done();
				}
			});
		});

		dt.html('basic');
		it('Two numbers (rows and total length)', function(done) {
			let table = $('#example').DataTable({
				deferLoading: [33, 22],
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
					expect($('div.dataTables_info').text()).toBe('Showing 1 to 10 of 33 entries (filtered from 22 total entries)');
					done();
				}
			});
		});
	});
});
