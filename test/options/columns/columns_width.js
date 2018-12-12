describe('columns.width option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('With AutoWidth disabled the width for one column is applied', function() {
			$('#example').dataTable({
				autoWidth: false,
				columns: [null, { width: '40%' }, null, null, null, null]
			});
			expect($('#example thead th:eq(1)')[0].style.width).toBe('40%');
		});

		dt.html('basic');
		it('With AutoWidth disabled the width for one column is applied (columnDefs)', function() {
			$('#example').dataTable({
				autoWidth: false,
				columnDefs: [{"targets": 1, "width": '40%' }]
			});
			expect($('#example thead th:eq(1)')[0].style.width).toBe('40%');
		});

		dt.html('basic');
		it('With autoWidth disabled the widths for multiple columns are applied', function() {
			$('#example').dataTable({
				autoWidth: false,
				columns: [null, { width: '20%' }, { width: '30%' }, null, null, null]
			});
			expect($('#example thead th:eq(1)')[0].style.width).toBe('20%');
			expect($('#example thead th:eq(2)')[0].style.width).toBe('30%');
		});

		dt.html('basic');
		it('With autowidth, it will make the smallest columns the largest with percentage width given', function() {
			$('#example').dataTable({
				columns: [null, null, null, { width: '50%' }, null, null]
			});
			
			var anThs = $('#example thead th');
			var a0 = anThs[0].offsetWidth;
			var a1 = anThs[1].offsetWidth;
			var a2 = anThs[2].offsetWidth;
			var a3 = anThs[3].offsetWidth;
			var a4 = anThs[4].offsetWidth;

			expect(a3 > a0).toBe(true);
			expect(a3 > a1).toBe(true);
			expect(a3 > a2).toBe(true);
			expect(a3 > a4).toBe(true);
		});
	});
});
