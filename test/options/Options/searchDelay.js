describe('searchDelay Option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Default tests', function() {
		dt.html('basic');
		it('Default is null', function() {
			let table = $('#example').DataTable();
			expect(table.settings()[0].searchDelay).toBe(null);
		});

		dt.html('basic');
		it('Default test- Searcher all Accountants', function() {
			let table = $('#example').DataTable({
				searchDelay: 1000
			});
			expect(table.settings()[0].searchDelay).toBe(1000);
		});

		dt.html('basic');
		it('Test when given null as parameter', function() {
			let table = $('#example').DataTable({
				searchDelay: null
			});
			expect(table.settings()[0].searchDelay).toBe(null);
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		let table;
		it('First key has immediate effect', function() {
			table = $('#example').DataTable({
				searchDelay: 3000
			});
			$('div.dataTables_filter input')
				.val('z')
				.keyup();
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Gavin Cortez');
		});
		it('Second interaction has no effect before timeout', function() {
			$('div.dataTables_filter input')
				.val('o')
				.keyup();
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Gavin Cortez');
		});
		it('But has effect after timeout', async function(done) {
			await dt.sleep(3000);
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
			done();
		});
	});
});
