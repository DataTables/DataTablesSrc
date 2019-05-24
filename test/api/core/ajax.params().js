describe('core- ajax.params()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;

	describe('Check the defaults', function() {
		dt.html('empty');
		it('Exists and is a function', function(done) {
			table = $('#example').DataTable({
				columns: dt.getTestColumns(),
				ajax: '/base/test/data/data.txt',
				initComplete: function(settings, json) {
					expect(typeof table.ajax.params).toBe('function');
					done();
				}
			});
		});
		it('Returns empty object if nothing passed', function() {
			expect(JSON.stringify(table.ajax.params())).toBe('{}');
		});

		dt.html('basic');
		it('Returns undefined for DOM sourced table', function() {
			table = $('#example').DataTable();
			expect(table.ajax.params()).toBe(undefined);
		});
	});

	describe('Functional tests', function() {
		let toSend = 'init';

		dt.html('empty');
		it('Setup', function(done) {
			table = $('#example').DataTable({
				columns: dt.getTestColumns(),
				ajax: {
					url: '/base/test/data/data.txt',
					data: function(d) {
						d.test = toSend;
					}
				},
				initComplete: function(settings, json) {
					done();
				}
			});
		});
		it('Returns single string', function() {
			expect(table.ajax.params()).toEqual({ test: 'init' });
		});
		it('Updated by ajax.reload()', function() {
			toSend = 'reload';
			table.ajax.reload();
			expect(table.ajax.params()).toEqual({ test: 'reload' });
		});
		it('Returns an object', function() {
			toSend = { second: 'object' };
			table.ajax.reload();
			expect(table.ajax.params()).toEqual({ test: { second: 'object' } });
		});
	});
});
