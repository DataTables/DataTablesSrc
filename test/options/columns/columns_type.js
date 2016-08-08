//Needs to write a test for this, not too sure how to do it.
describe( "columns.type option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Default should be null", function () {
				$('#example').dataTable();
				expect($.fn.dataTable.defaults.column.sType).toBe(null);
		});
		dt.html( 'basic' );
		it("Use columns.type to set the first columns as the 'html' type", function () {
			$('#example').dataTable( {
			"columnDefs": [
				{ "type": 'html', "targets": [ 0 ] }
			]
			} );

		});

	});

});
