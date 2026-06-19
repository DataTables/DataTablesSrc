describe('nonjQuery - events', function () {
	dt.libs({
		js: ['datatables'],
		css: ['datatables']
	});

	it('Runs without jQuery', function () {
		expect(window.jQuery).toBeUndefined();
		expect(window.$).toBeUndefined();
		expect(DataTable.use('jq')).toBe(null);
	});

	let event = '';
	let table;
	let order = 0;
	let page = 0;

	dt.html('basic');
	it('No options', function () {
		table = new DataTable('#example');

		table
			.on('order', function () {
				event = 'Order';
				order++;
			})
			.on('search', function () {
				event = 'Search';
			})
			.on('page', function () {
				event = 'Page';
				page++;
			});

		expect(event).toBe('');
	});
	it('Order', function () {
		// A draw will trigger a search as well
		table.order(1).draw();
		expect(event).toBe('Search');
		expect(order).toBe(1);
	});
	it('Search', function () {
		table.search('a');
		expect(event).toBe('Search');
	});
	it('Page', function () {
		table.search('').draw();
		table.page(2);
		expect(page).toBe(1);
		expect(event).toBe('Page');
	});

	it('Can delegate blur events without jQuery', function () {
		let container = document.createElement('div');
		let input = document.createElement('input');
		let called = 0;

		container.appendChild(input);
		document.body.appendChild(container);

		try {
			DataTable.Dom.s(container).on('blur', 'input', function (e) {
				called++;
				expect(this).toBe(input);
				expect(e.currentTarget).toBe(input);
				expect(e.delegateTarget).toBe(container);
			});

			input.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));

			DataTable.Dom.s(container).off('blur');
		}
		finally {
			container.remove();
		}

		expect(called).toBe(1);
	});

	it('Removes only matching delegated event handlers without jQuery', function () {
		let container = document.createElement('div');
		let button = document.createElement('button');
		let first = 0;
		let second = 0;
		let firstHandler = function () {
			first++;
		};
		let secondHandler = function () {
			second++;
		};

		container.appendChild(button);
		document.body.appendChild(container);

		try {
			DataTable.Dom.s(container)
				.on('click', 'button', firstHandler)
				.on('click', 'button', secondHandler);

			DataTable.Dom.s(container).off('click', 'button', firstHandler);

			button.dispatchEvent(new MouseEvent('click', { bubbles: true }));

			DataTable.Dom.s(container).off('click');
		}
		finally {
			container.remove();
		}

		expect(first).toBe(0);
		expect(second).toBe(1);
	});
});
