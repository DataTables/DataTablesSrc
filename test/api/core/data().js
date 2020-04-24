describe('core - data()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			expect(typeof $('#example').DataTable().data).toBe('function');
		});
		it('Returns an API instance', function() {
			expect(
				$('#example')
					.DataTable()
					.data() instanceof $.fn.dataTable.Api
			).toBe(true);
		});
	});

	describe('Functional tests (DOM)', function() {
		dt.html('basic');
		let table, data;
		it('Contains data for each row', function() {
			table = $('#example').DataTable();
			data = table.data();
			expect(data.length).toBe(57);
		});
		it('In the order of the index', function() {
			expect(data[0][0]).toBe('Tiger Nixon');
			expect(data[56][0]).toBe('Donna Snider');
		});
	});

	describe('Functional tests (AJAX loaded array)', function() {
		dt.html('empty');
		let table, data;
		it('Ensure all data loaded correctly', function(done) {
			table = $('#example').DataTable({
				ajax: '/base/test/data/array.txt',
				deferRender: true,
				initComplete: function(settings, json) {
					data = table.data();
					expect(data.length).toBe(57);
					done();
				}
			});
		});
		it('In the order of the index', function() {
			expect(data[0][0]).toBe('Tiger Nixon');
			expect(data[56][0]).toBe('Donna Snider');
		});
	});

	describe('Functional tests (AJAX loaded object)', function() {
		dt.html('empty');
		let table, data;
		it('Ensure all data loaded correctly', function(done) {
			table = $('#example').DataTable({
				ajax: '/base/test/data/data.txt',
				deferRender: true,
				columns: [
					{ data: 'name' },
					{ data: 'position' },
					{ data: 'office' },
					{ data: 'age' },
					{ data: 'start_date' },
					{ data: 'salary' }
				],
				initComplete: function(settings, json) {
					data = table.data();
					expect(data.length).toBe(57);
					done();
				}
			});
		});
		it('In the order of the index', function() {
			expect(data[0].name).toBe('Tiger Nixon');
			expect(data[56].name).toBe('Donna Snider');
		});
	});

	describe('Functional tests (general)', function() {
		dt.html('empty');
		let table, record;
		it('Adding rows from an array', function() {
			record = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth'];
			table = $('#example').DataTable();
			table.row.add(record).draw();
			let data = table.data();
			expect(data.length).toBe(1);
			expect(data[0][2]).toBe('Third');
		});
		it('Change the record - data updated', function() {
			record[2] = 'Changed';
			let data = table.data();
			expect(data.length).toBe(1);
			expect(data[0][2]).toBe('Changed');
		});
	});
});
