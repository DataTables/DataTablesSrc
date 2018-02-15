// todo tests
// - Check it exists and is a function
// - As a getter:
//   - Will return the options specified by the `orderFixed` init option
//     - pre
//     - post
//     - pre and post together
//     - none (`undefined`)
//   - Fixed sorting set with this method will be corrected returned
// - As a setter:
//   - A pre fixed order can be set
//   - A post fixed order can be set
//   - Both pre and post can be set
//   - Returns an API instance

describe('core - order.fixed()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			expect(typeof $('#example').DataTable().order.fixed).toBe('function');
		});

		it('Getter returns a plain object', function() {
			let table = $('#example').DataTable();
			expect($.isPlainObject(table.order.fixed())).toBe(true);
		});

		dt.html('basic');
		it('Setter returns an API instance', function() {
			let table = $('#example').DataTable();
			expect(table.order.fixed({ pre: [0, 'asc'] }) instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Simple tests for the getter behaviour', function() {
		dt.html('basic');
		it('Returns empty object if nothing set', function() {
			let table = $('#example').DataTable();
			expect(JSON.stringify(table.order.fixed())).toBe('{"pre":[]}');
		});

		it('Returns single pre items', function() {
			let table = $('#example').DataTable();
			table.order.fixed({ pre: [1, 'asc'] });
			expect(JSON.stringify(table.order.fixed())).toBe('{"pre":[1,"asc"]}');
		});

		it('Returns two pre items', function() {
			let table = $('#example').DataTable();
			table.order.fixed({ pre: [[1, 'asc'], [2, 'desc']] });
			expect(JSON.stringify(table.order.fixed())).toBe('{"pre":[[1,"asc"],[2,"desc"]]}');
		});

		it('Returns single post item', function() {
			let table = $('#example').DataTable();
			table.order.fixed({ post: [1, 'desc'] });
			expect(JSON.stringify(table.order.fixed())).toBe('{"post":[1,"desc"]}');
		});

		it('Returns two post items', function() {
			let table = $('#example').DataTable();
			table.order.fixed({ post: [[1, 'asc'], [2, 'desc']] });
			expect(JSON.stringify(table.order.fixed())).toBe('{"post":[[1,"asc"],[2,"desc"]]}');
		});

		it('Returns combined pre and post items', function() {
			let table = $('#example').DataTable();
			table.order.fixed({ pre: [1, 'desc'], post: [2, 'asc'] }).draw();
			expect(JSON.stringify(table.order.fixed())).toBe('{"pre":[1,"desc"],"post":[2,"asc"]}');
		});
	});

	describe('Simple setter tests without any other searching enabled', function() {
		dt.html('basic');
		it('Confirm no initial sorting', function() {
			let table = $('#example').DataTable({
				order: []
			});
			expect($('#example tbody tr td:eq(0)').text()).toBe('Tiger Nixon');
		});

		dt.html('basic');
		it('Can clear existing sort', function() {
			let table = $('#example').DataTable();
			table.order.fixed({ pre: [1, 'asc'] });
			table.order.fixed({ post: [] });
			expect(JSON.stringify(table.order.fixed())).toBe('{"post":[]}');
		});

		dt.html('basic');
		it('Single pre item before draw()', function() {
			let table = $('#example').DataTable({
				order: []
			});
			table.order.fixed({ pre: [0, 'asc'] });
			expect($('#example tbody tr td:eq(0)').text()).toBe('Tiger Nixon');
		});

		dt.html('basic');
		it('Single pre item', function() {
			let table = $('#example').DataTable({
				order: []
			});
			table.order.fixed({ pre: [0, 'desc'] }).draw();
			expect($('#example tbody tr td:eq(0)').text()).toBe('Zorita Serrano');
		});

		dt.html('basic');
		it('Two pre items', function() {
			let table = $('#example').DataTable({
				order: []
			});
			table.order.fixed({ pre: [[4, 'desc'], [3, 'asc']] }).draw();
			expect($('#example tbody tr td:eq(0)').text()).toBe('Thor Walton');
		});

		dt.html('basic');
		it('Single post item', function() {
			let table = $('#example').DataTable({
				order: []
			});
			table.order.fixed({ post: [0, 'desc'] }).draw();
			expect($('#example tbody tr td:eq(0)').text()).toBe('Zorita Serrano');
		});

		dt.html('basic');
		it('Two post items', function() {
			let table = $('#example').DataTable({
				order: []
			});
			table.order.fixed({ post: [[2, 'asc'], [3, 'desc']] }).draw();
			expect($('#example tbody tr td:eq(0)').text()).toBe('Tiger Nixon');
		});

		dt.html('basic');
		it('Returns combined pre and post items', function() {
			let table = $('#example').DataTable({
				order: []
			});
			table.order.fixed({ pre: [1, 'desc'], post: [2, 'asc'] }).draw();
			expect($('#example tbody tr td:eq(0)').text()).toBe('Prescott Bartlett');
		});
	});

	describe('Interactions with other sorts', function() {
		dt.html('basic');
		it('Pre with default searching', function() {
			let table = $('#example').DataTable();
			table.order.fixed({ pre: [2, 'desc'] }).draw();
			expect($('#example tbody tr td:eq(0)').text()).toBe('Airi Satou');
		});

		dt.html('basic');
		it('Post with default searching', function() {
			let table = $('#example').DataTable();
			table.order.fixed({ post: [2, 'desc'] }).draw();
			expect($('#example tbody tr td:eq(0)').text()).toBe('Airi Satou');
		});

		dt.html('basic');
		it('Pre with initialisation ordering', function() {
			let table = $('#example').DataTable({
				order: [[2, 'desc']]
			});
			table.order.fixed({ pre: [3, 'desc'] }).draw();
			expect($('#example tbody tr td:eq(0)').text()).toBe('Ashton Cox');
		});

		dt.html('basic');
		it('Post with initialisation ordering', function() {
			let table = $('#example').DataTable({
				order: [[2, 'desc']]
			});
			table.order.fixed({ post: [3, 'desc'] }).draw();
			expect($('#example tbody tr td:eq(0)').text()).toBe('Garrett Winters');
		});

		dt.html('basic');
		it('Pre with API ordering', function() {
			let table = $('#example').DataTable({
				order: []
			});
			table.order([2, 'desc']).draw();
			table.order.fixed({ pre: [3, 'desc'] }).draw();
			expect($('#example tbody tr td:eq(0)').text()).toBe('Ashton Cox');
		});

		dt.html('basic');
		it('Post with API ordering', function() {
			let table = $('#example').DataTable({
				order: []
			});
			table.order([2, 'desc']).draw();
			table.order.fixed({ post: [3, 'desc'] }).draw();
			expect($('#example tbody tr td:eq(0)').text()).toBe('Garrett Winters');
		});
	});
});
