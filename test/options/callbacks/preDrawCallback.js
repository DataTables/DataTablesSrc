describe('preDrawCallback option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the arguments', function() {
		let args;
		let table;

		dt.html('basic');
		it('Default should not be true', function() {
			table = $('#example').DataTable();
			expect($.fn.dataTable.defaults.fnpreDrawCallback).not.toBe(true);
		});

		dt.html('basic');
		it('Count arguments', function() {
			table = $('#example').DataTable({
				preDrawCallback: function() {
					args = arguments;
					return true;
				}
			});
			expect(args.length).toBe(1);
		});
		it('First arg is the settings', function() {
			expect(args[0]).toBe(table.settings()[0]);
		});
	});

	describe('Functional tests', function() {
		let count = 0;
		let drawCount = 0;
		let response = true;

		dt.html('basic');
		it('preDrawCallback called once on first draw', function() {
			table = $('#example').DataTable({
				preDrawCallback: function() {
					count++;
					return response;
				},
				drawCallback: function() {
					drawCount++;
				}
			});
			expect(count).toBe(1);
			expect(drawCount).toBe(1);
		});
		it('preDrawCallback called once after each draw', function() {
			$('.paginate_button.next').click();
			$('.paginate_button.next').click();
			$('.paginate_button.next').click();

			expect(count).toBe(4);
			expect(drawCount).toBe(4);
		});
		it('Able to cancel draw', function() {
			response = false;

			table.page(1).draw(false);

			expect(count).toBe(5);
			expect(drawCount).toBe(4);
			expect($('div.dataTables_info').text()).toBe('Showing 31 to 40 of 57 entries');
		});
	});
});
