describe('Legacy callbacks', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	// Only care that they are run here. Functionality is in the camelCase tests
	describe('Check they run', function() {
		dt.html('basic');

		it('fnDrawCallback', function() {
			let isCalled = false;

			$('#example').dataTable({
				fnDrawCallback: function () {
					isCalled = true;
				}
			});

			expect(isCalled).toBe(true);
		});

		dt.html('basic');

		it('fnStateSaveParams', function() {
			let isCalled = false;

			$('#example').dataTable({
				stateSave: true,
				fnStateSaveParams: function () {
					isCalled = true;
				}
			});

			expect(isCalled).toBe(true);
		});

		dt.html('basic');

		it('fnStateLoadParams', function() {
			let isCalled = false;

			$('#example').dataTable({
				stateSave: true,
				fnStateLoadParams: function () {
					isCalled = true;
				}
			});

			expect(isCalled).toBe(true);
		});

		dt.html('basic');

		it('fnStateLoaded', function() {
			let isCalled = false;

			$('#example').dataTable({
				stateSave: true,
				fnStateLoaded: function () {
					isCalled = true;
				}
			});

			expect(isCalled).toBe(true);
		});

		dt.html('basic');

		it('fnRowCallback', function() {
			let isCalled = false;

			$('#example').dataTable({
				fnRowCallback: function () {
					isCalled = true;
				}
			});

			expect(isCalled).toBe(true);
		});

		dt.html('basic');

		it('fnCreatedRow', function() {
			let isCalled = false;

			$('#example').dataTable({
				fnCreatedRow: function () {
					isCalled = true;
				}
			});

			expect(isCalled).toBe(true);
		});

		dt.html('basic');

		it('fnHeaderCallback', function() {
			let isCalled = false;

			$('#example').dataTable({
				fnHeaderCallback: function () {
					isCalled = true;
				}
			});

			expect(isCalled).toBe(true);
		});

		dt.html('basic');

		it('fnFooterCallback', function() {
			let isCalled = false;

			$('#example').dataTable({
				fnFooterCallback: function () {
					isCalled = true;
				}
			});

			expect(isCalled).toBe(true);
		});

		dt.html('basic');

		it('fnInitComplete', function() {
			let isCalled = false;

			$('#example').dataTable({
				fnInitComplete: function () {
					isCalled = true;
				}
			});

			expect(isCalled).toBe(true);
		});

		dt.html('basic');

		it('fnPreDrawCallback', function() {
			let isCalled = false;

			$('#example').dataTable({
				fnPreDrawCallback: function () {
					isCalled = true;
				}
			});

			expect(isCalled).toBe(true);
		});
	});
});
