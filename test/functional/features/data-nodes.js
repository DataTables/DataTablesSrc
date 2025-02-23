describe('Node based data', function () {
	var table;
	var dataSet = [
		[
			'Tiger Nixon',
			'System Architect',
			'Edinburgh',
			'5421',
			'2011/04/25',
			'$320,800'
		],
		[
			'Garrett Winters',
			'Accountant',
			'Tokyo',
			'8422',
			'2011/07/25',
			'$170,750'
		],
		[
			'Ashton Cox',
			'Junior Technical Author',
			'San Francisco',
			'1562',
			'2009/01/12',
			'$86,000'
		],
		[
			'Cedric Kelly',
			'Senior JavaScript Developer',
			'Edinburgh',
			'6224',
			'2012/03/29',
			'$433,060'
		],
		['Airi Satou', 'Accountant', 'Tokyo', '5407', '2008/11/28', '$162,700']
	];

	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	dt.html('empty');

	it('Load DataTable', function () {
		// Wrap some data in divs
		dataSet.forEach((r) => {
			var div1 = document.createElement('div');
			div1.innerHTML = r[1];
			r[1] = div1;

			var div3 = document.createElement('div');
			div3.innerHTML = r[3];
			r[3] = div3;
		});

		table = $('#example').DataTable({
			data: dataSet
		});

		expect($('tbody tr:first-child td:first-child').text()).toBe('Airi Satou');
	});

	it('Divs are present', async function () {
		expect($('tbody div').length).toBe(10);
	});

	it('String sort on div column', async function () {
		await dt.clickHeader(1);

		expect($('tbody tr:first-child td:first-child').text()).toBe(
			'Garrett Winters'
		);
	});

	it('String reverse sort on div column', async function () {
		await dt.clickHeader(1);

		expect($('tbody tr:first-child td:first-child').text()).toBe('Tiger Nixon');
	});

	it('Number sort on div column', async function () {
		await dt.clickHeader(3);

		expect($('tbody tr:first-child td:first-child').text()).toBe('Ashton Cox');
	});

	it('Number reverse sort on div column', async function () {
		await dt.clickHeader(3);

		expect($('tbody tr:first-child td:first-child').text()).toBe(
			'Garrett Winters'
		);
	});

	it('String search on div column', async function () {
		table.search('System').draw();

		expect($('tbody tr:first-child td:first-child').text()).toBe('Tiger Nixon');
	});

	it('Number search on div column', async function () {
		table.search('6224').draw();

		expect($('tbody tr:first-child td:first-child').text()).toBe('Cedric Kelly');
	});
});
