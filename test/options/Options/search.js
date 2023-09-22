describe('Search option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Default values should be blank', function() {
			let table = $('#example').DataTable();
			expect(table.settings()[0].oPreviousSearch.search).toBe('');
			expect(table.settings()[0].oPreviousSearch.regex).toBe(false);
			expect(table.settings()[0].oPreviousSearch.caseInsensitive).toBe(true);
			expect(table.settings()[0].oPreviousSearch.smart).toBe(true);
		});

		dt.html('basic');
		it('Search term only in object', function() {
			$('#example').dataTable({
				search: {
					search: '41'
				}
			});
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Bradley Greer');
		});
		it('New search term should wipeout one at initialisation', function() {
			$('div.dt-search input')
				.val('Cox')
				.keyup();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Ashton Cox');
		});
		it('Clearing search returns to full table (not initialisation search)', function() {
			$('div.dt-search input')
				.val('')
				.keyup();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});
	});

	describe('search.search', function() {
		dt.html('basic');
		it('Set an initial global filter', function() {
			$('#example').dataTable({
				search: {
					search: 'Officer'
				}
			});
			expect($('div.dt-info').html()).toBe('Showing 1 to 4 of 4 entries (filtered from 57 total entries)');
		});
	});

	describe('search.regex option', function() {
		dt.html('basic');
		it('Search plain text and escape regex true', function() {
			$('#example').dataTable({
				search: {
					search: 'Ashton',
					regex: false
				}
			});
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Ashton Cox');
		});

		dt.html('basic');
		it('Search plain text term and escape regex false', function() {
			$('#example').dataTable({
				search: {
					search: 'Ashton',
					regex: true
				}
			});
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Ashton Cox');
		});
		dt.html('basic');
		it('Search regex text term and escape regex true', function() {
			$('#example').dataTable({
				search: {
					search: 'As.ton',
					regex: false
				}
			});
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('No matching records found');
		});

		dt.html('basic');
		it('Search regex text term and escape regex false', function() {
			$('#example').dataTable({
				search: {
					search: 'As.ton',
					regex: true
				}
			});
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Ashton Cox');
		});

		dt.html('basic');
		it('Search regex via DOM when disabled', function() {
			$('#example').dataTable({
				search: {
					regex: false
				}
			});
			$('div.dt-search input')
				.val('As.ton')
				.keyup();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('No matching records found');
		});

		dt.html('basic');
		it('Search regex via DOM when enabled', function() {
			$('#example').dataTable({
				search: {
					regex: true
				}
			});
			$('div.dt-search input')
				.val('As.ton')
				.keyup();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Ashton Cox');
		});

		dt.html('basic');
		it('Search regex via API when disabled', function() {
			let table = $('#example').DataTable({
				search: {
					regex: false
				}
			});
			table.search('As.ton').draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('No matching records found');
		});

		dt.html('basic');
		it('Search regex via API when enabled', function() {
			let table = $('#example').DataTable({
				search: {
					regex: true
				}
			});
			table.search('As.ton').draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Ashton Cox');
		});
	});

	describe('search.caseInsensitive option', function() {
		dt.html('basic');
		it('Search via DOM (expect false)', function() {
			$('#example').dataTable({
				search: {
					caseInsensitive: false
				}
			});
			$('div.dt-search input')
				.val('accountant')
				.keyup();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('No matching records found');
		});
		dt.html('basic');
		it('Search via API (expect false)', function() {
			let table = $('#example').DataTable({
				search: {
					caseInsensitive: false
				}
			});
			table.search('angelica').draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('No matching records found');
		});

		dt.html('basic');
		it('Search via DOM (expect true)', function() {
			$('#example').dataTable({
				search: {
					caseInsensitive: true
				}
			});
			$('div.dt-search input')
				.val('accountant')
				.keyup();
			expect($('#example tbody tr:eq(0) td:eq(1)').text()).toBe('Accountant');
		});
		dt.html('basic');
		it('Search via API (expect true)', function() {
			let table = $('#example').DataTable({
				search: {
					caseInsensitive: true
				}
			});
			table.search('angelica').draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Angelica Ramos');
		});
	});

	describe('search.smart option', function() {
		dt.html('basic');
		it('Check smart option turns off smart filtering', function() {
			$('#example').dataTable({
				search: {
					smart: false,
					search: 'Officer 47'
				}
			});
			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('No matching records found');
		});
		dt.html('basic');
		it('Check with smart true', function() {
			$('#example').dataTable({
				search: {
					smart: true,
					search: 'Officer 47'
				}
			});
			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Angelica Ramos');
		});
	});

	describe('Combined option', function() {
		dt.html('basic');
		it('Check regex and caseInsensitive - positive', function() {
			$('#example').dataTable({
				search: {
					regex: true,
					caseInsensitive: false,
					search: 'As.ton'
				}
			});
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Ashton Cox');
		});

		dt.html('basic');
		it('Check regex and caseInsensitive - negative', function() {
			$('#example').dataTable({
				search: {
					regex: true,
					caseInsensitive: false,
					search: 'as.ton'
				}
			});
			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('No matching records found');
		});

		dt.html('basic');
		it('Check smart and caseInsensitive - positive', function() {
			$('#example').dataTable({
				search: {
					smart: true,
					caseInsensitive: false,
					search: 'Ashton 66'
				}
			});
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Ashton Cox');
		});

		dt.html('basic');
		it('Check smart and caseInsensitive - negative', function() {
			$('#example').dataTable({
				search: {
					smart: true,
					caseInsensitive: false,
					search: 'ashton 66'
				}
			});
			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('No matching records found');
		});

		dt.html('basic');

		// Don't think you'd ever use exact on the search top level!
		it('Check exact with no match', function() {
			$('#example').DataTable({
				search: {
					exact: true,
					search: 'Ashton'
				}
			});
			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('No matching records found');
		});

		dt.html('basic');

		it('Check exact with a match', function() {
			// Don't think you'd ever do this!
			$('#example').DataTable({
				search: {
					exact: true,
					search: 'Ashton Cox  Junior Technical Author  San Francisco  66  2009/01/12  $86,000'
				}
			});
			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Ashton Cox');
		});

		dt.html('basic');

		// Don't think you'd ever use exact on the search top level!
		it('Boundary option', function() {
			$('#example').DataTable({
				search: {
					boundary: true,
					search: 'ton'
				}
			});
			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('No matching records found');
		});

		dt.html('basic');

		it('Check exact with a match', function() {
			// Don't think you'd ever do this!
			$('#example').DataTable({
				search: {
					boundary: false,
					search: 'ton'
				}
			});
			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Ashton Cox');
		});
	});
});
