describe('Div className', function() {
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
					topStart: {
						div: {
							className: 'test'
						}
					}
				}
			});

			div = $('div.dt-layout-cell').eq(0).children();

			expect(div.length).toBe(1);
		});

		it('Is empty by default', function() {
			expect(div.text()).toBe('');
		});

		it('Has class name', function() {
			expect(div[0].className).toBe('test');
		});

		it('No id', function() {
			expect(div[0].id).toBe('');
		});
	});
});
