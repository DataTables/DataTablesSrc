describe('reverse()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			table = $('#example').DataTable();
			expect(typeof table.reverse).toBe('function');
		});
		it('Returns API instance', function() {
			expect(table.reverse() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Functional tests', function() {
		function isReversed(forward, backward) {
			let count = forward.count();
			if (count !== backward.count()) {
				return false;
			}

			for (let i = 0; i < count; i++) {
				if (forward[i] !== backward[count - i - 1]) {
					return false;
				}
			}

			return true;
		}

		dt.html('basic');
		it('Confirm with ordered list', function() {
			table = $('#example').DataTable();
			expect(
				isReversed(
					table.column(0).data(),
					table
						.column(0)
						.data()
						.reverse()
				)
			).toBe(true);
		});
		it('Confirm with unordered list', function() {
			expect(
				isReversed(
					table.column(4).data(),
					table
						.column(4)
						.data()
						.reverse()
				)
			).toBe(true);
		});
	});
});
