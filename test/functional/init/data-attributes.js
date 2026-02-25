describe('Empty DataTable', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	dt.html('basic');

	it('Page length can be set from a data property', function() {
		document.querySelector('#example').setAttribute('data-page-length', '25');

		new DataTable('#example');

		expect(document.querySelectorAll('tbody tr').length).toEqual(25);
	});

	dt.html('basic');

	it('Order can be set from a data property', function() {
		document.querySelector('#example').setAttribute('data-order', '[[ 1, "asc" ]]');

		new DataTable('#example');

		expect(document.querySelectorAll('tbody tr').length).toEqual(10);
		expect(document.querySelector('tbody td').textContent).toEqual('Garrett Winters');
	});

	dt.html('basic');

	it('Both can from data properties at the same time', function() {
		document.querySelector('#example').setAttribute('data-page-length', '25');
		document.querySelector('#example').setAttribute('data-order', '[[ 1, "asc" ]]');

		new DataTable('#example');

		expect(document.querySelectorAll('tbody tr').length).toEqual(25);
		expect(document.querySelector('tbody td').textContent).toEqual('Garrett Winters');
	});
});
