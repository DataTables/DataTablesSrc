describe('Legacy bSort option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check Default', function () {
		dt.html('basic');

		it('Enabled by default', async function () {
			new DataTable('#example');
			
			await dt.clickHeader(1);
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Garrett Winters');
		});

		dt.html('basic');

		it('Disable with legacy parameter', async function () {
			new DataTable('#example', {
				bSort: false
			});

			await dt.clickHeader(1);
			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Tiger Nixon');
		});

		dt.html('basic');

		it('Disable with legacy default', async function () {
			DataTable.defaults.bSort = false;

			new DataTable('#example');
			
			await dt.clickHeader(1);
			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Tiger Nixon');
		});

		dt.html('basic');

		it('Keep enabled with legacy default', async function () {
			DataTable.defaults.bSort = true;

			new DataTable('#example');

			await dt.clickHeader(1);
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Garrett Winters');
		});

		dt.html('basic');

		it('Remove legacy default', async function () {
			delete DataTable.defaults.bSort;

			new DataTable('#example');
			
			await dt.clickHeader(1);
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Garrett Winters');
		});
	});
});
