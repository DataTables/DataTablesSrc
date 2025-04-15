describe('core- order.listener()', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function () {
		dt.html('basic');
		let table;
		it('Exists and is a function', function () {
			table = $('#example').DataTable();
			expect(typeof table.order.listener).toBe('function');
		});
		it('Returns an API instance', function () {
			expect(table.order([]) instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Functional tests', function () {
		let table;
		let count = 0;

		dt.html('basic');

		it('Does column ordering without need for a draw()', async function () {
			table = $('#example').DataTable();
			table.order.listener('.dt-search input', 2, function callback() {
				count++;
			});
			$('.dt-search input').click();

			await dt.sleep(25); // click action is async
			expect($('#example tbody td:eq(0)').html()).toBe('Tiger Nixon');
		});

		it('Callback is executed', function () {
			expect(count).toBe(1);
		});

		it('Can still sort on the table control', async function () {
			await dt.clickHeader(2);
			expect($('#example tbody td:eq(0)').html()).toBe('Sakura Yamamoto');
		});

		it('Callback is not executed', function () {
			expect(count).toBe(1);
		});

		it('Responds to shift being pressed', async function () {
			await dt.clickHeader(1);
			var clickEvent = $.Event('click');
			clickEvent.shiftKey = true;
			$('.dt-search input').trigger(clickEvent);
			await dt.sleep(25); // click action is async
			expect($('#example tbody tr:eq(9) td:eq(0)').html()).toBe('Suki Burks');
		});

		it('Callback is not executed', function () {
			expect(count).toBe(2);
		});

		it('Callback is not executed on API order', function () {
			table.order([5, 'asc']).draw();
			expect($('#example tbody td:eq(0)').html()).toBe('Jennifer Acosta');
			expect(count).toBe(2);
		});

		dt.html('basic');

		it('Can apply to an array of columns', async function () {
			table = $('#example').DataTable();
			table.order.listener('.dt-search input', [2, 3]);
			$('.dt-search input').trigger('click');

			await dt.sleep(25); // click action is async
			expect($('#example tbody tr').eq(0).children().eq(0).html()).toBe('Cedric Kelly');
			expect($('#example tbody tr').eq(1).children().eq(0).html()).toBe('Quinn Flynn');
			expect($('#example thead th').eq(2).hasClass('dt-ordering-asc')).toBe(true);
			expect($('#example thead th').eq(3).hasClass('dt-ordering-asc')).toBe(true);
		});
	});
});
