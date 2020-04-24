describe('initComplete Option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		let table;
		it('Default should not be true', function() {
			$('#example').dataTable();
			expect($.fn.dataTable.defaults.fnInitComplete).toBe(null);
		});

		dt.html('basic');
		it('Two arguments passed (no Ajax)', function() {
			let called = false;
			$('#example').dataTable({
				initComplete: function() {
					called = true;
					expect(arguments.length).toBe(2);
					expect(typeof arguments[0]).toBe('object');
					expect(typeof arguments[1]).toBe('undefined');
				}
			});
			expect(called).toBe(true);
		});

		dt.html('empty');
		it('Two arguments passed (Ajax)', function(done) {
			$('#example').DataTable({
				ajax: '/base/test/data/data.txt',
				columns: dt.getTestColumns(),
				initComplete: function() {
					expect(arguments.length).toBe(2);
					expect(typeof arguments[0]).toBe('object');
					expect(typeof arguments[1]).toBe('object');
					done();
				}
			});
		});

		dt.html('basic');
		it('That one argument is the settings object', function() {
			let test;
			table = $('#example').DataTable({
				initComplete: function(settings) {
					test = settings;
				}
			});
			expect(test).toBe(table.settings()[0]);
		});
		
		dt.html('basic');
		let count = 0;
		it('initComplete called once on first draw', function() {
			count = 0;
			table = $('#example').DataTable({
				initComplete: function() {
					count++;
				}
			});
			expect(count).toBe(1);
		});
		it('initComplete never called there after', function() {
			$('.paginate_button.next').click();
			table.page(1).draw();
			expect(count).toBe(1);
		});

		dt.html('basic');
		it('Table fully loaded when called (no Ajax)', function() {
			count = 0;
			$('#example').dataTable({
				initComplete: function() {
					expect($('#example tbody tr').length).toBe(10);
					expect(this.api().rows().count()).toBe(57);
				}
			});
		});

		dt.html('empty');
		it('Table fully loaded when called (Ajax)', function(done) {
			$('#example').DataTable({
				ajax: '/base/test/data/data.txt',
				columns: dt.getTestColumns(),
				initComplete: function() {
					expect($('#example tbody tr').length).toBe(10);
					expect(this.api().rows().count()).toBe(57);
					done();
				}
			});
		});		
	});
});
