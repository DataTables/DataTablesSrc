describe('nonjQuery - ajax', function () {
	let counter = 0;
	let counterAsc = 0;
	let counterDesc = 0;
	let args, argsAsc, argsDesc;
	
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	dt.html('basic');

	it('Define a custom sorter with a pre-formatter', function () {
		DataTable.ext.type.order['test1-pre'] = function (d) {
			counter++;
			args = arguments;

			if (d === 'Cedric Kelly') {
				return -1;
			}
			return 0;
		}

		new DataTable('#example', {
			columnDefs: [{
				target: 0,
				type: 'test1'
			}]
		});

		expect($('#example tbody td').eq(0).text()).toBe('Cedric Kelly');
	});

	it('Pre-formatter was called once for each cell', function () {
		expect(counter).toBe(57);
	});

	it('A two parameters were passed to the pre function', function () {
		expect(args.length).toBe(2);
	});

	it('Second is the settings object', function () {
		expect(args[1].nTable).toBeDefined();
	});

	dt.html('basic');

	it('Custom asc and desc formatters', function () {
		DataTable.ext.type.order['test2-asc'] = function (a, b) {
			counterAsc++;
			argsAsc = arguments;
			return a.localeCompare(b);
		}

		DataTable.ext.type.order['test2-desc'] = function (a, b) {
			counterDesc++;
			argsDesc = arguments;
			return b.localeCompare(a);
		}

		new DataTable('#example', {
			columnDefs: [{
				target: 0,
				type: 'test2'
			}]
		});

		expect($('#example tbody td').eq(0).text()).toBe('Airi Satou');
	});

	it('Functions were called as needed', function () {
		// The sorting algorithm defines how many times it will actually be called
		expect(counterAsc).toBeGreaterThan(0);
		expect(counterDesc).toBe(0);
	});

	it('Two arguments were given to the sort function', function () {
		expect(argsAsc.length).toBe(2);
	});

	it('Reverse sorting', async function () {
		counter = counterAsc;

		await dt.clickHeader(0);

		expect($('#example tbody td').eq(0).text()).toBe('Zorita Serrano');
	});

	it('Functions were called as needed', function () {
		expect(counterDesc).toBeGreaterThan(0);
		expect(counter).toBe(counterAsc);
	});

	it('Two arguments were given to the sort function', function () {
		expect(argsDesc.length).toBe(2);
	});

	dt.html('basic');

	it('Pre, asc and desc can all be defined', function () {
		counter = 0;
		counterAsc = 0;
		counterDesc = 0;

		DataTable.ext.type.order['test3-pre'] = function (d) {
			counter++;
			return d.toLowerCase();
		}

		DataTable.ext.type.order['test3-asc'] = function (a, b) {
			counterAsc++;
			return a.localeCompare(b);
		}

		DataTable.ext.type.order['test3-desc'] = function (a, b) {
			counterDesc++;
			return b.localeCompare(a);
		}

		new DataTable('#example', {
			columnDefs: [{
				target: 0,
				type: 'test3'
			}]
		});

		expect($('#example tbody td').eq(0).text()).toBe('Airi Satou');
	});

	it('Functions were called', function () {
		expect(counter).toBe(57);
		expect(counterAsc).toBeGreaterThan(0);
		expect(counterDesc).toBe(0);
	});
});
