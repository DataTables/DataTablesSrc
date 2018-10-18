describe('DOM option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Default DOM variable', function() {
			var table = $('table').DataTable();
			expect(table.settings()[0].sDom).toBe('lfrtip');
		});
		it('Default DOM in document in correct order', function() {
			var nNodes = $('div.dataTables_wrapper div, div.dataTables_wrapper table');

			var nLength = document.getElementsByClassName('dataTables_length');
			var nFilter = document.getElementsByClassName('dataTables_filter');
			var nInfo = document.getElementsByClassName('dataTables_info');
			var nPaging = document.getElementsByClassName('dataTables_paginate');
			var nTable = document.getElementsByClassName('dataTable');

			expect(nNodes[0]).toBe(nLength[0]);
			expect(nNodes[1]).toBe(nFilter[0]);
			expect(nNodes[2]).toBe(nTable[0]);
			expect(nNodes[3]).toBe(nInfo[0]);
			expect(nNodes[4]).toBe(nPaging[0]);
		});

		dt.html('basic');
		it('Check example 1 in code propogates', function() {
			var table = $('table').DataTable({
				dom: '<"wrapper"flipt>'
			});
			expect(table.settings()[0].sDom).toBe('<"wrapper"flipt>');
		});
		it('Check example 1 in DOM', function() {
			var jqNodes = $('div.dataTables_wrapper div, div.dataTables_wrapper table');
			var nNodes = [];
			for (var i = 0, iLen = jqNodes.length; i < iLen; i++) {
				nNodes.push(jqNodes[i]);
			}

			var nLength = document.getElementsByClassName('dataTables_length');
			var nFilter = document.getElementsByClassName('dataTables_filter');
			var nInfo = document.getElementsByClassName('dataTables_info');
			var nPaging = document.getElementsByClassName('dataTables_paginate');
			var nTable = document.getElementsByClassName('dataTable');
			var nCustomWrapper = $('div.wrapper')[0];

			expect(nNodes[0]).toBe(nCustomWrapper);
			expect(nNodes[1]).toBe(nFilter[0]);
			expect(nNodes[2]).toBe(nLength[0]);
			expect(nNodes[3]).toBe(nInfo[0]);
			expect(nNodes[4]).toBe(nPaging[0]);
			expect(nNodes[5]).toBe(nTable[0]);
		});

		dt.html('basic');
		it('Check example 2 in DOM', function() {
			$('table').dataTable({
				dom: '<lf<t>ip>'
			});
			var jqNodes = $('div.dataTables_wrapper div, div.dataTables_wrapper table');
			var nNodes = [];
			var nCustomWrappers = [];

			/* Strip the paging nodes */
			for (var i = 0, iLen = jqNodes.length; i < iLen; i++) {
				nNodes.push(jqNodes[i]);

				/* Only the two custom divs don't have class names */
				if (jqNodes[i].className == '') {
					nCustomWrappers.push(jqNodes[i]);
				}
			}

			var nLength = document.getElementsByClassName('dataTables_length');
			var nFilter = document.getElementsByClassName('dataTables_filter');
			var nInfo = document.getElementsByClassName('dataTables_info');
			var nPaging = document.getElementsByClassName('dataTables_paginate');
			var nTable = document.getElementsByClassName('dataTable');

			expect(nNodes[0]).toBe(nCustomWrappers[0]);
			expect(nNodes[1]).toBe(nLength[0]);
			expect(nNodes[2]).toBe(nFilter[0]);
			expect(nNodes[3]).toBe(nCustomWrappers[1]);
			expect(nNodes[4]).toBe(nTable[0]);
			expect(nNodes[5]).toBe(nInfo[0]);
			expect(nNodes[6]).toBe(nPaging[0]);
		});

		dt.html('basic');
		it('Check no length element', function() {
			$('table').dataTable({
				dom: 'frtip'
			});
			var nNodes = $('div.dataTables_wrapper div, div.dataTables_wrapper table');
			var nLength = document.getElementsByClassName('dataTables_length');
			var nFilter = document.getElementsByClassName('dataTables_filter');
			var nInfo = document.getElementsByClassName('dataTables_info');
			var nPaging = document.getElementsByClassName('dataTables_paginate');
			var nTable = document.getElementsByClassName('dataTable');

			expect(undefined).toBe(nLength[0]);
			expect(nNodes[0]).toBe(nFilter[0]);
			expect(nNodes[1]).toBe(nTable[0]);
			expect(nNodes[2]).toBe(nInfo[0]);
			expect(nNodes[3]).toBe(nPaging[0]);
		});

		dt.html('basic');
		it('Check no filter element', function() {
			$('table').dataTable({
				dom: 'lrtip'
			});

			var nNodes = $('div.dataTables_wrapper div, div.dataTables_wrapper table');
			var nLength = document.getElementsByClassName('dataTables_length');
			var nFilter = document.getElementsByClassName('dataTables_filter');
			var nInfo = document.getElementsByClassName('dataTables_info');
			var nPaging = document.getElementsByClassName('dataTables_paginate');
			var nTable = document.getElementsByClassName('dataTable');

			expect(nNodes[0]).toBe(nLength[0]);
			expect(undefined).toBe(nFilter[0]);
			expect(nNodes[1]).toBe(nTable[0]);
			expect(nNodes[2]).toBe(nInfo[0]);
			expect(nNodes[3]).toBe(nPaging[0]);
		});

		dt.html('basic');
		it('Check no info element', function() {
			$('table').dataTable({
				dom: 'lfrtp'
			});

			var nNodes = $('div.dataTables_wrapper div, div.dataTables_wrapper table');
			var nLength = document.getElementsByClassName('dataTables_length');
			var nFilter = document.getElementsByClassName('dataTables_filter');
			var nInfo = document.getElementsByClassName('dataTables_info');
			var nPaging = document.getElementsByClassName('dataTables_paginate');
			var nTable = document.getElementsByClassName('dataTable');

			expect(nNodes[0]).toBe(nLength[0]);
			expect(nNodes[1]).toBe(nFilter[0]);
			expect(nNodes[2]).toBe(nTable[0]);
			expect(undefined).toBe(nInfo[0]);
			expect(nNodes[3]).toBe(nPaging[0]);
		});

		dt.html('basic');
		it('Check no paging element', function() {
			$('table').dataTable({
				dom: 'lfrti'
			});

			var nNodes = $('div.dataTables_wrapper div, div.dataTables_wrapper table');
			var nLength = document.getElementsByClassName('dataTables_length');
			var nFilter = document.getElementsByClassName('dataTables_filter');
			var nInfo = document.getElementsByClassName('dataTables_info');
			var nPaging = document.getElementsByClassName('dataTables_paginate');
			var nTable = document.getElementsByClassName('dataTable');

			expect(nNodes[0]).toBe(nLength[0]);
			expect(nNodes[1]).toBe(nFilter[0]);
			expect(nNodes[2]).toBe(nTable[0]);
			expect(nNodes[3]).toBe(nInfo[0]);
			expect(nNodes[4]).toBe(nPaging[0]);
		});

		dt.html('basic');
		it('Element with an id', function() {
			$('table').dataTable({
				dom: '<"#test"lf>rti'
			});
			expect($('#test').length).toBe(1);
		});

		dt.html('basic');
		it('Element with an id and a class', function() {
			$('table').dataTable({
				dom: '<"#test.classTest"lf>rti'
			});
			expect($('#test').length).toBe(1);
			expect($('#test')[0].className).toBe('classTest');
		});

		dt.html('basic');
		it('Element with just a class', function() {
			$('table').dataTable({
				dom: '<"classTest"lf>rti'
			});
			expect($('div.classTest').length == 1).toBe(true);
		});

		dt.html('basic');
		it('Two Elements with an id', function() {
			$('table').dataTable({
				dom: '<"#test1"lf>rti<"#test2"lf>'
			});
			expect($('#test1').length).toBe(1);
			expect($('#test2').length).toBe(1);
		});

		dt.html('basic');
		it('Two elements with an id and one with a class', function() {
			$('table').dataTable({
				dom: '<"#test1"lf>rti<"#test2.classTest"lf>'
			});
			expect($('#test1').length).toBe(1);
			expect($('#test2').length).toBe(1);
			expect($('div.classTest').length).toBe(1);
		});
	});
});
