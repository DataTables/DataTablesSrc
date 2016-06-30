describe( "pageLength Option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Default length is ten", function () {
			$('#example').dataTable( );
			expect($('#example tbody tr').length == 10).toBe(true);
		});
		it("Select menu shows 10", function () {
			expect($('#example_length select').val() == 10).toBe(true);
		});

		it("Sit initial length to 25", function () {
			$('#example').dataTable( {
				"pageLength": 25,
				"destroy": true
			});
			expect($('#example tbody tr').length == 25).toBe(true);
		});
		it("Select menu shows 25", function () {
			expect($('#example_length select').val() == 25).toBe(true);
		});

		it("Sit initial length to 100", function () {
			$('#example').dataTable( {
				"pageLength": 100,
				"destroy": true
			});
			expect($('#example tbody tr').length == 57).toBe(true);
		});
		it("Select menu shows 100", function () {
			expect($('#example_length select').val() == 100).toBe(true);
		});
		it("Set initial length to 23 (unknown select menu length)", function () {
			$('#example').dataTable( {
				"pageLength": 23,
				"destroy": true
			});
			expect($('#example tbody tr').length == 23).toBe(true);
		});
		it("Select menu shows 10 (since 23 is unknown)", function () {
			expect($('#example_length select').val() == 10).toBe(true);
		});

	});


});
