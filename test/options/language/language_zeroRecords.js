describe( "language.zeroRecords option ", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Zero records language is 'No matching records found' by default ", function () {
			$('#example').dataTable();
			expect($('#example').DataTable().settings()[0].oLanguage.sZeroRecords  === "No matching records found").toBe(true);
		});

		it("Text is shown when empty table (after filtering)", function () {
			$('#example').DataTable().search("nothinghere").draw();
			expect($('#example tbody tr td')[0].innerHTML == "No matching records found").toBe(true);
		});
		dt.html( 'basic' );
		it("Zero records language can be defined", function () {
			$('#example').dataTable( {
				"language": {
					"zeroRecords": "unit test"
				}
			});
			expect($('#example').DataTable().settings()[0].oLanguage.sZeroRecords == "unit test").toBe(true);
		});
		it("Text is shown when empty table (after filtering)", function () {
			$('#example').DataTable().search("nothinghere2").draw();
			expect($('#example tbody tr td')[0].innerHTML == "unit test").toBe(true);
		});
	});
});
