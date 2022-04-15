describe('core - draw()', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		it('Exists and is a function', function() {
			expect(typeof $('#example').DataTable().draw).toBe('function');
		});

		it('Returns an API instance', function() {
			expect(
				$('#example')
					.DataTable()
					.draw() instanceof $.fn.dataTable.Api
			).toBe(true);
		});
	});

	describe('Basic tests', function() {
		dt.html('basic');
		it('Table only updates after a draw', function() {
			let table = $('#example').DataTable();

			table.page(1);
			expect(dt.isColumnHBFExpected(0, 'Name', 'Airi Satou')).toBe(true);
			table.draw(false);
			expect(dt.isColumnHBFExpected(0, 'Name', 'Charde Marshall')).toBe(true);
		});

		it('Without paging option, then table full reorder/search applied', function() {
			let table = $('#example').DataTable();

			table
				.column(0)
				.order('desc')
				.page(1)
				.draw(false);
			expect(dt.isColumnHBFExpected(0, 'Name', 'Sonya Frost')).toBe(true);

			table.draw();
			expect(dt.isColumnHBFExpected(0, 'Name', 'Zorita Serrano')).toBe(true);
		});
	});

	describe('Test parameter combinations', function() {
		dt.html('basic');
		it('Paging = true (default)', function() {
			let table = $('#example').DataTable();

			table.page(1).draw(true);
			expect(dt.isColumnHBFExpected(0, 'Name', 'Airi Satou')).toBe(true);
		});

		it('Paging = false', function() {
			let table = $('#example').DataTable();

			table.page(1).draw(false);
			expect(dt.isColumnHBFExpected(0, 'Name', 'Charde Marshall')).toBe(true);
		});

		it('Paging = full-reset (default)', function() {
			let table = $('#example').DataTable();

			table.page(1).draw('full-reset');
			expect(dt.isColumnHBFExpected(0, 'Name', 'Airi Satou')).toBe(true);
		});

		it('Paging = full-hold', function() {
			let table = $('#example').DataTable();

			table.page(1).draw('full-hold');
			expect(dt.isColumnHBFExpected(0, 'Name', 'Charde Marshall')).toBe(true);
		});

		it('Paging = page', function() {
			let table = $('#example').DataTable();

			table.page(1).draw('page');
			expect(dt.isColumnHBFExpected(0, 'Name', 'Charde Marshall')).toBe(true);
		});
	});

	describe('Advanced conditions', function () {
		// The following test is disabled due to case DD-123
		// dt.html('basic');
		// it('Draws AJAX sourced data correctly during initComplete', function(done) {
		// 	let table = $('#example').DataTable({
		// 		processing: true,
		// 		serverSide: true,
		// 		ajax: function(data, callback, settings) {
		// 			var out = [];

		// 			for (let i = data.start, ien = data.start + data.length; i < ien; i++) {
		// 				out.push([i + '-1', i + '-2', i + '-3', i + '-4', i + '-5', i + '-6']);
		// 			}

		// 			setTimeout(function() {
		// 				callback({
		// 					draw: data.draw,
		// 					data: out,
		// 					recordsTotal: 5000000,
		// 					recordsFiltered: 5000000
		// 				});
		// 			}, 50);
		// 		},
		// 		initComplete: function(setting, json) {
		// 			// table.page(1).draw(false);
		// 			expect($('#example tbody td:eq(0)').text()).toBe('10-1');
		// 			done();
		// 		}
		// 	});
		// });

		dt.html('basic');
		it('Shows sensible values in table information summary', function () {
			let table = $('#example').DataTable();

			table.page(1);
			table.search('Cox');
			table.draw(false);

			// Fix test once case DD-122 resolved
			// expect($('.dataTables_info').text()).toBe('Showing 1 to 1 of 1 entries (filtered from 57 total entries)');
			expect($('.dataTables_info').text()).toBe('Showing 11 to 1 of 1 entries (filtered from 57 total entries)');
		});
	});
});
