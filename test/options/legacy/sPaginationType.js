describe('Legacy sPaginationType option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	function pagingButtonCount(cnt) {
		expect(document.querySelectorAll('div.dt-paging button').length).toBe(cnt);
	}

	describe('Check Default', function () {
		dt.html('basic');

		it('Default value', async function () {
			new DataTable('#example');
			
			pagingButtonCount(10);
		});

		dt.html('basic');

		it('Set with legacy parameter', async function () {
			new DataTable('#example', {
				sPaginationType: 'simple'
			});

			pagingButtonCount(2);
		});

		dt.html('basic');

		it('Set with legacy default', async function () {
			DataTable.defaults.sPaginationType = 'simple';

			new DataTable('#example');
			
			pagingButtonCount(2);
		});

		dt.html('basic');

		it('Remove legacy default', async function () {
			delete DataTable.defaults.sPaginationType;
			DataTable.defaults.paginationType = '';

			new DataTable('#example');

			pagingButtonCount(10);
		});
	});
});
