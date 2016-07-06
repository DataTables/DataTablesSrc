describe( "Search option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Default values should be blank", function () {
			$('#example').dataTable();
			expect($('#example').DataTable().settings()[0].oPreviousSearch.sSearch === "" && $('#example').DataTable().settings()[0].oPreviousSearch.bRegex !== true).toBe(true);
		});
		it("Search term only in object", function () {
			$('#example').dataTable( {
				"search": {
					"search": "41"
				},
				"destroy": true
			});
			expect($('#example tbody tr:eq(0) td:eq(0)').html() == "Bradley Greer").toBe(true);
		});
		it("New search term should wipe old one", function () {
			$('#example_filter input').val('33').keyup();
			expect($('#example tbody tr:eq(0) td:eq(0)').html() == "Airi Satou").toBe(true);
		});

	});


	describe("search.regex option", function () {
		dt.html( 'basic' );
		it("Search plain text and escape regex true", function () {
			$('#example').dataTable( {
				"search": {
					"search": 'Marketing',
					"regex": false
				}
			});
			expect($('#example tbody tr:eq(0) td:eq(1)').html() == "Senior Marketing Designer").toBe(true);
		});
		dt.html( 'basic' );
		it("Search plain text term and escape regex false", function () {
			$('#example').dataTable( {
				"search": {
					"search": 'Designer',
					"regex": true
				}

			});
			expect($('#example tbody tr:eq(0) td:eq(1)').html() == "Senior Marketing Designer").toBe(true);
		});
		dt.html( 'basic' );
		it("Search regex text term and escape regex true", function () {
			$('#example').dataTable( {
				"search": {
					"search": '1.*',
					"regex": false
				}
			});
			expect($('#example tbody tr:eq(0) td:eq(0)').html() == "No matching records found").toBe(true);
		});
		dt.html( 'basic' );
		it("Search regex text term and escape regex false", function () {
			$('#example').dataTable( {
				"search": {
					"search": '1.*',
					"regex": true
				}
			});
			expect($('#example tbody tr:eq(0) td:eq(0)').html() == "Airi Satou").toBe(true);
		});
	});

	describe("search.smart option", function () {
		dt.html( 'basic' );
		it("Check smart option turns off smart filtering", function () {
			$('#example').dataTable( {
				"search": {
					"smart": false,
					"search": "Officer 47"
				}
			});
			expect($('#example tbody tr:eq(0) td:eq(0)').html() == "No matching records found").toBe(true);
		});
		dt.html( 'basic' );
		it("Check with smart true", function () {
			$('#example').dataTable( {
				"search": {
					"smart": true,
					"search": "Officer 47"
				}
			});
			expect($('#example tbody tr:eq(0) td:eq(0)').html() == "Angelica Ramos").toBe(true);
		});
	});

	describe("search.search", function () {
		dt.html( 'basic' );
		it("Set an initial global filter", function () {
			$('#example').dataTable( {
				"search": {
					"search": "Officer"
				}
			});
			expect($('#example_info').html() == "Showing 1 to 4 of 4 entries (filtered from 57 total entries)").toBe(true);
		});
	});

<<<<<<< HEAD
	describe("search.caseIntensitive option", function () {
		// dt.html( 'basic' );
		// it("Search via DOM (expect false)", function () {
		// 	$('#example').dataTable( {
		// 		"search": {
		// 			"caseIntensitive": false
		// 		}
		// 	});
		// 	$('#example_filter input').val('accountant').keyup();
		// 	expect($('#example tbody tr:eq(0) td:eq(0)').html() == "No matching records found").toBe(true);
		// });
		// dt.html( 'basic' );
		// it("Search via API (expect false)", function () {
		// 	$('#example').dataTable( {
		// 		"search": {
		// 			"caseIntensitive": false
		// 		}
		// 	});
		// 	$('#example_filter input').val('angelica').keyup();
		// 	expect($('#example tbody tr:eq(0) td:eq(0)').html() == "No matching records found").toBe(true);
		// });
=======
	describe("search.caseInsensitive option", function () {
		dt.html( 'basic' );
		it("Search via DOM (expect false)", function () {
			$('#example').dataTable( {
				"search": {
					"caseInsensitive": false
				}
			});
			$('#example_filter input').val('accountant').keyup();
			expect($('#example tbody tr:eq(0) td:eq(0)').html() == "No matching records found").toBe(true);
		});
		dt.html( 'basic' );
		it("Search via API (expect false)", function () {
			$('#example').dataTable( {
				"search": {
					"caseInsensitive": false
				}
			});
			$('#example_filter input').val('angelica').keyup();
			expect($('#example tbody tr:eq(0) td:eq(0)').html() == "No matching records found").toBe(true);
		});
>>>>>>> 3f208ffd4cb1516e9936aeeff6eb8217d98f3ae5
		dt.html( 'basic' );
		it("Search via DOM (expect true)", function () {
			$('#example').dataTable( {
				"search": {
					"caseInsensitive": true
				}
			});
			$('#example_filter input').val('Accountant').keyup();
			expect($('#example tbody tr:eq(0) td:eq(1)').html() == "Accountant").toBe(true);
		});
		dt.html( 'basic' );
		it("Search via API (expect true)", function () {
			$('#example').dataTable( {
				"search": {
					"caseInsensitive": true
				}
			});
			$('#example_filter input').val('Angelica').keyup();
			expect($('#example tbody tr:eq(0) td:eq(0)').html() == "Angelica Ramos").toBe(true);
		});
	});
});
