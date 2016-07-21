describe( "ordering option ", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );
	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Default should be set to true", function () {
			$('#example').dataTable();
			expect($('#example').DataTable().settings()[0].oFeatures.bSort && $('#example thead th:eq(0)').hasClass('sorting')).toBe(true);
		});
		dt.html( 'basic' );
		it("Column ordering can be disabled", function () {
			$('#example').dataTable( {
				"ordering": false
			});
			expect($('#example thead th:eq(0)').hasClass('sorting_disabled')).toBe(true);
		});
		it("Try activate sorting via DOM- when disabled", function (done) {
			setTimeout(function(){
				done();
			}, 100);
			$('#example thead th:eq(0)').click();
			expect($('#example tbody tr:eq(0) td:eq(0)').html() == 'Tiger Nixon').toBe(true);
		});
		dt.html( 'basic' );
		it("Enabling makes no difference", function () {
			$('#example').dataTable( {
				"ordering": true
			});
			expect($('#example thead th:eq(0)').hasClass('sorting')).toBe(true);
		});
	});
});
