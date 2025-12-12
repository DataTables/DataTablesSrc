describe('Legacy bRetrieve option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	function hasInfo(has) {
		expect(document.querySelectorAll('div.dt-info').length).toBe(
			has ? 1 : 0
		);
	}

	describe('Check Default', function () {
		dt.html('basic');

		it('Retrieve will not destroy and recreate the table', function () {
			new DataTable('#example');
			hasInfo(true);

			new DataTable('#example', {
				info: false,
				bRetrieve: true
			});
			hasInfo(true);
		});

		// Not testing the default - that would be mad to set it
	});
});