describe('rows- rows().data()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	const testRowData = ['Ashton Cox', 'Junior Technical Author', 'San Francisco', '66', '2009/01/12', '$86,000'];

	describe('Check the defaults', function() {
		dt.html('basic');

		it('Exists and is a function', function() {
			let table = $('#example').DataTable();
			expect(typeof table.rows().data).toBe('function');
		});

		dt.html('basic');
		it('Returns an API instance', function() {
			let table = $('#example').DataTable();
			expect(table.rows().data() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('DOM tests', function() {
		dt.html('basic');

		it('GET - DOM returns all rows', function() {
			let table = $('#example').DataTable();
			let rows = table.rows().data();

			expect(rows.length).toBe(57);
			expect(rows.count()).toBe(57 * 6);

			expect(rows[2].toString()).toBe(testRowData.toString());
		});

		it('GET - DOM returns single rows', function() {
			let table = $('#example').DataTable();
			let rows = table.rows(2).data();

			expect(rows.length).toBe(1);
			expect(rows.count()).toBe(6);
			expect(rows[0].toString()).toBe(testRowData.toString());
		});

		it('GET - DOM returns two rows', function() {
			let table = $('#example').DataTable();
			let rows = table.rows([0, 2]).data();

			expect(rows.length).toBe(2);
			expect(rows.count()).toBe(2 * 6);
			expect(rows[1].toString()).toBe(testRowData.toString());
		});
	});

	describe('AJAX tests', function() {
		dt.html('empty');
		it('GET - AJAX returns all rows', function(done) {
			let table = $('#example').DataTable({
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
					let rows = table.rows().data();

					expect(rows.length).toBe(57);
					expect(Object.values(rows[2]).toString()).toBe(testRowData.toString());
					done();
				}
			});
		});

		dt.html('empty');
		it('GET - AJAX returns single rows', function(done) {
			let table = $('#example').DataTable({
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
					let rows = table.rows(2).data();

					expect(rows.length).toBe(1);
					expect(Object.values(rows[0]).toString()).toBe(testRowData.toString());
					done();
				}
			});
		});

		dt.html('empty');
		it('GET - AJAX returns single rows', function(done) {
			let table = $('#example').DataTable({
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
					let rows = table.rows([0, 2]).data();

					expect(rows.length).toBe(2);
					expect(Object.values(rows[1]).toString()).toBe(testRowData.toString());
					done();
				}
			});
		});
	});
});
