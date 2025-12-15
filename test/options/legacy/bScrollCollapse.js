describe('Legacy bScrollCollapse option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');

		it('Confirm behaviour if legacy bScrollCollapse is set', function() {
			$('#example').dataTable({
				sScrollY: 300,
				bScrollCollapse: true
			});

			expect($('div.dt-scroll-body').height()).toBe(300);
			expect($('#example').height()).toBeGreaterThan(300);
		});

		it('Check viewport is shrunk to result set', function() {
			$('div.dt-search input')
				.val('41')
				.triggerNative('keyup');

			expect($('div.dt-scroll-body').height()).toBeLessThan(300);
			expect($('#example').height()).toBe($('div.dt-scroll-body').height());
		});

		it('Check viewport is reset when no input', function() {
			$('div.dt-search input')
				.val('')
				.triggerNative('keyup');

			expect($('div.dt-scroll-body').height()).toBe(300);
			expect($('#example').height()).toBeGreaterThan(300);
		});
	});
});
