describe('drawCallback option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Default should not be true', function() {
			$('#example').dataTable();
			expect($.fn.dataTable.defaults.fnDrawCallback).not.toBe(true);
		});

		dt.html('basic');
		it('One argument passed', function() {
			let test = 0;
			$('#example').dataTable({
				drawCallback: function() {
					test = arguments.length;
				}
			});
			expect(test).toBe(1);
		});

		dt.html('basic');
		it('That one argument is the settings object', function() {
			let table = $('#example').DataTable({
				drawCallback: function(settings) {
					test = settings;
				}
			});
			expect(table.settings()[0]).toBe(test);
		});

		dt.html('basic');
		it('Context is correct', function() {
			let test = 0;
			$('#example').dataTable({
				drawCallback: function() {
					test = this.api()
						.columns()
						.count();
				}
			});
			expect(test).toBe(6);
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('drawCallback called after the draw', function() {
			let test = 0;
			$('#example').dataTable({
				drawCallback: function() {
					test = $('#example tbody tr').length;
				}
			});
			$('div.dataTables_filter input')
				.val('developer')
				.keyup();
			expect(test).toBe(8);
		});

		dt.html('basic');
		let test = 0;
		it('drawCallback called once on first draw', function() {
			$('#example').dataTable({
				drawCallback: function() {
					test++;
				}
			});
			expect(test).toBe(1);
		});

		it('drawCallback called once when paging', function() {
			$('.paginate_button.next').click();
			expect(test).toBe(2);
		});

		it('drawCallback called once when filtering', function() {
			$('div.dataTables_filter input')
				.val('Accountant')
				.keyup();
			expect(test).toBe(3);
		});

		it('drawCallback called once when ordering', function() {
			$('#example thead th:eq(3)').click();
			expect(test).toBe(4);
		});
	});

	describe('Integration style tests', function() {
		dt.html('basic');
		it('Server-side processing', function(done) {
			let test = 0;
			let table = $('#example').DataTable({
				processing: true,
				serverSide: true,
				displayStart: 20,
				lengthMenu: [15, 30, 45, 60],
				ajax: dt.serverSide,
				drawCallback: function() {
					test++;
				},
				initComplete: function(setting, json) {
					expect(test).toBe(1);
					done();
				}
			});
		});

		dt.html('basic');
		it('Server-side processing', function(done) {
			let test = 0;
			let table = $('#example').DataTable({
				processing: true,
				serverSide: true,
				displayStart: 20,
				deferRendering: true,
				lengthMenu: [15, 30, 45, 60],
				ajax: dt.serverSide,
				drawCallback: function() {
					test++;
				},
				initComplete: function(setting, json) {
					expect(test).toBe(1);
					done();
				}
			});
		});
	});
});
