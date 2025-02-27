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
		let context;
		let args;

		dt.html('basic');

		it('Returns true when table already initialised', function () {
			table = $('#example').DataTable();

			let run = false;
			table.ready(function () {
				run = true;
				context = this;
				args = arguments;
			});

			expect(run).toBe(true);
		});

		it('Sync - Context was an API reference', function () {
			expect(typeof context.draw).toBe('function');
			expect(typeof context.order).toBe('function');
		});

		it('Sync - No arguments passed', function () {
			expect(args.length).toBe(0);
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
				context = this;
				args = arguments;
			});

			expect(run).toBe(false);
		});

		it('Async - Context was an API reference', function () {
			expect(typeof context.draw).toBe('function');
			expect(typeof context.order).toBe('function');
		});

		it('Async - No arguments passed', function () {
			expect(args.length).toBe(0);
		});
	});
});
