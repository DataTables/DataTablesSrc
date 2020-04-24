describe('displayStart Option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Check default is 0', function() {
			let table = $('#example').DataTable();

			expect(table.page.info().start).toBe(0);
			expect($('div.dataTables_info').html()).toBe('Showing 1 to 10 of 57 entries');
		});

		dt.html('basic');
		it('Set to non-default', function() {
			table = $('#example').DataTable({
				displayStart: 20
			});

			expect(table.page.info().start).toBe(20);
			expect($('div.dataTables_info').html()).toBe('Showing 21 to 30 of 57 entries');
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('In conjunction with pageLength', function() {
			table = $('#example').DataTable({
				displayStart: 20,
				pageLength: 5
			});

			expect(table.page.info().start).toBe(20);
			expect($('div.dataTables_info').html()).toBe('Showing 21 to 25 of 57 entries');
		});

		dt.html('basic');
		it('Invalid value', function() {
			table = $('#example').DataTable({
				displayStart: 88
			});

			expect(table.page.info().start).toBe(0);
			expect($('div.dataTables_info').html()).toBe('Showing 1 to 10 of 57 entries');
		});
	});

	describe('Integration style tests', function() {
		// This will fail when manuscript case #514 is fixed
		dt.html('basic');
		it('Paging disabled', function() {
			table = $('#example').DataTable({
				paging: false,
				displayStart: 20
			});

			expect(table.page.info().start).toBe(20);
			expect($('div.dataTables_info').html()).toBe('Showing 21 to 57 of 57 entries');
		});

		dt.html('basic');
		it('Server-side processing', function(done) {
			let table = $('#example').DataTable({
				processing: true,
				serverSide: true,
				displayStart: 30,
				ajax: dt.serverSide,
				initComplete: function(setting, json) {
					expect(table.page.info().start).toBe(30);
					expect($('div.dataTables_info').html()).toBe('Showing 31 to 40 of 5,000,000 entries');
					expect($('#example tbody tr td:eq(0)').text()).toBe('30-1');
					done();
				}
			});
		});

		dt.html('basic');
		it('Server-side processing with deferRender', function(done) {
			let table = $('#example').DataTable({
				processing: true,
				serverSide: true,
				deferRender: true,
				displayStart: 30,
				ajax: dt.serverSide,
				initComplete: function(setting, json) {
					expect(table.page.info().start).toBe(30);
					expect($('div.dataTables_info').html()).toBe('Showing 31 to 40 of 5,000,000 entries');
					expect($('#example tbody tr td:eq(0)').text()).toBe('30-1');
					done();
				}
			});
		});

		// defer loading
	});
});
