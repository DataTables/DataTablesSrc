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
			expect($('#example colgroup col:eq(0)').attr('style').match(/width/i)).toBeTruthy();
		});
		it("Second column has a width assigned to it", function () {

			expect($('#example colgroup col:eq(1)').attr('style').match(/width/i)).toBeTruthy();
		});


		dt.html( 'basic' );

		it("Autowidth can be disabled", function () {
			$('#example').dataTable( {
				"autoWidth": false
			});

		});
		it("'style returns undefined during datatables initialisation'", function () {
			expect($('#example thead th:eq(0)').attr('style')).toEqual(undefined);
			expect($('#example colgroup col:eq(0)').attr('style')).toEqual(undefined);
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
			expect($('#example colgroup col:eq(0)').attr('style').match(/width/i)).toBeTruthy();
		});
		it("Second column has a width assigned to it", function () {

			expect($('#example colgroup col:eq(1)').attr('style').match(/width/i)).toBeTruthy();
		});
	});

	describe("width attribute / style addition", function () {
		dt.html( 'basic' );

		it("Initialisation without a width attribute or style causes it to be added", function () {
			$('#example').removeAttr('width');

			$('#example').DataTable();

			expect($('#example')[0].style.width).toBe('100%')
		});
		
		dt.html( 'basic' );

		it("With auto width disabled it is not 100%", function () {
			$('#example').removeAttr('width');

			$('#example').DataTable({
				autoWidth: false
			});

			expect($('#example')[0].style.width).toBe('')
		});
		
		dt.html( 'basic' );

		it("A set width is retained (style)", function () {
			$('#example').removeAttr('width');
			$('#example')[0].style.width = '50%';

			$('#example').DataTable();

			expect($('#example')[0].style.width).toBe('50%')
		});
		
		dt.html( 'basic' );

		it("A set width is retained (attribute)", function () {
			$('#example').attr('width', '50%');

			$('#example').DataTable();

			expect($('#example')[0].style.width).toBe('50%')
		});
	});
});
