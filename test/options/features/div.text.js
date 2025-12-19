describe('Div text', function() {
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
							text: 'My life has been <a>tapestry</a>'
						}
					}
				}
			});

			div = $('div.dt-layout-cell').eq(0).children();

			expect(div.length).toBe(1);
		});

		it('Text is set, with HTML not rendered', function() {
			expect(div.text()).toBe('My life has been <a>tapestry</a>');
		});

		it('No class name', function() {
			expect(div[0].className).toBe('');
		});

		it('No id', function() {
			expect(div[0].id).toBe('');
		});
	});
});
