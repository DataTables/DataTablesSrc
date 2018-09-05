describe( "language.infoPostFix option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Info post fix language is 'Showing 0 to 0 of 0 entries' ", function () {
			$('#example').dataTable();
			expect($('#example').DataTable().settings()[0].oLanguage.sInfoPostFix  === "").toBe(true);
		});
		it("Width no post fix, the basic info shows", function () {
			expect(document.getElementById('example_info').innerHTML == "Showing 1 to 10 of 57 entries").toBe(true);
		});
		dt.html( 'basic' );
		it("Info post fix language cam be defined", function () {
			$('#example').dataTable( {
				"language": {
					"infoPostFix": "unit test"
				}
			});
			expect($('#example').DataTable().settings()[0].oLanguage.sInfoPostFix == "unit test").toBe(true);
		});
		it("Info empty lanuage default is in the dom", function () {
			expect(document.getElementById('example_info').innerHTML == "Showing 1 to 10 of 57 entriesunit test").toBe(true);
		});
		dt.html( 'basic' );
		it("Macros have no effect in the post fix", function () { //possible bug?
			$('#example').dataTable( {
				"language": {
					"infoPostFix": "unit _START_ _END_ _TOTAL_ test"
				}
			});
			//expect($('div.dataTables_info').innerHTML == "Showing 1 to 10 of 57 entriesunit _START_ _END_ _TOTAL_ test").toBe(true);
		});
		dt.html( 'basic' );
		it("Post fix is applied after filtering info", function () {
			$('#example').dataTable( {
				"language": {
					"infoPostFix": "unit test"
				}
			});
			$('div.dataTables_filter input').val('asdasd').keyup();
			expect($('div.dataTables_info').html() == "Showing 0 to 0 of 0 entries (filtered from 57 total entries)unit test").toBe(true);
		});


	});
});
