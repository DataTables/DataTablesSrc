describe( "columns.orderData option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	dt.html( 'basic' );

	it("Sorting on Column 1 is uneffected", function () {
		$('#example').dataTable( {
			"columns": [
			null,
			null,
			{ "orderData": [ 2, 3 ] },
			null,
			null,
			{ "orderData": [ 0 ] }
			]
		});
		expect($('#example tbody tr:eq(0) td:eq(0)').html() == "Airi Satou").toBe(true);
	});

	it("Sorting on third column uses 4th column as well as third", function () {
		$('#example thead th:eq(2)').click();
		expect($('#example tbody tr:eq(0) td:eq(0)').html() == "Cedric Kelly").toBe(true);
	});

	it("Sorting on third column uses 4th column as well as third- reversed", function () {
		$('#example thead th:eq(2)').click();
		expect($('#example tbody tr:eq(0) td:eq(0)').html() == "Garrett Winters").toBe(true);
	});

	it("Sorting on last column uses data from first", function () {
		$('#example thead th:eq(5)').click();
		expect($('#example tbody tr:eq(0) td:eq(0)').html() == "Airi Satou").toBe(true);
	});

	// DataTablesSrc #97
	dt.html( 'basic' );

	it("Initialise table with data ordering as an integer for column index 0", function () {
		$('#example').dataTable( {
			columnDefs: [ {
				targets: 1,
				orderData: 0
			} ]
		} );

		expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe("Airi Satou");
	});

	it("Sort by column index 1", function () {
		$('#example thead th:eq(1)').click();
		expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe("Airi Satou");
	});

	it("And reverse - still column 0 data being used", function () {
		$('#example thead th:eq(1)').click();
		expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe("Zorita Serrano");
	});
});
