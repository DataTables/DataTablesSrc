describe( "language.aria option ", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Can we set pagination aria controls different from normal paginate", function () {
			$('#example').DataTable( {
				pagingType: 'full',
				language: {
					paginate: {
						first:    '«',
						previous: '‹',
						next:     '›',
						last:     '»'
					},
					aria: {
						paginate: {
							first:    'First',
							previous: 'Previous',
							next:     'Next',
							last:     'Last'
						}
					}
				}
			} );

			expect( $('#example_next').attr('aria-label') == "Next" &&
			$('#example_previous').attr('aria-label') == "Previous" &&
			$('#example_first').attr('aria-label') == "First" &&
			$('#example_last').attr('aria-label') == "Last").toBe(true);

		});

		dt.html( 'basic' );
		it("Language aria sortAsc", function () {
			$('#example').DataTable( {
				pagingType: 'full',
				language: {
					"aria": {
						"sortAscending": "test case"
					}
				}
			} );
			$('#example thead th:eq(0)').click();
			expect( $('#example thead th:eq(0)').attr('aria-label') == "Nametest case").toBe(true);
		});
		dt.html( 'basic' );
		it("Language Aria sortDesc", function () {
			$('#example').DataTable( {
				pagingType: 'full',
				language: {
					"aria": {
						"sortDescending": "test case1"
					}
				}
			} );

			expect( $('#example thead th:eq(0)').attr('aria-label') == "Nametest case1").toBe(true);
		});
	});
});
