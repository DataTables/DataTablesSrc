describe('columns- column().type()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Basics', function() {
		let table;

		dt.html('basic');

		it('Exists and is a function', function() {
			table = $('#example').DataTable();
			
			expect(typeof table.column().type).toBe('function');
		});

		it('Returns a string', function() {
			expect(typeof table.column(0).type()).toBe('string');
		});

		it('Default data is detected as expected', function() {
			expect(table.column(0).type()).toBe('string');
			expect(table.column(1).type()).toBe('string');
			expect(table.column(2).type()).toBe('string');
			expect(table.column(3).type()).toBe('num');
			expect(table.column(4).type()).toBe('date');
			expect(table.column(5).type()).toBe('num-fmt');
		});

		dt.html('basic');

		it('HTML type is detected at the end of the table', function() {
			$('#example tbody').append(
				'<tr><td><a href="url">ZZ link name</a></td><td>position&#10new line</td><td>office&gt;</td><td> 99 </td><td>2019/04/16</td><td>$333,333</td></tr>'
			);

			table = $('#example').DataTable();
			
			expect(table.column(0).type()).toBe('html');
		});

	});
});
