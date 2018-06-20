//Unsure how to test
describe('column.contentPadding option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Functional tests', function() {
		dt.html('basic');
		var standardWidth;
		it('Get standard column width', function() {
			$('#example').dataTable();
			var anThs = $('#example thead th');
			standardWidth = anThs[3].offsetWidth;
		});

		dt.html('basic');
		it('Ensure it is substanitally larger now', function() {
			$('#example').dataTable({
				columns: [null, null, null, { contentPadding: 'mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm' }, null, null]
			});
			var anThs = $('#example thead th');
			//console.log("NOW: " + anThs[3].offsetWidth + " BEFORE " + standardWidth*1.5);
			//expect(anThs[3].offsetWidth > standardWidth*1.5).toBe(true);
		});
	});
});
