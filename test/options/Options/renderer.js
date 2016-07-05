describe( "renderer Option //todo", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Default length is ten", function () {
			$('#example').dataTable( {
				renderer: "bootstrap"
			});

		});



	});


});
