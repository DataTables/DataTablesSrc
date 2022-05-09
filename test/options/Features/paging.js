describe('Paging option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	function checkDisabled(previous, next) {
		expect($('.paginate_button.previous').attr('tabindex')).toBe(previous ? '-1' : '0');
		expect($('.paginate_button.previous').hasClass('disabled')).toBe(previous);

		expect($('.paginate_button.next').attr('tabindex')).toBe(next ? '-1' : '0');
		expect($('.paginate_button.next').hasClass('disabled')).toBe(next);
	}

	describe('Check Default', function() {
		dt.html('basic');
		it('Enabled by default', function() {
			expect($.fn.dataTable.defaults.bPaginate).toBe(true);
		});
		it('Check table is paged', function() {
			table = $('#example').DataTable();
			expect($('#example tbody tr').length).toBe(10);
			expect(table.page.info().pages).toBe(6);
		});
		it('Paging control is in the DOM', function() {
			table = $('#example').DataTable();
			expect($('div.dataTables_paginate')[0]).toBeInDOM();
		});
		it('Length control is in the DOM', function() {
			expect($('div.dataTables_length')[0]).toBeInDOM();
		});
		it('Correct place in DOM', function() {
			expect(
				$('div.dataTables_paginate')
					.prev()
					.attr('class')
			).toBe('dataTables_info');
		});
		it('Disabled previous on first page', function() {
			checkDisabled(true, false);
		});
		it('Both buttons active in middle of the table', function() {
			table.page(3).draw(false);
			checkDisabled(false, false);
		});
		it('Disabled next element on final page', function() {
			table.page(5).draw(false);
			checkDisabled(false, true);
		});
		it('Both disabled after a search', function() {
			table.search('Ashton Cox').draw();
			checkDisabled(true, true);
		});
		it('Both disabled when table empty', function() {
			table
				.rows()
				.remove()
				.draw();
			checkDisabled(true, true);
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Can disable paging using option', function() {
			$('#example').DataTable({
				paging: false
			});
			expect($('#example tbody tr').length).toBe(57);
		});

		it('Paging control is not in the DOM', function() {
			expect($('div.dataTables_paginate')[0]).not.toBeInDOM();
		});

		it('Length control has been removed', function() {
			expect($('div.dataTables_length')[0]).not.toBeInDOM();
		});

		dt.html('basic');
		it('When manually enabled it is indeed enabled', function() {
			$('#example').DataTable({
				paging: true
			});
			expect($('#example tbody tr').length).toBe(10);
		});

		it('Length control has been removed', function() {
			expect($('div.dataTables_length')[0]).toBeInDOM();
		});

		dt.html('basic');
		it('Default can be set to disabled', function() {
			$.fn.dataTable.defaults.paging = false;
			$('#example').DataTable();
			expect($('#example tbody tr').length).toBe(57);
		});

		dt.html('basic');
		it('And enabled from the options', function() {
			$.fn.dataTable.defaults.paging = true;
			$('#example').DataTable({
				paging: true
			});
			expect($('#example tbody tr').length).toBe(10);
		});
	});
});
