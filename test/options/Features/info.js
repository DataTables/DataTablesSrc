describe( "info option- Feature", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check Default", function () {
		dt.html( 'basic' );
		it("Info div set to true by default", function () {
			$('#example').dataTable();
			expect($.fn.dataTable.defaults.bInfo).toBe(true);
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
		it("Info correctly displays text", function () {
			expect($('#example_info').html() == "Showing 1 to 10 of 57 entries").toBe(true);
		});
		it("example_info is in correct position in DOM", function () {
			expect($('#example_info').prev().attr('id') == 'example').toBe(true);
		});
	});
} );
