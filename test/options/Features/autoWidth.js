describe( "autoWidth option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	//Need to think about how to test this as it's not a simple binary output.
	describe("Check Default", function () {
		dt.html( 'basic' );
		it("Auto Width enabled by default", function () {
			$('#example').dataTable();
			expect($.fn.dataTable.defaults.bAutoWidth).toBeTruthy();
		});
		it("First column has a width assigned to it", function () {
			expect($('#example thead th:eq(0)').attr('style').match(/width/i)).toBeTruthy();
		});
		it("Second column has a width assigned to it", function () {

			expect($('#example thead th:eq(1)').attr('style').match(/width/i)).toBeTruthy();
		});


		dt.html( 'basic' );

		it("Autowidth can be disabled", function () {
			$('#example').dataTable( {
				"autoWidth": false
			});

		});
		it("'style returns undefined during datatables initialisation'", function () {
			expect($('#example thead th:eq(0)').attr('style')).toEqual(undefined);
		});
		it("First column does not have a width assigned to it", function () {
			// setTimeout(function(){
			// 	expect($('#example thead th:eq(0)').attr('style')).toBeTruthy();
			// 	done();
			// }, 1000);

		});


		dt.html( 'basic' );
		it("Auto width enabled override", function () {
			$('#example').dataTable( {
				"autoWidth": true
			});
			expect($.fn.dataTable.defaults.bAutoWidth).toBe(true);
		});
		it("First column has a width assigned to it", function () {
			expect($('#example thead th:eq(0)').attr('style').match(/width/i)).toBeTruthy();
		});
		it("Second column has a width assigned to it", function () {

			expect($('#example thead th:eq(1)').attr('style').match(/width/i)).toBeTruthy();
		});
	});
});
