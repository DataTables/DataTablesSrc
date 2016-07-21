describe( "searching option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );
  describe("Check Default", function () {
		dt.html( 'basic' );
		it("searching enabled by default- DOM", function () {
			$('#example').dataTable();
			$('#example_filter input').val(33).keyup();
			expect($('#example_info').html() == "Showing 1 to 2 of 2 entries (filtered from 57 total entries)").toBeTruthy();
		});
		it("searching enabled by default- API", function () {
			$('#example').DataTable().search(33).draw();
			expect($('#example_info').html() == "Showing 1 to 2 of 2 entries (filtered from 57 total entries)").toBeTruthy();
		});
		it("Can search multiple space seperated words- DOM", function () {
			$('#example_filter input').val("New 3").keyup();
			expect($('#example_info').html() == "Showing 1 to 5 of 5 entries (filtered from 57 total entries)").toBeTruthy();
		});
		it("Can search multiple space seperated words- API", function () {
			$('#example').DataTable().search("New 3").draw();
			expect($('#example_info').html() == "Showing 1 to 5 of 5 entries (filtered from 57 total entries)").toBeTruthy();
		});
	});
	describe("Check can disable", function () {
		dt.html( 'basic' );
		it("Searching can be disabled", function () {
			$('#example').dataTable( {
			"searching": false
			});
			expect($('#example_filter').is(':visible')).toBe(false);
		});
		it("Searching on disabled table has no effect- DOM", function () {
			$('#example_filter input').val("New 3").keyup();
			expect($('#example_info').html() == "Showing 1 to 10 of 57 entries").toBeTruthy();
		});
		it("Searching on disabled table has no effect- API", function () {
			$('#example').DataTable().search(33).draw();
			expect($('#example_info').html() == "Showing 1 to 10 of 57 entries").toBeTruthy();
		});
	});
	describe("Check enable override", function () {
		dt.html( 'basic' );
		it("Searching enabled override- DOM", function () {
			$('#example').dataTable( {
			"seaching": true
			});
			$('#example_filter input').val("New 3").keyup();
			expect($('#example_info').html() == "Showing 1 to 5 of 5 entries (filtered from 57 total entries)").toBeTruthy();
		});
		it("Searching enabled override- API", function () {
			$('#example').DataTable().search("New 3").draw();
			expect($('#example_info').html() == "Showing 1 to 5 of 5 entries (filtered from 57 total entries)").toBeTruthy();
		});
	});
} );
