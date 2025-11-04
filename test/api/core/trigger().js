describe('core - init()', function() {
	let table;

	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');

		it('Exists and is a function', function() {
			table = $('#example').DataTable();
			expect(typeof table.trigger).toBe('function');
		});

		it('Returns an object', function() {
			expect(table.trigger('custom', []) instanceof DataTable.Api).toBe(true);
		});
	});

	describe('Functional tests', function() {
		let args;
		let counter = 0;

		dt.html('basic');
		
		it('Triggers custom events', function() {
			table = $('#example').DataTable();
			
			table.on('custom', function () {
				counter++;
				args = arguments;
			});

			table.trigger('custom', [1, 2, 'three']);

			expect(counter).toBe(1);
		});

		it('First argument was an event object', function () {
			expect(args[0] instanceof $.Event).toBe(true);
		});

		it('And has a DT API instance available', function () {
			expect(args[0].dt instanceof DataTable.Api).toBe(true);
		});

		it('Custom arguments were correctly passed', function () {
			expect(args[1]).toBe(1);
			expect(args[2]).toBe(2);
			expect(args[3]).toBe('three');
			expect(args.length).toBe(4);
		});
		
		it('Return values are provided', function() {
			table.on('customRet', function () {
				return false;
			});

			let ret = table.trigger('customRet', []);

			expect(ret[0]).toBe(false);
		});
		
		it('Uses DT namespace', function() {
			let namespace = false;
			let noNamespace = false;

			$('#example').on('namespace.dt', function () {
				namespace = true;
			});

			$('#example').on('namespace', function () {
				noNamespace = true;
			});

			table.trigger('namespace', [], true);

			expect(namespace).toBe(true);
			expect(noNamespace).toBe(false);
		});
		
		it('Does not bubble by default', function() {
			let bubbled = false;

			$('body').on('nonBubble', function () {
				bubbled = true;
			});

			table.trigger('nonBubble', []);

			expect(bubbled).toBe(false);
		});
		
		it('Can bubble', function() {
			let bubbled = false;

			$('body').on('doBubble.dt', function () {
				bubbled = true;
			});

			table.trigger('doBubble', [], true);

			expect(bubbled).toBe(true);
		});
	});
});
