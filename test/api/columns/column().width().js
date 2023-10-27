describe('columns- column().width()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Basics', function() {
		let table;

		dt.html('basic');

		it('Exists and is a function', function() {
			table = $('#example').DataTable();
			
			expect(typeof table.column().width).toBe('function');
		});

		it('Returns a number', function() {
			expect(typeof table.column().width()).toBe('number');
		});

		it('Column 1', function() {
			let width = $('tbody tr:first-child td:nth-child(1)').outerWidth();

			expect(table.column(0).width()).toBe(width);
		});

		it('Column 2', function() {
			let width = $('tbody tr:first-child td:nth-child(2)').outerWidth();

			expect(table.column(1).width()).toBe(width);
		});

		it('Column 3', function() {
			let width = $('tbody tr:first-child td:nth-child(3)').outerWidth();

			expect(table.column(2).width()).toBe(width);
		});

		it('Column 4', function() {
			let width = $('tbody tr:first-child td:nth-child(4)').outerWidth();

			expect(table.column(3).width()).toBe(width);
		});

		it('Column 5', function() {
			let width = $('tbody tr:first-child td:nth-child(5)').outerWidth();

			expect(table.column(4).width()).toBe(width);
		});

		it('Column 6', function() {
			let width = $('tbody tr:first-child td:nth-child(6)').outerWidth();

			expect(table.column(5).width()).toBe(width);
		});

		it('When there is no data, still returns a number', function() {
			table.search('nothere').draw();
			expect(typeof table.column(0).width()).toBe('number');
		});

		it('Hidden column returns 0', function() {
			table.search('');
			table.column(1).visible(false).draw();
			expect(table.column(1).width()).toBe(0);
		});
	});
});
