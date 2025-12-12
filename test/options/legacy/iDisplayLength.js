describe('Legacy iDisplayLength option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	function pageSize(cnt) {
		expect(document.querySelectorAll('#example tbody tr').length).toBe(cnt);
	}

	describe('Check Default', function () {
		dt.html('basic');

		it('Default value', async function () {
			new DataTable('#example');
			
			pageSize(10);
		});

		dt.html('basic');

		it('Set with legacy parameter', async function () {
			new DataTable('#example', {
				iDisplayLength: 12
			});

			pageSize(12);
		});

		dt.html('basic');

		it('Set with legacy default', async function () {
			DataTable.defaults.iDisplayLength = 20;

			new DataTable('#example');
			
			pageSize(20);
		});

		dt.html('basic');

		it('Remove legacy default', async function () {
			delete DataTable.defaults.iDisplayLength;
			delete DataTable.defaults.displayLength;
			DataTable.defaults.pageLength = 10;

			new DataTable('#example');

			pageSize(10);
		});
	});
});
