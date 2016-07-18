describe( "language.info option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Info language is 'Showing _START_ to _END_ of _TOTAL_ entries' by default ", function () {
			$('#example').dataTable();
			expect($('#example').DataTable().settings()[0].oLanguage.sInfo  == "Showing _START_ to _END_ of _TOTAL_ entries").toBe(true);
		});
		it("Info language default is in the DOM", function () {
			expect($('#example_info').html() == "Showing 1 to 10 of 57 entries").toBe(true);
		});
		dt.html( 'basic' );
		it("Info language can be defined - without any macros", function () {
			$('#example').dataTable( {
				"language": {
					"info": "unit test"
				}
			});
			expect($('#example').DataTable().settings()[0].oLanguage.sInfo  == "unit test").toBe(true);
		});
		it("Info language is in the dom", function () {
			expect($('#example_info').html() == "unit test").toBe(true);
		});
		dt.html( 'basic' );
		it("info language can be defined- with macro _START_ only", function () {
			$('#example').dataTable( {
				"language": {
					"info": "unit _START_ test"
				}
			});
			expect( $('#example_info').html() == "unit 1 test" ).toBe(true);
		});
		dt.html( 'basic' );
		it("info language can be defined- with macro _END_ only", function () {
			$('#example').dataTable( {
				"language": {
					"info": "unit _END_ test"
				}
			});
			expect( $('#example_info').html() == "unit 10 test" ).toBe(true);
		});
		dt.html( 'basic' );
		it("info language can be defined- with macro _TOTAL only", function () {
			$('#example').dataTable( {
				"language": {
					"info": "unit _TOTAL_ test"
				}
			});
			expect( $('#example_info').html() == "unit 57 test" ).toBe(true);
		});
		dt.html( 'basic' );
		it("info language can be defined- with macro _START_ and _END_ only", function () {
			$('#example').dataTable( {
				"language": {
					"info": "unit _START_ _END_ test"
				}
			});
			expect( $('#example_info').html() == "unit 1 10 test" ).toBe(true);
		});
		dt.html( 'basic' );
		it("info language can be defined- with macro _START_, _END_ and _TOTAL_ only", function () {
			$('#example').dataTable( {
				"language": {
					"info": "unit _START_ _END_ _TOTAL_ test"
				}
			});
			expect( $('#example_info').html() == "unit 1 10 57 test" ).toBe(true);
		});


	});

});
