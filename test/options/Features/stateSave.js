// TK COLIN add some tests for multiple tables
describe('stateSave option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check Default', function() {
		dt.html('basic');
		it('stateSave disabled by default', function() {
			let table = $('#example').DataTable();
			expect($.fn.dataTable.defaults.bStateSave).toBe(false);
			expect(table.state.loaded()).toBeNull();
		});

		dt.html('basic');
		it('stateSave can be enabled', function() {
			let table = $('#example').DataTable({ stateSave: true });
			table.destroy();
			table = $('#example').DataTable({ stateSave: true });
			expect(table.state.loaded()).toBeTruthy();
		});
	});

	describe('Check when enabled', function() {
		dt.html('basic');
		it('Is filter state saved upon table refresh- DOM', function() {
			let table = $('#example').DataTable({ stateSave: true });
			$('div.dataTables_filter input')
				.val(2012)
				.keyup();
			table.destroy();

			table = $('#example').DataTable({ stateSave: true });
			expect($('#example tbody td:eq(0)').text()).toBe('Bradley Greer');
			expect($('div.dataTables_info').text()).toBe('Showing 1 to 9 of 9 entries (filtered from 57 total entries)');
			expect($('div.dataTables_filter input').val()).toBe('2012');
			table.state.clear();
		});

		dt.html('basic');
		it('Is filter state saved upon table refresh- API', function() {
			let table = $('#example').DataTable({ stateSave: true });
			table.search('2012').draw();
			table.destroy();

			$('#example').dataTable({ stateSave: true });
			expect($('#example tbody td:eq(0)').text()).toBe('Bradley Greer');
			expect($('div.dataTables_info').text()).toBe('Showing 1 to 9 of 9 entries (filtered from 57 total entries)');
			expect(table.search()).toBe('2012');
			table.state.clear();
		});
	});

	describe('Single column sorting', function() {
		dt.html('basic');
		it('Does sorting function by default', function() {
			let table = $('#example').DataTable({ stateSave: true });
			table.search('2012').draw();
			table.destroy();

			table = $('#example').DataTable({ stateSave: true });
			table.search('').draw();
			$('#example thead th:eq(2)').click();
			expect($('#example tbody td:eq(0)').text()).toBe('Cedric Kelly');
			table.destroy();
		});

		it('Does sorting remain applied after page refresh', function() {
			/*
			 * Note the following behaviour is unintuitive. It's different to the search results before the refresh
			 * because the first search is a stable search - it uses the first column as a secondary ordering.
			 * The second search doesn't do this, so the secondary ordering is purely the load order. A bug-ette
			 * in the reload, but very minor, and unlikely to ever be resolved.
			 */
			let table = $('#example').DataTable({ stateSave: true });
			expect($('#example tbody td:eq(0)').text()).toBe('Tiger Nixon');
			table.state.clear();
			table.destroy();
		});

		it('State reset after a clear', function() {
			let table = $('#example').DataTable({ stateSave: true });
			expect($('#example tbody td:eq(0)').text()).toBe('Airi Satou');
			table.state.clear();
		});
	});

	describe('Multi-Column Sorting', function() {
		dt.html('basic');
		it('Does sorting function by default', function() {
			let table = $('#example').DataTable({ stateSave: true });
			$('#example thead th:eq(3)').click();
			$('#example thead th:eq(3)').click();
			var clickEvent = $.Event('click');
			clickEvent.shiftKey = true;
			$('#example thead th:eq(5)').trigger(clickEvent);

			expect($('#example tbody td:eq(5)').text()).toBe('$86,000');
			expect($('#example tbody td:eq(3)').text()).toBe('66');

			table.destroy();
		});

		it('Does sorting remain after refresh', function() {
			let table = $('#example').dataTable({ stateSave: true });

			expect($('#example tbody td:eq(5)').text()).toBe('$86,000');
			expect($('#example tbody td:eq(3)').text()).toBe('66');
		});

		it('Can we destroy the session', function() {
			let table = $('#example').DataTable();
			table.state.clear();
			table.destroy();
			table = $('#example').dataTable({ stateSave: true });

			expect($('#example tbody td:eq(5)').text()).toBe('$162,700');
		});
	});

	describe('saveState when paging', function() {
		dt.html('basic');
		it('Check table is back to default state', function() {
			$('#example').dataTable({ stateSave: true });
			expect($('#example tbody td:eq(0)').text()).toBe('Airi Satou');
			expect($('div.dataTables_info').text()).toBe('Showing 1 to 10 of 57 entries');
		});

		it('Paging - Second page', function() {
			$('.paginate_button.next').click();
			expect($('#example tbody td:eq(0)').text()).toBe('Charde Marshall');
			expect($('div.dataTables_info').text()).toBe('Showing 11 to 20 of 57 entries');
		});

		it('Paging - Second page - After refresh', function() {
			$('#example')
				.DataTable()
				.destroy();
			$('#example').dataTable({ stateSave: true });
			expect($('#example tbody td:eq(0)').text()).toBe('Charde Marshall');
			expect($('div.dataTables_info').text()).toBe('Showing 11 to 20 of 57 entries');
		});

		it('Paging - Third page', function() {
			$('.paginate_button.next').click();
			expect($('#example tbody td:eq(0)').text()).toBe('Gloria Little');
			expect($('div.dataTables_info').text()).toBe('Showing 21 to 30 of 57 entries');
		});

		it('Paging - Third page- After refresh', function() {
			$('#example')
				.DataTable()
				.destroy();
			$('#example').dataTable({ stateSave: true });
			expect($('#example tbody td:eq(0)').text()).toBe('Gloria Little');
			expect($('div.dataTables_info').text()).toBe('Showing 21 to 30 of 57 entries');
		});

		it('Paging back to second page and refreshing', function() {
			$('.paginate_button.previous').click();
			$('#example')
				.DataTable()
				.destroy();
			$('#example').dataTable({ stateSave: true });
			expect($('#example tbody td:eq(0)').text()).toBe('Charde Marshall');
			expect($('div.dataTables_info').text()).toBe('Showing 11 to 20 of 57 entries');
		});

		it('Paging back to first page and refreshing', function() {
			$('.paginate_button.previous').click();
			$('#example')
				.DataTable()
				.destroy();
			let table = $('#example').DataTable({ stateSave: true });
			expect($('#example tbody td:eq(0)').text()).toBe('Airi Satou');
			expect($('div.dataTables_info').text()).toBe('Showing 1 to 10 of 57 entries');
			table.state.clear();
		});
	});

	describe('saveState when changing page length', function() {
		dt.html('basic');
		it('Information with 25 records - state cleared', function() {
			let table = $('#example').DataTable({ stateSave: true });
			$('select[name=example_length]')
				.val('25')
				.change();

			expect($('div.dataTables_info').text()).toBe('Showing 1 to 25 of 57 entries');
			table.state.clear();
			table.destroy();
			table = $('#example').DataTable({ stateSave: true });
			expect($('div.dataTables_info').text()).toBe('Showing 1 to 10 of 57 entries');
		});

		dt.html('basic');
		it('Information with 25 record - state not cleared', function() {
			let table = $('#example').DataTable({ stateSave: true });
			$('select[name=example_length]')
				.val('25')
				.change();
			table.destroy();
			table = $('#example').DataTable({ stateSave: true });
			expect($('div.dataTables_info').text()).toBe('Showing 1 to 25 of 57 entries');
		});
	});

	describe('Check state is ignored if table shape changes', function() {
		dt.html('basic');

		it('Create the initial table, confirm then destroy', function() {
			let table = $('#example').DataTable({ stateSave: true });
			$('#example thead th:eq(0)').click();

			expect(table.settings()[0].aoColumns.length).toBe(6);
			expect($('#example tbody td:eq(0)').text()).toBe('Zorita Serrano');
			expect($('#example tbody td:eq(3)').text()).toBe('56');
			table.destroy();
		});

		it('Remove column and reinitialise datatable', function() {
			$('#example thead th:eq(3)').remove();
			$('#example tfoot th:eq(3)').remove();
			$('#example tbody tr').each(function() {
				$(this)
					.find('td:eq(3)')
					.remove();
			});

			let table = $('#example').DataTable({ stateSave: true });
			expect(table.settings()[0].aoColumns.length).toBe(5);
			expect($('#example tbody td:eq(0)').text()).toBe('Airi Satou');
			expect($('#example tbody td:eq(3)').text()).toBe('2008/11/28');
		});
	});
});
