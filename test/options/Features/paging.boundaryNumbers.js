describe('paging.boundaryNumbers option', function() {
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

	describe('Disable', function() {
		dt.html('basic');

		it('Disable boundary numbers - initialization', function() {
			table = $('#example').DataTable({
				layout: {
					bottomEnd: {
						paging: {
							boundaryNumbers: false
						}
					}
				}
			});

			checkButtons(['first', 'previous', 1, 2, 3, 4, 5, 6, 'next', 'last']);
		});

		it('Draws correctly for end only', function () {
			table.page.len(8).draw();
			
			checkButtons(['first', 'previous', 1, 2, 3, 4, 5, 6, 'ellipsis', 'next', 'last']);
		});

		it('Draws correctly for start only', function () {
			table.page('last').draw(false);
			
			checkButtons(['first', 'previous', 'ellipsis', 3, 4, 5, 6, 7, 8, 'next', 'last']);
		});

		it('Smaller page - first only', function () {
			table.page('first');
			table.page.len(3).draw(false);
			
			checkButtons(['first', 'previous', 1, 2, 3, 4, 5, 6, 'ellipsis', 'next', 'last']);
		});

		it('Smaller page - end only', function () {
			table.page('last').draw(false);
			
			checkButtons(['first', 'previous', 'ellipsis', 14, 15, 16, 17, 18, 19, 'next', 'last']);
		});

		it('Pre start ellipsis', function () {
			table.page(3).draw(false);
			
			checkButtons(['first', 'previous', 1, 2, 3, 4, 5, 6, 'ellipsis', 'next', 'last']);
		});

		it('Start ellipsis', function () {
			table.page(4).draw(false);
			
			checkButtons(['first', 'previous', 'ellipsis', 3, 4, 5, 6, 7, 'ellipsis', 'next', 'last']);
		});

		it('Middle ellipsis', function () {
			table.page(9).draw(false);
			
			checkButtons(['first', 'previous', 'ellipsis', 8, 9, 10, 11, 12, 'ellipsis', 'next', 'last']);
		});

		it('End ellipsis', function () {
			table.page(14).draw(false);
			
			checkButtons(['first', 'previous', 'ellipsis', 13, 14, 15, 16, 17, 'ellipsis', 'next', 'last']);
		});

		it('Post end ellipsis', function () {
			table.page(15).draw(false);
			
			checkButtons(['first', 'previous', 'ellipsis', 14, 15, 16, 17, 18, 19, 'next', 'last']);
		});
	});
});
