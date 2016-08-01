describe( "lengthChange option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );
	describe("Check Default", function () {
		dt.html( 'basic' );
		it("Info div exists by default", function () {
				$('#example').dataTable();
				expect(document.getElementById('example_info')).toBeTruthy();
				expect($.fn.dataTable.defaults.bLengthChange).toBe(true);
		});
		it("Four default options", function () {
			expect($("select[name=example_length] option").length == 4).toBeTruthy();
		});
		it("Correct place in DOM by default", function () {
			expect($('#example_length').next().attr('id') == 'example_filter').toBe(true);
		});

	});
	describe("Check can disable", function () {
		dt.html( 'basic' );
			it("Change length can be disabled", function () {
				$('#example').dataTable({
					"lengthChange": false
				});
				expect(document.getElementById('example_length') === null).toBeTruthy();
			});
		it("Information takes length disabled into account", function () {
			expect(document.getElementById('example_info').innerHTML == "Showing 1 to 10 of 57 entries").toBeTruthy();
		});
		dt.html( 'basic' );
		it("If we disable the 'paging' option then lengthChange should be set to false by default", function () {
			$('#example').dataTable( {
				"paging": false
			});
			 expect($('#example_length').html()).not.toBeDefined();
		});
	});
	describe("Enable makes no difference", function () {
		dt.html( 'basic' );
		it("Length change enabled override", function () {
			$('#example').dataTable({
				"lengthChange": true
			});
			expect(document.getElementById('example_length')).not.toBeNull();
		});
	});
} );
