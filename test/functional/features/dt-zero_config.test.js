// TK COLIN not convinced by the usefulness of these tests...
describe('Basic DataTables Test', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	doc = window.document;

	describe('Sanity Checks for DataTables with DOM data', function() {
		dt.html('basic');

		it('jQuery.dataTable function', function() {
			expect(jQuery().dataTable).toEqual(jasmine.any(Function));
		});

		it('jQuery.dataTableSettings storage array', function() {
			expect(jQuery().dataTableSettings).toEqual(jasmine.any(Object));
		});

		it('jQuery.dataTableExt Plugin Object', function() {
			expect(jQuery().dataTableExt).toEqual(jasmine.any(Object));
		});
	});

	describe('Basic checks', function() {
		dt.html('basic');

		it('Length changing div exists', function() {
			$('#example').DataTable();
			expect(doc.getElementsByClassName('dt-length')[0]).not.toBeUndefined();
		});

		it('Filtering div exists', function() {
			expect(doc.getElementsByClassName('dt-search')[0]).not.toBeUndefined();
		});

		it('Information div exists', function() {
			expect(doc.getElementsByClassName('dt-info')[0]).not.toBeUndefined();
		});

		it('Pagination div exists', function() {
			expect(doc.getElementsByClassName('dt-paging')[0]).not.toBeUndefined();
		});

		it('Processing div exists', function() {
			expect(doc.getElementsByClassName('dt-processing')[0]).toBeUndefined();
		});

		it('10 rows shown on the first page', function() {
			expect($('#example tbody tr').length).toBe(10);
		});

		it('Initial sort occurred //todo make sure this is correct', function() {
			expect($('#example tbody td:eq(0)').html()).toBe('Airi Satou');
			expect($('#example thead th span:last-child').eq(1).attr('aria-label')).toBe('Position: Activate to sort');
			expect($('#example thead th').eq(1).attr('aria-sort')).toBe(undefined);
		});

		it('Sorting (first click) on second column', async function() {
			await dt.clickHeader(1);
			expect($('#example tbody td:eq(1)').html()).toBe('Accountant');
			expect($('#example thead th span:last-child').eq(1).attr('aria-label')).toBe('Position: Activate to invert sorting');
			expect($('#example thead th').eq(1).attr('aria-sort')).toBe('ascending');
		});

		it('Sorting (second click) on second column', async function() {
			await dt.clickHeader(1);
			expect($('#example tbody td:eq(1)').html()).toBe('Technical Author');
			expect($('#example thead th span:last-child').eq(1).attr('aria-label')).toBe('Position: Activate to remove sorting');
			expect($('#example thead th').eq(1).attr('aria-sort')).toBe('descending');
		});

		it('Sorting (third click) on second column results in original data order', async function() {
			await dt.clickHeader(1);
			expect($('#example tbody td:eq(1)').html()).toBe('System Architect');
			expect($('#example thead th span:last-child').eq(1).attr('aria-label')).toBe('Position: Activate to sort');
			expect($('#example thead th').eq(1).attr('aria-sort')).toBe(undefined);
		});

		it('Sorting (fourth click) on second column results in sorting asc again', async function() {
			await dt.clickHeader(1);
			expect($('#example tbody td:eq(1)').html()).toBe('Accountant');
			expect($('#example thead th span:last-child').eq(1).attr('aria-label')).toBe('Position: Activate to invert sorting');
			expect($('#example thead th').eq(1).attr('aria-sort')).toBe('ascending');
		});

		it('Sorting (first click) on numeric column', async function() {
			await dt.clickHeader(3);
			expect($('#example tbody td:eq(3)').html()).toBe('19');
		});

		it('Sorting (second click) on numeric column', async function() {
			await dt.clickHeader(3);
			expect($('#example tbody td:eq(3)').html()).toBe('66');
		});

		it('Sorting (third click) on numeric column results in original data order', async function() {
			await dt.clickHeader(3);
			expect($('#example tbody td:eq(3)').html()).toBe('61');
		});

		it('Sorting multi-column (first click)', async function() {
			$('#example').DataTable();

			await dt.clickHeader(3);
			await dt.clickHeader(3);
			await dt.clickHeader(5, {shift: true});

			expect($('#example tbody td:eq(5)').html()).toBe('$86,000');
			expect($('#example tbody td:eq(3)').html()).toBe('66');
		});

		it('Sorting multi-column (second click)', async function() {
			$('#example').DataTable();

			await dt.clickHeader(3); // neutral sort state
			await dt.clickHeader(3);
			await dt.clickHeader(3);
			await dt.clickHeader(5, {shift: true});
			await dt.clickHeader(5, {shift: true});

			expect($('#example tbody td:eq(3)').html()).toBe('66');
			expect($('#example tbody td:eq(5)').html()).toBe('$198,500');
		});
	});

	describe('Changing Length', function() {
		dt.html('basic');

		it('Changing table length to 25 records', function() {
			$('#example').DataTable();
			$('div.dt-length select')
				.val('25')
				.change();
			expect($('#example tbody tr').length).toBe(25);
		});

		it('Changing table length to 50 records', function() {
			$('div.dt-length select')
				.val('50')
				.change();
			expect($('#example tbody tr').length).toBe(50);
		});

		it('Changing table length to 100 records', function() {
			$('div.dt-length select')
				.val('100')
				.change();
			expect($('#example tbody tr').length).toBe(57);
		});

		it('Changing table length to 10 records', function() {
			$('div.dt-length select')
				.val('10')
				.change();
			expect($('#example tbody tr').length).toBe(10);
		});
	});

	describe('Information element', function() {
		dt.html('basic');

		it('Information on zero config', function() {
			$('#example').DataTable();
			expect(doc.getElementsByClassName('dt-info')[0].innerHTML).toBe('Showing 1 to 10 of 57 entries');
		});

		it('Information on second page', function() {
			$('div button.next').click();
			expect(doc.getElementsByClassName('dt-info')[0].innerHTML).toBe('Showing 11 to 20 of 57 entries');
		});

		it('Information on third page', function() {
			$('div button.next').click();
			expect(doc.getElementsByClassName('dt-info')[0].innerHTML).toBe('Showing 21 to 30 of 57 entries');
		});

		it('Information on last page', function() {
			$('div button.next').click();
			$('div button.next').click();
			$('div button.next').click();
			expect(doc.getElementsByClassName('dt-info')[0].innerHTML).toBe('Showing 51 to 57 of 57 entries');
		});

		it('Information back on first page', function() {
			$('div button.previous').click();
			$('div button.previous').click();
			$('div button.previous').click();
			$('div button.previous').click();
			$('div button.previous').click();
			expect(doc.getElementsByClassName('dt-info')[0].innerHTML).toBe('Showing 1 to 10 of 57 entries');
		});

		it('Information with 25 records', function() {
			$('div.dt-length select')
				.val('25')
				.change();
			expect(doc.getElementsByClassName('dt-info')[0].innerHTML).toBe('Showing 1 to 25 of 57 entries');
		});

		it('Information with 25 records- second page', function() {
			$('div button.next').click();
			expect(doc.getElementsByClassName('dt-info')[0].innerHTML).toBe('Showing 26 to 50 of 57 entries');
		});

		it('Information with 100 records', function() {
			$('div.dt-length select')
				.val('100')
				.change();
			expect(doc.getElementsByClassName('dt-info')[0].innerHTML).toBe('Showing 1 to 57 of 57 entries');
		});

		it('Information back to 10 records', function() {
			$('div.dt-length select')
				.val('10')
				.change();
			$('div button.previous').click();
			expect(doc.getElementsByClassName('dt-info')[0].innerHTML).toBe('Showing 1 to 10 of 57 entries');
		});

		it("Information with filter 'London'", function() {
			$('div.dt-search input')
				.val('London')
				.keyup();
			expect(doc.getElementsByClassName('dt-info')[0].innerHTML).toBe(
				'Showing 1 to 10 of 12 entries (filtered from 57 total entries)'
			);
		});

		it("Information with filter 'London'- second page", function() {
			$('div button.next').click();
			expect(doc.getElementsByClassName('dt-info')[0].innerHTML).toBe(
				'Showing 11 to 12 of 12 entries (filtered from 57 total entries)'
			);
		});

		it("Information with filter 'London' back to first page", function() {
			$('div button.previous').click();
			expect(doc.getElementsByClassName('dt-info')[0].innerHTML).toBe(
				'Showing 1 to 10 of 12 entries (filtered from 57 total entries)'
			);
		});

		it("Information with filter 'London'- second page- second time", function() {
			$('div button.next').click();
			expect(doc.getElementsByClassName('dt-info')[0].innerHTML).toBe(
				'Showing 11 to 12 of 12 entries (filtered from 57 total entries)'
			);
		});

		it("Information with filter increased to 'London 66'", function() {
			$('div.dt-search input')
				.val('London 66')
				.keyup();
			expect(doc.getElementsByClassName('dt-info')[0].innerHTML).toBe(
				'Showing 1 to 1 of 1 entry (filtered from 57 total entries)'
			);
		});

		it("Information with filter decreased to 'London'", function() {
			$('div.dt-search input')
				.val('London')
				.keyup();
			expect(doc.getElementsByClassName('dt-info')[0].innerHTML).toBe(
				'Showing 1 to 10 of 12 entries (filtered from 57 total entries)'
			);
		});

		it("Information with filter 'London'- second page- third time", function() {
			$('div button.next').click();
			expect(doc.getElementsByClassName('dt-info')[0].innerHTML).toBe(
				'Showing 11 to 12 of 12 entries (filtered from 57 total entries)'
			);
		});

		it('Information with filter removed', function() {
			$('div.dt-search input')
				.val('')
				.keyup();
			expect(doc.getElementsByClassName('dt-info')[0].innerHTML).toBe('Showing 1 to 10 of 57 entries');
		});
	});

	describe('Filtering', function() {
		dt.html('basic');

		it("Filter 'W'- rows", function() {
			$('#example').dataTable();
			$('div.dt-search input')
				.val('W')
				.keyup();
			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Bradley Greer');
		});

		it("Filter 'W'- info", function() {
			expect(doc.getElementsByClassName('dt-info')[0].innerHTML).toBe(
				'Showing 1 to 10 of 20 entries (filtered from 57 total entries)'
			);
		});

		it("Filter 'Lon'", function() {
			$('div.dt-search input')
				.val('Lon')
				.keyup();
			expect(doc.getElementsByClassName('dt-info')[0].innerHTML).toBe(
				'Showing 1 to 10 of 12 entries (filtered from 57 total entries)'
			);
		});

		it("Filter 'Lon'- sorting column 1", async function() {
			await dt.clickHeader(1);
			expect($('#example tbody tr:eq(0) td:eq(1)').html()).toBe('Chief Executive Officer (CEO)');
		});

		it("Filter 'Lon'- sorting column 1 reverse", async function() {
			await dt.clickHeader(1);
			expect($('#example tbody tr:eq(0) td:eq(1)').html()).toBe('Technical Author');
		});

		it("Filter 'London'- sorting column 1 reverse", function() {
			$('div.dt-search input')
				.val('London')
				.keyup();
			expect($('#example tbody tr:eq(0) td:eq(1)').html()).toBe('Technical Author');
		});

		it("Filter 'London'- sorting column 3", async function() {
			await dt.clickHeader(3);
			expect($('#example tbody tr:eq(0) td:eq(3)').html()).toBe('19');
		});

		it("Filter 'London'- sorting column 3", async function() {
			await dt.clickHeader(3);
			expect($('#example tbody tr:eq(0) td:eq(3)').html()).toBe('66');
		});

		it("Filter 'London'- sorting col 3- reversed info", function() {
			$('div.dt-search input')
				.val('Lon')
				.keyup();
			expect(doc.getElementsByClassName('dt-info')[0].innerHTML).toBe(
				'Showing 1 to 10 of 12 entries (filtered from 57 total entries)'
			);
		});

		it("Filter 'nothingishere'", function() {
			$('div.dt-search input')
				.val('nothingishere')
				.keyup();
			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('No matching records found');
		});

		it("Filter 'nothingishere' info", function() {
			expect(doc.getElementsByClassName('dt-info')[0].innerHTML).toBe(
				'Showing 0 to 0 of 0 entries (filtered from 57 total entries)'
			);
		});

		it('Filter back to blank and 1st column sorting', async function() {
			$('div.dt-search input')
				.val('')
				.keyup();

			await dt.clickHeader(0);
			expect(doc.getElementsByClassName('dt-info')[0].innerHTML).toBe('Showing 1 to 10 of 57 entries');
		});

		it('Prefixing a filter entry', function() {
			$('div.dt-search input')
				.val('Author')
				.keyup();
			$('div.dt-search input')
				.val('TechnicalAuthor')
				.keyup();
			expect(doc.getElementsByClassName('dt-info')[0].innerHTML).toBe(
				'Showing 0 to 0 of 0 entries (filtered from 57 total entries)'
			);
		});

		it('Prefixing a filter entry with space', function() {
			$('div.dt-search input')
				.val('Author')
				.keyup();
			$('div.dt-search input')
				.val('Technical Author')
				.keyup();
			expect(doc.getElementsByClassName('dt-info')[0].innerHTML).toBe(
				'Showing 1 to 2 of 2 entries (filtered from 57 total entries)'
			);
		});

		it('Smart search - double quoted phrase', function() {
			$('div.dt-search input')
				.val('"Regional Director"')
				.keyup();

			expect($('.dt-info').text()).toBe(
				'Showing 1 to 5 of 5 entries (filtered from 57 total entries)'
			);
		});

		it('Smart search - double quoted phrase and individual', function() {
			$('div.dt-search input')
				.val('"Regional Director" Chang')
				.keyup();

			expect($('.dt-info').text()).toBe(
				'Showing 1 to 1 of 1 entry (filtered from 57 total entries)'
			);
		});

		it('Smart search - double quote unique match', function() {
			$('div.dt-search input')
				.val('"Chief O"')
				.keyup();

			expect($('.dt-info').text()).toBe(
				'Showing 1 to 1 of 1 entry (filtered from 57 total entries)'
			);
			expect($('#example tbody td').eq(0).text()).toBe('Fiona Green');
		});

		it('Smart search - double quote without proves phase', function() {
			$('div.dt-search input')
				.val('Chief O')
				.keyup();

			expect($('.dt-info').text()).toBe(
				'Showing 1 to 4 of 4 entries (filtered from 57 total entries)'
			);
			expect($('#example tbody td').eq(0).text()).toBe('Angelica Ramos');
		});

		it('Smart search - negative', function() {
			$('div.dt-search input')
				.val('!Airi')
				.keyup();

			expect($('.dt-info').text()).toBe(
				'Showing 1 to 10 of 56 entries (filtered from 57 total entries)'
			);
			expect($('#example tbody td').eq(0).text()).toBe('Angelica Ramos');
		});

		it('Smart search - two negatives', function() {
			$('div.dt-search input')
				.val('!Airi !London')
				.keyup();

			expect($('.dt-info').text()).toBe(
				'Showing 1 to 10 of 44 entries (filtered from 57 total entries)'
			);
			expect($('#example tbody td').eq(0).text()).toBe('Ashton Cox');
		});

		it('Smart search - two negatives and a positive', function() {
			$('div.dt-search input')
				.val('!Airi !London Director')
				.keyup();

			expect($('.dt-info').text()).toBe(
				'Showing 1 to 4 of 4 entries (filtered from 57 total entries)'
			);
			expect($('#example tbody td').eq(0).text()).toBe('Charde Marshall');
		});

		it('Smart search - negative phrase', function() {
			$('div.dt-search input')
				.val('!"Airi Satou"')
				.keyup();

			expect($('.dt-info').text()).toBe(
				'Showing 1 to 10 of 56 entries (filtered from 57 total entries)'
			);
			expect($('#example tbody td').eq(0).text()).toBe('Angelica Ramos');
		});

		dt.clean();
	});
});
