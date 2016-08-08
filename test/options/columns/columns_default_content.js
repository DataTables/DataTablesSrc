describe( "columns.defaultContent option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {

		dt.html( 'basic' );
		it("Default is null", function () {
			$('#example').dataTable();
			expect($.fn.DataTable.defaults.column.sDefaultContent).toBe(null);
		});

		dt.html( 'basic' );
		it("Use default content to add static value to column- using columns", function () {
			$('#example').dataTable( {
				"columns": [
					{
						"data": null,
						"defaultContent": "<button>Not set</button>"
					},
					null,
					null,
					null,
					null,
					null
				]
			});
			expect($('#example tbody tr:eq(0) td:eq(0) button').html() === "Not set").toBe(true);
		});
		dt.html( 'basic' );
		it("use defaultContent to add button to column- using columnDefs", function () {
			$('#example').dataTable( {
				"columnDefs": [
					{
						"data": null,
						"targets": 0,
						"defaultContent": "<button>Not set</button>"
					}
				]
			});
			expect($('#example tbody tr:eq(0) td:eq(0) button').html() === "Not set").toBe(true);
		});
	

	});

});
