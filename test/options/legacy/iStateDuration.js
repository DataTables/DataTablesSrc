describe('Legacy iStateDuration option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check Default', function () {
		dt.html('basic');

		it('Can enable with legacy parameter', function () {
			let table = $('#example').DataTable({
				stateSave: true,
				iStateDuration: 1
			});

			table.search('cox').draw();
			
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Ashton Cox');
		});

		dt.html('basic');

		it('Reload with the saved state', function () {
			new DataTable('#example', {
				stateSave: true,
				iStateDuration: 1
			});

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Ashton Cox');
		});

		dt.html('basic');

		it('State is lost after time out', async function () {
			await dt.sleep(2000);

			new DataTable('#example', {
				stateSave: true,
				iStateDuration: 1
			});
			
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});
	});
});
