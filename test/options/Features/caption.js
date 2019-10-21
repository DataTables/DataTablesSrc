describe('Caption tag', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	dt.html('basic');

	it('Remains in place when initialised without scrolling - top', function() {
		$('#example').append('<caption>Caption</caption>');
		var table = $('#example').DataTable();

		expect($('caption')[0].parentNode).toBe(table.table().node());
		expect($('caption').css('caption-side')).toBe('top');
	});

	dt.html('basic');

	it('Remains in place when initialised without scrolling - bottom', function() {
		$('#example').append('<caption style="caption-side: bottom;">Caption</caption>');
		var table = $('#example').DataTable();

		expect($('caption')[0].parentNode).toBe(table.table().node());
		expect($('caption').css('caption-side')).toBe('bottom');
	});

	dt.html('basic');

	it('When set to appear above the table, it does when scrolling', function() {
		$('#example').append('<caption>Caption</caption>');
		var table = $('#example').DataTable({
			scrollY: 200
		});

		expect($('caption')[0].parentNode).toBe(table.table().header().parentNode);
		expect($('caption').css('caption-side')).toBe('top');
	});

	dt.html('basic');

	it('When set to appear below the table, it does when scrolling', function() {
		$('#example').append('<caption style="caption-side: bottom;">Caption</caption>');
		var table = $('#example').DataTable({
			scrollY: 200
		});

		expect($('caption')[0].parentNode).toBe(table.table().footer().parentNode);
		expect($('caption').css('caption-side')).toBe('bottom');
	});
});
