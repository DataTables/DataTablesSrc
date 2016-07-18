describe( "language.processing option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Processing language is 'Processing...' by default ", function () {
			$('#example').dataTable({
				"processing": true
			});
			expect($('#example').DataTable().settings()[0].oLanguage.sProcessing  === "Processing...").toBe(true);
		});
		it("Processing language default is in the DOM ", function () {
			expect($('#example_processing').html() == "Processing...").toBe(true);
		});
		dt.html( 'basic' );
		it("Processing language can be defined", function () {
			$('#example').dataTable( {
				"processing": true,
				"language": {
					"processing": "unit test"
				}
			} );
			expect($('#example').DataTable().settings()[0].oLanguage.sProcessing == "unit test").toBe(true);
		});
		it("Processing language definition is in the DOM", function () {
			expect($('#example_processing').html() == "unit test").toBe(true);
		});
	});
});
