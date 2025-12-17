describe( "language.url option //Need de_DE.txt", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );

		it("url is blank by default ", function () {
			$('#example').dataTable();
			expect(DataTable.defaults.language.url).toBe('');
		});

		dt.html( 'basic' );
		// it("Loading of German file loads language information", function () {
		// 	$('#example').dataTable( {
		// 		"language": {
		// 			"url": "../../../examples/resources/de_DE.txt"
		// 		}
		// 	});
		//
		// });
	});
});
