describe('Legacy bSortMulti option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check Default', function () {
		dt.html('basic');

		it('Enabled by default', async function () {
			new DataTable('#example');
			
			await dt.clickHeader(2);
			await dt.clickHeader(3, {shift: true});
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Cedric Kelly');
		});

		dt.html('basic');

		it('Disable with legacy parameter', async function () {
			new DataTable('#example', {
				bSortMulti: false
			});

			await dt.clickHeader(2);
			await dt.clickHeader(3, {shift: true});
			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Tatyana Fitzpatrick');
		});

		dt.html('basic');

		it('Disable with legacy default', async function () {
			DataTable.defaults.bSortMulti = false;

			new DataTable('#example');
			
			await dt.clickHeader(2);
			await dt.clickHeader(3, {shift: true});
			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Tatyana Fitzpatrick');
		});

		dt.html('basic');

		it('Keep enabled with legacy default', async function () {
			DataTable.defaults.bSortMulti = true;

			new DataTable('#example');

			await dt.clickHeader(2);
			await dt.clickHeader(3, {shift: true});
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Cedric Kelly');
		});

		dt.html('basic');

		it('Remove legacy default', async function () {
			delete DataTable.defaults.bSortMulti;

			new DataTable('#example');
			
			await dt.clickHeader(2);
			await dt.clickHeader(3, {shift: true});
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Cedric Kelly');
		});
	});
});
