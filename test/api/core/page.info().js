// TK COLIN needs a test to verify serverSide - do as part of the Editor tests
describe('core - page.info()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	function getExpectedPageInfo(pageNumber, pageLength, paging = true) {
		pageEnd = pageLength * (pageNumber + 1) > 57 ? 57 : pageLength * (pageNumber + 1);
		pageLen = paging ? pageLength : -1;
		pageCount = 57 % pageLength ? Math.floor(57 / pageLength) + 1 : Math.floor(57 / pageLength);

		return {
			page: pageNumber,
			pages: pageCount,
			start: pageLength * pageNumber,
			end: pageEnd,
			length: pageLen,
			recordsTotal: 57,
			recordsDisplay: 57,
			serverSide: false
		};
	}

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			expect(typeof $('#example').DataTable().page.info).toBe('function');
		});

		it('Returns an object instance', function() {
			let table = $('#example').DataTable();
			expect($.isPlainObject(table.page.info())).toBe(true);
		});
	});

	describe('Check the behaviour with default page length', function() {
		dt.html('basic');
		it('All good post initialisation', function() {
			let table = $('#example').DataTable();
			let info = table.page.info();

			expect(JSON.stringify(info)).toBe(JSON.stringify(getExpectedPageInfo(0, 10)));
		});

		dt.html('basic');
		it('All good on changing to page 2 and not drawing', function() {
			let table = $('#example').DataTable();
			table.page(1);
			let info = table.page.info();
			expect(JSON.stringify(info)).toBe(JSON.stringify(getExpectedPageInfo(1, 10)));
		});

		dt.html('basic');
		it('All good on page 2', function() {
			let table = $('#example').DataTable();
			table.page(1).draw(false);
			let info = table.page.info();
			expect(JSON.stringify(info)).toBe(JSON.stringify(getExpectedPageInfo(1, 10)));
		});

		dt.html('basic');
		it('All good on last page', function() {
			let table = $('#example').DataTable();
			table.page('last').draw(false);
			let info = table.page.info();
			expect(JSON.stringify(info)).toBe(JSON.stringify(getExpectedPageInfo(5, 10)));
		});
	});

	describe('Check the behaviour with custom page length', function() {
		dt.html('basic');
		it('All good post initialisation', function() {
			let table = $('#example').DataTable({
				pageLength: 17
			});
			let info = table.page.info();

			expect(JSON.stringify(info)).toBe(JSON.stringify(getExpectedPageInfo(0, 17)));
		});

		it('All good on page 2', function() {
			let table = $('#example').DataTable();
			table.page(1).draw(false);
			let info = table.page.info();
			expect(JSON.stringify(info)).toBe(JSON.stringify(getExpectedPageInfo(1, 17)));
		});

		it('All good on last page', function() {
			let table = $('#example').DataTable();
			table.page('last').draw(false);
			let info = table.page.info();
			expect(JSON.stringify(info)).toBe(JSON.stringify(getExpectedPageInfo(3, 17)));
		});
	});

	describe('Check the behaviour with paging disabled', function() {
		dt.html('basic');
		it('All good post initialisation', function() {
			let table = $('#example').DataTable({
				paging: false
			});
			let info = table.page.info();

			expect(JSON.stringify(info)).toBe(JSON.stringify(getExpectedPageInfo(0, 57, false)));
		});

		dt.html('basic');
		it('Paging disabled by  page.len(-1)', function() {
			let table = $('#example').DataTable();
			table.page.len(-1).draw();
			let info = table.page.info();
			expect(JSON.stringify(info)).toBe(JSON.stringify(getExpectedPageInfo(0, 57, false)));
		});
	});

	describe('Check the behaviour with Ajax sourced data', function() {
		dt.html('basic');
		it('All good post initialisation with custom page size', function(done) {
			let table = $('#example').DataTable({
				ajax: '/base/test/data/data.txt',
				deferRender: true,
				pageLength: 17,
				columns: dt.getTestColumns(),
				initComplete: function(settings, json) {
					let info = table.page.info();
					expect(JSON.stringify(info)).toBe(JSON.stringify(getExpectedPageInfo(0, 17)));
					done();
				}
			});
		});

		dt.html('basic');
		it('All good on page 2 with custom page size', function(done) {
			let table = $('#example').DataTable({
				ajax: '/base/test/data/data.txt',
				deferRender: true,
				pageLength: 17,
				columns: dt.getTestColumns(),
				initComplete: function(settings, json) {
					table.page(2).draw(false);
					let info = table.page.info();
					expect(JSON.stringify(info)).toBe(JSON.stringify(getExpectedPageInfo(2, 17)));
					done();
				}
			});
		});

		dt.html('basic');
		it('All good on page 2 with custom page size', function(done) {
			let table = $('#example').DataTable({
				ajax: '/base/test/data/data.txt',
				deferRender: true,
				paging: false,
				columns: dt.getTestColumns(),
				initComplete: function(settings, json) {
					let info = table.page.info();
					expect(JSON.stringify(info)).toBe(JSON.stringify(getExpectedPageInfo(0, 57, false)));
					done();
				}
			});
		});

		describe('Check the behaviour with other stuff', function() {
			dt.html('basic');
			it('Correct values when doing a search', function() {
				let table = $('#example').DataTable();
				table.search('Software').draw();
				let info = table.page.info();

				let expectedInfo = {
					page: 0,
					pages: 1,
					start: 0,
					end: 6,
					length: 10,
					recordsTotal: 57,
					recordsDisplay: 6,
					serverSide: false
				};
				expect(JSON.stringify(info)).toBe(JSON.stringify(expectedInfo));
			});
		});
	});
});
