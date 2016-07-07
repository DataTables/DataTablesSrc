describe( "columns.name option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {

		dt.html( 'basic' );
		it("Names are stored in the columns object", function () {
			$('#example').dataTable( {
				"columns": [
					null,
					{ "name": "unit test" },
					null,
					null,
					null,
					null
				]
			});
			$('#example').DataTable().search('Accountant').draw();
			expect($('#example').DataTable.settings[0].aoColumns[1].name == "unit test").toBe(true);
		});


	});

});
