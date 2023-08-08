describe('dt-data-order attribute', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Options', function() {
		dt.html('two_headers');

		it('All cells have icons by default', function() {
			$('#example').DataTable();

			expect($('.dt-orderable-asc').length).toBe(12);
		});


		dt.html('two_headers');

		it('Disable first cell', function() {
			$('#example thead th').eq(0).attr('data-dt-order', 'disable');
			$('#example').DataTable();

			expect($('.dt-orderable-asc').length).toBe(11);
			expect($('#example thead th').eq(0).hasClass('dt-orderable-asc')).toBe(false);
		});

		it('Click doesn\'t change the first cell', async function() {
			await dt.clickHeader(0);
			expect($('#example tbody td').eq(0).text()).toBe('Airi Satou');
		});


		dt.html('two_headers');

		it('Disable second cell', function() {
			$('#example thead th').eq(1).attr('data-dt-order', 'disable');
			$('#example').DataTable();

			expect($('.dt-orderable-asc').length).toBe(11);
			expect($('#example thead th').eq(0).hasClass('dt-orderable-asc')).toBe(true);
			expect($('#example thead th').eq(1).hasClass('dt-orderable-asc')).toBe(false);
		});

		it('Click doesn\'t change the first cell', async function() {
			await dt.clickHeader(1);
			expect($('#example tbody td').eq(0).text()).toBe('Airi Satou');
		});


		dt.html('two_headers');

		it('Disable whole row - first row', function() {
			$('#example thead tr').eq(0).attr('data-dt-order', 'disable');
			$('#example').DataTable();

			expect($('.dt-orderable-asc').length).toBe(6);
			expect($('#example thead th').eq(0).hasClass('dt-orderable-asc')).toBe(false);
			expect($('#example thead th').eq(7).hasClass('dt-orderable-asc')).toBe(true);
		});

		it('Click on disabled row does nothing', async function() {
			await dt.clickHeader(0);
			expect($('#example tbody td').eq(0).text()).toBe('Airi Satou');
		});

		it('Click on enabled row does sort', async function() {
			await dt.clickHeader(6);
			expect($('#example tbody td').eq(0).text()).toBe('Zorita Serrano');
		});


		dt.html('two_headers');

		it('Disable whole row - second row', function() {
			$('#example thead tr').eq(1).attr('data-dt-order', 'disable');
			$('#example').DataTable();

			expect($('.dt-orderable-asc').length).toBe(6);
			expect($('#example thead th').eq(0).hasClass('dt-orderable-asc')).toBe(true);
			expect($('#example thead th').eq(7).hasClass('dt-orderable-asc')).toBe(false);
		});

		it('Click on disabled row does nothing', async function() {
			await dt.clickHeader(6);
			expect($('#example tbody td').eq(0).text()).toBe('Airi Satou');
		});

		it('Click on enabled row does sort', async function() {
			await dt.clickHeader(0);
			expect($('#example tbody td').eq(0).text()).toBe('Zorita Serrano');
		});


		dt.html('basic');

		it('Icons only', function() {
			$('#example thead th').eq(0).attr('data-dt-order', 'icon-only');
			$('#example').DataTable();

			expect($('.dt-orderable-asc').length).toBe(6);
			expect($('#example thead th').eq(0).hasClass('dt-orderable-asc')).toBe(true);
		});

		it('Click on icon-only cell does nothing', async function() {
			await dt.clickHeader(0);
			expect($('#example tbody td').eq(0).text()).toBe('Airi Satou');
		});
	});
});
