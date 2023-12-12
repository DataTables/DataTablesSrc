describe('core - ready()', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table, data;

	describe('Check the defaults', function () {
		dt.html('basic');

		it('Exists and is a function', function () {
			table = $('#example').DataTable();
			expect(typeof table.ready).toBe('function');
		});
	});

	describe('No parameters - getter', function () {
		dt.html('basic');

		it('Returns true when table already initialised', function () {
			table = $('#example').DataTable();
			expect(table.ready()).toBe(true);
		});

		dt.html('empty');

		it('Async loading', function (done) {
			table = $('#example').DataTable({
				ajax: '/base/test/data/data.txt',
				columns: [
					{data: 'name'},
					{data: 'position'},
					{data: 'office'},
					{data: 'age'},
					{data: 'start_date'},
					{data: 'salary'}
				],
				initComplete: function () {
					expect(table.ready()).toBe(true);
					done();
				}
			});

			expect(table.ready()).toBe(false);
		});
	});

	describe('One parameter - function', function () {
		dt.html('basic');

		it('Returns true when table already initialised', function () {
			table = $('#example').DataTable();

			let run = false;
			table.ready(function () {
				run = true;
			});

			expect(run).toBe(true);
		});

		dt.html('empty');

		it('Async loading', function (done) {
			let run = false;

			table = $('#example').DataTable({
				ajax: '/base/test/data/data.txt',
				columns: [
					{data: 'name'},
					{data: 'position'},
					{data: 'office'},
					{data: 'age'},
					{data: 'start_date'},
					{data: 'salary'}
				],
				initComplete: function () {
					// Need a timeout as `initComplete` happens before the `init` event
					// is called (which is what the ready function listens for).
					setTimeout(function () {
						expect(run).toBe(true);
						done();
					}, 100);
				}
			});

			table.ready(function () {
				run = true;
			});

			expect(run).toBe(false);
		});
	});
});
