describe( "columns.searchable option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Columns are searchable by default", function () {

			$('#example').dataTable();
			$('#example').DataTable().search('Airi Satou').draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').html() == "Airi Satou").toBe(true);
		});
		dt.html( 'basic' );
		it("Disabling sorting on a column removes it from the global filter", function () {
			$('#example').dataTable( {
				"columns": [
					null,
					{ "searchable": false },
					null,
					null,
					null,
					null
				]
			});
			$('#example').DataTable().search('Accountant').draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').html() == "No matching records found").toBe(true);
		});
		it("Disabled on one column has no effect on other columns", function () {
			$('#example').DataTable().search('Airi').draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').html() == "Airi Satou").toBe(true);
		});
		dt.html( 'basic' );
		it("Disble filtering on multiple columns", function () {
			$('#example').dataTable( {
				"columns": [
					null,
					{ "searchable": false },
					{ "searchable": false },
					null,
					null,
					null
				]
			});
			$('#example').DataTable().search('Accountant').draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').html() == "No matching records found").toBe(true);
		});
		it("Filter on second column disabled", function () {
			$('#example').DataTable().search('tokyo').draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').html() == "No matching records found").toBe(true);
		});
		

	});

});
