describe( "rowId option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		// it("Default length is ten", function () {
		// 	$('#example').dataTable( {
		// 		"saveState": true
		// 	});
		// 	$('#example_filter input').val(2012).keyup();
		// 	$('#example').DataTable().destroy();
		// 	$('#example').dataTable({
		// 		"stateSave": true
		// 	});
		// 	expect($('#example_info').html() == "Showing 1 to 9 of 9 entries (filtered from 57 total entries)").toBeTruthy();
		//
		// });
	});

});
