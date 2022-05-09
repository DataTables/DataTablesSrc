describe('Static method - get()', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let user = {
		name: {
			first: 'Fiona',
			last: 'Grayling'
		},
		address: {
			house: {
				number: 2,
				name: 'test'
			},
			city: 'Boston',
			country: 'USA'
		}
	};

	describe('Check the defaults', function () {
		it('Exists and is a function', function () {
			expect(typeof $.fn.dataTable.util.get).toBe('function');
			expect(typeof DataTable.util.get).toBe('function');
		});
		it('Returns a boolean', function () {
			expect(typeof $.fn.dataTable.util.get()).toBe('function');
			expect(typeof DataTable.util.get()).toBe('function');
		});
	});

	describe('Functional tests (with both DataTable and $.fn.dataTable)', function () {
		it('Top-level', function () {
			let fn = DataTable.util.get('name.first');
			let str = fn(user);
			expect(str).toBe('Fiona');
		});
		it('Lower-level', function () {
			let fn = DataTable.util.get('address.house.number');
			let str = fn(user);
			expect(str).toBe(2);
		});
		it('Object', function () {
			let fn = DataTable.util.get('address.house');
			let str = fn(user);
			expect(str).toEqual(user.address.house);
		});
		it('No descriptor', function () {
			let fn = DataTable.util.get(null);
			let str = fn(user);
			expect(str).toEqual(user);
		});
		it('Object descriptor', function () {
			let fn = DataTable.util.get(user.name);
			let str = fn(user.name);
			expect(str).toEqual(user.name);
		});
	});
});
