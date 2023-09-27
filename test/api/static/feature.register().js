describe('Static method - feature.register()', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});


	describe('Check the defaults', function () {
		it('Exists and is a function', function () {
			expect(typeof $.fn.dataTable.feature.register).toBe('function');
			expect(typeof DataTable.feature.register).toBe('function');
		});
	});

	describe('Functional tests', function () {
		var args;

		dt.html('basic');

		it('Can register', function () {
			var ret = DataTable.feature.register('toolbar', function( settings, opts ) {
				args = arguments;

				var div = document.createElement('div');
				var text = ! opts || ! opts.text
					? 'default text'
					: opts.text;

				div.className = 'testToolbar';
				div.innerHTML = text;

				return div;
			});

			expect(ret).toBe(undefined);
		});

		it('Create datatable with it - defaults', function () {
			new DataTable('#example', {
				layout: {
					topStart: 'toolbar'
				}
			});

			expect($('div.testToolbar').length).toBe(1);
			expect($('div.testToolbar').text()).toBe('default text');
		});

		it('Expected arguments', function () {
			expect(args.length).toBe(2);
			expect(args[0].nTable).toBeDefined();
			expect(args[1]).toBe(null);
		});

		dt.html('basic');

		it('Create datatable with it - options', function () {
			new DataTable('#example', {
				layout: {
					topStart: {
						toolbar: {
							text: 'custom text'
						}
					}
				}
			});

			expect($('div.testToolbar').length).toBe(1);
			expect($('div.testToolbar').text()).toBe('custom text');
		});

		it('Expected arguments', function () {
			expect(args.length).toBe(2);
			expect(args[0].nTable).toBeDefined();
			expect(args[1].text).toBe('custom text');
		});
	});
});
