describe('row - row().data()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	const newValue = 'New Value';
	const testRowData = ['Ashton Cox', 'Junior Technical Author', 'San Francisco', '66', '2009/01/12', '$86,000'];

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
			expect(row.length).toBe(6);
		});

		dt.html('basic');
		it('GET - DOM Sourced Data - check row contents', function() {
			let table = $('#example').DataTable();
			expect(
				table
					.row(2)
					.data()
					.toString()
			).toBe(testRowData.toString());
		});

		dt.html('basic');
		it('SET - DOM Source Data - set one cell', function() {
			let table = $('#example').DataTable();
			let newRow = testRowData.slice(0); // clone the original array

			newRow[0] = newValue;
			table.row(2).data(newRow);

			expect($('#example tbody tr:eq(2) td:eq(0)').html()).toBe(newValue);
			expect(
				table
					.row(2)
					.data()
					.toString()
			).toBe(newRow.toString());
		});
	});

	describe('JSON tests', function() {
		dt.html('empty');
		it('GET - JSON Returns object containing all columns', function(done) {
			let table = $('#example').DataTable({
				ajax: '/base/test/data/data.txt',
				columns: dt.getTestColumns(),
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
				columns: dt.getTestColumns(),
				initComplete: function(settings, json) {
					expect(Object.values(table.row(2).data()).toString(), testRowData.toString());
					done();
				}
			});
		});

		dt.html('empty');
		it('SET - JSON Source Data - set one cell', function(done) {
			let table = $('#example').DataTable({
				ajax: '/base/test/data/data.txt',
				columns: dt.getTestColumns(),
				initComplete: function(settings, json) {
					// get the old row and modify it
					let newRow = table.row(2).data();
					newRow.name = newValue;
					table.row(2).data(newRow);

					expect($('#example tbody tr:eq(2) td:eq(0)').html()).toBe(newValue);
					expect(Object.values(table.row(2).data()).toString()).toBe(Object.values(newRow).toString());
					done();
				}
			});
		});
	});
});
