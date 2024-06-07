describe('pageType Option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	function checkPaging(count, typeInternal, type, pages, pageCount, prevNext, firstLast) {
		expect($('.dt-paging button').length).toBe(count);
		expect($('#example').DataTable.settings[0].sPaginationType).toBe(typeInternal);
		expect($('div.' + type).length).toBe(1);

		if (pages) {
			// this is the sum of the numbers ('a') and the ellipses ('span')
			let buttons = $('.dt-paging button').length;
			let ellipsis = $('.dt-paging span.ellipsis').length;
			let leading = prevNext ? 2 : 0;
			let trailing = firstLast ? 2 : 0;

			expect(buttons - leading - trailing + ellipsis).toBe(pageCount);
		}

		if (prevNext) {
			expect($('.dt-paging .previous').length).toBe(1);
			expect($('.dt-paging .next').length).toBe(1);
		}

		if (firstLast) {
			expect($('.dt-paging .first').length).toBe(1);
			expect($('.dt-paging .last').length).toBe(1);
		}

		return true;
	}

	describe('Check the various paging types in default table', function() {
		dt.html('basic');
		it('Default', function() {
			$('#example').dataTable();
			expect(checkPaging(10, '', 'dt-paging', true, 6, true, true)).toBe(true);
		});

		dt.html('basic');
		it('Numbers', function() {
			$('#example').dataTable({
				pagingType: 'numbers'
			});
			expect(checkPaging(6, 'numbers', 'paging_numbers', true, 6, false, false)).toBe(true);
		});

		dt.html('basic');
		it('Simple', function() {
			$('#example').dataTable({
				pagingType: 'simple'
			});
			expect(checkPaging(2, 'simple', 'paging_simple', false, undefined, true, false)).toBe(true);
		});

		dt.html('basic');
		it('Simple Numbers', function() {
			$('#example').dataTable({
				pagingType: 'simple_numbers'
			});
			expect(checkPaging(8, 'simple_numbers', 'paging_simple_numbers', true, 6, true, false)).toBe(true);
		});

		dt.html('basic');
		it('Full', function() {
			$('#example').dataTable({
				pagingType: 'full'
			});
			expect(checkPaging(4, 'full', 'paging_full', false, undefined, true, true)).toBe(true);
		});

		dt.html('basic');
		it('Full Numbers', function() {
			$('#example').dataTable({
				pagingType: 'full_numbers'
			});
			expect(checkPaging(10, 'full_numbers', 'paging_full_numbers', true, 6, true, true)).toBe(true);
		});

		dt.html('basic');
		it('First Last Numbers', function() {
			$('#example').dataTable({
				pagingType: 'first_last_numbers'
			});
			expect(checkPaging(8, 'first_last_numbers', 'paging_first_last_numbers', true, 6, false, true)).toBe(true);
		});
	});

	describe('Check the various paging types when long pageLength', function() {
		dt.html('basic');
		it('Default', function() {
			$('#example').dataTable({
				pageLength: 60
			});
			expect(checkPaging(5, '', 'dt-paging', true, 1, true, true)).toBe(true);
		});

		dt.html('basic');
		it('Numbers', function() {
			$('#example').dataTable({
				pagingType: 'numbers',
				pageLength: 60
			});
			expect(checkPaging(1, 'numbers', 'paging_numbers', true, 1, false, false)).toBe(true);
		});

		dt.html('basic');
		it('Simple', function() {
			$('#example').dataTable({
				pagingType: 'simple',
				pageLength: 60
			});
			expect(checkPaging(2, 'simple', 'paging_simple', false, undefined, true, false)).toBe(true);
		});

		dt.html('basic');
		it('Simple Numbers', function() {
			$('#example').dataTable({
				pagingType: 'simple_numbers',
				pageLength: 60
			});
			expect(checkPaging(3, 'simple_numbers', 'paging_simple_numbers', true, 1, true, false)).toBe(true);
		});

		dt.html('basic');
		it('Full', function() {
			$('#example').dataTable({
				pagingType: 'full',
				pageLength: 60
			});
			expect(checkPaging(4, 'full', 'paging_full', false, undefined, true, true)).toBe(true);
		});

		dt.html('basic');
		it('Full Numbers', function() {
			$('#example').dataTable({
				pagingType: 'full_numbers',
				pageLength: 60
			});
			expect(checkPaging(5, 'full_numbers', 'paging_full_numbers', true, 1, true, true)).toBe(true);
		});

		dt.html('basic');
		it('First Last Numbers', function() {
			$('#example').dataTable({
				pagingType: 'first_last_numbers',
				pageLength: 60
			});
			expect(checkPaging(3, 'first_last_numbers', 'paging_first_last_numbers', true, 1, false, true)).toBe(true);
		});
	});

	describe('Check the various paging types when short pageLength', function() {
		dt.html('basic');
		it('Default', function() {
			$('#example').dataTable({
				pageLength: 2
			});
			expect(checkPaging(10, '', 'dt-paging', true, 7, true, true)).toBe(true);
		});

		dt.html('basic');
		it('Numbers', function() {
			$('#example').dataTable({
				pagingType: 'numbers',
				pageLength: 2
			});
			expect(checkPaging(6, 'numbers', 'paging_numbers', true, 7, false, false)).toBe(true);
		});

		dt.html('basic');
		it('Simple', function() {
			$('#example').dataTable({
				pagingType: 'simple',
				pageLength: 2
			});
			expect(checkPaging(2, 'simple', 'paging_simple', false, undefined, true, false)).toBe(true);
		});

		dt.html('basic');
		it('Simple Numbers', function() {
			$('#example').dataTable({
				pagingType: 'simple_numbers',
				pageLength: 2
			});
			expect(checkPaging(8, 'simple_numbers', 'paging_simple_numbers', true, 7, true, false)).toBe(true);
		});

		dt.html('basic');
		it('Full', function() {
			$('#example').dataTable({
				pagingType: 'full',
				pageLength: 2
			});
			expect(checkPaging(4, 'full', 'paging_full', false, undefined, true, true)).toBe(true);
		});

		dt.html('basic');
		it('Full Numbers', function() {
			$('#example').dataTable({
				pagingType: 'full_numbers',
				pageLength: 2
			});
			expect(checkPaging(10, 'full_numbers', 'paging_full_numbers', true, 7, true, true)).toBe(true);
		});

		dt.html('basic');
		it('First Last Numbers', function() {
			$('#example').dataTable({
				pagingType: 'first_last_numbers',
				pageLength: 2
			});
			expect(checkPaging(8, 'first_last_numbers', 'paging_first_last_numbers', true, 7, false, true)).toBe(true);
		});
	});

	describe('Check the various paging types when empty table', function() {
		dt.html('empty');
		it('Default', function() {
			$('#example').dataTable();
			expect($('.dt-paging-button').length).toBe(4);
		});

		dt.html('empty');
		it('Numbers', function() {
			$('#example').dataTable({
				pagingType: 'numbers'
			});
			expect($('.dt-paging-button').length).toBe(0);
		});

		dt.html('empty');
		it('Simple', function() {
			$('#example').dataTable({
				pagingType: 'simple'
			});
			expect($('.dt-paging-button').length).toBe(2);
		});

		dt.html('empty');
		it('Simple Numbers', function() {
			$('#example').dataTable({
				pagingType: 'simple_numbers'
			});
			expect($('.dt-paging-button').length).toBe(2);
		});

		dt.html('empty');
		it('Full', function() {
			$('#example').dataTable({
				pagingType: 'full'
			});
			expect($('.dt-paging-button').length).toBe(4);
		});

		dt.html('empty');
		it('Full Numbers', function() {
			$('#example').dataTable({
				pagingType: 'full_numbers'
			});
			expect($('.dt-paging-button').length).toBe(4);
		});

		dt.html('empty');
		it('First Last Numbers', function() {
			$('#example').dataTable({
				pagingType: 'first_last_numbers'
			});
			expect($('.dt-paging-button').length).toBe(2);
		});
	});

	describe('General odds and ends', function() {
		dt.html('basic');
		it('Short page length when mid-table', function() {
			$('#example').dataTable({
				pageLength: 2,
				displayStart: 20
			});
			expect(checkPaging(9, '', 'dt-paging', true, 7, true, true)).toBe(true);
		});

		dt.html('basic');
		it('Paging disabled', function() {
			$('#example').dataTable({
				pageLength: 2,
				paging: false
			});
			expect($('.dt-paging').length).toBe(0);
		});
	});
});
