describe('Static method - set()', function () {
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
			expect(typeof $.fn.dataTable.util.set).toBe('function');
			expect(typeof DataTable.util.set).toBe('function');
		});
		it('Returns a boolean', function () {
			expect(typeof $.fn.dataTable.util.set()).toBe('function');
			expect(typeof DataTable.util.set()).toBe('function');
		});
	});

	describe('Functional tests (with both DataTable and $.fn.dataTable)', function () {
		it('Top-level', function () {
			let fn = DataTable.util.set('name.first');
			fn(user, 'fred');
			expect(user.name.first).toBe('fred');
		});
		it('Lower-level', function () {
			let fn = DataTable.util.set('address.house.number');
			fn(user, 5);
			expect(user.address.house.number).toBe(5);
		});
		it('Object', function () {
			let fn = DataTable.util.set('address.house');
			fn(user, { test: true });
			expect(user.address.house).toEqual({ test: true });
		});
		it('Function descriptor', function () {
			let params;
			let fn = DataTable.util.set(function () {
				params = arguments;
			});
			fn(user, 'stan');
			expect(params[0]).toEqual(user);
			expect(params[1]).toBe('set');
			expect(params[2]).toEqual('stan');
		});
	});
});
