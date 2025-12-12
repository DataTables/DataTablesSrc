describe('Legacy aLengthMenu option', function () {
	var original;

	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	function lengthMenuCount(cnt) {
		expect(document.querySelectorAll('div.dt-length select option').length).toBe(cnt);
	}

	describe('Check Default', function () {
		dt.html('basic');

		it('Default value', async function () {
			original = DataTable.defaults.lengthMenu;

			new DataTable('#example');
			
			lengthMenuCount(4);
		});

		dt.html('basic');

		it('Set with legacy parameter', async function () {
			new DataTable('#example', {
				aLengthMenu: [10, 25]
			});

			lengthMenuCount(2);
		});

		dt.html('basic');

		it('Set with legacy default', async function () {
			DataTable.defaults.aLengthMenu = [10, 25, 50];

			new DataTable('#example');
			
			lengthMenuCount(3);
		});

		dt.html('basic');

		it('Remove legacy default', async function () {
			delete DataTable.defaults.aLengthMenu;
			DataTable.defaults.lengthMenu = original;

			let table = new DataTable('#example');

			lengthMenuCount(4);
		});
	});
});
