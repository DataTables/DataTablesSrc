describe( "language.infoEmpty option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Info empty language is 'Showing 0 to 0 of 0 entries' ", function () {
			$('#example').dataTable();
			expect($('#example').DataTable().settings()[0].oLanguage.sInfoEmpty  == "Showing 0 to 0 of 0 entries").toBe(true);
		});
		it("Info empty language default is in the DOM", function () {
			expect($('div.dataTables_info').html() == "Showing 1 to 10 of 57 entries").toBe(true);
		});
		dt.html( 'basic' );
		it("Info empty language can be defined", function () {
			$('#example').dataTable( {
				"language": {
					"infoEmpty": "unit test"
				}
			});
			$('div.dataTables_filter input').val('asdasd').keyup();
			expect($('#example').DataTable().settings()[0].oLanguage.sInfoEmpty == "unit test").toBe(true);
		});
		it("Info empty language default is in the dom", function () {
			expect($('div.dataTables_info').html() == "unit test (filtered from 57 total entries)").toBe(true);
		});
		dt.html( 'basic' );
		it("Macro's replaced", function () {
		$('#example').dataTable( {
			"language": {
				"infoEmpty": "unit _START_ _END_ _TOTAL_ test"
			}
		});
		$('div.dataTables_filter input').val('asdasd').keyup();
		expect( $('div.dataTables_info').html() == "unit 1 0 0 test (filtered from 57 total entries)").toBe(true);
		});
	});
});
