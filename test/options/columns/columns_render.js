describe('columns.render option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Default should be null', function() {
			expect($.fn.DataTable.defaults.column.mRender).toBe(null);
		});
	});

	// // TK COLIN
	// describe('Functional tests - special values', function() {
	// 	dt.html('basic');
	// 	it('undefined', function() {
	// 		let data = [['aaa', 'bbb', 'ccc', 'ddd', 'eee']];
	// 		let table = $('#example').DataTable({
	// 			data: data,
	// 			columns: [null, null, null, null, null, { render: null }]
	// 		});
	// 		expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Edinburgh');
	// 	});

	// 	// dt.html('basic');
	// 	// it('null', function() {
	// 	// 	// let table = $('#example').DataTable({
	// 	// 	// 	columns: [{ data: null, render: null }, null, null, null, null, null]
	// 	// 	// });
	// 	// 	// expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Edinburgh');
	// 	// });
	// });

	describe('Functional tests - integer type', function() {
		dt.html('basic');
		it('Integer for data source', function() {
			let table = $('#example').DataTable({
				columns: [{ data: null, render: 2 }, null, null, null, null, null]
			});
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Edinburgh');
		});

		dt.html('basic');
		it('Integer for data source', function() {
			let table = $('#example').DataTable({
				columns: [{ render: 2 }, null, null, null, null, null]
			});
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('a');
		});
	});

	describe('Functional tests - string type', function() {
		// dt.html('empty');
		// it('Plain string', function() {
		// 	let data = [
		// 		{
		// 			name: { first: 'Aaron', last: 'Aardvark' },
		// 			position: 'Architect',
		// 			office: 'Atlanta',
		// 			age: 99,
		// 			start_date: '2018/05/06',
		// 			salary: '$40,000'
		// 		}
		// 	];
		// 	let cols = dt.testColumns;
		// 	cols[0].render = 'first';
		// 	$('#example').DataTable({
		// 		data: data,
		// 		columns: cols
		// 	});
		// 	expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Aaron');
		// });

		dt.html('empty');
		it('Dotted JS notation (next objects)', function() {
			let data = [
				{
					name: { name_object: { first: 'Aaron', last: 'Aardvark' } },
					position: 'Architect',
					office: 'Atlanta',
					age: 99,
					start_date: '2018/05/06',
					salary: '$40,000'
				}
			];
			let cols = dt.testColumns;
			cols[0].render = '.name_object.first';
			$('#example').DataTable({
				data: data,
				columns: cols
			});
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Aaron');
		});

		// dt.html('empty');
		// it('Array in the string', function() {
		// 	let data = [
		// 		{
		// 			name: { first: 'Aaron', last: 'Aardvark' },
		// 			position: 'Architect',
		// 			office: [{ city: 'Atlanta' }, { city: 'Aspen' }],
		// 			age: 99,
		// 			start_date: '2018/05/06',
		// 			salary: '$40,000'
		// 		}
		// 	];
		// 	let cols = dt.testColumns;
		// 	cols[0].render = 'first';
		// 	cols[2].render = '[; ].city';
		// 	$('#example').DataTable({
		// 		data: data,
		// 		columns: cols
		// 	});
		// 	expect($('tbody tr:eq(0) td:eq(2)').text()).toBe('Atlanta; Aspen');
		// });


	});
});
