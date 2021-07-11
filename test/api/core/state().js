// TK COLIN : heavily based on stateSaveCallback - could do with some sharing at some point
describe('core- state()', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function () {
		dt.html('basic');
		it('Exists and is a function', function () {
			expect(typeof $('#example').DataTable().state).toBe('function');
		});

		dt.html('basic');
		it('Does not return null if stateSave disabled', function () {
			let table = $('#example').DataTable({
				stateSave: false
			});
			expect(table.state()).not.toBe(null);
			expect($.isPlainObject(table.state())).toBe(true);
		});

		dt.html('basic');
		it('Returns a plain object is stateSave enabled', function () {
			let table = $('#example').DataTable({
				stateSave: true
			});
			expect($.isPlainObject(table.state())).toBe(true);
		});
	});

	describe('Functional tests', function () {
		// Clear down save state before proceeding (otherwise old stuff may be lurking that will affect us)
		dt.html('basic');
		it('Clear state save', function () {
			let table = $('#example').DataTable();
			table.state.clear();
		});

		dt.html('basic');
		it('Saved time is sensible', function () {
			let savedState1;
			let savedState2;
			let table = $('#example').DataTable({
				stateSave: true
			});
			table.page(1).draw();
			savedState1 = table.state();

			table.page(2).draw();
			savedState2 = table.state();

			expect(savedState1.time < savedState2.time).toBe(true);
		});

		dt.html('basic');
		it('Start position is sensible', function () {
			let savedState;
			let table = $('#example').DataTable({
				stateSave: true
			});
			table.page(2).draw(false);
			savedState = table.state();
			table.page(1).draw(true);

			expect(savedState.start).toBe(20);
		});

		dt.html('basic');
		it('Page length is sensible', function () {
			let savedState;
			let table = $('#example').DataTable({
				stateSave: true
			});
			table.page.len(15).draw();
			savedState = table.state();
			table.page.len(20).draw();

			expect(savedState.length).toBe(15);
		});

		dt.html('basic');
		it('Order is sensible', function () {
			let savedState;
			let table = $('#example').DataTable({
				stateSave: true
			});
			table.columns([1, 2]).order('desc').draw();
			savedState = table.state();
			table.column(3).order('desc').draw();

			expect(savedState.order.length).toBe(2);
			expect(savedState.order[0][0]).toBe(1);
			expect(savedState.order[0][1]).toBe('desc');
			expect(savedState.order[1][0]).toBe(2);
			expect(savedState.order[1][1]).toBe('desc');
		});

		dt.html('basic');
		it('Search is sensible', function () {
			let savedState;
			let table = $('#example').DataTable({
				stateSave: true
			});
			table.search('Cox', true, false, true).draw();
			savedState = table.state();
			table.search('').draw();

			expect(savedState.search.search).toBe('Cox');
			expect(savedState.search.smart).toBe(false);
			expect(savedState.search.regex).toBe(true);
			expect(savedState.search.caseInsensitive).toBe(true);
		});

		function checkColumn(data, visible, search, smart, regex, caseInsensitive) {
			if (
				data.visible == visible &&
				data.search.search == search &&
				data.search.smart == smart &&
				data.search.regex == regex &&
				data.search.caseInsensitive == caseInsensitive
			) {
				return true;
			}

			return false;
		}

		dt.html('basic');
		it('Columns are sensible', function () {
			let savedState;
			let table = $('#example').DataTable({
				stateSave: true
			});
			table.columns([3, 5]).visible(false);
			table.columns([1, 4]).search('Cox', true, false, true).draw();
			savedState = table.state();
			table.columns([3, 5]).visible(true);
			table.columns([1, 4]).search('', true, false, true).draw();
			expect(checkColumn(savedState.columns[0], true, '', true, false, true)).toBe(true);
			expect(checkColumn(savedState.columns[1], true, 'Cox', false, true, true)).toBe(true);
			expect(checkColumn(savedState.columns[2], true, '', true, false, true)).toBe(true);
			expect(checkColumn(savedState.columns[3], false, '', true, false, true)).toBe(true);
			expect(checkColumn(savedState.columns[4], true, 'Cox', false, true, true)).toBe(true);
			expect(checkColumn(savedState.columns[5], false, '', true, false, true)).toBe(true);
		});
	});

	describe('Setter', function() {
		let table;
		let state;
		dt.html('basic');

		it('A redraw is required', function() {
			table = $('#example').DataTable();
			state = table.state();

			state.start = 10;
			table.state( state );

			expect( $('#example tbody td').eq(0).text() ).toBe('Airi Satou');
		});

		it('Page start - set as a whole', function() {
			table.draw( false );
			expect( $('#example tbody td').eq(0).text() ).toBe('Charde Marshall');
		});

		it('Page start - set directly', function() {
			table
				.state( {
					start: 20
				})
				.draw( false );

				expect( $('#example tbody td').eq(0).text() ).toBe('Gloria Little');
		});

		it('Page length', function() {
			table
				.state( {
					start: 0,
					length: 25
				})
				.draw( false );

			expect( $('#example tbody td').eq(0).text() ).toBe('Airi Satou');
			expect( $('#example tbody tr').length ).toBe(25);
		});

		it('Order', function() {
			table
				.state( {
					order: [[3, 'asc']]
				})
				.draw();

			expect( $('#example tbody td').eq(0).text() ).toBe('Tatyana Fitzpatrick');
		});

		it('Search', function() {
			table
				.state( {
					search: {
						search: 'Gavin'
					}
				})
				.draw();

			expect( $('#example tbody td').eq(0).text() ).toBe('Gavin Cortez');
			expect( $('input', table.table().container()).val() ).toBe('Gavin');
		});

		it('Column visibility', function() {
			table
				.state( {
					columns: [
						{ visible: false },
						{ visible: true },
						{ visible: false },
						{ visible: true },
						{ visible: false },
						{ visible: false }
					]
				})
				.draw();

			expect( $('#example tbody tr').eq(0).children('td').length ).toBe(2);
			expect( $('#example tbody td').eq(0).text() ).toBe('Team Leader');
			expect( $('#example tbody td').eq(1).text() ).toBe('22');
		});
	});
});
