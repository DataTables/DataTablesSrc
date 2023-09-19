describe('searching option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Default is enabled', function() {
			expect($.fn.dataTable.defaults.bFilter).toBe(true);
		});

		dt.html('basic');
		it('Filter there if not specified', function() {
			$('#example').DataTable();
			expect($('div.dt-search').length).toBe(1);
		});

		dt.html('basic');
		it('Filter there if  specified', function() {
			$('#example').DataTable({
				searching: true
			});
			expect($('div.dt-search').length).toBe(1);
		});

		dt.html('basic');
		it('Filter not there if disabled', function() {
			$('#example').DataTable({
				searching: false
			});
			expect($('div.dt-search').length).toBe(0);
		});
	});

	describe('Functional tests', function() {
		dt.html('two_tables');
		it('Can specify differently on multiple tables', function() {
			$('#example_one').DataTable({
				searching: true
			});
			$('#example_two').DataTable({
				searching: false
			});

			expect($('#example_one_wrapper div.dt-search').length).toBe(1);
			expect($('#example_two_wrapper div.dt-search').length).toBe(0);
		});
	});

	// the following tests are historical - a bit verbose and not focused on the option, but does no harm to leave in
	describe('Check searches', function() {
		dt.html('basic');
		it('searching enabled by default- DOM', function() {
			$('#example').dataTable();
			$('div.dt-search input')
				.val(33)
				.keyup();
			expect(
				$('div.dt-info').html() == 'Showing 1 to 2 of 2 entries (filtered from 57 total entries)'
			).toBeTruthy();
		});

		it('searching enabled by default- API', function() {
			$('#example')
				.DataTable()
				.search(33)
				.draw();
			expect(
				$('div.dt-info').html() == 'Showing 1 to 2 of 2 entries (filtered from 57 total entries)'
			).toBeTruthy();
		});

		it('Can search multiple space separated words- DOM', function() {
			$('div.dt-search input')
				.val('New 3')
				.keyup();
			expect(
				$('div.dt-info').html() == 'Showing 1 to 5 of 5 entries (filtered from 57 total entries)'
			).toBeTruthy();
		});

		it('Can search multiple space separated words- API', function() {
			$('#example')
				.DataTable()
				.search('New 3')
				.draw();
			expect(
				$('div.dt-info').html() == 'Showing 1 to 5 of 5 entries (filtered from 57 total entries)'
			).toBeTruthy();
		});
	});

	describe('Check can disable', function() {
		dt.html('basic');
		it('Searching can be disabled', function() {
			$('#example').dataTable({
				searching: false
			});
			expect($('div.dt-search').is(':visible')).toBe(false);
		});

		it('Searching on disabled table has no effect- DOM', function() {
			$('div.dt-search input')
				.val('New 3')
				.keyup();
			expect($('div.dt-info').html() == 'Showing 1 to 10 of 57 entries').toBeTruthy();
		});

		it('Searching on disabled table has no effect- API', function() {
			$('#example')
				.DataTable()
				.search(33)
				.draw();
			expect($('div.dt-info').html() == 'Showing 1 to 10 of 57 entries').toBeTruthy();
		});
	});

	describe('Check enable override', function() {
		dt.html('basic');
		it('Searching enabled override- DOM', function() {
			$('#example').dataTable({
				searching: true
			});
			$('div.dt-search input')
				.val('New 3')
				.keyup();
			expect(
				$('div.dt-info').html() == 'Showing 1 to 5 of 5 entries (filtered from 57 total entries)'
			).toBeTruthy();
		});

		it('Searching enabled override- API', function() {
			$('#example')
				.DataTable()
				.search('New 3')
				.draw();
			expect(
				$('div.dt-info').html() == 'Showing 1 to 5 of 5 entries (filtered from 57 total entries)'
			).toBeTruthy();
		});
	});
});
