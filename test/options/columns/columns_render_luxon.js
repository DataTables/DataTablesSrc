describe('columns.render option', function () {
	dt.libs({
		js: ['jquery', 'datatables', 'luxon'],
		css: ['datatables']
	});

	let table;

	function checkRecord(record, name, date) {
		expect($('tbody tr:eq(' + record + ') td:eq(0)').text()).toBe(name);
		expect($('tbody tr:eq(' + record + ') td:eq(4)').text()).toBe(date);
	}

	describe('Functional tests', function () {
		dt.html('basic');
		it('Standard data', function () {
			table = $('#example').DataTable({
				order: [4, 'asc']
			});
			checkRecord(0, 'Jackson Bradshaw', '2008/09/26');
		});

		dt.html('ISO8601');
		it('Standard ISO8601 data', function () {
			table = $('#example').DataTable({
				order: [4, 'asc']
			});
			checkRecord(0, 'Jackson Bradshaw', '2008-09-26');
		});

		dt.html('ISO8601');
		it('Auto-render', function () {
			table = $('#example').DataTable({
				order: [4, 'asc'],
				columnDefs: [
					{
						targets: 4,
						render: DataTable.render.date()
					}
				]
			});

			let result = navigator.languages[0] === 'en-GB'
				? '26/09/2008'
				: '9/26/2008';

			checkRecord(0, 'Jackson Bradshaw', result);
		});

		dt.html('ISO8601');
		it('Date rendering', function () {
			table = $('#example').DataTable({
				order: [4, 'asc'],
				columnDefs: [
					{
						targets: 4,
						render: DataTable.render.datetime('d MMM yyyy')
					}
				]
			});
			checkRecord(0, 'Jackson Bradshaw', '26 Sep 2008');
		});

		dt.html('dates_non_std');
		it('Date conversion', function () {
			table = $('#example').DataTable({
				order: [4, 'asc'],
				columnDefs: [
					{
						targets: 4,
						render: DataTable.render.datetime('d MMM yyyy', 'MMM d, yy', 'en'),
					}
				]
			});
			checkRecord(0, 'Jackson Bradshaw', 'Sep 26, 08');
		});

		dt.html('dates_non_std');
		it('Global date rendering', function () {
			DataTable.datetime('d MMM yyyy');

			table = $('#example').DataTable({
				order: [4, 'asc']
			});
			checkRecord(0, 'Jackson Bradshaw', '26 Sep 2008');
		});

		it('Type can be retrieved', function () {
			expect(table.column(4).type()).toBe('datetime-d MMM yyyy');
		});
	});
});
