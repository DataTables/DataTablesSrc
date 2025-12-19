describe('Div feature', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check defaults', function() {
		let table, div;

		dt.html('basic');

		it('Can create a div feature', function() {
			$('#example').DataTable({
				layout: {
					topStart: 'div'
				}
			});

			div = $('div.dt-layout-cell').eq(0).children();

			expect(div.length).toBe(1);
		});

		it('Is empty by default', function() {
			expect(div.text()).toBe('');
		});

		it('No class name', function() {
			expect(div[0].className).toBe('');
		});

		it('No id', function() {
			expect(div[0].id).toBe('');
		});
	});

	describe('Multiple', function() {
		let table, div;

		dt.html('basic');

		it('Can create multiple div features', function() {
			$('#example').DataTable({
				layout: {
					topStart: ['div', 'div', 'div']
				}
			});

			div = $('div.dt-layout-cell').eq(0).children();

			expect(div.length).toBe(3);
		});
	});
});
