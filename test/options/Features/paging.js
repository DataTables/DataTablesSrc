describe('Paging option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

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
		it('Disabled previous element has a tab index of -1', function() {
			expect($('.paginate_button.previous').attr('tabindex')).toBe('-1');
			expect($('.paginate_button.previous').hasClass('disabled')).toBe(true);

			// DD-1098/DD-1099
			// expect($('.paginate_button.next').attr('tabindex')).toBe('0');
			// expect($('.paginate_button.next').hasClass('disabled')).toBe(false);
		});
		it('Both buttons active in middle of the table', function() {
			table.page(3).draw(false);

			expect($('.paginate_button.previous').attr('tabindex')).toBe('0');
			expect($('.paginate_button.previous').hasClass('disabled')).toBe(false);

			// DD-1098/DD-1099
			// expect($('.paginate_button.next').attr('tabindex')).toBe('0');
			// expect($('.paginate_button.next').hasClass('disabled')).toBe(false);
		});
		it('Disabled next element has a tab index of -1', function() {
			table.page(5).draw(false);

			expect($('.paginate_button.previous').attr('tabindex')).toBe('0');
			expect($('.paginate_button.previous').hasClass('disabled')).toBe(false);

			// DD-1098/DD-1099// expect($('.paginate_button.next').attr('tabindex')).toBe('-1');
			// expect($('.paginate_button.next').hasClass('disabled')).toBe(true);
		});
		it('Both disabled after a search', function() {
			table.search('Ashton Cox').draw();

			expect($('.paginate_button.previous').attr('tabindex')).toBe('-1');
			expect($('.paginate_button.previous').hasClass('disabled')).toBe(true);

			// DD-1098/DD-1099
			// expect($('.paginate_button.next').attr('tabindex')).toBe('-1');
			// expect($('.paginate_button.next').hasClass('disabled')).toBe(true);
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
