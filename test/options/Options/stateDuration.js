describe('stateDuration Option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;

	describe('Functional tests', function() {
		dt.html('basic');
		it('Infinite duration', function() {
			table = $('#example').DataTable({
				stateSave: true,
				stateDuration: 0
			});

			table.search('cox').draw();
		});
		dt.html('basic');
		it('... keeps value immediately', function() {
			table = $('#example').DataTable({
				stateSave: true
			});
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Ashton Cox');
		});
		dt.html('basic');
		it('... and after 2 seconds', async function(done) {
			await dt.sleep(2000);
			table = $('#example').DataTable({
				stateSave: true
			});
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Ashton Cox');
			done();
		});

		dt.html('basic');
		it('1 second duration', function() {
			table = $('#example').DataTable({
				stateSave: true,
				stateDuration: 1
			});

			table.search('cox').draw();
		});
		dt.html('basic');
		it('... keeps value immediately', function() {
			table = $('#example').DataTable({
				stateSave: true,
				stateDuration: 1
			});
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Ashton Cox');
		});
		dt.html('basic');
		it('... but not after 2 seconds', async function(done) {
			await dt.sleep(2000);
			table = $('#example').DataTable({
				stateSave: true,
				stateDuration: 1
			});
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
			done();
		});

		dt.html('basic');
		it('1 second duration', function() {
			table = $('#example').DataTable({
				stateSave: true,
				stateDuration: 1
			});

			table.search('cox').draw();
			table.state.clear();
		});
		dt.html('basic');
		it('... still loses value if state cleared', function() {
			table = $('#example').DataTable({
				stateSave: true,
				stateDuration: 1
			});
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});
	});

	describe('old tests (really tests for state().clear()', function() {
		dt.html('basic');
		it('Test using session storage', function() {
			table = $('#example').DataTable({
				stateSave: true,
				stateDuration: -1
			});
			table.state.clear();
			expect(sessionStorage['DataTables_example_' + location.pathname]).toBeDefined();
		});

		dt.html('basic');
		it('Test using localStorage', function() {
			table = $('#example').DataTable({
				stateSave: true,
				stateDuration: 1
			});

			table.state.clear();

			expect(localStorage['DataTables_example_' + location.pathname]).toBeDefined();

			// The following test should fail - but it is passing due to
			// https://sprymedia.atlassian.net/browse/DD-205
			// remove the test when that bug is fixed - it will cause the test to fail.
			// The second test is just a failsafe to ensure it is behaving, so could optionally be removed
			expect(sessionStorage['DataTables_example_' + location.pathname]).toBeDefined();
			expect($.isEmptyObject($.parseJSON(sessionStorage['DataTables_example_' + location.pathname]))).toBe(true);
		});
	});
});
