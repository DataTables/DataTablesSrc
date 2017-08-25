describe('LengthMenu', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	dt.html('basic');

	it('Check default values', function() {
		$('#example').dataTable();

		var options = $('select option');
		expect(options.eq(0).text()).toBe('10');
		expect(options.eq(1).text()).toBe('25');
		expect(options.eq(2).text()).toBe('50');
		expect(options.eq(3).text()).toBe('100');
	});

	it('Setting to default values makes no difference', function() {
		$('#example').dataTable({
			lengthMenu: [10, 25, 50, 100],
			destroy: true
		});

		var options = $('select option');
		expect(options.eq(0).text()).toBe('10');
		expect(options.eq(1).text()).toBe('25');
		expect(options.eq(2).text()).toBe('50');
		expect(options.eq(3).text()).toBe('100');
	});

	dt.html('basic');

	it('Change length Menu', function() {
		$('#example').dataTable({
			lengthMenu: [1, 10, 15]
		});

		var options = $('select option');
		expect(options.eq(0).text()).toBe('1');
		expect(options.eq(1).text()).toBe('10');
		expect(options.eq(2).text()).toBe('15');

		expect(options.get(0).value).toBe('1');
		expect(options.get(1).value).toBe('10');
		expect(options.get(2).value).toBe('15');
	});

	dt.html('basic');

	it('Use different language strings', function() {
		$('#example').dataTable({
			lengthMenu: [[10, 25, 50, -1], [10, 25, 50, 'All']]
		});

		var options = $('select option');
		expect(options.eq(0).text()).toBe('10');
		expect(options.eq(1).text()).toBe('25');
		expect(options.eq(2).text()).toBe('50');
		expect(options.eq(3).text()).toBe('All');

		expect(options.get(0).value).toBe('10');
		expect(options.get(1).value).toBe('25');
		expect(options.get(2).value).toBe('50');
		expect(options.get(3).value).toBe('-1');
	});

	dt.html('basic');

	it('Large numbers are formatted for thousands', function() {
		$('#example').dataTable({
			lengthMenu: [[10, 25, 50, 10000, -1], [10, 25, 50, 10000, 'All']]
		});

		var options = $('select option');
		expect(options.eq(0).text()).toBe('10');
		expect(options.eq(1).text()).toBe('25');
		expect(options.eq(2).text()).toBe('50');
		expect(options.eq(3).text()).toBe('10,000');
		expect(options.eq(4).text()).toBe('All');

		expect(options.get(0).value).toBe('10');
		expect(options.get(1).value).toBe('25');
		expect(options.get(2).value).toBe('50');
		expect(options.get(3).value).toBe('10000');
		expect(options.get(4).value).toBe('-1');
	});
});
