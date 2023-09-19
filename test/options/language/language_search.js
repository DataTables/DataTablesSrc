describe('language.search option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;

	describe('Check the defaults', function() {
		dt.html('basic');
		it("Search language is 'Search:' by default ", function() {
			table = $('#example').DataTable();
			expect(table.settings()[0].oLanguage.sSearch).toBe('Search:');
		});
		it('A label input is used', function() {
			expect($('div.dt-search label').length).toBe(1);
		});
		it('Search language default is in the DOM', function() {
			expect($('div.dt-search label').text()).toBe('Search:');
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Search language can be defined', function() {
			table = $('#example').DataTable({
				language: {
					search: 'unit test'
				}
			});
			expect($('div.dt-search').text()).toBe('unit test');
		});

		dt.html('basic');
		it('Blank search has no (separator) inserted', function() {
			$('#example').dataTable({
				language: {
					search: ''
				}
			});
			expect($('div.dt-search').text()).toBe('');
		});

		dt.html('basic');
		it("Default DOM structure", function () {
			$('#example').DataTable();

			expect($('div.dt-search > label').length).toBe(1);
			expect($('div.dt-search > input').length).toBe(1);
			expect($('div.dt-search > label + input').length).toBe(1);
		});

		it("Has for and id attributes", function () {
			expect($('div.dt-search > label').attr('for'))
				.toBe($('div.dt-search > input').attr('id'));
		});

		dt.html('basic');
		it("DOM structure - input at start", function () {
			$('#example').DataTable({
				language: {
					search: '_INPUT_ Search'
				}
			});

			expect($('div.dt-search > label').length).toBe(1);
			expect($('div.dt-search > input').length).toBe(1);
			expect($('div.dt-search > input + label').length).toBe(1);

			expect($('div.dt-search > label').attr('for'))
				.toBe($('div.dt-search > input').attr('id'));
		});

		dt.html('basic');
		it("DOM structure - input at end", function () {
			$('#example').DataTable({
				language: {
					search: 'Search _INPUT_'
				}
			});

			expect($('div.dt-search > label').length).toBe(1);
			expect($('div.dt-search > input').length).toBe(1);
			expect($('div.dt-search > label + input').length).toBe(1);

			expect($('div.dt-search > label').attr('for'))
				.toBe($('div.dt-search > input').attr('id'));
		});

		dt.html('basic');
		it("DOM structure - input in middle (explicit)", function () {
			$('#example').DataTable({
				language: {
					search: 'Search _INPUT_ Records'
				}
			});

			expect($('div.dt-search > label').length).toBe(1);
			expect($('div.dt-search > label > input').length).toBe(1);

			expect($('div.dt-search > label').attr('for'))
				.toBe($('div.dt-search input').attr('id'));
		});
	});
});
