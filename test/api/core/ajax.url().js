describe('core- ajax.url()', function() {
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
					expect(typeof table.ajax.reload).toBe('function');
					done();
				}
			});
		});
		it('Getter returns string', function() {
			expect(typeof table.ajax.url()).toBe('string');
		});
		it('Setter returns an API instance', function() {
			expect(table.ajax.url('/base/test/data/data_small.txt') instanceof $.fn.dataTable.Api).toBe(true);
		});

		dt.html('basic');
		it('Getter returns null for DOM sourced table', function() {
			table = $('#example').DataTable();
			expect(table.ajax.url()).toBe(null);
		});
		it('Getter returns an API instance for DOM sourced table', function() {
			expect(table.ajax.url('/base/test/data/data_small.txt') instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Functional tests', function() {
		dt.html('empty');
		it('Setup', function(done) {
			table = $('#example').DataTable({
				columns: dt.getTestColumns(),
				ajax: '/base/test/data/data.txt',
				initComplete: function(settings, json) {
					done();
				}
			});
		});
		it('Getter returns original address', function() {
			expect(table.ajax.url()).toBe('/base/test/data/data.txt');
		});
		it('Does not update the table', function() {
			table.ajax.url('/base/test/data/data_small.txt');
			expect($('tbody tr:eq(1) td:eq(0)').text()).toBe('Angelica Ramos');
		});
		it('Getter returns new address', function() {
			expect(table.ajax.url()).toBe('/base/test/data/data_small.txt');
		});
		it('New data loads after reload', async function() {
			table.ajax.reload();
			await dt.sleep(500);
			expect($('tbody tr:eq(1) td:eq(0)').text()).toBe('Winter Jenkins');
		});
		it('Can give the same URL again', async function() {
			table.ajax.url('/base/test/data/data_small.txt').load();
			await dt.sleep(500);
			expect($('tbody tr:eq(1) td:eq(0)').text()).toBe('Winter Jenkins');
		});
		it('Getter returns new address', function() {
			expect(table.ajax.url()).toBe('/base/test/data/data_small.txt');
		});
		it('Can give another URL', async function() {
			table.ajax.url('/base/test/data/data.txt').load();
			await dt.sleep(500);
			expect($('tbody tr:eq(1) td:eq(0)').text()).toBe('Angelica Ramos');
		});
		it('Getter returns new address', function() {
			expect(table.ajax.url()).toBe('/base/test/data/data.txt');
		});
	});
});
