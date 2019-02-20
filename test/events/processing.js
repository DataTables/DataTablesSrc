describe('core - events - processing', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;
	let count;
	let params;
	let results;

	function reset() {
		count = 0;
		params = undefined;
		results = [];
	}

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Called before data loaded', function() {
			reset();
			table = $('#example')
				.on('processing.dt', function() {
					count++;
					params = arguments;
					results.push(arguments[2]);
				})
				.DataTable();

			expect(count).toBe(2);
		});
		it('Called with expected parameters', function() {
			expect(params.length).toBe(3);
			expect(params[0] instanceof $.Event).toBe(true);
			expect(params[1]).toBe(table.settings()[0]);
			expect(typeof params[2]).toBe('boolean');
			expect(results).toEqual([true, false]);
		});
	});

	describe('Functional tests', function() {
		dt.html('empty');
		it('Called when not Ajax initialisation', function() {
			reset();
			table = $('#example')
				.on('processing.dt', function() {
					count++;
					params = arguments;
					results.push(arguments[2]);
				})
				.DataTable({
					processing: false
				});
			expect(count).toBe(2);
		});
		it('Not called when changing page', function() {
			reset();
			table.page(2).draw(false);
			//DD797 - this should be 1
			expect(count).toBe(0);
		});
		it('Not called when changing order', function() {
			reset();
			table.order([2, 'asc']).draw(false);
			expect(count).toBe(0);
		});
		it('Not called when searching', function() {
			reset();
			table.search('cox').draw(false);
			expect(count).toBe(0);
		});

		dt.html('empty');
		it('Called when processing enabled', function() {
			reset();
			table = $('#example')
				.on('processing.dt', function() {
					count++;
					params = arguments;
					results.push(arguments[2]);
				})
				.DataTable({
					processing: true
				});
			expect(count).toBe(2);
		});
		it('Not called when changing page', function() {
			reset();
			table.page(2).draw(false);
			expect(count).toBe(0);
		});

		dt.html('empty');
		it('Load ajax data into an empty table', function(done) {
			reset();
			table = $('#example')
				.on('processing.dt', function() {
					count++;
					params = arguments;
					results.push(arguments[2]);
				})
				.DataTable({
					columns: dt.getTestColumns(),
					ajax: '/base/test/data/data.txt',
					initComplete: function(settings, json) {
						expect(count).toBe(2);
						expect(results).toEqual([true, false]);
						done();
					}
				});
		});
		it('Called on ajax reload', function(done) {
			reset();
			table.ajax.reload(function callback() {
				done();
			});
		});
		it('Called on ajax reload', function() {
			expect(count).toBe(2);
			expect(results).toEqual([true, false]);
		});
	});
});
