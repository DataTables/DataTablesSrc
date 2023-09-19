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
			$('div.dt-scroll-body')
				.scrollLeft(20)
				.trigger('scroll');
			expect($('div.dt-scroll-head').scrollLeft()).toBe(20);
		});

		it('Footer follow x-scrolling', function() {
			expect($('div.dt-scroll-foot').scrollLeft()).toBe(20);
		});

		it('y-scrolling has no effect on header', function() {
			$('div.dt-scroll-body')
				.scrollTop(20)
				.trigger('scroll');
			expect($('div.dt-scroll-head').scrollLeft()).toBe(20);
		});

		it('Filtering results in sets y-scroll back to 0 - Testing DOM', function() {
			$('div.dt-search input')
				.val(1)
				.keyup();
			expect($('div.dt-scroll-head').scrollTop()).toBe(0);
		});

		it('Filter results in sets y-scroll back to 0 - Testing search()', function() {
			$('div.dt-scroll-body')
				.scrollTop(20)
				.trigger('scroll');
			$('#example')
				.DataTable()
				.search('1')
				.draw();
			expect($('div.dt-scroll-head').scrollTop()).toBe(0);
		});

		it('Filtering has no effect on x-scroll', function() {
			expect($('div.dt-scroll-body').scrollLeft()).toBe(20);
		});

		it('Full right x-scroll with manual trigger has header track all the way with the body', function() {
			$('div.dt-scroll-body')
				.scrollLeft($('#example').width() - $('div.dt-scroll-body')[0].clientWidth)
				.trigger('scroll');
			expect($('div.dt-scroll-body').scrollLeft()).toBe($('div.dt-scroll-head').scrollLeft());
		});

		it('Footer with manual trigger also tracked all the way', function() {
			expect($('div.dt-scroll-body').scrollLeft()).toBe($('div.dt-scroll-foot').scrollLeft());
		});

		it('Full left x-scroll with timeout has header track all the way with the body', function(done) {
			$('div.dt-scroll-body').scrollLeft(0);
			setTimeout(function() {
				expect($('div.dt-scroll-body').scrollLeft()).toBe($('div.dt-scroll-head').scrollLeft());
				done();
			}, 250);
		});

		it('Footer with timeout also tracked all the way', function() {
			expect($('div.dt-scroll-body').scrollLeft()).toBe($('div.dt-scroll-foot').scrollLeft());
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
			expect($('div.dt-scroll-body').outerWidth()).toBe(800);
		});

		it('Unaltered when filter applied', function() {
			$('div.dt-search input')
				.val('47')
				.keyup();
			expect($('div.dt-scroll-body').width()).toBe(800);
		});
	});
});
