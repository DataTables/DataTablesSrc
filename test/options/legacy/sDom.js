describe('Legacy sDom option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check Default', function () {
		dt.html('basic');

		it('layout default', function() {
			let table = $('table').DataTable();
			let nodes = $('div.dt-layout-cell').children();

			let length = document.getElementsByClassName('dt-length');
			let filter = document.getElementsByClassName('dt-search');
			let info = document.getElementsByClassName('dt-info');
			let paging = document.getElementsByClassName('dt-paging');
			let t = document.getElementsByClassName('dataTable');

			expect(nodes[0]).toBe(length[0]);
			expect(nodes[1]).toBe(filter[0]);
			expect(nodes[2]).toBe(t[0]);
			expect(nodes[3]).toBe(info[0]);
			expect(nodes[4]).toBe(paging[0]);
		});

		dt.html('basic');

		it('Set with legacy parameter', function () {
			let table = $('table').DataTable({
				dom: 'lfrtip'
			});

			let nNodes = $('div.dt-container div:not(.dt-autosize, .dt-column-header, .dt-column-footer), div.dt-container table');

			let nLength = document.getElementsByClassName('dt-length');
			let nFilter = document.getElementsByClassName('dt-search');
			let nInfo = document.getElementsByClassName('dt-info');
			let nPaging = document.getElementsByClassName('dt-paging');
			let nTable = document.getElementsByClassName('dataTable');

			expect(nNodes[0]).toBe(nLength[0]);
			expect(nNodes[1]).toBe(nFilter[0]);
			expect(nNodes[2]).toBe(nTable[0]);
			expect(nNodes[3]).toBe(nInfo[0]);
			expect(nNodes[4]).toBe(nPaging[0]);
		});

		dt.html('basic');

		it('Set with legacy default', function () {
			DataTable.defaults.sDom = 'lt';

			let table = $('table').DataTable();

			let nNodes = $('div.dt-container div:not(.dt-autosize, .dt-column-header, .dt-column-footer), div.dt-container table');

			let nLength = document.getElementsByClassName('dt-length');
			let nTable = document.getElementsByClassName('dataTable');

			expect(nNodes[0]).toBe(nLength[0]);
			expect(nNodes[1]).toBe(nTable[0]);
		});

		dt.html('basic');

		it('Remove default', function() {
			delete DataTable.defaults.sDom;
			DataTable.defaults.dom = null;

			let table = $('table').DataTable();
			let nodes = $('div.dt-layout-cell').children();

			let length = document.getElementsByClassName('dt-length');
			let filter = document.getElementsByClassName('dt-search');
			let info = document.getElementsByClassName('dt-info');
			let paging = document.getElementsByClassName('dt-paging');
			let t = document.getElementsByClassName('dataTable');

			expect(nodes[0]).toBe(length[0]);
			expect(nodes[1]).toBe(filter[0]);
			expect(nodes[2]).toBe(t[0]);
			expect(nodes[3]).toBe(info[0]);
			expect(nodes[4]).toBe(paging[0]);
		});
	});
});
