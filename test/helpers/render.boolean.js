describe('boolean rendering helper', function () {
	let table;
	let data = [
		['a', 1, true],
		['b', 2, true],
		['c', 3, false],
		['d', 4, null],
		['e', 5, '']
	];
	let defaultTrue = '\u2713';
	let defaultFalse = '\u2717';
	let defaultEmpty = '';

	dt.libs({
		js: ['datatables'],
		css: ['datatables']
	});

	dt.html('no-columns');

	it('Boolean data type detected', () => {
		table = new DataTable('#test', {
			columns: [
				{ title: 'a' },
				{ title: 'b' },
				{ title: 'c' }
			],
			data
		});

		expect(table.column(0).type()).toBe('string');
		expect(table.column(1).type()).toBe('num');
		expect(table.column(2).type()).toBe('bool');
	});

	it('Class is applied', () => {
		expect(
			table.column(0).header().classList.contains('dt-type-boolean')
		).toBe(false);
		expect(
			table.column(1).header().classList.contains('dt-type-boolean')
		).toBe(false);
		expect(
			table.column(2).header().classList.contains('dt-type-boolean')
		).toBe(true);

		expect(
			table.cell(0, 0).node().classList.contains('dt-type-boolean')
		).toBe(false);
		expect(
			table.cell(0, 1).node().classList.contains('dt-type-boolean')
		).toBe(false);
		expect(
			table.cell(0, 2).node().classList.contains('dt-type-boolean')
		).toBe(true);
	});

	dt.html('no-columns');

	it('Rendering with defaults', () => {
		table = new DataTable('#test', {
			columns: [
				{ title: 'str' },
				{ title: 'num' },
				{ title: 'bool', render: DataTable.render.boolean() }
			],
			data
		});

		expect(table.cell(0, 2).node().textContent).toBe(defaultTrue);
		expect(table.cell(1, 2).node().textContent).toBe(defaultTrue);
		expect(table.cell(2, 2).node().textContent).toBe(defaultFalse);
		expect(table.cell(3, 2).node().textContent).toBe(defaultEmpty);
		expect(table.cell(4, 2).node().textContent).toBe(defaultEmpty);
	});

	dt.html('no-columns');

	it('Rendering with custom values', () => {
		table = new DataTable('#test', {
			columns: [
				{ title: 'str' },
				{ title: 'num' },
				{ title: 'bool', render: DataTable.render.boolean('yes', 'no', 'maybe') }
			],
			data
		});

		expect(table.cell(0, 2).node().textContent).toBe('yes');
		expect(table.cell(1, 2).node().textContent).toBe('yes');
		expect(table.cell(2, 2).node().textContent).toBe('no');
		expect(table.cell(3, 2).node().textContent).toBe('maybe');
		expect(table.cell(4, 2).node().textContent).toBe('maybe');
	});
});
