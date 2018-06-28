describe('core - page.len()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	function checkTableLength(pageLen, infoLength = pageLen, tableLength = pageLen) {
		let table = $('#example').DataTable();

		// check APIs knowledge of the table
		expect(table.page.len()).toBe(pageLen);
		expect(table.page.info().length).toBe(infoLength);

		// check DOM for number of rows and the reported number of rows
		expect($('#example tbody tr').length).toBe(tableLength);
		expect(
			parseInt(
				$('div.dataTables_info')
					.text()
					.split(' ')[3]
			)
		).toBe(tableLength);
	}

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			let table = $('#example').DataTable();
			expect(typeof table.page.len).toBe('function');
		});

		it('Getter returns an integer', function() {
			let table = $('#example').DataTable();
			expect(Number.isInteger(table.page.len())).toBe(true);
		});

		it('Setter returns an API instance', function() {
			var table = $('#example').DataTable();
			expect(table.page.len(5) instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Check the getter behaviour', function() {
		dt.html('basic');
		it('Expected default length', function() {
			let table = $('#example').DataTable();
			checkTableLength(10);
		});

		dt.html('basic');
		it('Page lengthcan be set to 1 during initialisation', function() {
			let table = $('#example').DataTable({
				pageLength: 1
			});
			checkTableLength(1);
		});

		dt.html('basic');
		it('Page lengthcan be set to 5 during initialisation', function() {
			let table = $('#example').DataTable({
				pageLength: 5
			});
			checkTableLength(5);
		});

		dt.html('basic');
		it('Page lengthcan be set to 10 during initialisation', function() {
			let table = $('#example').DataTable({
				pageLength: 10
			});
			checkTableLength(10);
		});

		dt.html('basic');
		it('Ensure page length greater than the number of records', function() {
			let table = $('#example').DataTable({
				pageLength: 100
			});
			checkTableLength(100, 100, 57);
		});

		dt.html('basic');
		it('Ensure setting page length to be -1 during initialisation shows all', function() {
			let table = $('#example').DataTable({
				pageLength: -1
			});
			checkTableLength(-1, -1, 57);
		});
	});

	describe('Check the setter behaviour', function() {
		dt.html('basic');
		it('Page length in the DOM does not change before the draw', function() {
			$('#example')
				.DataTable()
				.page.len(15);
			checkTableLength(15, 15, 10);
		});

		it('Page length can be set to 1 through the API', function() {
			$('#example')
				.DataTable()
				.page.len(1)
				.draw();
			checkTableLength(1);
		});

		it('Page lengthcan be set to 5 through the API', function() {
			$('#example')
				.DataTable()
				.page.len(5)
				.draw();
			checkTableLength(5);
		});

		it('Page lengthcan be set to 10 through the API', function() {
			$('#example')
				.DataTable()
				.page.len(10)
				.draw();
			checkTableLength(10);
		});

		it('Ensure page length greater than the number of records', function() {
			$('#example')
				.DataTable()
				.page.len(100)
				.draw();
			checkTableLength(100, 100, 57);
		});

		it('Ensure setting page length to be -1 through the API shows all', function() {
			$('#example')
				.DataTable()
				.page.len(-1)
				.draw();
			checkTableLength(-1, -1, 57);
		});
	});

	describe('Advanced behaviour', function() {
		dt.html('basic');
		it('Has no effect if paging disabled at initialisation', function() {
			let table = $('#example').DataTable({ paging: false });
			table.page.len(15);
			checkTableLength(15, -1, 57);
		});
	});
});
