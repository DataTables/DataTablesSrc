describe('paging.numbers option', function() {
	let table;

	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});
	

	function checkButtons(buttons) {
		var dom = $('div.dt-paging > nav').children();

		if (dom.length !== buttons.length) {
			throw new Error('Paging buttons are an unexpected length');
		}

		buttons.forEach((btn, i) => {
			let domBtn = dom.eq(i);

			if (typeof btn === 'number') {
				expect(domBtn.html() * 1).toBe(btn);
			}
			else {
				expect(domBtn.attr('data-dt-idx')).toBe(btn);
			}
		});
	}

	describe('Tests', function() {
		dt.html('basic');

		it('Default is enabled', function() {
			table = $('#example').DataTable();

			checkButtons(['first', 'previous', 1, 2, 3, 4, 5, 6, 'next', 'last']);
		});
		
		dt.html('basic');

		it('Disable numbers', function() {
			table = $('#example').DataTable({
				layout: {
					bottomEnd: {
						paging: {
							numbers: false
						}
					}
				}
			});

			checkButtons(['first', 'previous', 'next', 'last']);
		});

		it('Retained state on page draw', function () {
			table.page('next').draw();
			
			checkButtons(['first', 'previous', 'next', 'last']);
		});
		
		dt.html('basic');

		it('Numbers show when specifically enabled', function() {
			table = $('#example').DataTable({
				layout: {
					bottomEnd: {
						paging: {
							numbers: true
						}
					}
				}
			});

			checkButtons(['first', 'previous', 1, 2, 3, 4, 5, 6, 'next', 'last']);
		});
	});
});
