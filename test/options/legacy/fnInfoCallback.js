describe('Legacy fnInfoCallback option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');

		it('Is called when set', function() {
			let isCalled = false;

			$('#example').dataTable({
				fnInfoCallback: function () {
					isCalled = true;
					return 'abc';
				}
			});

			expect($('div.dt-info').text()).toBe('abc');
			expect(isCalled).toBe(true);
		});
	});
});
