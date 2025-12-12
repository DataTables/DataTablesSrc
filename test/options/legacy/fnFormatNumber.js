describe('Legacy fnFormatNumber option', function () {
	let original;

	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	function getInfo() {
		return document.querySelector('div.dt-info').textContent;
	}

	function addData(table) {
		let d = [];

		for (let i=0 ; i<1000 ; i++) {
			d.push([i+'-1', i+'-2', i+'-3', i+'-4', i+'-5', i+'-6']);
		}

		table.rows.add(d).draw();
	}

	describe('Check Default', function () {
		dt.html('empty');

		it('Has default function', function () {
			let table = new DataTable('#example');
			addData(table);

			expect(getInfo()).toBe('Showing 1 to 10 of 1,000 entries');
		});

		dt.html('empty');

		it('Set with legacy parameter', function () {
			let table = new DataTable('#example', {
				fnFormatNumber: n => n.toString()
			});
			addData(table);

			expect(getInfo()).toBe('Showing 1 to 10 of 1000 entries');
		});

		dt.html('empty');

		it('Set with legacy default', function () {
			original = DataTable.defaults.formatNumber;
			DataTable.defaults.fnFormatNumber = n => (n+1).toString();

			let table = new DataTable('#example');
			addData(table);

			expect(getInfo()).toBe('Showing 2 to 11 of 1001 entries');
		});

		dt.html('empty');

		it('Remove legacy default', function () {
			delete DataTable.defaults.fnFormatNumber;
			DataTable.defaults.formatNumber = original;

			let table = new DataTable('#example');
			addData(table);

			expect(getInfo()).toBe('Showing 1 to 10 of 1,000 entries');
		});
	});
});
