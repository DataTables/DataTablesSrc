describe( "DOM option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	dt.html( 'basic' );

	it("Default DOM variable", function () {
		$('#example').dataTable( );
		expect($('#example').DataTable().settings()[0].sDom == "lftrip").toBe(true);
	});

	it("Default DOM in document in correct order", function () {
		var nNodes = $('#example_wrapper div, #example_wrapper table');

		var nLength = document.getElementById('example_length');
		var nFilter = document.getElementById('example_filter');
		var nInfo = document.getElementById('example_info');
		var nPaging = document.getElementById('example_paginate');
		var nTable = document.getElementById('example');
		var bReturn;
		expect(bReturn = nNodes[0] == nLength && nNodes[1] == nFilter && nNodes[2] == nTable && nNodes[3] == nInfo && nNodes[4] == nPaging).toBe(true);

	});

	dt.html( 'basic' );

	it("Check example 1 in code propogates", function () {
		$('#example').dataTable( {
			"dom":'<"wrapper"flipt>'
		});
		expect($('#example').DataTable().settings()[0].sDom == '<"wrapper"flipt>').toBe(true);
	});

	it("Check example 1 in DOM", function () {
		var jqNodes = $('#example_wrapper div, #example_wrapper table');
		var nNodes = [];
		for ( var i=0, iLen=jqNodes.length ; i<iLen ; i++ )
		{
			if ( jqNodes[i].getAttribute('id') != "example_previous" &&
					jqNodes[i].getAttribute('id') != "example_next" )
			{
				nNodes.push( jqNodes[i] );
			}
		}
		var nLength = document.getElementById('example_length');
		var nFilter = document.getElementById('example_filter');
		var nInfo = document.getElementById('example_info');
		var nPaging = document.getElementById('example_paginate');
		var nTable = document.getElementById('example');
		var nCustomWrapper = $('div.wrapper')[0];
		expect(bReturn = nNodes[0] == nCustomWrapper && nNodes[1] == nFilter && nNodes[2] == nLength && nNodes[3] == nInfo && nNodes[4] == nPaging && nNodes[5] == nTable).toBe(true);
	});

	dt.html( 'basic' );

	it("Check example 2 in DOM", function () {
		$('#example').dataTable( {
			"dom": '<lf<t>ip>'
		} );
		var jqNodes = $('#example_wrapper div, #example_wrapper table');
		var nNodes = [];
		var nCustomWrappers = []

		/* Strip the paging nodes */
		for ( var i=0, iLen=jqNodes.length ; i<iLen ; i++ )
		{
			if ( jqNodes[i].getAttribute('id') != "example_previous" &&
					jqNodes[i].getAttribute('id') != "example_next" )
			{
				nNodes.push( jqNodes[i] );
			}

			/* Only the two custom divs don't have class names */
			if ( jqNodes[i].className == "" )
			{
				nCustomWrappers.push( jqNodes[i] );
			}
		}

		var nLength = document.getElementById('example_length');
		var nFilter = document.getElementById('example_filter');
		var nInfo = document.getElementById('example_info');
		var nPaging = document.getElementById('example_paginate');
		var nTable = document.getElementById('example');
		expect(bReturn = nNodes[0] == nCustomWrappers[0] && nNodes[1] == nLength && nNodes[2] == nFilter && nNodes[3] == nCustomWrappers[1] && nNodes[4] == nTable && nNodes[5] == nInfo && nNodes[6] == nPaging).toBe(true);
	});

	dt.html( 'basic' );

	it("Check no length element", function () {
		$('#example').dataTable( {
			"dom": 'frtip'
		} );
		var nNodes = $('#example_wrapper div, #example_wrapper table');
		var nLength = document.getElementById('example_length');
		var nFilter = document.getElementById('example_filter');
		var nInfo = document.getElementById('example_info');
		var nPaging = document.getElementById('example_paginate');
		var nTable = document.getElementById('example');
		expect(bReturn = null === nLength && nNodes[0] == nFilter && nNodes[1] == nTable && nNodes[2] == nInfo && nNodes[3] == nPaging).toBe(true);
	});

	dt.html( 'basic' );

	it("Check no filter element", function () {
		$('#example').dataTable( {
			"dom": 'lrtip'
		} );

		var nNodes = $('#example_wrapper div, #example_wrapper table');
		var nLength = document.getElementById('example_length');
		var nFilter = document.getElementById('example_filter');
		var nInfo = document.getElementById('example_info');
		var nPaging = document.getElementById('example_paginate');
		var nTable = document.getElementById('example');
		expect(bReturn = nNodes[0] == nLength && null === nFilter && nNodes[1] == nTable && nNodes[2] == nInfo && nNodes[3] == nPaging).toBe(true);
	});

	dt.html( 'basic' );

	it("Check no info element", function () {
		$('#example').dataTable( {
			"dom": 'lfrtp'
		} );

		var nNodes = $('#example_wrapper div, #example_wrapper table');
		var nLength = document.getElementById('example_length');
		var nFilter = document.getElementById('example_filter');
		var nInfo = document.getElementById('example_info');
		var nPaging = document.getElementById('example_paginate');
		var nTable = document.getElementById('example');
		expect(bReturn = nNodes[0] == nLength && nNodes[1] == nFilter && nNodes[2] == nTable && null === nInfo && nNodes[3] == nPaging).toBe(true);
	});

	dt.html( 'basic' );

	it("Check no paging element", function () {
		$('#example').dataTable( {
			"dom": 'lfrti'
		} );
		var nNodes = $('#example_wrapper div, #example_wrapper table');
		var nLength = document.getElementById('example_length');
		var nFilter = document.getElementById('example_filter');
		var nInfo = document.getElementById('example_info');
		var nPaging = document.getElementById('example_paginate');
		var nTable = document.getElementById('example');
		expect(bReturn = nNodes[0] == nLength && nNodes[1] == nFilter && nNodes[2] == nTable && nNodes[3] == nInfo && null === nPaging).toBe(true);
	});

	dt.html( 'basic' );

	it("Element with an id", function () {
		$('#example').dataTable( {
			"dom": '<"#test"lf>rti'
		} );
		expect($('#test').length == 1).toBe(true);
	});
	dt.html( 'basic' );

	it("Element with an id and a class", function () {
		$('#example').dataTable( {
			"dom": '<"#test.classTest"lf>rti'
		} );
		expect($('#test').length == 1 && $('#test')[0].className == "classTest").toBe(true);
	});

	dt.html( 'basic' );

	it("Element with just a class", function () {
		$('#example').dataTable( {
			"dom": '<"classTest"lf>rti'
		} );
		expect($('div.classTest').length == 1).toBe(true);
	});

	dt.html( 'basic' );

	it("Two Elements with an id", function () {
		$('#example').dataTable( {
			"dom": '<"#test1"lf>rti<"#test2"lf>'
		} );
		expect($('#test1').length == 1 && $('#test2').length == 1).toBe(true);
	});

	dt.html( 'basic' );

	it("Two elements with an id and one with a class", function () {
		$('#example').dataTable( {
			"dom": '<"#test1"lf>rti<"#test2.classTest"lf>'
		} );
		expect($('#test1').length == 1 && $('#test2').length == 1 && $('div.classTest').length == 1).toBe(true);
	});

	dt.html( 'basic' );

	it("Processing element is not shown if processing is not enabled", function () {
		$('#example').dataTable();
		expect($('#example_processing').length).toBe(0);
	});

	dt.html( 'basic' );

	it("Processing element in the document if processing is enabled", function () {
		$('#example').dataTable( {
			processing: true	
		} );
		expect($('#example_processing').length).toBe(1);
	});

	it("Processing element is immediately after the table element", function () {
		expect($('#example_processing').prev()[0].id).toBe('example');
	});
});
