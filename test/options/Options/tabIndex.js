describe('tabIndex Option', function() {
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
	describe('Check the defaults', function() {
		dt.html('basic');
		it('Test using default value', function() {
			let table = $('#example').DataTable({
				tabIndex: 0
			});
			expect(table.settings()[0].iTabIndex).toBe(0);
		});
		dt.html('basic');
		it('Test using -1', function() {
			let table = $('#example').DataTable({
				tabIndex: -1
			});
			expect(table.settings()[0].iTabIndex).toBe(-1);
		});
	});
});
