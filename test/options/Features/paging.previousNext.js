describe('paging.previousNext option', function() {
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

		it('Disable previous and next buttons', function() {
			table = $('#example').DataTable({
				layout: {
					bottomEnd: {
						paging: {
							previousNext: false
						}
					}
				}
			});

			checkButtons(['first', 1, 2, 3, 4, 5, 6, 'last']);
		});

		it('Retained state on page draw', function () {
			table.page('next').draw();
			
			checkButtons(['first', 1, 2, 3, 4, 5, 6, 'last']);
		});
		
		dt.html('basic');

		it('Show when specifically enabled', function() {
			table = $('#example').DataTable({
				layout: {
					bottomEnd: {
						paging: {
							previousNext: true
						}
					}
				}
			});

			checkButtons(['first', 'previous', 1, 2, 3, 4, 5, 6, 'next', 'last']);
		});
	});
});
