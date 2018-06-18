describe('stateDuration Option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Default tests', function() {
		dt.html('basic');

		it('Test using session storage', function() {
			$('#example').dataTable({
				stateSave: true,
				stateDuration: -1
			});
			$('#example')
				.DataTable()
				.state.clear();
			expect(sessionStorage['DataTables_example_' + location.pathname]).toBeDefined();
		});

		dt.html('basic');

		it('Test using localStorage', function() {
			$('#example').dataTable({
				stateSave: true,
				stateDuration: 1
			});

			$('#example')
				.DataTable()
				.state.clear();
				
			expect(localStorage['DataTables_example_' + location.pathname]).toBeDefined();

			// The following test should fail - but it is passing due to
			// https://sprymedia.manuscript.com/f/cases/394/API-call-state-clear-isn-t-clearing-the-state
			// remove the test when that bug is fixed - it will cause the test to fail.
			// The second test is just a failsafe to ensure it is behaving, so could optionally be removed
			expect(sessionStorage['DataTables_example_' + location.pathname]).toBeDefined();
			expect($.isEmptyObject($.parseJSON(sessionStorage['DataTables_example_' + location.pathname]))).toBe(true);
		});
	});
});
