describe('core - ajax.json()', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table, data;

	describe('Check the defaults', function () {
		dt.html('basic');
		it('Exists and is a function', function () {
			table = $('#example').DataTable();
			expect(typeof table.ajax.json).toBe('function');
		});
		it('Returns undefined if DOM data', function () {
			expect(typeof table.ajax.json()).toBe('undefined');
		});
	});

	describe('Functional test', function () {
		dt.html('empty');
		it('Returns object', function (done) {
			table = $('#example').DataTable({
				ajax: '/base/test/data/data.txt',
				columns: [
					{data: 'name'},
					{data: 'position'},
					{data: 'office'},
					{data: 'age'},
					{data: 'start_date'},
					{data: 'salary'}
				],
				initComplete: function () {
					expect(typeof table.ajax.json()).toBe('object');
					done();
				}
			});
		});
		it('Returns correct data', function () {
			data = table.ajax.json();
			expect(data.data.length).toBe(57);
			expect(data.data[2].name).toBe('Ashton Cox');
		});
		it('Change URL and confirm it gets the new data', async function (done) {
			table.ajax.url('/base/test/data/data_small.txt').load();
			await dt.sleep(1000);

			data = table.ajax.json();
			expect(data.data.length).toBe(2);
			expect(data.data[1].name).toBe('Winter Jenkins');

			done();
		});

		dt.html('empty');
		it('Returns undefined if ajax is a function', function (done) {
			let table = $('#example').DataTable({
				ajax: function (data, callback, settings) {
					var out = [];

					for (let i = 0; i < 2; i++) {
						out.push([i + '-1', i + '-2', i + '-3', i + '-4', i + '-5', i + '-6']);
					}

					setTimeout(function () {
						callback({
							data: out
						});
					}, 50);
				},
				initComplete: function (setting, json) {
					expect(table.ajax.json()).toEqual({
						data: [
							['0-1', '0-2', '0-3', '0-4', '0-5', '0-6'],
							['1-1', '1-2', '1-3', '1-4', '1-5', '1-6']
						]
					});
					done();
				}
			});
		});
	});
});
