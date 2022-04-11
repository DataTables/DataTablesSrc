describe('pluck()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			table = $('#example').DataTable();
			expect(typeof table.pluck).toBe('function');
		});
		it('Returns API instance', function() {
			expect(table.pluck() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Can use numerical parameter to get array item', function() {
			table = $('#example').DataTable();
			let data = table
				.rows()
				.data()
				.pluck(3);
			expect(data.count()).toBe(57);
			expect(data[0]).toBe('33');
			expect(data[56]).toBe('56');
		});

		it('Can use numerical parameter to break into an array', function() {
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
			table = $('#example').DataTable({
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
			table = $('#example').DataTable({
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

		dt.html('basic');
		it('Works with nested data', function(done) {
			table = $('#example').DataTable({
				ajax: '/base/test/data/objects_deep.txt',
				columns: [
					{ "data": "name" },
					{ "data": "hr.position" },
					{ "data": "contact.0" },
					{ "data": "contact.1" },
					{ "data": "hr.start_date" },
					{ "data": "hr.salary" }
				],
				initComplete: function(settings, json) {
					let d = table.rows().data().pluck('hr.position');

					expect(d.count()).toBe(57);
					expect(d[0]).toBe('Accountant');
					expect(d[56]).toBe('Software Engineer');

					done();
				}
			});
		});
	});
});
