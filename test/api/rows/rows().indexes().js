describe('rows- rows().indexes()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');

		it('Exists and is a function', function() {
			let table = $('#example').DataTable();
			expect(typeof table.rows().indexes).toBe('function');
		});

		it('Returns an API instance', function() {
			let table = $('#example').DataTable();
			expect(table.rows().indexes() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Check behaviour', function() {
		dt.html('basic');

		it('Correct indexes when no rows selected', function() {
			let table = $('#example').DataTable();
			expect(table.rows().indexes().length).toBe(57);
		});

		it('Correct indexes if no rows are selected', function() {
			let table = $('#example').DataTable();
			expect(table.rows('.selected').indexes().length).toBe(0);
		});

		dt.html('basic');

		it('Correct indexes if one row is selected', function() {
			let table = $('#example').DataTable();
			$(table.row(2).node()).addClass('selected');

			let rowIdx = table.rows('.selected').indexes();

			expect(rowIdx.length).toBe(1);
			expect(rowIdx[0]).toBe(2);
		});

		dt.html('basic');

		it('Correct indexes if two rows are selected', function() {
			let table = $('#example').DataTable();
			$(table.row(2).node()).addClass('selected');
			$(table.row(4).node()).addClass('selected');

			let rowIdx = table.rows('.selected').indexes();

			expect(rowIdx.length).toBe(2);
			expect($.inArray(2, rowIdx)).not.toBe(-1);
			expect($.inArray(4, rowIdx)).not.toBe(-1);
		});
	});
});
