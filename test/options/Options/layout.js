describe('layout option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Default value', function() {
			expect(DataTable.defaults.layout).toEqual({
				topStart: 'pageLength',
				topEnd: 'search',
				bottomStart: 'info',
				bottomEnd: 'paging'
			});
		});

		it('Default DOM in document in correct order', function() {
			var table = $('table').DataTable();
			var nodes = $('div.dt-layout-cell').children();

			var length = document.getElementsByClassName('dt-length');
			var filter = document.getElementsByClassName('dt-search');
			var info = document.getElementsByClassName('dt-info');
			var paging = document.getElementsByClassName('dt-paging');
			var table = document.getElementsByClassName('dataTable');

			expect(nodes[0]).toBe(length[0]);
			expect(nodes[1]).toBe(filter[0]);
			expect(nodes[2]).toBe(table[0]);
			expect(nodes[3]).toBe(info[0]);
			expect(nodes[4]).toBe(paging[0]);
		});

		dt.html('basic');
		it('Check no length element', function() {
			$('table').dataTable({
				layout: {
					topStart: null
				}
			});

			var nodes = $('div.dt-layout-cell').children();
			var length = document.getElementsByClassName('dt-length');
			var filter = document.getElementsByClassName('dt-search');
			var info = document.getElementsByClassName('dt-info');
			var paging = document.getElementsByClassName('dt-paging');
			var table = document.getElementsByClassName('dataTable');

			expect(undefined).toBe(length[0]);
			expect(nodes[0]).toBe(filter[0]);
			expect(nodes[1]).toBe(table[0]);
			expect(nodes[2]).toBe(info[0]);
			expect(nodes[3]).toBe(paging[0]);
		});

		dt.html('basic');
		it('Check no filter element', function() {
			$('table').dataTable({
				layout: {
					topEnd: null
				}
			});

			var nodes = $('div.dt-layout-cell').children();
			var length = document.getElementsByClassName('dt-length');
			var filter = document.getElementsByClassName('dt-search');
			var info = document.getElementsByClassName('dt-info');
			var paging = document.getElementsByClassName('dt-paging');
			var table = document.getElementsByClassName('dataTable');

			expect(nodes[0]).toBe(length[0]);
			expect(undefined).toBe(filter[0]);
			expect(nodes[1]).toBe(table[0]);
			expect(nodes[2]).toBe(info[0]);
			expect(nodes[3]).toBe(paging[0]);
		});

		dt.html('basic');
		it('Check no info element', function() {
			$('table').dataTable({
				layout: {
					bottomStart: null
				}
			});

			var nodes = $('div.dt-layout-cell').children();
			var length = document.getElementsByClassName('dt-length');
			var filter = document.getElementsByClassName('dt-search');
			var info = document.getElementsByClassName('dt-info');
			var paging = document.getElementsByClassName('dt-paging');
			var table = document.getElementsByClassName('dataTable');

			expect(nodes[0]).toBe(length[0]);
			expect(nodes[1]).toBe(filter[0]);
			expect(nodes[2]).toBe(table[0]);
			expect(undefined).toBe(info[0]);
			expect(nodes[3]).toBe(paging[0]);
		});

		dt.html('basic');
		it('Check no paging element', function() {
			$('table').dataTable({
				bottomEnd: null
			});

			var nodes = $('div.dt-layout-cell').children();
			var length = document.getElementsByClassName('dt-length');
			var filter = document.getElementsByClassName('dt-search');
			var info = document.getElementsByClassName('dt-info');
			var paging = document.getElementsByClassName('dt-paging');
			var table = document.getElementsByClassName('dataTable');

			expect(nodes[0]).toBe(length[0]);
			expect(nodes[1]).toBe(filter[0]);
			expect(nodes[2]).toBe(table[0]);
			expect(nodes[3]).toBe(info[0]);
			expect(nodes[4]).toBe(paging[0]);
		});


		dt.html('basic');
		it('feature - repeated info', function() {
			$('table').dataTable({
				layout: {
					topEnd: 'info'
				}
			});
			
			var nodes = $('div.dt-layout-cell').children();
			var length = document.getElementsByClassName('dt-length');
			var filter = document.getElementsByClassName('dt-search');
			var info = document.getElementsByClassName('dt-info');
			var paging = document.getElementsByClassName('dt-paging');
			var table = document.getElementsByClassName('dataTable');

			expect(filter.length).toBe(0);
			expect(nodes[0]).toBe(length[0]);
			expect(nodes[1]).toBe(info[0]);
			expect(nodes[2]).toBe(table[0]);
			expect(nodes[3]).toBe(info[1]);
			expect(nodes[4]).toBe(paging[0]);
		});

		dt.html('basic');
		it('feature - repeated pageLength', function() {
			$('table').dataTable({
				layout: {
					topEnd: 'pageLength'
				}
			});
			
			var nodes = $('div.dt-layout-cell').children();
			var length = document.getElementsByClassName('dt-length');
			var filter = document.getElementsByClassName('dt-search');
			var info = document.getElementsByClassName('dt-info');
			var paging = document.getElementsByClassName('dt-paging');
			var table = document.getElementsByClassName('dataTable');

			expect(filter.length).toBe(0);
			expect(nodes[0]).toBe(length[0]);
			expect(nodes[1]).toBe(length[1]);
			expect(nodes[2]).toBe(table[0]);
			expect(nodes[3]).toBe(info[0]);
			expect(nodes[4]).toBe(paging[0]);
		});

		dt.html('basic');
		it('feature - repeated pageLength', function() {
			$('table').dataTable({
				layout: {
					topEnd: 'paging'
				}
			});
			
			var nodes = $('div.dt-layout-cell').children();
			var length = document.getElementsByClassName('dt-length');
			var filter = document.getElementsByClassName('dt-search');
			var info = document.getElementsByClassName('dt-info');
			var paging = document.getElementsByClassName('dt-paging');
			var table = document.getElementsByClassName('dataTable');

			expect(filter.length).toBe(0);
			expect(nodes[0]).toBe(length[0]);
			expect(nodes[1]).toBe(paging[0]);
			expect(nodes[2]).toBe(table[0]);
			expect(nodes[3]).toBe(info[0]);
			expect(nodes[4]).toBe(paging[1]);
		});

		dt.html('basic');
		it('feature - repeated search', function() {
			$('table').dataTable({
				layout: {
					topStart: 'search'
				}
			});
			
			var nodes = $('div.dt-layout-cell').children();
			var length = document.getElementsByClassName('dt-length');
			var filter = document.getElementsByClassName('dt-search');
			var info = document.getElementsByClassName('dt-info');
			var paging = document.getElementsByClassName('dt-paging');
			var table = document.getElementsByClassName('dataTable');

			expect(length.length).toBe(0);
			expect(nodes[0]).toBe(filter[0]);
			expect(nodes[1]).toBe(filter[1]);
			expect(nodes[2]).toBe(table[0]);
			expect(nodes[3]).toBe(info[0]);
			expect(nodes[4]).toBe(paging[0]);
		});


		dt.html('basic');
		it('object - feature options', function() {
			$('table').dataTable({
				layout: {
					topStart: {
						search: {}
					}
				}
			});
			
			var nodes = $('div.dt-layout-cell').children();
			var length = document.getElementsByClassName('dt-length');
			var filter = document.getElementsByClassName('dt-search');
			var info = document.getElementsByClassName('dt-info');
			var paging = document.getElementsByClassName('dt-paging');
			var table = document.getElementsByClassName('dataTable');

			expect(length.length).toBe(0);
			expect(nodes[0]).toBe(filter[0]);
			expect(nodes[1]).toBe(filter[1]);
			expect(nodes[2]).toBe(table[0]);
			expect(nodes[3]).toBe(info[0]);
			expect(nodes[4]).toBe(paging[0]);
		});


		dt.html('basic');
		it('jQuery - custom node', function() {
			var insert = $('<div>').addClass('test');
			$('table').dataTable({
				layout: {
					topStart: insert
				}
			});
			
			var nodes = $('div.dt-layout-cell').children();
			var length = document.getElementsByClassName('dt-length');
			var filter = document.getElementsByClassName('dt-search');
			var info = document.getElementsByClassName('dt-info');
			var paging = document.getElementsByClassName('dt-paging');
			var table = document.getElementsByClassName('dataTable');

			expect(length.length).toBe(0);
			expect(nodes[0]).toBe(insert[0]);
			expect(nodes[1]).toBe(filter[0]);
			expect(nodes[2]).toBe(table[0]);
			expect(nodes[3]).toBe(info[0]);
			expect(nodes[4]).toBe(paging[0]);
		});


		dt.html('basic');
		it('node - custom node', function() {
			var insert = document.createElement('div');

			$('table').dataTable({
				layout: {
					topStart: insert
				}
			});
			
			var nodes = $('div.dt-layout-cell').children();
			var length = document.getElementsByClassName('dt-length');
			var filter = document.getElementsByClassName('dt-search');
			var info = document.getElementsByClassName('dt-info');
			var paging = document.getElementsByClassName('dt-paging');
			var table = document.getElementsByClassName('dataTable');

			expect(length.length).toBe(0);
			expect(nodes[0]).toBe(insert);
			expect(nodes[1]).toBe(filter[0]);
			expect(nodes[2]).toBe(table[0]);
			expect(nodes[3]).toBe(info[0]);
			expect(nodes[4]).toBe(paging[0]);
		});


		dt.html('basic');
		it('function - returning a node', function() {
			var insert;

			$('table').dataTable({
				layout: {
					topStart: function () {
						var div = document.createElement('div');

						insert = div;

						return div;
					}
				}
			});
			
			var nodes = $('div.dt-layout-cell').children();
			var length = document.getElementsByClassName('dt-length');
			var filter = document.getElementsByClassName('dt-search');
			var info = document.getElementsByClassName('dt-info');
			var paging = document.getElementsByClassName('dt-paging');
			var table = document.getElementsByClassName('dataTable');

			expect(length.length).toBe(0);
			expect(nodes[0]).toBe(insert);
			expect(nodes[1]).toBe(filter[0]);
			expect(nodes[2]).toBe(table[0]);
			expect(nodes[3]).toBe(info[0]);
			expect(nodes[4]).toBe(paging[0]);
		});


		dt.html('basic');
		it('object - class instance with a `node` method', function() {
			var insert;
			var Animal = function (name) {
				this.name = name;
				this.node = function () {
					var div = document.createElement('div');

					div.classList.add('test');
					div.innerHTML = this.name;
					insert = div;

					return div;
				};
			};

			$('table').dataTable({
				layout: {
					topStart: new Animal('Dog')
				}
			});
			
			var nodes = $('div.dt-layout-cell').children();
			var length = document.getElementsByClassName('dt-length');
			var filter = document.getElementsByClassName('dt-search');
			var info = document.getElementsByClassName('dt-info');
			var paging = document.getElementsByClassName('dt-paging');
			var table = document.getElementsByClassName('dataTable');

			expect(length.length).toBe(0);
			expect(insert.textContent).toBe('Dog');
			expect(nodes[0]).toBe(insert);
			expect(nodes[1]).toBe(filter[0]);
			expect(nodes[2]).toBe(table[0]);
			expect(nodes[3]).toBe(info[0]);
			expect(nodes[4]).toBe(paging[0]);
		});


		dt.html('basic');
		it('array - feature string and custom', function() {
			var insert = document.createElement('div');

			$('table').dataTable({
				layout: {
					topStart: [
						'pageLength',
						insert
					]
				}
			});
			
			var nodes = $('div.dt-layout-cell').children();
			var length = document.getElementsByClassName('dt-length');
			var filter = document.getElementsByClassName('dt-search');
			var info = document.getElementsByClassName('dt-info');
			var paging = document.getElementsByClassName('dt-paging');
			var table = document.getElementsByClassName('dataTable');

			expect(nodes[0]).toBe(length[0]);
			expect(nodes[1]).toBe(insert);
			expect(nodes[2]).toBe(filter[0]);
			expect(nodes[3]).toBe(table[0]);
			expect(nodes[4]).toBe(info[0]);
			expect(nodes[5]).toBe(paging[0]);
		});

		dt.html('basic');
		it('array - feature string twice', function() {
			$('table').dataTable({
				layout: {
					topStart: [
						'pageLength',
						'pageLength'
					]
				}
			});
			
			var nodes = $('div.dt-layout-cell').children();
			var length = document.getElementsByClassName('dt-length');
			var filter = document.getElementsByClassName('dt-search');
			var info = document.getElementsByClassName('dt-info');
			var paging = document.getElementsByClassName('dt-paging');
			var table = document.getElementsByClassName('dataTable');

			expect(nodes[0]).toBe(length[0]);
			expect(nodes[1]).toBe(length[1]);
			expect(nodes[2]).toBe(filter[0]);
			expect(nodes[3]).toBe(table[0]);
			expect(nodes[4]).toBe(info[0]);
			expect(nodes[5]).toBe(paging[0]);
		});

		dt.html('basic');
		it('array - objects', function() {
			$('table').dataTable({
				layout: {
					topStart: [
						{search: {text: 'Test1'}},
						{search: {text: 'Test2'}},
					]
				}
			});
			
			var nodes = $('div.dt-layout-cell').children();

			nodes.eq(0).children(0).text('Test1');
			nodes.eq(0).children(1).text('Test2');
		});



		dt.html('basic');
		it('multirow - showing features multiple times above table', function() {
			$('table').dataTable({
				layout: {
					top2Start: 'pageLength'
				}
			});
			
			var nodes = $('div.dt-layout-cell').children();
			var length = document.getElementsByClassName('dt-length');
			var filter = document.getElementsByClassName('dt-search');
			var info = document.getElementsByClassName('dt-info');
			var paging = document.getElementsByClassName('dt-paging');
			var table = document.getElementsByClassName('dataTable');

			expect(nodes[0]).toBe(length[0]);
			expect(nodes[1]).toBe(length[1]);
			expect(nodes[2]).toBe(filter[0]);
			expect(nodes[3]).toBe(table[0]);
			expect(nodes[4]).toBe(info[0]);
			expect(nodes[5]).toBe(paging[0]);
		});

		dt.html('basic');
		it('multirow - custom element', function() {
			var insert = document.createElement('div');

			$('table').dataTable({
				layout: {
					top2Start: insert
				}
			});
			
			var nodes = $('div.dt-layout-cell').children();
			var length = document.getElementsByClassName('dt-length');
			var filter = document.getElementsByClassName('dt-search');
			var info = document.getElementsByClassName('dt-info');
			var paging = document.getElementsByClassName('dt-paging');
			var table = document.getElementsByClassName('dataTable');

			expect(nodes[0]).toBe(insert);
			expect(nodes[1]).toBe(length[0]);
			expect(nodes[2]).toBe(filter[0]);
			expect(nodes[3]).toBe(table[0]);
			expect(nodes[4]).toBe(info[0]);
			expect(nodes[5]).toBe(paging[0]);
		});

		dt.html('basic');
		it('multirow - showing features multiple times below table', function() {
			$('table').dataTable({
				layout: {
					bottom2Start: 'pageLength'
				}
			});
			
			var nodes = $('div.dt-layout-cell').children();
			var length = document.getElementsByClassName('dt-length');
			var filter = document.getElementsByClassName('dt-search');
			var info = document.getElementsByClassName('dt-info');
			var paging = document.getElementsByClassName('dt-paging');
			var table = document.getElementsByClassName('dataTable');

			expect(nodes[0]).toBe(length[0]);
			expect(nodes[1]).toBe(filter[0]);
			expect(nodes[2]).toBe(table[0]);
			expect(nodes[3]).toBe(info[0]);
			expect(nodes[4]).toBe(paging[0]);
			expect(nodes[5]).toBe(length[1]);
		});


		dt.html('basic');
		it('fullrow - custom element is before split for the row when above the table', function() {
			var insert = document.createElement('div');

			$('table').dataTable({
				layout: {
					top: insert
				}
			});
			
			var nodes = $('div.dt-layout-cell').children();
			var length = document.getElementsByClassName('dt-length');
			var filter = document.getElementsByClassName('dt-search');
			var info = document.getElementsByClassName('dt-info');
			var paging = document.getElementsByClassName('dt-paging');
			var table = document.getElementsByClassName('dataTable');

			expect(nodes[0]).toBe(insert);
			expect(nodes[1]).toBe(length[0]);
			expect(nodes[2]).toBe(filter[0]);
			expect(nodes[3]).toBe(table[0]);
			expect(nodes[4]).toBe(info[0]);
			expect(nodes[5]).toBe(paging[0]);
		});

		dt.html('basic');
		it('fullrow - custom element is below split for the row when below the table', function() {
			var insert = document.createElement('div');

			$('table').dataTable({
				layout: {
					bottom: insert
				}
			});
			
			var nodes = $('div.dt-layout-cell').children();
			var length = document.getElementsByClassName('dt-length');
			var filter = document.getElementsByClassName('dt-search');
			var info = document.getElementsByClassName('dt-info');
			var paging = document.getElementsByClassName('dt-paging');
			var table = document.getElementsByClassName('dataTable');

			expect(nodes[0]).toBe(length[0]);
			expect(nodes[1]).toBe(filter[0]);
			expect(nodes[2]).toBe(table[0]);
			expect(nodes[3]).toBe(insert);
			expect(nodes[4]).toBe(info[0]);
			expect(nodes[5]).toBe(paging[0]);
		});

		dt.html('basic');
		it('fullrow - custom element is after the previous split row', function() {
			var insert = document.createElement('div');

			$('table').dataTable({
				layout: {
					top2Start: 'info',
					top: insert
				}
			});
			
			var nodes = $('div.dt-layout-cell').children();
			var length = document.getElementsByClassName('dt-length');
			var filter = document.getElementsByClassName('dt-search');
			var info = document.getElementsByClassName('dt-info');
			var paging = document.getElementsByClassName('dt-paging');
			var table = document.getElementsByClassName('dataTable');

			expect(nodes[0]).toBe(info[0]);
			expect(nodes[1]).toBe(insert);
			expect(nodes[2]).toBe(length[0]);
			expect(nodes[3]).toBe(filter[0]);
			expect(nodes[4]).toBe(table[0]);
			expect(nodes[5]).toBe(info[1]);
			expect(nodes[6]).toBe(paging[0]);
		});
	});
});
