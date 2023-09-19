describe('scrollCollapse option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Confirm behaviour when if scrollCollapse is not set', function() {
			$('#example').dataTable({
				scrollY: 300
			});
			expect($('div.dt-scroll-body').height()).toBe(300);
			expect($('#example').height()).toBeGreaterThan(300);
		});
		it('Check viewport unchanged if smaller result set', function() {
			$('div.dt-search input')
				.val('41')
				.keyup();
			expect($('div.dt-scroll-body').height()).toBe(300);
			expect($('#example').height()).toBeLessThan(300);
		});

		dt.html('basic');
		it('Confirm behaviour if scrollCollapse is set', function() {
			$('#example').dataTable({
				scrollY: 300,
				scrollCollapse: true
			});
			expect($('div.dt-scroll-body').height()).toBe(300);
			expect($('#example').height()).toBeGreaterThan(300);
		});
		it('Check viewport is shrunk to result set', function() {
			$('div.dt-search input')
				.val('41')
				.keyup();
			expect($('div.dt-scroll-body').height()).toBeLessThan(300);
			expect($('#example').height()).toBe($('div.dt-scroll-body').height());
		});
		it('Check viewport is reset when no input', function() {
			$('div.dt-search input')
				.val('')
				.keyup();
			expect($('div.dt-scroll-body').height()).toBe(300);
			expect($('#example').height()).toBeGreaterThan(300);
		});
	});
});
