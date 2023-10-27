describe('columns- columns().widths()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Basics', function() {
		let table;

		dt.html('basic');

		it('Exists and is a function', function() {
			table = $('#example').DataTable();
			
			expect(typeof table.columns().widths).toBe('function');
		});

		it('Returns an API instance', function() {
			expect(table.columns().widths() instanceof DataTable.Api).toBe(true);
		});

		it('Consecutive columns', function() {
			let a = table.column(0).width();
			let b = table.column(1).width();
			let sum = Math.round(a+b);

			expect(Math.round(table.columns([0,1]).widths().reduce((acc, v) => acc + v))).toBe(sum);
		});

		it('Discountinuous columns', function() {
			let a = table.column(0).width();
			let b = table.column(3).width();
			let sum = Math.round(a+b);

			expect(Math.round(table.columns([0,3]).widths().reduce((acc, v) => acc + v))).toBe(sum);
		});

		it('Sums the width of all columns', function() {
			let a = table.column(0).width();
			let b = table.column(1).width();
			let c = table.column(2).width();
			let d = table.column(3).width();
			let e = table.column(4).width();
			let f = table.column(5).width();
			let sum = Math.round(a+b+c+d+e+f);

			expect(Math.round(table.columns().widths().reduce((acc, v) => acc + v))).toBe(sum);
		});

		it('When there is no data, still returns a value', function() {
			table.search('nothere').draw();
			expect(typeof table.columns().widths()[0]).toBe('number');
		});
	});
});
