describe('nonjQuery - ajax', function () {
	dt.libs({
		js: ['datatables'],
		css: ['datatables']
	});

	it('Runs without jQuery', function () {
		expect(window.jQuery).toBeUndefined();
		expect(window.$).toBeUndefined();
		expect(DataTable.use('jq')).toBe(null);
	});

	it('Does not send when beforeSend returns false', function () {
		let originalXhr = window.XMLHttpRequest;
		let aborted = 0;
		let sent = 0;
		let FakeXhr = function () {
			this.headers = {};
		};

		FakeXhr.prototype.open = function () {};
		FakeXhr.prototype.setRequestHeader = function (key, value) {
			this.headers[key] = value;
		};
		FakeXhr.prototype.abort = function () {
			aborted++;
		};
		FakeXhr.prototype.send = function () {
			sent++;
		};

		window.XMLHttpRequest = FakeXhr;

		try {
			DataTable.ajax({
				url: '/base/test/data/data.txt',
				beforeSend: function () {
					return false;
				}
			});
		}
		finally {
			window.XMLHttpRequest = originalXhr;
		}

		expect(aborted).toBe(1);
		expect(sent).toBe(0);
	});

	dt.html('basic');
	it('No options', function (done) {
		let table = new DataTable('#example', {
			ajax: function(d, cb) {
				fetch('/base/test/data/data.txt')
				.then(response => response.json())
                .then(data => cb(data));
			},
			columns: [
				{data: 'name'},
				{data: 'position'},
				{data: 'office'},
				{data: 'age'},
				{data: 'start_date'},
				{data: 'salary'}
			],
			initComplete: function() {
				expect(table.rows().count()).toBe(57);
				expect(DataTable.Dom.s('#example tbody tr').length).toBe(10);
				done();
			}
		});
	});

	dt.html('basic');
	it('No options', function (done) {
		let table = new DataTable('#example', {
			ajax: function(d, cb) {
				fetch('/base/test/data/data.txt')
				.then(response => response.json())
                .then(data => cb(data));
			},
			columns: [
				{data: 'name'},
				{data: 'position'},
				{data: 'office'},
				{data: 'age'},
				{data: 'start_date'},
				{data: 'salary'}
			],
			paging: false,
			initComplete: function() {
				expect(table.rows().count()).toBe(57);
				expect(DataTable.Dom.s('#example tbody tr').length).toBe(57);
				done();
			}
		});
	});
});
