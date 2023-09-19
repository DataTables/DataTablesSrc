describe('core - events - destroy', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;
	let params;
	let bubbled = true;

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Called before the destroy', function() {
			let count;

			$('body').on('destroy.dt', function () {
				bubbled = true;
			});

			table = $('#example').DataTable();
			table.on('destroy.dt', function() {
				params = arguments;
				count = $('div.dt-search').length;
			});

			table.destroy();
			expect(count).toBe(1);
			expect($('div.dt-search').length).toBe(0);
		});
		it('Called with expected parameters', function() {
			expect(params.length).toBe(2);
			expect(params[0] instanceof $.Event).toBe(true);
			expect(params[1]).toBe(table.settings()[0]);
		});
		it('Has a DT API instance on the event object', function () {
			expect(params[0].dt instanceof DataTable.Api).toBe(true);
		});

		it('Bubbles', function () {
			expect(bubbled).toBe(true);
		});
	});

	describe('Functional tests', function() {
		let count = 0;
		let length;

		dt.html('basic');
		it('Not called on initial draw', function() {
			table = $('#example').DataTable();
			table.on('destroy.dt', function() {
				count++;
			});
			expect(count).toBe(0);
		});
		it('Called when API deletes table but leaves in DOM', function() {
			table.destroy(false);
			expect(count).toBe(1);
		});

		dt.html('basic');
		it('Called when table deleted from the DOM', function() {
			table = $('#example').DataTable();
			table.on('destroy.dt', function() {
				count++;
			});
			table.destroy(true);
			expect(count).toBe(2);
		});

		dt.html('basic');
		it('Called when initialisation option destroys table', function() {
			table = $('#example').DataTable();
			table.on('destroy.dt', function() {
				count++;
			});
			$('#example').DataTable({
				destroy: true
			});
			expect(count).toBe(3);
		});
	});
});
