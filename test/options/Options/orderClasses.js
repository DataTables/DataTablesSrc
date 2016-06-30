describe( "orderClasses option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Enabled by default", function () {
			$('#example').dataTable();
			expect( $('#example tbody tr:eq(0) td:eq(0)').hasClass('sorting_1'));
		});

		it("Applied to multiple columns", function () {
			$('#example').dataTable( {
				"order": [[ 0, 'desc' ], [ 1, 'desc' ]],
				"destroy": "true"
			});
			expect( $('#example tbody tr:eq(0) td:eq(0)').hasClass('sorting_1')).toBe(true);
			expect( $('#example tbody tr:eq(0) td:eq(1)').hasClass('sorting_2')).toBe(true);
		});
		it("Applied to a third column", function () {
			$('#example').dataTable( {
				"order": [[ 0, 'desc' ], [ 1, 'desc' ],[ 2, 'asc']],
				"destroy": "true"
			});
			expect( $('#example tbody tr:eq(0) td:eq(0)').hasClass('sorting_1')).toBe(true);
			expect( $('#example tbody tr:eq(0) td:eq(1)').hasClass('sorting_2')).toBe(true);
			expect( $('#example tbody tr:eq(0) td:eq(2)').hasClass('sorting_3')).toBe(true);
		});
		it("Applied to a 4th column", function () {
			$('#example').dataTable( {
				"order": [[ 0, 'desc' ], [ 1, 'desc' ],[ 2, 'asc'],[ 3, 'desc']],
				"destroy": "true"
			});
			expect( $('#example tbody tr:eq(0) td:eq(0)').hasClass('sorting_1')).toBe(true);
			expect( $('#example tbody tr:eq(0) td:eq(1)').hasClass('sorting_2')).toBe(true);
			expect( $('#example tbody tr:eq(0) td:eq(2)').hasClass('sorting_3')).toBe(true);
			expect( $('#example tbody tr:eq(0) td:eq(3)').hasClass('sorting_3')).toBe(true);
		});
	});
	describe("Can be disabled", function () {
		it("Can be turned off", function () {
			$('#example').dataTable( {
				"orderClasses": false,
				"destroy": "true"
			});
			expect( $('#example tbody tr:eq(0) td:eq(0)').hasClass('sorting_1')).toBe(false);
		});
		it("Add column 2- no effect", function () {
			var clickEvent = $.Event('click');
			clickEvent.shiftKey = true;
			$('#example thead th:eq(1)').trigger(clickEvent);
			expect( $('#example tbody tr:eq(0) td:eq(0)').hasClass('sorting_1')).toBe(false);
			expect( $('#example tbody tr:eq(0) td:eq(1)').hasClass('sorting_1')).toBe(false);
		});
		it("Add column 3- no effect", function () {
			var clickEvent = $.Event('click');
			clickEvent.shiftKey = true;
			$('#example thead th:eq(2)').trigger(clickEvent);
			expect( $('#example tbody tr:eq(0) td:eq(0)').hasClass('sorting_1')).toBe(false);
			expect( $('#example tbody tr:eq(0) td:eq(1)').hasClass('sorting_1')).toBe(false);
			expect( $('#example tbody tr:eq(0) td:eq(2)').hasClass('sorting_1')).toBe(false);

		});
	});
});
