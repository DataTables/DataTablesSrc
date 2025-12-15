describe('Legacy fnStateLoadCallback option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Configuration', function () {
		dt.html('basic');

		it('Is called', function () {
			let called = false;
			let table = $('#example').DataTable({
				stateSave: true,
				fnStateLoadCallback: function(settings, cb) {
					expect(arguments.length).toBe(2);
					called = true;
				}
			});

			expect(called).toBe(true);
		});

		// fnStateLoadCallback.js does the rest of the tests, this just checks
		// that it gets mapped over.
	});
});
