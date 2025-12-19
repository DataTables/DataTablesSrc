describe('order Option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check defaults', function() {
		dt.html('basic');

		it('Check disabled by default', function() {
			expect($.fn.dataTable.defaults.orderDescReverse).toBe(true);
		});
	});

	describe('Enabled', function() {
		dt.html('empty');

		it('Initial sort', function() {
			// Only need two columns for this test
			$('th:gt(1)').remove();

			$('#example').DataTable({
				data: [
					['A', 1],
					['A', 2],
					['A', 3]
				]
			});

			expect($('tbody tr').eq(0).find('td').eq(1).text()).toBe('1');
			expect($('tbody tr').eq(1).find('td').eq(1).text()).toBe('2');
			expect($('tbody tr').eq(2).find('td').eq(1).text()).toBe('3');
		});

		it('Reverse sort will reverse the initial load', async function() {
			await dt.clickHeader(0);

			expect($('tbody tr').eq(0).find('td').eq(1).text()).toBe('3');
			expect($('tbody tr').eq(1).find('td').eq(1).text()).toBe('2');
			expect($('tbody tr').eq(2).find('td').eq(1).text()).toBe('1');
		});
	});

	describe('Disabled', function() {
		dt.html('empty');

		it('Initial sort', function() {
			// Only need two columns for this test
			$('th:gt(1)').remove();

			$('#example').DataTable({
				orderDescReverse: false,
				data: [
					['A', 1],
					['A', 2],
					['A', 3]
				]
			});

			expect($('tbody tr').eq(0).find('td').eq(1).text()).toBe('1');
			expect($('tbody tr').eq(1).find('td').eq(1).text()).toBe('2');
			expect($('tbody tr').eq(2).find('td').eq(1).text()).toBe('3');
		});

		it('Reverse sort will NOT reverse the initial load', async function() {
			await dt.clickHeader(0);

			expect($('tbody tr').eq(0).find('td').eq(1).text()).toBe('1');
			expect($('tbody tr').eq(1).find('td').eq(1).text()).toBe('2');
			expect($('tbody tr').eq(2).find('td').eq(1).text()).toBe('3');
		});
	});
});
