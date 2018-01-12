describe('rows- rows().data()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	// TK COLIN - see about putting this into a library file
	const testRow = 2;
	const expectedResult = ['Ashton Cox', 'Junior Technical Author', 'San Francisco', '66', '2009/01/12', '$86,000'];
	const newValue = 'New Value';

	function checkResult(result, expected) {
		expect(result[0]).toBe(expected[0]);
		expect(result[1]).toBe(expected[1]);
		expect(result[2]).toBe(expected[2]);
		expect(result[3]).toBe(expected[3]);
		expect(result[4]).toBe(expected[4]);
		expect(result[5]).toBe(expected[5]);
	}

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

			expect(rows.length).toBe(table.rows().count());
			expect(rows.count()).toBe(table.cells().count());
			checkResult(rows[testRow], expectedResult);
		});

		it('GET - DOM returns single rows', function() {
			let table = $('#example').DataTable();
			let rows = table.rows(testRow).data();

			expect(rows.length).toBe(1);
			expect(rows.count()).toBe(table.columns().count());
			checkResult(rows[0], expectedResult);
		});

		it('GET - DOM returns two rows', function() {
			let table = $('#example').DataTable();
			let rows = table.rows([0, testRow]).data();

			expect(rows.length).toBe(2);
			expect(rows.count()).toBe(2 * table.columns().count());
			checkResult(rows[1], expectedResult);
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

					expect(rows.length).toBe(table.rows().count());
					checkResult(Object.values(rows[testRow]), expectedResult);
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
					let rows = table.rows(testRow).data();

					expect(rows.length).toBe(1);
					checkResult(Object.values(rows[0]), expectedResult);
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
					let rows = table.rows([0, testRow]).data();

					expect(rows.length).toBe(2);
					checkResult(Object.values(rows[1]), expectedResult);
					done();
				}
			});
		});
	});
});
