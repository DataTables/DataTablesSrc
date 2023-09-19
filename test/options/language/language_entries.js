describe('language.entries option', function() {
	let table;

	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');

		it("Check default ", function() {
			expect(DataTable.defaults.oLanguage.entries).toEqual({
				_: 'entries',
				1: 'entry'
			});
		});

		it('Info - plural', function() {
			table = $('#example').DataTable({
				language: {
					entries: {
						_: 'people',
						1: 'person'
					},
					search: 'Look for _ENTRIES_:'
				},
				lengthMenu: [
					10,
					25,
					50,
					1
				]
			});

			expect($('div.dt-info').text()).toBe('Showing 1 to 10 of 57 people');
		});
	
		it('Info - plural filtered', function() {
			table.search('Airi').draw();
			expect($('div.dt-info').text()).toBe('Showing 1 to 1 of 1 person (filtered from 57 total people)');
		});

		it('Info - singular', function() {
			table.search('').draw();
			table.rows(':gt(0)').remove().draw();

			expect($('div.dt-info').text()).toBe('Showing 1 to 1 of 1 person');
		});

		it('Info - singular - filtered', function() {
			table.search('123').draw();
			table.rows(':gt(0)').remove().draw();

			expect($('div.dt-info').text()).toBe('Showing 0 to 0 of 0 people (filtered from 1 total person)');
		});

		it('Search', function() {
			table.search('').draw();
			expect($('div.dt-search').text()).toBe('Look for people:');
		});

		it('Length - plural', function() {
			expect($('div.dt-length').text()).toBe('1025501 people per page');
		});

		it('Length - singular', function() {
			table.page.len(1).draw();
			expect($('div.dt-length').text()).toBe('1025501 person per page');
		});

		dt.html('basic');

		it('Info - string value', function() {
			table = $('#example').DataTable({
				language: {
					entries: 'people',
					search: 'Look for _ENTRIES_:'
				}
			});

			expect($('div.dt-info').text()).toBe('Showing 1 to 10 of 57 people');
			expect($('div.dt-search').text()).toBe('Look for people:');
			expect($('div.dt-length').text()).toBe('102550100 people per page');
		});
	
	});
});
