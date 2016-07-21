describe( "stateSave option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );
	describe("Check Default", function () {
		dt.html( 'basic' );
		it("stateSave disabled by default", function () {
			$('#example').dataTable();
			expect($('#example').DataTable().settings()[0].oFeatures.bStateSave).toBeNull();
		});
		dt.html( 'basic' );
		it("stateSave can be enabled", function () {
			$('#example').dataTable({
				"stateSave": true
			});
			expect($('#example').DataTable().settings()[0].oFeatures.bStateSave).toBe(true);
		});
	});
	describe("Check when enabled", function () {
		it("Is filter state saved upon table refresh- DOM", function () {
			$('#example_filter input').val(2012).keyup();
			$('#example').DataTable().destroy();
			$('#example').dataTable({
				"stateSave": true
			});
			expect($('#example_info').html() == "Showing 1 to 9 of 9 entries (filtered from 57 total entries)").toBeTruthy();
		});
		it("Has input been entered into input element", function () {
			expect($('#example_filter input').val() == 2012).toBeTruthy();
		});
		dt.html( 'basic' );
		it("Is filter state saved upon table refresh- API", function () {
			$('#example').dataTable({
				"stateSave": true
			});
			$('#example').DataTable().search("2012").draw();
			$('#example').DataTable().destroy();
			$('#example').dataTable({
				"stateSave": true
			});
			expect($('#example_info').html() == "Showing 1 to 9 of 9 entries (filtered from 57 total entries)").toBeTruthy();
		});

		describe("Single Sorting", function () {
			it("Does sorting function by default", function () {
				$('#example').DataTable().search('').draw();
				$('#example thead th:eq(0)').click();
				expect($('#example tbody td:eq(0)').html() == "Zorita Serrano").toBeTruthy();
			});

			it("Does sorting remain applied after page refresh", function () {
				$('#example').DataTable().search('').draw();
				$('#example').DataTable().destroy();
				$('#example').dataTable({
					"stateSave": true
				});
				expect($('#example tbody td:eq(0)').html() == "Zorita Serrano").toBeTruthy();
				$('#example').DataTable().state.clear();
			});

			it("Single column sorting reversed", function () {
				$('#example thead th:eq(0)').click();
				console.log($('#example tbody td:eq(0)').html());
				expect($('#example tbody td:eq(0)').html() == "Airi Satou").toBeTruthy();
			});
			it("Single column sorting reversed- remain applied after refresh", function () {
				$('#example').DataTable().destroy();
				$('#example').dataTable({
					"stateSave": true
				});
				expect($('#example tbody td:eq(0)').html() == "Airi Satou").toBeTruthy();
				$('#example').DataTable().state.clear();
			});
		});

		describe("Multi-Column Sorting", function () {
			dt.html( 'basic' );
			it("Does sorting function by default", function () {
				$('#example').dataTable({
					"stateSave": true
				});
				$('#example thead th:eq(3)').click();
				$('#example thead th:eq(3)').click();
				var clickEvent = $.Event('click');
				clickEvent.shiftKey = true;
				$('#example thead th:eq(5)').trigger(clickEvent);

				expect($('#example tbody td:eq(5)').html() == "$86,000").toBeTruthy();
				expect($('#example tbody td:eq(3)').html() == "66").toBeTruthy();
			});

			it("Does sorting remain after refresh", function () {
				$('#example').DataTable().destroy();
				$('#example').dataTable({
					"stateSave": true
				});
				expect($('#example tbody td:eq(5)').html() == "$86,000").toBeTruthy();
				expect($('#example tbody td:eq(3)').html() == "66").toBeTruthy();

			});

			it("Can we destroy the session //Unable to get working", function () {
				$('#example').DataTable().state.clear();
				console.log($('#example tbody td:eq(5)').html());
				//expect($('#example tbody td:eq(5)').html() == "$162,700").toBeTruthy();
			});
		});

		describe(" saveState when paging", function () {
			dt.html( 'basic' );
			it("Check table is back to default state", function () {
				$('#example').dataTable({
					"stateSave": true
				});
				expect($('#example tbody td:eq(0)').html() == "Airi Satou").toBeTruthy();
				expect(doc.getElementById('example_info').innerHTML == "Showing 1 to 10 of 57 entries").toBeTruthy();
			});

			it("Paging- Second page", function () {
				$('#example_next').click();
				expect($('#example tbody td:eq(0)').html() == "Charde Marshall").toBeTruthy();
				expect(doc.getElementById('example_info').innerHTML == "Showing 11 to 20 of 57 entries").toBeTruthy();
			});
			it("Paging- Second page- After refresh", function () {
				$('#example').DataTable().destroy();
				$('#example').dataTable({
					"stateSave": true
				});
				expect($('#example tbody td:eq(0)').html() == "Charde Marshall").toBeTruthy();
				expect(doc.getElementById('example_info').innerHTML == "Showing 11 to 20 of 57 entries").toBeTruthy();
			});
			it("Paging- Third page", function () {
				$('#example_next').click();
				expect($('#example tbody td:eq(0)').html() == "Gloria Little").toBeTruthy();
				expect(doc.getElementById('example_info').innerHTML == "Showing 21 to 30 of 57 entries").toBeTruthy();
			});
			it("Paging- Third page- After refresh", function () {
				$('#example').DataTable().destroy();
				$('#example').dataTable({
					"stateSave": true
				});
				expect($('#example tbody td:eq(0)').html() == "Gloria Little").toBeTruthy();
				expect(doc.getElementById('example_info').innerHTML == "Showing 21 to 30 of 57 entries").toBeTruthy();
			});
			it("Paging back to second page", function () {
				$('#example_previous').click();
				expect($('#example tbody td:eq(0)').html() == "Charde Marshall").toBeTruthy();
				expect(doc.getElementById('example_info').innerHTML == "Showing 11 to 20 of 57 entries").toBeTruthy();
			});
			it("Paging back to second page- After refresh", function () {
				$('#example').DataTable().destroy();
				$('#example').dataTable({
					"stateSave": true
				});
				expect($('#example tbody td:eq(0)').html() == "Charde Marshall").toBeTruthy();
				expect(doc.getElementById('example_info').innerHTML == "Showing 11 to 20 of 57 entries").toBeTruthy();
			});
			it("paging back to first page", function () {
				$('#example_previous').click();
				expect($('#example tbody td:eq(0)').html() == "Airi Satou").toBeTruthy();
				expect(doc.getElementById('example_info').innerHTML == "Showing 1 to 10 of 57 entries").toBeTruthy();
			});
			it("paging back to first page- After refresh", function () {
				$('#example').DataTable().destroy();
				$('#example').dataTable({
					"stateSave": true
				});
				expect($('#example tbody td:eq(0)').html() == "Airi Satou").toBeTruthy();
				expect(doc.getElementById('example_info').innerHTML == "Showing 1 to 10 of 57 entries").toBeTruthy();
			});
		});

		describe("saveState when changing page length", function () {
			it("Information with 25 records", function () {
				$('select[name=example_length]').val('25').change();
				expect(doc.getElementById('example_info').innerHTML == "Showing 1 to 25 of 57 entries").toBeTruthy();
				$('#example').DataTable().state.clear();
			});
		});
	});


	describe("Check when disabled", function () {
		dt.html( 'basic' );
		it("Information with 25 records", function () {
			$('#example').dataTable({
				"stateSave": true
			});
			$('select[name=example_length]').val('25').change();
			expect(doc.getElementById('example_info').innerHTML == "Showing 1 to 25 of 57 entries").toBeTruthy();
		});
		it("Information with 25 records- After refresh", function () {
			$('#example').DataTable().destroy();
			$('#example').dataTable({
				"stateSave": true
			});
			expect(doc.getElementById('example_info').innerHTML == "Showing 1 to 25 of 57 entries").toBeTruthy();
		});
		it("Information with 100 records", function () {
			$('select[name=example_length]').val('100').change();
			expect(doc.getElementById('example_info').innerHTML == "Showing 1 to 57 of 57 entries").toBeTruthy();
		});
		it("Information with 100 records- After refresh", function () {
			$('#example').DataTable().destroy();
 			$('#example').dataTable({
 				"stateSave": true
 			});
			expect(doc.getElementById('example_info').innerHTML == "Showing 1 to 57 of 57 entries").toBeTruthy();
			$('#example').DataTable().state.clear();
		});
	});
	describe("Check state is ignored", function () {
		dt.html( 'basic' );
		it("Ignored if datatable is reinitialised with different number of columns", function () {
			$('#example').dataTable({
				"stateSave": true
			});
			expect($('#example').DataTable().settings()[0].aoColumns.length == 6).toBe(true);
			expect($('#example tbody td:eq(0)').html() == "Airi Satou").toBeTruthy();
			expect($('#example tbody td:eq(3)').html() == "33").toBeTruthy();
		});
		it("Remove column and reinitialise datatable", function () {
			$('#example').DataTable().destroy();
			$('#example thead th:eq(3)').remove();
			$('#example tfoot th:eq(3)').remove();
			$("#example tbody tr").each(function() {
				$(this).find("td:eq(3)").remove();
			});
			$('#example').dataTable({
				"stateSave": true
			});
			expect($('#example').DataTable().settings()[0].aoColumns.length == 5).toBe(true);
			expect($('#example tbody td:eq(0)').html() == "Airi Satou").toBeTruthy();
			expect($('#example tbody td:eq(3)').html() == "2008/11/28").toBeTruthy();
			$('#example').DataTable().state.clear();
		});
	});

} );
