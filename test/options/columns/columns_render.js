describe( "columns.render option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Default should be null", function () {
				$('#example').dataTable({
					"columnDefs": [ {
						"targets": 0,
						"cellType": "th"
					}]
				});
				expect($.fn.DataTable.defaults.column.mRender).toBe(null);
		});
		dt.html( 'basic' );
		it("Able to successfully use render- columnDefs", function () {
			$('#example').dataTable( {
				"columnDefs": [ {
					"targets": 0,
					"render": function ( data, type, full, meta ) {
						return data + " Test";
					}
				} ]
			});
			expect($('#example tbody tr:eq(0) td:eq(0)').html() == "Airi Satou Test").toBe(true);
		});
	});

});
