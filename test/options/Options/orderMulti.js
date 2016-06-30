describe( "orderMulti option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Enabled by default", function () {
			$('#example').dataTable();
			$('#example thead th:eq(2)').click();
			var clickEvent = $.Event('click');
	        clickEvent.shiftKey = true;
	        $('#example thead th:eq(3)').trigger(clickEvent);
			expect($('#example tbody tr:eq(0) td:eq(0)').html() == 'Cedric Kelly').toBe(true);
		});
		dt.html( 'basic' );
		it("Enable override makes no difference", function () {
			$('#example').dataTable( {
				"orderMulti": true
			});
			$('#example thead th:eq(2)').click();
			var clickEvent = $.Event('click');
	        clickEvent.shiftKey = true;
	        $('#example thead th:eq(3)').trigger(clickEvent);
			expect($('#example tbody tr:eq(0) td:eq(0)').html() == 'Cedric Kelly').toBe(true);
		});
		dt.html( 'basic' );
		it("Can be disabled", function () {
			$('#example').dataTable( {
				"orderMulti": false
			});
			$('#example thead th:eq(2)').click();
			var clickEvent = $.Event('click');
	        clickEvent.shiftKey = true;
	        $('#example thead th:eq(5)').trigger(clickEvent);
			expect($('#example tbody tr:eq(0) td:eq(0)').html() == 'Jennifer Acosta').toBe(true);
		});

	});
});
