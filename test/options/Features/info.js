describe( "info option- Feature", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check Default", function () {
		dt.html( 'basic' );
		it("Info div exists by default", function () {
			$('#example').dataTable();
			expect($('#example_info')).toBeDefined();
		});

		dt.html( 'basic' );
		it("Info can be disabled", function () {
			$('#example').dataTable({
				'info': false
			});
			expect($('#example_info').html()).not.toBeDefined();
		});

		dt.html( 'basic' );
		it("Info enable override", function () {
			$('#example').dataTable( {
					"info": true
				});
				expect($('#example_info').html()).toBeDefined();
		});
	});
} );
