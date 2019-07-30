describe('core - off()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let stan = 0;
	let fred = 0;

	function incrementStan() {
		stan++;
	}

	function incrementFred() {
		fred++;
	}

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			let table = $('#example').DataTable();
			expect(typeof table.off).toBe('function');
		});

		it('Returns an API instance', function() {
			let table = $('#example').DataTable();
			expect(table.off('draw') instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Check the behaviour', function() {
		dt.html('basic');
		it('Single event listeners for a type are removable', function() {
			stan = 0;
			let table = $('#example').DataTable();
			table.on('draw', incrementStan);
			table.page(2).draw(false);
			table.off('draw');
			table.page(3).draw(false);
			expect(stan).toBe(1);
		});

		dt.html('basic');
		it('Single event listeners (dt namespace) for a type can be removed', function() {
			stan = 0;
			let table = $('#example').DataTable();
			table.on('draw', incrementStan);
			table.page(2).draw(false);
			table.off('draw.dt');
			table.page(3).draw(false);
			expect(stan).toBe(1);
		});

		dt.html('basic');
		it('All event listeners for a type can be removed', function() {
			(stan = 0), (fred = 0);
			let table = $('#example').DataTable();
			table.on('draw', incrementStan);
			table.on('draw', incrementFred);
			table.page(2).draw(false);
			table.off('draw');
			table.page(3).draw(false);
			expect(stan).toBe(1);
			expect(fred).toBe(1);
		});

		dt.html('basic');
		it('Specific type of event listener can be removed', function() {
			stan = 0;
			let table = $('#example').DataTable();
			table.on('draw page', incrementStan);
			table.page(2).draw(false);
			table.off('draw');
			table.page(3).draw(false);
			expect(stan).toBe(3);
		});

		dt.html('basic');
		it('Event listener with a specific function can be removed', function() {
			(stan = 0), (fred = 0);
			let table = $('#example').DataTable();
			table.on('draw', incrementStan);
			table.on('draw', incrementFred);
			table.page(2).draw(false);
			table.off('draw', incrementStan);
			table.page(3).draw(false);
			expect(stan).toBe(1);
			expect(fred).toBe(2);
		});
	});
});
