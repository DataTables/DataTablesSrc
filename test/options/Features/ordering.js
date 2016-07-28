describe( "ordering option ", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );
	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Default should be set to true", function () {
			$('#example').dataTable();
			expect($.fn.dataTable.defaults.bSort === true).toBe(true);
		});
		it("Default sorting has class 'sorting_asc'", function () {
			expect($('#example thead th:eq(0)').hasClass('sorting_asc')).toBe(true);
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
		it("Try activate sorting via DOM- when disabled (second click)", function (done) {
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
			expect($('#example thead th:eq(0)').hasClass('sorting_asc')).toBe(true);
		});
		dt.html('basic');
		it("'sorting_desc' is added as a class when a column is clicked on", function () {
			$('#example').dataTable( {

			});

			$('#example thead th:eq(0)').click();
			expect($('#example thead th:eq(0)').hasClass('sorting_desc')).toBe(true);
		});
		it("'sorting_asc' is added as a class when a column is clicked on", function () {
			$('#example thead th:eq(0)').click();
			expect($('#example thead th:eq(0)').hasClass('sorting_asc')).toBe(true);
		});

	});
});
