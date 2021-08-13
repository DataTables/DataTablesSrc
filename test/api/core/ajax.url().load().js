describe('core- ajax.url().load()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;
	let args;

	describe('Check the defaults', function() {
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
		it('Exists and is a function', function() {
			expect(typeof table.ajax.url('/base/test/data/data.txt').load).toBe('function');
		});
		it('Returns an API instance', function() {
			expect(table.ajax.url('/base/test/data/data.txt').load() instanceof $.fn.dataTable.Api).toBe(true);
		});
		it('Callback function called after reload', function(done) {
			table.ajax.url('/base/test/data/data_small.txt').load(function() {
				args = arguments;
				expect($('tbody tr:eq(1) td:eq(0)').text()).toBe('Winter Jenkins');
				done();
			});
		});
		it('Callback function passed correct arguments', function() {
			expect(args.length).toBe(1);
			expect(args[0].data[0].name).toBe('Steve Earl');
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
		it('By default, paging is reset', function(done) {
			table.page(2).draw(false);
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Gloria Little');

			table.ajax.url('/base/test/data/data.txt').load(function() {
				expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
				done();
			});
		});
		it('Can request page reset', function(done) {
			table.page(2).draw(false);
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Gloria Little');

			table.ajax.url('/base/test/data/data.txt').load(function() {
				expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
				done();
			}, true);
		});
		it('Can request no page reset', function(done) {
			table.page(2).draw(false);
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Gloria Little');

			table.ajax.url('/base/test/data/data.txt').load(function() {
				expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Gloria Little');
				done();
			}, false);
		});
		// Due to DD-923, null needs to be passed in for the callback function
		it('Can request page reset without callback function', async function() {
			table.page(2).draw(false);
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Gloria Little');

			table.ajax.url('/base/test/data/data.txt').load(null, true);
			await dt.sleep(500);

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});
		it('Can request no page reset without callback function', async function() {
			table.page(2).draw(false);
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Gloria Little');

			table.ajax.url('/base/test/data/data.txt').load(null, false);
			await dt.sleep(500);

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Gloria Little');
		});
		// Disabled due to DD-922 - the paging goes wobbly in this scenario.
		// it('Paging forced reset if data less', async function() {
		// 	table.page(2).draw(false);
		// 	expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Gloria Little');

		// 	table.ajax.url('/base/test/data/data_small.txt').load(null, false);
		// 	await dt.sleep(500);

		// 	expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Gloria Little');
		// });
	});
});
