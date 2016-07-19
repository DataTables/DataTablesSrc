describe( "language.emptyTable option ", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Default is 'No data available in table' ", function () {
			$('#example').dataTable( {

			} );
			expect($('#example').DataTable().settings()[0].oLanguage.sEmptyTable  === "No data available in table").toBe(true);
		});
		dt.html( 'empty' );
		it("Can we change the value of emptyTable- check option", function () {
			$('#example').dataTable( {
				"language": {
					"emptyTable": "test case"
				}
			});
			expect($('#example').DataTable().settings()[0].oLanguage.sEmptyTable  === "test case").toBe(true);
		});
		it("Can we change the value of emptyTable- check DOM", function () {
			expect($('#example > tbody > tr > td').html() == "test case").toBe(true);
		});
	});
});
