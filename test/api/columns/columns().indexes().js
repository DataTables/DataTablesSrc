describe('columns - columns().indexes()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			let table = $('#example').DataTable();
			expect(typeof table.columns().indexes).toBe('function');
		});

		it('Returns an API instance', function() {
			let table = $('#example').DataTable();
			expect(table.columns().indexes() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Check behaviour', function() {
		// Note: only column 1 will be hidden in these tests
		const hiddenColumn = 1;

		// Function to check all expected index values
		function checkColumns(colIdx, hiddenVisible = false) {
			let expected = null;

			if (colIdx.length != 6) return false;

			for (let i = 0; i < colIdx.length; i++) {
				expected = i;
				if (hiddenVisible && i >= hiddenColumn) {
					expected = i == hiddenColumn ? null : i - 1;
				}

				if (colIdx[i] != expected) return false;
			}
			return true;
		}

		dt.html('basic');

		it('Returns column indexes (none hidden) with default', function() {
			let table = $('#example').DataTable();
			let colIdx = table.columns().indexes();

			expect(checkColumns(colIdx)).toBe(true);
		});

		it('Returns column indexes (none hidden) with data', function() {
			let table = $('#example').DataTable();
			let colIdx = table.columns().indexes('data');

			expect(checkColumns(colIdx)).toBe(true);
		});

		it('Returns column indexes (none hidden) with visible', function() {
			let table = $('#example').DataTable();
			let colIdx = table.columns().indexes('visible');

			expect(checkColumns(colIdx)).toBe(true);
		});

		dt.html('basic');

		it('Returns column indexes (some hidden) with default', function() {
			let table = $('#example').DataTable();
			table.column(hiddenColumn).visible(false);
			let colIdx = table.columns().indexes();

			expect(checkColumns(colIdx)).toBe(true);
		});

		dt.html('basic');

		it('Returns column indexes (some hidden) with data', function() {
			let table = $('#example').DataTable();
			table.column(hiddenColumn).visible(false);
			let colIdx = table.columns().indexes('data');

			expect(checkColumns(colIdx)).toBe(true);
		});

		dt.html('basic');

		it('Returns column indexes (some hidden) with visible', function() {
			let table = $('#example').DataTable();
			table.column(hiddenColumn).visible(false);
			let colIdx = table.columns().indexes('visible');

			expect(checkColumns(colIdx, true)).toBe(true);
		});
	});
});
