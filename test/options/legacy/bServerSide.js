describe('Legacy bServerSide option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	function ajaxFn(shouldHaveData) {
		return function (data, cb) {
			if (shouldHaveData) {
				expect(data.start).toBe(0);
			}
			else {
				expect(data.start).toBeUndefined();
			}

			var out = [];

			for (let i = 0; i < 10; i++) {
				out.push([i + '-1', i + '-2', i + '-3', i + '-4', i + '-5', i + '-6']);
			}

			setTimeout(function() {
				cb({
					draw: data.draw,
					data: out,
					recordsTotal: 5000,
					recordsFiltered: 5000
				});
			}, 50);
		}
	}

	describe('Check Default', function () {
		dt.html('basic');

		it('Disabled by default', function (done) {
			new DataTable('#example', {
				ajax: ajaxFn(false),
				initComplete: () => done()
			});
		});

		dt.html('basic');

		it('Enable with legacy parameter', function (done) {
			new DataTable('#example', {
				bServerSide: true,
				ajax: ajaxFn(true),
				initComplete: () => done()
			});
		});

		dt.html('basic');

		it('Enable with legacy default', function (done) {
			DataTable.defaults.bServerSide = true;

			new DataTable('#example', {
				ajax: ajaxFn(true),
				initComplete: () => done()
			});
		});

		dt.html('basic');

		it('Disable with legacy default', function (done) {
			DataTable.defaults.bServerSide = false;

			new DataTable('#example', {
				ajax: ajaxFn(false),
				initComplete: () => done()
			});
		});

		dt.html('basic');

		it('Remove legacy default', function (done) {
			delete DataTable.defaults.bServerSide;

			new DataTable('#example', {
				ajax: ajaxFn(false),
				initComplete: () => done()
			});
		});
	});
});
