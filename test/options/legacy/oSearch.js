describe('Legacy oSearch option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check Default', function () {
		dt.html('basic');

		it('Set with legacy parameter', function () {
			new DataTable('#example', {
				oSearch: {
					sSearch: 'Nash'
				}
			});

			expect($('#example tbody td:eq(0)').text()).toBe('Bruno Nash');
		});
	});
});
