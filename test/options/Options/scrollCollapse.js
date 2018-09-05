describe( "scrollCollapse option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Default length of scrollBody is 300", function () {
			$('#example').dataTable( {
				scrollY: 300,
				scrollCollapse: true
			});
			expect($('div.dataTables_scrollBody').height() == 300).toBeTruthy();
		});
		it("Check viewport is shrunk to result set", function () {
			$('div.dataTables_filter input').val("41").keyup();
			expect($('div.dataTables_scrollBody').height() == $('#example').height()).toBe(true);
		});
		it("Check viewport is reset when no input", function () {
			$('div.dataTables_filter input').val("").keyup();
			expect($('div.dataTables_scrollBody').height() == 300).toBeTruthy();
		});


	});


});
