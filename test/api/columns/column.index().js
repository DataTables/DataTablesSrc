describe('columns - column.index()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	function doCheckColumns(type, indexArray) {
		let table = $('#example').DataTable();
		for (let pos = 0; pos < indexArray.length; pos++) {
			expect(table.column.index(type, Number(pos))).toBe(indexArray[pos]);
		}
		expect(table.column.index(type, indexArray.length)).toBeNull();
	}

	// Double up the tests to avoid duplication
	function checkColumns(type, indexArray) {
		let fromVisible = ['fromVisible', 'toData'];
		let fromData = ['fromData', 'toVisible'];
		let toTest = fromVisible.includes(type) ? fromVisible : fromData;

		toTest.forEach(function(testType) {
			doCheckColumns(testType, indexArray);
		});
	}

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			expect(typeof $('#example').DataTable().column.index).toBe('function');
		});
	});

	describe('Check fromVisible', function() {
		dt.html('basic');
		it('When all visible', function() {
			checkColumns('fromVisible', [0, 1, 2, 3, 4, 5]);
		});

		dt.html('basic');
		it('When none visible', function() {
			$('#example')
				.DataTable()
				.columns()
				.visible(false);
			checkColumns('fromVisible', []);
		});

		dt.html('basic');
		it('Hide first column - check data index', function() {
			$('#example')
				.DataTable()
				.column(0)
				.visible(false);
			checkColumns('fromVisible', [1, 2, 3, 4, 5]);
		});

		dt.html('basic');
		it('Hide last column - check data index', function() {
			$('#example')
				.DataTable()
				.column(5)
				.visible(false);
			checkColumns('fromVisible', [0, 1, 2, 3, 4]);
		});

		dt.html('basic');
		it('Hide middle columns - check data index', function() {
			$('#example')
				.DataTable()
				.columns([2, 4])
				.visible(false);
			checkColumns('fromVisible', [0, 1, 3, 5]);
		});
	});

	describe('Check fromData', function() {
		dt.html('basic');
		it('When all visible', function() {
			checkColumns('fromData', [0, 1, 2, 3, 4, 5]);
		});

		dt.html('basic');
		it('When none visible', function() {
			$('#example')
				.DataTable()
				.columns()
				.visible(false);
			checkColumns('fromData', [null, null, null, null, null, null]);
		});

		dt.html('basic');
		it('Hide first column - check data index', function() {
			$('#example')
				.DataTable()
				.column(0)
				.visible(false);
			checkColumns('fromData', [null, 0, 1, 2, 3, 4]);
		});

		dt.html('basic');
		it('Hide last column - check data index', function() {
			$('#example')
				.DataTable()
				.column(5)
				.visible(false);
			checkColumns('fromData', [0, 1, 2, 3, 4, null]);
		});

		dt.html('basic');
		it('Hide middle columns - check data index', function() {
			$('#example')
				.DataTable()
				.columns([2,4])
				.visible(false);
			checkColumns('fromData', [0, 1, null, 2, null, 3]);
		});
	});
});
