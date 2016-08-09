//Unable to get working
describe( "columns.cellType option", function() {
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
				expect($.fn.DataTable.defaults.column.sCellType).toBe('td');
		});

	});

});
