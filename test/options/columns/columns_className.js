describe('columns.className option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it("By default the test class hasn't been applied to the column", function() {
			$('#example').dataTable({});
			expect($('#example tbody tr:eq(0) td:eq(2)').hasClass('unittest')).not.toBe(true);
		});

		dt.html('basic');
		it('Add a class to a single column', function() {
			$('#example').dataTable({
				columns: [null, null, { className: 'unittest' }, null, null, null]
			});
			expect($('#example tbody tr:eq(0) td:eq(2)').hasClass('unittest')).toBe(true);
		});
		it('Add a class to a single column- third row', function() {
			expect($('#example tbody tr:eq(2) td:eq(2)').hasClass('unittest')).toBe(true);
		});
		it('Add a class to a single column- last row', function() {
			expect($('#example tbody tr:eq(9) td:eq(2)').hasClass('unittest')).toBe(true);
		});
		it('Add a class to a single column- has not applied to other columns- 1st', function() {
			expect($('#example tbody tr:eq(3) td:eq(0)').hasClass('unittest')).toBe(false);
		});
		it('Add a class to a single column- has not applied to other columns- 5th', function() {
			expect($('#example tbody tr:eq(3) td:eq(4)').hasClass('unittest')).toBe(false);
		});
		it('Add a class to a single column- has not applied to header', function() {
			expect($('#example thead tr:eq(0) th:eq(4)').hasClass('unittest')).toBe(false);
		});
		it('Add a class to a single column- has not applied to footer', function() {
			expect($('#example tfoot tr:eq(0) th:eq(4)').hasClass('unittest')).toBe(false);
		});
		it('Add a class to a single column- seventh row- second page', function() {
			$('a.paginate_button.next').click();
			expect($('#example tbody tr:eq(6) td:eq(2)').hasClass('unittest')).toBe(true);
		});

		dt.html('basic');
		it('Class defined for multiple columns- first row', function() {
			$('#example').dataTable({
				columns: [{ className: 'unittest1' }, null, { className: 'unittest2' }, null, null, null]
			});
			expect($('#example tbody tr:eq(0) td:eq(0)').hasClass('unittest1')).toBe(true);
			expect($('#example tbody tr:eq(0) td:eq(2)').hasClass('unittest1')).toBe(false);
			expect($('#example tbody tr:eq(0) td:eq(2)').hasClass('unittest2')).toBe(true);
			expect($('#example tbody tr:eq(0) td:eq(0)').hasClass('unittest2')).toBe(false);
		});
		it('Class defined for multiple columns- has not applied to other columns- 5th 1', function() {
			expect($('#example tobody tr:eq(0) td:eq(4)').hasClass('unittest1')).toBe(false);
		});
		it('Class defined for multiple columns- has not applied to other columns- 5th 3', function() {
			expect($('#example tobody tr:eq(6) td:eq(4)').hasClass('unittest2')).toBe(false);
		});
	});
});
