describe('Legacy fnStateSaveCallback option', function () {
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
				stateSaveCallback: function(settings, data) {
					expect(arguments.length).toBe(2);
					called = true;
				}
			});

			expect(called).toBe(true);
		});

		// stateSaveCallback.js does the rest of the tests, this just checks
		// that it gets mapped over.
	});
});
