describe( "rowId option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'empty' );
		it("Default length is ten", function () {
			$('#example').dataTable( {
				"ajax": "../data/data.txt"
			});


		});



	});


});
