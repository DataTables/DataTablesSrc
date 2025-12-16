describe('Legacy aoColumns.fnCreatedCell option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	dt.html('basic');

	it('Set with legacy parameter and is called', function () {
		let args;
		let count = 0;

		new DataTable('#example', {
			aoColumnDefs: [{
				target: 1,
				fnCreatedCell: function () {
					args = arguments;
					count++;
				}
			}]
		});

		expect(args.length).toBe(5);
		expect(count).toBe(57);
	});
});
