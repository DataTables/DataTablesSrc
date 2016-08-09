describe( "columns.data option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {

		dt.html( 'numerical' );
		it("Default", function () {
			$('#example').dataTable( {
				"ajax": "/base/test/data/numerical.txt",
				"columns": [
					{ data: "city" },
					{ data: "Score" },
					{ data: "Salary" }
				]
			} );
			expect($.fn.DataTable.defaults.column.mData).toBe(null);
		});
		dt.html( 'deep' );
		it("Default deep tests", function () {
			// tmp = false;
			// $('#example').dataTable( {
			// 	"ajaxSource": "/base/test/data/deep.txt",
			// 	"columns": [
			// 		{ "data": "engine" },
			// 		{ "data": "browser" },
			// 		{ "data": "platform.inner" },
			// 		{ "data": "platform.details.0" },
			// 		{ "data": "platform.details.11" }
			// 	],
			// 	"initComplete": function (settings, json){
			// 		console.log(settings);
			// 		if( settings.bInitialised === true){
			// 			tmp = true;
			// 		}
			//
			// 		expect(tmp).toBe(true);
			// 	}
			// } );
		});

	});

});
