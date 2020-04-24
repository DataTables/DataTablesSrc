describe('columns.orderData option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	dt.html('basic');

	it('Sorting on column 1 is uneffected', function() {
		$('#example').dataTable({
			columns: [null, null, { orderData: [2, 3] }, null, null, { orderData: [0] }]
		});
		expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
	});

	it('Sorting on third column uses 4th column as well as third', function() {
		$('#example thead th:eq(2)').click();
		expect($('#example tbody tr:eq(1) td:eq(0)').text()).toBe('Quinn Flynn');
	});

	it('Sorting on third column uses 4th column as well as third- reversed', function() {
		$('#example thead th:eq(2)').click();
		expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Garrett Winters');
	});

	it('Sorting on last column uses data from first', function() {
		$('#example thead th:eq(5)').click();
		expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
	});

	dt.html('basic');
	it('Initialise table with data ordering as an integer for column index 0', function() {
		$('#example').dataTable({
			columnDefs: [
				{
					targets: 1,
					orderData: 0
				}
			]
		});

		expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Airi Satou');
	});

	it('Sort by column index 1', function() {
		$('#example thead th:eq(1)').click();
		expect($('#example tbody tr:eq(1) td:eq(0)').html()).toBe('Angelica Ramos');
	});

	it('And reverse - still column 0 data being used', function() {
		$('#example thead th:eq(1)').click();
		expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Zorita Serrano');
	});
});
