describe('tabIndex Option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	/*****
	 * Note these tests are limited - JS cannot issue key presses as that would pose a huge security problem:
	 * https://stackoverflow.com/questions/596481/is-it-possible-to-simulate-key-press-events-programmatically/42755803
	 * It's possible with Selenium, but they're not being used in unit tests. I tried checking jQuery's next() method
	 * to see if that would act as a cheat, but no luck unfortunately. So, bit rubbish, all we can do is confirm
	 * the option.
	 *****/
	describe('Check the defaults', function () {
		dt.html('basic');

		it('Test using default value', function () {
			let table = $('#example').DataTable({
				tabIndex: 0
			});

			expect(table.settings()[0].iTabIndex).toBe(0);
		});

		it('Header sorting icons get a tabindex', function () {
			expect($('th span[tabindex=0]').length).toBe(6);
		});

		it('Paging buttons don not get a tab index (they are buttons and so in the focus flow)', function () {
			expect($('div.dt-paging button[tabindex=0]').length).toBe(0);
		});

		dt.html('basic');

		it('Test using -1', function () {
			let table = $('#example').DataTable({
				tabIndex: -1
			});

			expect(table.settings()[0].iTabIndex).toBe(-1);
		});

		it('Header sorting icons do not get a tabindex assigned', function () {
			expect($('th span[tabindex]').length).toBe(0);
		});

		dt.html('basic');

		it('Test using 1', function () {
			let table = $('#example').DataTable({
				tabIndex: 1
			});

			expect(table.settings()[0].iTabIndex).toBe(1);
		});

		it('Header sorting icons get tabindex 1', function () {
			expect($('th span[tabindex=0]').length).toBe(0);
			expect($('th span[tabindex=1]').length).toBe(6);
		});

		dt.html('basic');

		it('Unsortable columns do not get a tabindex icon', function () {
			let table = $('#example').DataTable({
				columnDefs: [{
					orderable: false,
					targets: [2, 3]
				}]
			});

			expect($('th span[tabindex=0]').length).toBe(4);
			expect($('th:eq(0) span[tabindex=0]').length).toBe(1);
			expect($('th:eq(1) span[tabindex=0]').length).toBe(1);
			expect($('th:eq(2) span[tabindex=0]').length).toBe(0);
			expect($('th:eq(3) span[tabindex=0]').length).toBe(0);
			expect($('th:eq(4) span[tabindex=0]').length).toBe(1);
			expect($('th:eq(5) span[tabindex=0]').length).toBe(1);
		});
	});
});
