describe('core - events - requestChild', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;
	let params;
	let children = [];
	let columns = [{data: 'name'}, {data: 'position'}, {data: 'office'}, {data: 'age'}, {data: 'start_date'}, {data: 'salary'}];

	describe('Functional tests', function () {
		// Clear down save state before proceeding (otherwise old stuff may be lurking that will affect us)
		dt.html('basic');
		it('Clear state save', function () {
			let table = $('#example').DataTable();
			table.state.clear();
		});

		dt.html('empty');
		it('Not called on table initialisation if no stateSave', function (done) {
			table = $('#example')
				.on('requestChild.dt', function () {
					params = arguments;
				})
				.DataTable({
					ajax: '/base/test/data/id.txt',
					columns: columns,
					rowId: 'ID',
					initComplete: function () {
						expect(params).toBe(undefined);
						done();
					}
				});
		});

		dt.html('empty');
		it('Not called on table initialisation if no opened rows', function (done) {
			table = $('#example')
				.on('requestChild.dt', function () {
					params = arguments;
				})
				.DataTable({
					ajax: '/base/test/data/id.txt',
					columns: columns,
					stateSave: true,
					rowId: 'ID',
					initComplete: function () {
						expect(params).toBe(undefined);
						done();
					}
				});
		});
		it('Open a child row', function () {
			table.row(2).child('TEST').show();
		});

		dt.html('empty');
		it('Called on table initialisation if opened rows', function (done) {
			table = $('#example')
				.on('requestChild.dt', function () {
					params = arguments;
				})
				.DataTable({
					ajax: '/base/test/data/id.txt',
					columns: columns,
					stateSave: true,
					rowId: 'ID',
					initComplete: function () {
						expect(params).not.toBe(undefined);
						done();
					}
				});
		});
		it('Check parameter types', function () {
			expect(params.length).toBe(2);
			expect(params[0] instanceof $.Event).toBe(true);
			expect(params[1] instanceof $.fn.dataTable.Api).toBe(true);
		});
		it('Check parameters', function () {
			expect(params[0].type).toBe('requestChild');
			expect(params[1].index()).toBe(2);
		});
		it('Open child rows', function () {
			table.row(2).child('TEST').show();
			table.row(3).child('TEST').show();
		});

		dt.html('empty');
		it('Called for each opened row', function (done) {
			table = $('#example')
				.on('requestChild.dt', function () {
					children.push(arguments[1].index());
				})
				.DataTable({
					ajax: '/base/test/data/id.txt',
					columns: columns,
					stateSave: true,
					rowId: 'ID',
					initComplete: function () {
						done();
					}
				});
		});
		it('Check parameters', function () {
			expect(children.length).toBe(2);
			expect(children).toEqual([2, 3]);
		});
	});
});
