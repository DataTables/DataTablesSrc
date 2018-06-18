describe('columns- columns().data()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	function checkSingleColumn() {
		let table = $('#example').DataTable();
		let testData = table.columns(0).data();

		expect(testData.length).toBe(1);
		expect(testData.count()).toBe(57);

		expect(testData[0][0]).toBe('Airi Satou');
		expect(testData[0][2]).toBe('Ashton Cox');
		expect(testData[0][table.rows().count() - 1]).toBe('Zorita Serrano');
	}

	function checkTwoColumns() {
		let table = $('#example').DataTable();
		let testData = table.columns([0, 1]).data();

		expect(testData.length).toBe(2);
		expect(testData.count()).toBe(57 * 2);

		expect(testData[0][0]).toBe('Airi Satou');
		expect(testData[1][0]).toBe('Accountant');

		expect(testData[0][2]).toBe('Ashton Cox');
		expect(testData[1][2]).toBe('Junior Technical Author');

		expect(testData[0][table.rows().count() - 1]).toBe('Zorita Serrano');
		expect(testData[1][table.rows().count() - 1]).toBe('Software Engineer');
	}

	function checkAllColumns() {
		let table = $('#example').DataTable();
		let testData = table.columns().data();
		const testRowData = ['Ashton Cox', 'Junior Technical Author', 'San Francisco', '66', '2009/01/12', '$86,000'];

		expect(testData.length).toBe(6);
		expect(testData.count()).toBe(57 * 6);

		for (let i = 0; i < 6; i++) {
			expect(testData[i][2]).toBe(testRowData[i]);
		}
	}

	describe('Check the defaults', function() {
		dt.html('basic');

		it('Exists and is a function', function() {
			let table = $('#example').DataTable();
			expect(typeof table.columns().data).toBe('function');
		});

		dt.html('basic');
		it('Returns an API instance', function() {
			let table = $('#example').DataTable();
			expect(table.columns().data() instanceof $.fn.dataTable.Api).toBe(true);
		});

		dt.html('basic');
		it('Data is returned for single column only.', function() {
			checkSingleColumn();
		});

		dt.html('basic');
		it('Data is returned for two columns.', function() {
			checkTwoColumns();
		});

		dt.html('basic');
		it('Data is returned for all columns.', function() {
			checkAllColumns();
		});
	});

	// TK COLIN see if this can be tidied up
	describe('Repeated with AJAX based table', function() {
		dt.html('empty');
		it('Exists and is a function', function(done) {
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
					expect(typeof table.columns().data).toBe('function');
					done();
				}
			});
		});

		dt.html('empty');
		it('Returns an API instance', function(done) {
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
					expect(table.columns().data() instanceof $.fn.dataTable.Api).toBe(true);
					done();
				}
			});
		});

		dt.html('empty');
		it('Data is returned for single column only.', function(done) {
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
					checkSingleColumn();
					done();
				}
			});
		});

		dt.html('empty');
		it('Data is returned for two columns.', function(done) {
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
					checkTwoColumns();
					done();
				}
			});
		});

		dt.html('empty');
		it('Data is returned for all columns.', function(done) {
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
					checkAllColumns();
					done();
				}
			});
		});
	});
});
