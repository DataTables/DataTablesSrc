describe('core - events - childRow', function () {
	const barWidth = 15;
	let dom;

	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	dt.html('empty');

	it('Setup', function () {
		dom = DataTable.dom;

		$(`<div>
			<div id="content-box-no-scroll" style="box-sizing: content-box; width: 200px; height: 200px; padding: 25px; border: 50px solid red;  margin: 30px; background: green">
			box-sizing: content-box;
			</div>
			
			<div id="border-box-no-scroll" style="box-sizing: border-box; width: 200px; height: 200px; padding: 25px; border: 50px solid red;  margin: 30px; background: green">
			box-sizing: border-box;
			</div>
			
			<div id="content-box-scroll" style="box-sizing: content-box; overflow: scroll; width: 200px; height: 200px; padding: 25px; border: 50px solid red;  margin: 30px; background: green">
			box-sizing: content-box;
				<div style="height: 300px; width: 300px;"></div>
			</div>
			
			<div id="border-box-scroll" style="box-sizing: border-box; overflow: scroll; width: 200px; height: 200px; padding: 25px; border: 50px solid red;  margin: 30px; background: green">
			box-sizing: border-box;
				<div style="height: 300px; width: 300px;"></div>
			</div>
		</div>`).insertAfter('table');
	});

	it('$.width - content only', function () {
		expect($('#content-box-no-scroll').width()).toBe(200);
		expect($('#border-box-no-scroll').width()).toBe(50);
		expect($('#content-box-scroll').width()).toBe(200 - barWidth);
		expect($('#border-box-scroll').width()).toBe(50); // https://github.com/jquery/jquery/issues/4255
	});

	it('Dom.width - content only', function () {
		expect(dom.s('#content-box-no-scroll').width()).toBe(200);
		expect(dom.s('#border-box-no-scroll').width()).toBe(50);
		expect(dom.s('#content-box-scroll').width()).toBe(200 - barWidth);
		expect(dom.s('#border-box-scroll').width()).toBe(50 - barWidth); // Different from jQuery!
	});

	it('$.innerWidth - content + padding', function () {
		expect($('#content-box-no-scroll').innerWidth()).toBe(250);
		expect($('#border-box-no-scroll').innerWidth()).toBe(100);
		expect($('#content-box-scroll').innerWidth()).toBe(250);
		expect($('#border-box-scroll').innerWidth()).toBe(100);
	});

	it('Dom.width(withPadding | inner) - content + padding', function () {
		expect(dom.s('#content-box-no-scroll').width('withPadding')).toBe(250);
		expect(dom.s('#border-box-no-scroll').width('withPadding')).toBe(100);
		expect(dom.s('#content-box-scroll').width('withPadding')).toBe(250);
		expect(dom.s('#border-box-scroll').width('withPadding')).toBe(100);
	});

	it('$.outerWidth - content + padding + border', function () {
		expect($('#content-box-no-scroll').outerWidth()).toBe(350);
		expect($('#border-box-no-scroll').outerWidth()).toBe(200);
		expect($('#content-box-scroll').outerWidth()).toBe(350);
		expect($('#border-box-scroll').outerWidth()).toBe(200);
	});

	it('Dom.width(withBorder | outer) - content + padding + border', function () {
		expect(dom.s('#content-box-no-scroll').width('withBorder')).toBe(350);
		expect(dom.s('#border-box-no-scroll').width('withBorder')).toBe(200);
		expect(dom.s('#content-box-scroll').width('withBorder')).toBe(350);
		expect(dom.s('#border-box-scroll').width('withBorder')).toBe(200);
	});

	it('$.outerWidth(true) - content + padding + border', function () {
		expect($('#content-box-no-scroll').outerWidth(true)).toBe(410);
		expect($('#border-box-no-scroll').outerWidth(true)).toBe(260);
		expect($('#content-box-scroll').outerWidth(true)).toBe(410);
		expect($('#border-box-scroll').outerWidth(true)).toBe(260);
	});

	it('Dom.width(withMargin) - content + padding + border', function () {
		expect(dom.s('#content-box-no-scroll').width('withMargin')).toBe(410);
		expect(dom.s('#border-box-no-scroll').width('withMargin')).toBe(260);
		expect(dom.s('#content-box-scroll').width('withMargin')).toBe(410);
		expect(dom.s('#border-box-scroll').width('withMargin')).toBe(260);
	});
});