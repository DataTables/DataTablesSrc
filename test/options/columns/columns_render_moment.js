describe('columns.render option', function () {
	dt.libs({
		js: ['jquery', 'datatables', 'moment'],
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
			checkRecord(0, 'Jackson Bradshaw', '26/09/2008');
		});

		dt.html('ISO8601');
		it('Date rendering', function () {
			table = $('#example').DataTable({
				order: [4, 'asc'],
				columnDefs: [
					{
						targets: 4,
						render: DataTable.render.datetime('Do MMM YYYY')
					}
				]
			});
			checkRecord(0, 'Jackson Bradshaw', '26th Sep 2008');
		});

		dt.html('dates_non_std');
		it('Date conversion', function () {
			table = $('#example').DataTable({
				order: [4, 'asc'],
				columnDefs: [
					{
						targets: 4,
						render: DataTable.render.datetime('D MMM YYYY', 'MMM D, YY', 'en'),
					}
				]
			});
			checkRecord(0, 'Jackson Bradshaw', 'Sep 26, 08');
		});

		dt.html('dates_non_std');
		it('Global date rendering', function () {
			DataTable.datetime('D MMM YYYY');

			table = $('#example').DataTable({
				order: [4, 'asc']
			});
			checkRecord(0, 'Jackson Bradshaw', '26 Sep 2008');
		});
	});
});
