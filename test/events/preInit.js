describe('core - events - preInit', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;
	let params;
	let firstCell;
	let count = 0;
	let length = 0;

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Called before table fully initialised', function() {
			table = $('#example')
				.on('preInit.dt', function() {
					params = arguments;
					firstCell = $('tbody tr:eq(0) td:eq(0)').text();
					length = $('div.dataTables_wrapper').length;
				})
				.DataTable();

			expect(firstCell).toBe('Tiger Nixon');
			expect(length).toBe(1);
		});
		it('Called with expected parameters', function() {
			expect(params.length).toBe(2);
			expect(params[0] instanceof $.Event).toBe(true);
			expect(params[1]).toBe(table.settings()[0]);
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Called on initial draw', function() {
			table = $('#example')
				.on('preInit.dt', function() {
					count++;
				})
				.DataTable();
			expect(count).toBe(1);
		});
		it('Not called when API changes page', function() {
			table.page(2).draw(false);
			expect(count).toBe(1);
		});

		dt.html('empty');
		let table;
		it('Load ajax data into an empty table', function(done) {
			length = 0;

			table = $('#example')
				.on('preInit.dt', function() {
					params = arguments;
					firstCell = $('tbody tr:eq(0) td:eq(0)').text();
					length = $('div.dataTables_wrapper').length;
				})
				.DataTable({
					columns: dt.getTestColumns(),
					ajax: '/base/test/data/data.txt',
					initComplete: function(settings, json) {
						done();
					}
				});
		});
		it('Check values', function() {
			expect(firstCell).toBe('');
			expect(length).toBe(1);
		});
	});
});
