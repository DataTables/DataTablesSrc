describe('Static method - tables()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let tables;

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			expect(typeof $.fn.dataTable.tables).toBe('function');
			expect(typeof $.fn.dataTable.tables).toBe('function');

		});
		it('Returns empty array if no tables', function() {
			tables = $.fn.dataTable.tables();
			expect(tables instanceof Array).toBe(true);
			expect(tables.length).toBe(0);

			tables = DataTable.tables();
			expect(tables instanceof Array).toBe(true);
			expect(tables.length).toBe(0);
		});
		it('Returns HTML elements by default', function() {
			$('#example').DataTable();
			tables = $.fn.dataTable.tables();

			expect(tables.length).toBe(1);
			expect(tables[0] instanceof HTMLElement).toBe(true);

			tables = DataTable.tables();

			expect(tables.length).toBe(1);
			expect(tables[0] instanceof HTMLElement).toBe(true);
		});
		it('Returns API instance', function() {
			tables = $.fn.dataTable.tables({ api: true });
			expect(tables.length).toBe(0);
			expect(tables instanceof $.fn.dataTable.Api).toBe(true);

			tables = DataTable.tables({ api: true });
			expect(tables.length).toBe(0);
			expect(tables instanceof $.fn.dataTable.Api).toBe(true);			
		});
		it('Returns visible tables', function() {
			tables = $.fn.dataTable.tables({ visible: true });
			expect(tables.length).toBe(1);
			expect(tables[0] instanceof HTMLElement).toBe(true);

			tables = DataTable.tables({ visible: true });
			expect(tables.length).toBe(1);
			expect(tables[0] instanceof HTMLElement).toBe(true);
		});
		it('Returns hidden tables', function() {
			$('div.dataTables_wrapper').hide();
			tables = $.fn.dataTable.tables({ visible: false });
			expect(tables.length).toBe(1);
			expect(tables[0] instanceof HTMLElement).toBe(true);

			tables = DataTable.tables({ visible: false });
			expect(tables.length).toBe(1);
			expect(tables[0] instanceof HTMLElement).toBe(true);
		});
		it('Doesnt return hidden tables', function() {
			$('div.dataTables_wrapper').hide();
			tables = $.fn.dataTable.tables({ visible: true });
			expect(tables.length).toBe(0);

			tables = DataTable.tables({ visible: true });
			expect(tables.length).toBe(0);
		});
	});

	describe('Functional tests', function() {
		let table1, table2;

		dt.html('two_tables');
		it('Returns empty array if no tables', function() {
			tables = $.fn.dataTable.tables();
			expect(tables instanceof Array).toBe(true);
			expect(tables.length).toBe(0);
		});
		it('Initialise one', function() {
			table1 = $('#example_two').DataTable();
			tables = $.fn.dataTable.tables();

			expect(tables.length).toBe(1);
			expect($(tables[0]).attr('id')).toBe('example_two');
		});
		it('Initialise both', function() {
			table1 = $('#example_one').DataTable();
			tables = $.fn.dataTable.tables();

			expect(tables.length).toBe(2);
			expect($(tables[0]).attr('id')).toBe('example_two');
			expect($(tables[1]).attr('id')).toBe('example_one');
		});
		it('Can issue API calls on both', function() {
			table1 = $('#example_one').DataTable();
			$.fn.dataTable
				.tables({ api: true })
				.search('Cox')
				.draw();

			expect($('#example_one tbody tr:eq(0) td:eq(0)').text()).toBe('Ashton Cox');
			expect($('#example_two tbody tr:eq(0) td:eq(0)').text()).toBe('No matching records found');
		});
		it('Returns visible tables', function() {
			$('div.dataTables_wrapper:eq(0)').hide();

			tables = $.fn.dataTable.tables({ visible: true });
			expect(tables.length).toBe(1);
			expect($(tables[0]).attr('id')).toBe('example_two');
		});
		it('Returns all tables', function() {
			$('div.dataTables_wrapper:eq(0)').hide();

			tables = $.fn.dataTable.tables({ visible: false });
			expect(tables.length).toBe(2);
		});
	});
});
