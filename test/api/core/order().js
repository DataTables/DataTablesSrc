describe('core- order()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		let table;
		it('Exists and is a function', function() {
			table = $('#example').DataTable();
			expect(typeof table.order).toBe('function');
		});
		it('Getter returns an array', function() {
			expect(table.order() instanceof Array).toBe(true);
		});
		it('Setter returns an API instance', function() {
			expect(table.order([]) instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Functional tests - Getter', function() {
		dt.html('basic');
		// Manuscript 576 raised for the below test - needs changing when bug fixed
		it('No ordering on the table', function() {
			let table = $('#example').DataTable({
				ordering: false
			});
			expect(table.order().toString()).toBe('0,asc');
		});

		dt.html('basic');
		it('Default ordering', function() {
			let table = $('#example').DataTable();
			expect(table.order().toString()).toBe('0,asc');
		});

		dt.html('basic');
		it('order option used', function() {
			let table = $('#example').DataTable({
				order: [[2, 'desc']]
			});
			expect(table.order().toString()).toBe('2,desc');
		});

		dt.html('basic');
		it('orderFixed option not returned', function() {
			let table = $('#example').DataTable({
				orderFixed: [2, 'desc']
			});
			expect(table.order().toString()).toBe('0,asc');
		});

		dt.html('basic');
		it('Two order options', function() {
			let table = $('#example').DataTable({
				order: [[2, 'asc'], [0, 'desc']]
			});
			expect(table.order().toString()).toBe('2,asc,0,desc');
		});

		dt.html('basic');
		// Manuscript 577 raised for the below test - needs changing when bug fixed
		it('User selected sorting', function() {
			let table = $('#example').DataTable();
			$('#example thead th:eq(2)').click();
			var clickEvent = $.Event('click');
			clickEvent.shiftKey = true;
			$('#example thead th:eq(3)').trigger(clickEvent);
			expect(table.order().toString()).toBe('2,asc,3,asc,0');
		});

		dt.html('basic');
		it('Single column set by order()', function() {
			let table = $('#example').DataTable();
			table.order([2, 'asc']).draw();
			expect(table.order().toString()).toBe('2,asc');
		});

		dt.html('basic');
		it('Two columns set by order()', function() {
			let table = $('#example').DataTable();
			table.order([[2, 'asc'], [0, 'desc']]).draw();
			let order = table.order();
			expect(order.length).toBe(2);
			expect(order[0].toString()).toBe('2,asc');
			expect(order[1].toString()).toBe('0,desc');
		});

		dt.html('basic');
		it('Two columns set by order() as separate arrays', function() {
			let table = $('#example').DataTable();
			table.order([2, 'asc'], [0, 'desc']).draw();
			let order = table.order();
			expect(order.length).toBe(2);
			expect(order[0].toString()).toBe('2,asc');
			expect(order[1].toString()).toBe('0,desc');
		});

		dt.html('two_tables');
		it('Can get order when two tables', function() {
			let table = $('table').DataTable();
			table.order([2, 'asc'], [0, 'desc']).draw();
			expect(table.order().toString()).toBe('2,asc,0,desc');
			expect(
				$('#example_one')
					.DataTable()
					.order()
					.toString()
			).toBe('2,asc,0,desc');
			expect(
				$('#example_two')
					.DataTable()
					.order()
					.toString()
			).toBe('2,asc,0,desc');
		});
	});

	describe('Functional tests - Setter', function() {
		dt.html('basic');
		it('Does nothing before the draw', function() {
			let table = $('#example').DataTable();
			table.order([3, 'asc']);
			expect(table.order().toString()).toBe('3,asc');
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});

		dt.html('basic');
		it('Orders after the draw', function() {
			let table = $('#example').DataTable();
			table.order([3, 'asc']).draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Tatyana Fitzpatrick');
		});

		dt.html('basic');
		it('Empty array clears order', function() {
			let table = $('#example').DataTable();
			table.order([]).draw();
			expect(table.order().toString()).toBe('');
		});

		dt.html('basic');
		// Manuscript case #580 - order still being applied (should be Tiger Nixon)
		it('Invalid order does nothing', function() {
			let table = $('#example').DataTable();
			table.order([3, 'fred']).draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Ashton Cox');
		});

		dt.html('basic');
		it('Does nothing when no ordering on the table', function() {
			let table = $('#example').DataTable({
				ordering: false
			});
			table.order([1, 'asc']).draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Tiger Nixon');
		});

		dt.html('basic');
		it('Overwrites order option', function() {
			let table = $('#example').DataTable({
				order: [[1, 'desc']]
			});
			table.order([2, 'asc']).draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Tiger Nixon');
			expect(table.order().toString()).toBe('2,asc');
		});

		dt.html('basic');
		it('orderFixed option not returned', function() {
			let table = $('#example').DataTable({
				orderFixed: [2, 'desc']
			});
			table.order([1, 'desc']).draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Sakura Yamamoto');
			expect(table.order().toString()).toBe('1,desc');
		});

		dt.html('basic');
		it('Can set two columns', function() {
			let table = $('#example').DataTable();
			table.order([[2, 'desc'], [1, 'desc']]).draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Sakura Yamamoto');
		});

		dt.html('basic');
		it('Can set two columns, order matters', function() {
			let table = $('#example').DataTable();
			table.order([[1, 'desc'], [2, 'desc']]).draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Prescott Bartlett');
		});

		dt.html('basic');
		it('Can set two arrays', function() {
			let table = $('#example').DataTable();
			table.order([2, 'desc'], [1, 'desc']).draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Sakura Yamamoto');
		});
	});

	describe('Functional tests - Test results of ordering on various types', function() {
		let table;
		dt.html('basic');
		it('String', function() {
			table = $('#example').DataTable();
			table.order([0, 'desc']).draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Zorita Serrano');
		});
		it('Integer', function() {
			table.order([3, 'desc']).draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Michael Silva');
		});
		it('Date', function() {
			table.order([4, 'desc']).draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Thor Walton');
		});
		it('Currency', function() {
			table.order([5, 'desc']).draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Angelica Ramos');
		});
	});
});
