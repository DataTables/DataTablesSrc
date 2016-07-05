describe( "order", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check defaults", function () {
		dt.html( 'basic' );
		it("Check disabled by default", function () {
			$('#example').dataTable();
			expect($('#example').DataTable().settings()[0].oFeatures.aaSorting).toBe(undefined);
		});
		it("First column should be sorted- asc by default", function () {
			expect($('#example tbody tr:eq(0) td:eq(0)').html() == "Airi Satou").toBe(true);
		});
	});

	describe("Check can be enabled", function () {
		dt.html( 'basic' );
		it("Single Column Sort -Asc", function () {
			$('#example').dataTable( {
				"order": [1, 'asc']
			});
			expect($('#example tbody tr:eq(0) td:eq(1)').html() == "Accountant").toBe(true);
		});
		it("Single column sort- Desc", function () {
			$('#example').dataTable( {
				"order": [1, 'desc'],
				"destroy": true
			});
			expect($('#example tbody tr:eq(0) td:eq(1)').html() == "Technical Author").toBe(true);
		});
		it("Two Column Sort- Both Asc", function () {
			$('#example').dataTable( {
				"order": [[ 0, 'asc' ], [ 1, 'asc' ]],
				"destroy": true
			});
			expect($('#example tbody tr:eq(0) td:eq(1)').html() == "Accountant").toBe(true);
			expect($('#example tbody tr:eq(0) td:eq(0)').html() == "Airi Satou").toBe(true);
		});
		it("Two Column Sort- Both Desc", function () {
			$('#example').dataTable( {
				"order": [[ 0, 'desc' ], [ 1, 'desc' ]],
				"destroy": true
			});
			expect($('#example tbody tr:eq(0) td:eq(1)').html() == "Software Engineer").toBe(true);
			expect($('#example tbody tr:eq(0) td:eq(0)').html() == "Zorita Serrano").toBe(true);
		});
		it("Two Column Sort- One Desc, One Asc", function () {
			$('#example').dataTable( {
				"order": [[ 2, 'asc' ], [ 1, 'desc' ]],
				"destroy": true
			});
			expect($('#example tbody tr:eq(0) td:eq(1)').html() == "System Architect").toBe(true);
			expect($('#example tbody tr:eq(0) td:eq(2)').html() == "Edinburgh").toBe(true);
		});


	});
});
