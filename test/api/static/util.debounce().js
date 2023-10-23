describe('Static method - util.debounce()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;
	let search;

	describe('Check the defaults', function() {
		dt.html('basic');

		it('Exists and is a function', function() {
			expect(typeof DataTable.util.debounce).toBe('function');
		});

		it('Return value is correct', function() {
			expect(typeof DataTable.util.debounce(() => {})).toBe('function');
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');

		it('Single call - waits correctly', async function() {
			var run = false;
			var bounce = DataTable.util.debounce(function() {
				run = true;
			});

			bounce();
			expect(run).toBe(false)

			await dt.sleep(300);

			expect(run).toBe(true)
		});

		it('Keeps waiting after multiple calls', async function() {
			var run = false;
			var bounce = DataTable.util.debounce(function() {
				run = true;
			});

			bounce();
			expect(run).toBe(false);

			bounce();
			await dt.sleep(100);
			expect(run).toBe(false);

			bounce();
			await dt.sleep(100);
			expect(run).toBe(false);

			bounce();
			await dt.sleep(100);
			expect(run).toBe(false);

			bounce();
			await dt.sleep(100);
			expect(run).toBe(false);

			bounce();
			await dt.sleep(300);
			expect(run).toBe(true);
		});

		it('Can pass arguments', async function() {
			var run = false;
			var args = null;
			var bounce = DataTable.util.debounce(function() {
				run = true;
				args = arguments;
			});

			bounce(1, 2, 3);
			expect(run).toBe(false);
			expect(args).toBe(null);

			await dt.sleep(300);
			expect(run).toBe(true);
			expect(Array.from(args)).toEqual([1, 2, 3]);
		});
	});
});
