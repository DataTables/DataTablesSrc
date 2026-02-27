describe('core - events - childRow', function () {
	const barWidth = 15;
	let Dom;

	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	dt.html('empty');

	it('Setup', function () {
		Dom = DataTable.Dom;

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
		expect($('#content-box-no-scroll').height()).toBe(200);
		expect($('#border-box-no-scroll').height()).toBe(50);
		expect($('#content-box-scroll').height()).toBe(200 - barWidth);
		expect($('#border-box-scroll').height()).toBe(50); // https://github.com/jquery/jquery/issues/4255
	});

	it('Dom.height - content only', function () {
		expect(Dom.s('#content-box-no-scroll').height()).toBe(200);
		expect(Dom.s('#border-box-no-scroll').height()).toBe(50);
		expect(Dom.s('#content-box-scroll').height()).toBe(200 - barWidth);
		expect(Dom.s('#border-box-scroll').height()).toBe(50 - barWidth); // Different from jQuery!
	});

	it('$.innerHeight - content + padding', function () {
		expect($('#content-box-no-scroll').innerHeight()).toBe(250);
		expect($('#border-box-no-scroll').innerHeight()).toBe(100);
		expect($('#content-box-scroll').innerHeight()).toBe(250);
		expect($('#border-box-scroll').innerHeight()).toBe(100);
	});

	it('Dom.height(withPadding | inner) - content + padding', function () {
		expect(Dom.s('#content-box-no-scroll').height('withPadding')).toBe(250);
		expect(Dom.s('#border-box-no-scroll').height('withPadding')).toBe(100);
		expect(Dom.s('#content-box-scroll').height('withPadding')).toBe(250);
		expect(Dom.s('#border-box-scroll').height('withPadding')).toBe(100);
	});

	it('$.outerHeight - content + padding + border', function () {
		expect($('#content-box-no-scroll').outerHeight()).toBe(350);
		expect($('#border-box-no-scroll').outerHeight()).toBe(200);
		expect($('#content-box-scroll').outerHeight()).toBe(350);
		expect($('#border-box-scroll').outerHeight()).toBe(200);
	});

	it('Dom.height(withBorder | outer) - content + padding + border', function () {
		expect(Dom.s('#content-box-no-scroll').height('withBorder')).toBe(350);
		expect(Dom.s('#border-box-no-scroll').height('withBorder')).toBe(200);
		expect(Dom.s('#content-box-scroll').height('withBorder')).toBe(350);
		expect(Dom.s('#border-box-scroll').height('withBorder')).toBe(200);
	});

	it('$.outerHeight(true) - content + padding + border', function () {
		expect($('#content-box-no-scroll').outerHeight(true)).toBe(410);
		expect($('#border-box-no-scroll').outerHeight(true)).toBe(260);
		expect($('#content-box-scroll').outerHeight(true)).toBe(410);
		expect($('#border-box-scroll').outerHeight(true)).toBe(260);
	});

	it('Dom.height(withMargin) - content + padding + border', function () {
		expect(Dom.s('#content-box-no-scroll').height('withMargin')).toBe(410);
		expect(Dom.s('#border-box-no-scroll').height('withMargin')).toBe(260);
		expect(Dom.s('#content-box-scroll').height('withMargin')).toBe(410);
		expect(Dom.s('#border-box-scroll').height('withMargin')).toBe(260);
	});
});