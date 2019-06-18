describe('core - i18n()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			expect(typeof $('#example').DataTable().i18n).toBe('function');
		});

		it('Returns an API instance', function() {
			table = $('#example').DataTable();
			expect(typeof table.i18n('paginate.first', 'fred')).toBe('string');
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Top level value', function() {
			table = $('#example').DataTable();
			expect(table.i18n('search', 'test')).toBe('test');
		});
		it('Nested value', function() {
			table = $('#example').DataTable();
			expect(table.i18n('paginate.last', 'test')).toBe('test');
		});

		dt.html('basic');
		it('Top level value', function() {
			table = $('#example').DataTable({
				language: {
					search: 'test_search',
					paginate: {
						last: 'test_last'
					}
				}
			});
			expect(table.i18n('search', 'test')).toBe('test_search');
		});
		it('Nested value', function() {
			table = $('#example').DataTable();
			expect(table.i18n('paginate.last', 'test')).toBe('test_last');
		});
		it('Not customised', function() {
			table = $('#example').DataTable();
			expect(table.i18n('processing', 'test')).toBe('test');
		});

		dt.html('basic');
		it('numeric - 0', function() {
			table = $('#example').DataTable();
			expect(
				table.i18n(
					'select.rows',
					{
						_: '%d rows selected',
						1: '1 row selected'
					},
					0
				)
			).toBe('0 rows selected');
		});
		dt.html('basic');
		it('numeric - 1', function() {
			expect(
				table.i18n(
					'select.rows',
					{
						_: '%d rows selected',
						1: '1 row selected'
					},
					1
				)
			).toBe('1 row selected');
		});
		dt.html('basic');
		it('numeric - 2', function() {
			expect(
				table.i18n(
					'select.rows',
					{
						_: '%d rows selected',
						1: '1 row selected'
					},
					2
				)
			).toBe('2 rows selected');
		});

		dt.html('basic');
		it('numeric - 0 (over-ride)', function() {
			table = $('#example').DataTable({
				language: {
					select: {
						rows: {
							_: '%d any',
							0: '%d zero',
							1: '%d one'
						}
					}
				}
			});
			expect(
				table.i18n(
					'select.rows',
					{
						_: '%d rows selected',
						1: '1 row selected'
					},
					0
				)
			).toBe('0 zero');
		});
		dt.html('basic');
		it('numeric - 1 (over-ride)', function() {
			expect(
				table.i18n(
					'select.rows',
					{
						_: '%d rows selected',
						1: '1 row selected'
					},
					1
				)
			).toBe('1 one');
		});
		dt.html('basic');
		it('numeric - 2 (over-ride)', function() {
			expect(
				table.i18n(
					'select.rows',
					{
						_: '%d rows selected',
						1: '1 row selected'
					},
					2
				)
			).toBe('2 any');
		});
	});
});
