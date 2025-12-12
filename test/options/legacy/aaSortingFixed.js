describe('Legacy aaSortingFixed option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check Default', function () {
		dt.html('basic');

		it('No extra sort by default', async function () {
			let table = new DataTable('#example');
			
			expect(table.cell(':eq(0)', 0).data()).toBe('Airi Satou');
		});

		dt.html('basic');

		it('Set with legacy parameter', async function () {
			let table = new DataTable('#example', {
				aaSortingFixed: [3, 'asc']
			});

			expect(table.cell(':eq(0)', 0).data()).toBe('Tatyana Fitzpatrick');
		});

		dt.html('basic');

		it('Set with legacy default', async function () {
			DataTable.defaults.aaSortingFixed = [3, 'asc']

			let table = new DataTable('#example');
			
			expect(table.cell(':eq(0)', 0).data()).toBe('Tatyana Fitzpatrick');
		});

		dt.html('basic');

		it('Clear with legacy default', async function () {
			DataTable.defaults.aaSortingFixed = []

			let table = new DataTable('#example');

			expect(table.cell(':eq(0)', 0).data()).toBe('Airi Satou');
		});

		dt.html('basic');

		it('Remove legacy default', async function () {
			delete DataTable.defaults.aaSortingFixed;

			let table = new DataTable('#example');

			expect(table.cell(':eq(0)', 0).data()).toBe('Airi Satou');
		});
	});
});
