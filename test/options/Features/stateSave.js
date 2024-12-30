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
			$('div.dt-search input')
				.val(2012)
				.keyup();
			table.destroy();

			table = $('#example').DataTable({ stateSave: true });
			expect($('#example tbody td:eq(0)').text()).toBe('Bradley Greer');
			expect($('div.dt-info').text()).toBe('Showing 1 to 9 of 9 entries (filtered from 57 total entries)');
			expect($('div.dt-search input').val()).toBe('2012');
			table.state.clear();
		});

		dt.html('basic');
		it('Is filter state saved upon table refresh- API', function() {
			let table = $('#example').DataTable({ stateSave: true });
			table.search('2012').draw();
			table.destroy();

			$('#example').dataTable({ stateSave: true });
			expect($('#example tbody td:eq(0)').text()).toBe('Bradley Greer');
			expect($('div.dt-info').text()).toBe('Showing 1 to 9 of 9 entries (filtered from 57 total entries)');
			expect(table.search()).toBe('2012');
			table.state.clear();
		});
	});

	describe('Single column sorting', function() {
		dt.html('basic');
		it('Does sorting function by default', async function() {
			let table = $('#example').DataTable({ stateSave: true });
			table.search('2012').draw();
			table.destroy();

			table = $('#example').DataTable({ stateSave: true });
			table.search('').draw();
			await dt.clickHeader(2);
			expect($('#example tbody td:eq(0)').text()).toBe('Tiger Nixon');
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
		it('Does sorting function by default', async function() {
			let table = $('#example').DataTable({ stateSave: true });
			await dt.clickHeader(3);
			await dt.clickHeader(3);
			await dt.clickHeader(5, {shift: true});

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
			expect($('div.dt-info').text()).toBe('Showing 1 to 10 of 57 entries');
		});

		it('Paging - Second page', function() {
			$('.dt-paging-button.next').click();
			expect($('#example tbody td:eq(0)').text()).toBe('Charde Marshall');
			expect($('div.dt-info').text()).toBe('Showing 11 to 20 of 57 entries');
		});

		it('Paging - Second page - After refresh', function() {
			$('#example')
				.DataTable()
				.destroy();
			$('#example').dataTable({ stateSave: true });
			expect($('#example tbody td:eq(0)').text()).toBe('Charde Marshall');
			expect($('div.dt-info').text()).toBe('Showing 11 to 20 of 57 entries');
		});

		it('Paging - Third page', function() {
			$('.dt-paging-button.next').click();
			expect($('#example tbody td:eq(0)').text()).toBe('Gloria Little');
			expect($('div.dt-info').text()).toBe('Showing 21 to 30 of 57 entries');
		});

		it('Paging - Third page- After refresh', function() {
			$('#example')
				.DataTable()
				.destroy();
			$('#example').dataTable({ stateSave: true });
			expect($('#example tbody td:eq(0)').text()).toBe('Gloria Little');
			expect($('div.dt-info').text()).toBe('Showing 21 to 30 of 57 entries');
		});

		it('Paging back to second page and refreshing', function() {
			$('.dt-paging-button.previous').click();
			$('#example')
				.DataTable()
				.destroy();
			$('#example').dataTable({ stateSave: true });
			expect($('#example tbody td:eq(0)').text()).toBe('Charde Marshall');
			expect($('div.dt-info').text()).toBe('Showing 11 to 20 of 57 entries');
		});

		it('Paging back to first page and refreshing', function() {
			$('.dt-paging-button.previous').click();
			$('#example')
				.DataTable()
				.destroy();
			let table = $('#example').DataTable({ stateSave: true });
			expect($('#example tbody td:eq(0)').text()).toBe('Airi Satou');
			expect($('div.dt-info').text()).toBe('Showing 1 to 10 of 57 entries');
			table.state.clear();
		});
	});

	describe('saveState when changing page length', function() {
		dt.html('basic');
		it('Information with 25 records - state cleared', function() {
			let table = $('#example').DataTable({ stateSave: true });
			$('div.dt-length select')
				.val('25')
				.change();

			expect($('div.dt-info').text()).toBe('Showing 1 to 25 of 57 entries');
			table.state.clear();
			table.destroy();
			table = $('#example').DataTable({ stateSave: true });
			expect($('div.dt-info').text()).toBe('Showing 1 to 10 of 57 entries');
		});

		dt.html('basic');
		it('Information with 25 record - state not cleared', function() {
			let table = $('#example').DataTable({ stateSave: true });
			$('div.dt-length select')
				.val('25')
				.change();
			table.destroy();
			table = $('#example').DataTable({ stateSave: true });
			expect($('div.dt-info').text()).toBe('Showing 1 to 25 of 57 entries');

			// Nuke old states
			localStorage.clear();
		});
	});

	describe('Check state restore on table structure change', function() {
		let table;

		dt.html('basic');

		it('Create the initial table with sorting, paging and column search', async function() {
			table = $('#example').DataTable({ stateSave: true });
			
			await dt.clickHeader(0);
			table.page(1);
			table.column(4).search('20').draw(false);

			expect(table.settings()[0].aoColumns.length).toBe(6);
			expect($('#example tbody td:eq(0)').text()).toBe('Sonya Frost');
			expect($('#example tbody td:eq(3)').text()).toBe('23');
			table.destroy();
		});

		it('Remove column and reinitialise datatable - check paging was restored', function() {
			$('#example thead th:eq(3)').remove();
			$('#example tfoot th:eq(3)').remove();
			$('#example tbody tr').each(function() {
				$(this)
					.find('td:eq(3)')
					.remove();
			});

			table = $('#example').DataTable({ stateSave: true });

			expect(table.settings()[0].aoColumns.length).toBe(5);
			expect(table.page()).toBe(1);
		});

		it('Check sorting was restored', function() {
			expect($('#example tbody td:eq(0)').text()).toBe('Sonya Frost');
			expect($('#example tbody td:eq(3)').text()).toBe('2008/12/13');
		});

		it('Column information however was not restored', function() {
			expect(table.column(4).search()).toBe('');

			// Nuke old states
			localStorage.clear();
		});
	});

	describe('Column order change when using names', function() {
		let table;

		dt.html('empty');

		it('Load with names', function(done) {
			table = $('#example').DataTable({
				stateSave: true,
				ajax: '/base/test/data/data.txt',
				columns: [
					{ data: 'name', name: 'name' },
					{ data: 'position', name: 'position' },
					{ data: 'office', name: 'office' },
					{ data: 'age', name: 'age' },
					{ data: 'start_date', name: 'start_date' },
					{ data: 'salary', name: 'salary' }
				],
				initComplete: function() {
					expect($('tbody tr:eq(2) td:eq(0)').text()).toBe('Ashton Cox');
					done();
				}
			});
		});

		it('Save state', function() {
			table.column(4).search('2011').draw();

			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Brenden Wagner');
		});

		it('Destroy and reinit in different column order', function(done) {
			table.destroy();

			table = $('#example').DataTable({
				stateSave: true,
				ajax: '/base/test/data/data.txt',
				columns: [
					{ data: 'start_date', name: 'start_date' },
					{ data: 'name', name: 'name' },
					{ data: 'position', name: 'position' },
					{ data: 'office', name: 'office' },
					{ data: 'age', name: 'age' },
					{ data: 'salary', name: 'salary' }
				],
				initComplete: function() {
					expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('2011/06/07');
					expect($('tbody tr:eq(0) td:eq(1)').text()).toBe('Brenden Wagner');
					done();
				}
			});
		});

		it('Filter is applied to what is now the first column', function() {
			expect(table.column(0).search()).toBe('2011');
		});

		it('Sorting is now the second column', function() {
			// Originally it was column index 0, which is now 1 due to the moved columns
			expect(table.order()[0][0]).toBe(1);

			// Nuke old states
			localStorage.clear();
		});
	});

	describe('Column visibility', function() {
		dt.html('basic');

		it('Create a table and hide a column', function () {
			let table = $('#example').DataTable({
				stateSave: true
			});

			table.columns(1).visible(false);

			expect($('thead tr:eq(0)').children().length).toBe(5);
			expect($('tbody tr:eq(0)').children().length).toBe(5);

			expect($('thead tr:eq(0)').text()).toBe('NameOfficeAgeStart dateSalary');
		});

		it('Is still hidden after a reload', function () {
			$('#example').DataTable().destroy();
			
			let table = $('#example').DataTable({
				stateSave: true
			});

			expect($('thead tr:eq(0)').children().length).toBe(5);
			expect($('tbody tr:eq(0)').children().length).toBe(5);

			expect($('thead tr:eq(0)').text()).toBe('NameOfficeAgeStart dateSalary');

			table.state.clear();
		});
	});

	describe('With Ajax', function() {
		let table;

		dt.html('empty');

		it('Loads first page', function(done) {
			table = $('#example').DataTable({
				ajax: '/base/test/data/data.txt',
				columns: [
					{ data: 'name' },
					{ data: 'position' },
					{ data: 'office' },
					{ data: 'age' },
					{ data: 'start_date' },
					{ data: 'salary' }
				],
				initComplete: function() {
					expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
					done();
				},
				stateSave: true
			});
		});

		it('Move to second page', function() {
			table.page('next').draw(false);

			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Charde Marshall');
		});

		dt.html('empty');

		it('Reinit - still on second page', function(done) {
			table = $('#example').DataTable({
				ajax: '/base/test/data/data.txt',
				columns: [
					{ data: 'name' },
					{ data: 'position' },
					{ data: 'office' },
					{ data: 'age' },
					{ data: 'start_date' },
					{ data: 'salary' }
				],
				initComplete: function() {
					expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Charde Marshall');
					done();
				},
				stateSave: true
			});
		});

		it('Clear state', function() {
			table.state.clear();
			expect(1).toBe(1);
		});
	});
});
