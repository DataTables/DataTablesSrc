describe('rows- row().data()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

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
			expect(typeof table.row().data).toBe('function');
		});
	});

	describe('DOM tests', function() {
		dt.html('basic');
		it('GET - DOM Returns Array instance with all columns', function() {
			let table = $('#example').DataTable();
			let row = table.row().data();

			expect(row instanceof Array).toBe(true);
			expect(row.length).toBe(table.columns().count());
		});

		dt.html('basic');
		it('GET - DOM Sourced Data - check row contents', function() {
			let table = $('#example').DataTable();
			checkResult(table.row(testRow).data(), expectedResult);
		});

		dt.html('basic');
		it('SET - DOM Source Data - set one cell', function() {
			let table = $('#example').DataTable();
			let newRow = expectedResult.slice(0); // clone the original array

			newRow[0] = newValue;
			table.row(testRow).data(newRow);

			expect($('#example tbody tr:eq(' + testRow + ') td:eq(0)').html()).toBe(newValue);
			checkResult(table.row(testRow).data(), newRow);
		});
	});

	describe('JSON tests', function() {
		dt.html('empty');
		it('GET - JSON Returns object containing all columns', function(done) {
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
					let result = table.row(0).data();

					expect(typeof result).toBe('object');
					expect(Object.keys(result).length).toBe(table.columns().count());
					done();
				}
			});
		});

		dt.html('empty');
		it('GET - JSON Sourced Data - check row contents', function(done) {
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
					checkResult(Object.values(table.row(testRow).data()), expectedResult);
					done();
				}
			});
		});

		dt.html('empty');
		it('SET - JSON Source Data - set one cell', function(done) {
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
					// get the old row and modify it
					let newRow = table.row(testRow).data();
					newRow.name = newValue;
					table.row(testRow).data(newRow);

					expect($('#example tbody tr:eq(' + testRow + ') td:eq(0)').html()).toBe(newValue);
					checkResult(Object.values(table.row(testRow).data()), Object.values(newRow));
					done();
				}
			});
		});
	});
});
