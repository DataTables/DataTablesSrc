describe( "language.decimal option ", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Default is emtpy", function () {
			$('#example').dataTable( {

			} );
			expect($('#example').DataTable().settings()[0].oLanguage.sDecimal  === "").toBe(true);
		});
		dt.html( 'basic' );
		it("Set decimal to comma", function () {
			$('#example').dataTable( {
				"language": {
					"decimal": ","
				}
			} );
			expect($('#example').DataTable().settings()[0].oLanguage.sDecimal  === ",").toBe(true);
		});
		dt.html( 'basic' );
		it("Set thousands seperator", function () {
			$('#example').dataTable( {
				"language": {
					"decimal": ",",
					"thousands": "."
				}
			} );
			expect($('#example').DataTable().settings()[0].oLanguage.sThousands  === ".").toBe(true);
		});
	});
});
