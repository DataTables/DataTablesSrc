describe('pluck()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			let table = $('#example').DataTable();
			expect(typeof table.pluck).toBe('function');
		});

		it('Returns API instance', function() {
			let table = $('#example').DataTable();
			expect(table.pluck() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Can use numerical parameter to get array item', function() {
			let table = $('#example').DataTable();
			let data = table
				.rows()
				.data()
				.pluck(3);
			expect(data.count()).toBe(57);
			expect(data[0]).toBe('33');
			expect(data[56]).toBe('56');
		});

		it('Can use numerical parameter to break into an array', function() {
			let table = $('#example').DataTable();
			let data = table
				.column(2)
				.data()
				.pluck(0);
			expect(data.count()).toBe(57);
			expect(data[0]).toBe('T');
			expect(data[56]).toBe('S');
		});

		dt.html('basic');
		it('Can use string parameter to get array item', function(done) {
			let table = $('#example').DataTable({
				ajax: '/base/test/data/data.txt',
				columns: dt.getTestColumns(),
				initComplete: function(settings, json) {
					let data = table
						.rows()
						.data()
						.pluck('age');
					expect(data.count()).toBe(57);
					expect(data[0]).toBe('33');
					expect(data[56]).toBe('56');
					done();
				}
			});
		});

		dt.html('basic');
		it('Can use string parameter to get array item', function(done) {
			let table = $('#example').DataTable({
				ajax: '/base/test/data/data.txt',
				columns: dt.getTestColumns(),
				initComplete: function(settings, json) {
					let data = table
						.column(2)
						.data()
						.pluck('0');
					expect(data.count()).toBe(57);
					expect(data[0]).toBe('T');
					expect(data[56]).toBe('S');
					done();
				}
			});
		});
	});
});
