describe('Legacy bDeferRender option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	function rowNodeCount(table, cnt) {
		expect(table.rows().nodes().count()).toBe(cnt);
	}

	describe('Check Default', function () {
		dt.html('empty');

		it('Enabled by default', function (done) {
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
					rowNodeCount(table, 10);
					done();
				}
			});
		});

		dt.html('empty');

		it('Disable with legacy parameter', function (done) {
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
					rowNodeCount(table, 57);
					done();
				},
				bDeferRender: false
			});
		});

		dt.html('empty');

		it('Disable with legacy default', function (done) {
			DataTable.defaults.bDeferRender = false;

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
					rowNodeCount(table, 57);
					done();
				}
			});
		});

		dt.html('empty');

		it('Keep enabled with legacy default', function (done) {
			DataTable.defaults.bDeferRender = true;

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
					rowNodeCount(table, 10);
					done();
				}
			});
		});

		dt.html('empty');

		it('Remove legacy default', function (done) {
			delete DataTable.defaults.bAutoWidth;

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
					rowNodeCount(table, 10);
					done();
				}
			});
		});
	});
});
