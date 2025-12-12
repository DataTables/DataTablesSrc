describe('Legacy bStateSave option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check Default', function () {
		dt.html('basic');

		it('Disabled by default', async function () {
			let table = new DataTable('#example');
			table.destroy();

			table = new DataTable('#example');
			expect(table.state.loaded()).toBe(null);
		});

		dt.html('basic');

		it('Enable with legacy parameter', async function () {
			let table = new DataTable('#example', {bStateSave: true});
			table.destroy();

			table = new DataTable('#example', {bStateSave: true});
			expect(table.state.loaded()).not.toBeNull();
		});

		dt.html('basic');

		it('Enable with legacy default', async function () {
			DataTable.defaults.bStateSave = true;

			let table = new DataTable('#example');
			table.destroy();

			table = new DataTable('#example');
			expect(table.state.loaded()).not.toBeNull();
		});

		dt.html('basic');

		it('Disable with legacy default', async function () {
			DataTable.defaults.bStateSave = false;

			let table = new DataTable('#example');
			table.destroy();

			table = new DataTable('#example');
			expect(table.state.loaded()).toBeNull();
		});

		dt.html('basic');

		it('Remove legacy default', async function () {
			delete DataTable.defaults.bStateSave;

			let table = new DataTable('#example');
			table.destroy();

			table = new DataTable('#example');
			expect(table.state.loaded()).toBeNull();
		});
	});
});
