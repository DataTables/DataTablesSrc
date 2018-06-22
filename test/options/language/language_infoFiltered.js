describe('language.infoFiltered option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it("Default is 'No data available in table' ", function() {
			table = $('#example').DataTable();
			expect(table.settings()[0].oLanguage.sInfoFiltered).toBe('(filtered from _MAX_ total entries)');
		});

		dt.html('basic');
		it('Can we change the value of infoFiltered- check option', function() {
			table = $('#example').DataTable({
				language: {
					infoFiltered: ' - filtered from _MAX_ records'
				}
			});
			expect(
				table.settings()[0].oLanguage.sInfoFiltered === ' - filtered from _MAX_ records'
			).toBe(true);
		});
		it('Can we change the value of infoFiltered- check DOM', function() {
			$('div.dataTables_filter input')
				.val('Jack')
				.keyup();
			expect($('div.dataTables_info').html() === 'Showing 1 to 1 of 1 entries  - filtered from 57 records').toBe(true);
		});

		// dt.html( 'basic' );
		// it("Use infoFiltered without macro", function () {
		// 	$('#example').dataTable( {
		// 		"language": {
		// 			"infoFiltered": " - filtered from 57 records"
		// 		}
		// 	});
		// 	expect($('#example').DataTable().settings()[0].oLanguage.sInfoFiltered  === " - filtered from 57 records").toBe(true);

		// });
		// it("User infoFiltered without macro- check DOM", function () {
		// 	$('div.dataTables_filter input').val('Jack').keyup();
		// 	expect($('div.dataTables_info').html() === "Showing 1 to 1 of 1 entries  - filtered from 57 records").toBe(true);
		// });
		// dt.html( 'basic' );
		// it("User infoFiltered with only macro", function () {
		// 	$('#example').dataTable( {
		// 		"language": {
		// 			"infoFiltered": "_MAX_ _TOTAL_"
		// 		}
		// 	});
		// 	$('div.dataTables_filter input').val('Jack').keyup();
		// 	expect($('#example').DataTable().settings()[0].oLanguage.sInfoFiltered  === "_MAX_ _TOTAL_").toBe(true);
		// });
		// it("User infoFiltered with only macro- check DOM", function () {
		// 	expect($('div.dataTables_info').html() === "Showing 1 to 1 of 1 entries 57 1").toBe(true);

		// });
	});
});
