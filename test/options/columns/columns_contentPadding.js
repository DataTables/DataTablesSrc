//Unsure how to test
describe( "column.contentPadding option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Default should be null", function () {
				$('#example').dataTable({
					"columns": [
						null,
						null,
						null,
						null,
						null,
						{ "contentPadding": "mmm" }
					]
				});
				expect($.fn.dataTable.defaults.aoColumnDefs).toBe(null);
		});

	});

});
