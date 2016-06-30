describe( "LengthMenu", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );
	//Test the text of the menu as well.

	// "aLengthMenu": [
    //     [10, 25, 50, 100, -1],
    //     [10, 25, 50, 100, "All"]
    // ],
	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Check default values", function () {
			$('#example').dataTable( );
			expect($('#example').DataTable().settings()[0].aLengthMenu).toEqual([10, 25, 50, 100]);
		});
		it("Setting to default values makes no difference", function () {
			$('#example').dataTable( {
				"lengthMenu": [10, 25, 50, 100],
				"destroy": "true"
			});
			expect($('#example').DataTable().settings()[0].aLengthMenu).toEqual([10, 25, 50, 100]);
		});
	});
	describe("Check when enabled", function () {
		dt.html( 'basic' );
		it("Change length Menu", function () {

			$('#example').dataTable( {
				"lengthMenu": [1,10,15]
			});
			expect($('#example').DataTable().settings()[0].aLengthMenu).toEqual([1,10,15]);
		});
		it("Change length Menu- Second time", function () {

			$('#example').dataTable( {
				"lengthMenu": [3,15,32],
				"destroy": "true"
			});
			expect($('#example').DataTable().settings()[0].aLengthMenu).toEqual([3,15,32]);
		});
		it("Change back to default", function () {
			$('#example').dataTable( {
				"destroy": "true"
			});
			expect($('#example').DataTable().settings()[0].aLengthMenu).toEqual([10, 25, 50, 100]);
		});

	});
});
