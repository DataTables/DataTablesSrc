describe('scrollY / X option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});
	describe('XY tests', function() {
		dt.html('basic');
		it('Header follows x-scrolling', function() {
			$('body').css('white-space', 'nowrap');
			dt.container().css('width', 400);
			$('#example').dataTable({
				scrollX: true,
				scrollY: '200px',
				paginate: false
			});
			$('div.dataTables_scrollBody')
				.scrollLeft(20)
				.trigger('scroll');
			expect($('div.dataTables_scrollHead').scrollLeft()).toBe(20);
		});

		it('Footer follow x-scrolling', function() {
			expect($('div.dataTables_scrollFoot').scrollLeft()).toBe(20);
		});

		it('y-scrolling has no effect on header', function() {
			$('div.dataTables_scrollBody')
				.scrollTop(20)
				.trigger('scroll');
			expect($('div.dataTables_scrollHead').scrollLeft()).toBe(20);
		});

		it('Filtering results in sets y-scroll back to 0 - Testing DOM', function() {
			$('div.dataTables_filter input')
				.val(1)
				.keyup();
			expect($('div.dataTables_scrollHead').scrollTop()).toBe(0);
		});

		it('Filter results in sets y-scroll back to 0 - Testing search()', function() {
			$('div.dataTables_scrollBody')
				.scrollTop(20)
				.trigger('scroll');
			$('#example')
				.DataTable()
				.search('1')
				.draw();
			expect($('div.dataTables_scrollHead').scrollTop()).toBe(0);
		});

		it('Filtering has no effect on x-scroll', function() {
			expect($('div.dataTables_scrollBody').scrollLeft()).toBe(20);
		});

		it('Full right x-scroll with manual trigger has header track all the way with the body', function() {
			$('div.dataTables_scrollBody')
				.scrollLeft($('#example').width() - $('div.dataTables_scrollBody')[0].clientWidth)
				.trigger('scroll');
			expect($('div.dataTables_scrollBody').scrollLeft()).toBe($('div.dataTables_scrollHead').scrollLeft());
		});

		it('Footer with manual trigger also tracked all the way', function() {
			expect($('div.dataTables_scrollBody').scrollLeft()).toBe($('div.dataTables_scrollFoot').scrollLeft());
		});

		it('Full left x-scroll with timeout has header track all the way with the body', function(done) {
			$('div.dataTables_scrollBody').scrollLeft(0);
			setTimeout(function() {
				expect($('div.dataTables_scrollBody').scrollLeft()).toBe($('div.dataTables_scrollHead').scrollLeft());
				done();
			}, 250);
		});

		it('Footer with timeout also tracked all the way', function() {
			expect($('div.dataTables_scrollBody').scrollLeft()).toBe($('div.dataTables_scrollFoot').scrollLeft());
		});

		it("Don't throw an error if initialising again on id selected element // Not sure about this one", function() {
			$('#example').dataTable();
			expect($('#example').dataTable()).toBeTruthy();
		});

		it("Don't throw an error if initialising again on tag name selected element- picking up header table as well", function() {
			$('table.dataTable').dataTable();
			expect($('table.dataTable').dataTable()).toBeTruthy();
		});
	});

	describe("5508- Table container width doesn't change when filtering applied to scrolling table ", function() {
		dt.html('basic');

		it('Width of container 800px on init with scroll', function() {
			dt.container().css('width', 800);
			$('#example').dataTable({
				scrollY: '300px',
				paginate: false
			});
			expect($('div.dataTables_scrollBody').outerWidth()).toBe(800);
		});

		it('Unaltered when filter applied', function() {
			$('div.dataTables_filter input')
				.val('47')
				.keyup();
			expect($('div.dataTables_scrollBody').width()).toBe(800);
		});
	});
});
