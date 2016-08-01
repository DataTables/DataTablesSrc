describe( "footerCallback option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Default should not be true", function () {
			$('#example').dataTable();
			expect($.fn.dataTable.defaults.fnFooterCallback).not.toBe(true);
			//$.fn.DataTable.defaults
		});
		dt.html( 'basic' );
		it("Five arguments pass", function () {
			test = -1;
			$('#example').dataTable( {
				"footerCallback": function() {
					test = arguments.length;
				}
			});
			expect(test == 5).toBe(true);
		});
		dt.html( 'basic' );
		it("footerCallback called once per draw", function () {
			test = 0;
			$('#example').dataTable( {
				"footerCallback": function( tfoot, data, start, end, display ){
					test++;
				}
			});
			expect(test == 1).toBe(true);
		});
		it("rooterCallback called on paging (ie another draw)", function () {
			$('#example_next').click();
			expect(test == 2).toBe(true);
		});
		dt.html( 'basic' );
		it("footerCallback allows ut to alter row information", function () {
			$('#example').dataTable( {
				"footerCallback": function ( tfoot, data, start, end, display){
					tfoot.getElementsByTagName('th')[0].innerHTML= "Displaying "+(end-start)+" records";
				}
			});
			expect($('#example tfoot th:eq(0)').html() == "Displaying 10 records").toBe(true);
		});
		dt.html( 'basic' );
		it("Data array has length matching original data", function () {
			test = true;
			$('#example').dataTable( {
				"footerCallback": function ( tfoot, data, start, end, display){
					if (data.length != 57){
						test = false;
					}
				}
			});
			expect(test === true).toBe(true);
		});
		dt.html( 'basic' );
		it("Data array's column lengths match original data", function () {
			test = true;
			$('#example').dataTable( {
				"footerCallback": function ( tfoot, data, start, end, display){
					for( var i=0, length = data.length ; i<length ; i++){
						if( data[i].length != 6){
							test = false;
						}
					}
				}
			});
			expect(test === true).toBe(true);
		});
		dt.html( 'basic' );
		it("start correct on first page", function () {
			test = true;
			$('#example').dataTable( {
				"footerCallback": function ( tfoot, data, start, end, display) {
					if ( start !== 0 ) {
						test = false;
					}
				}
			});
			expect(test === true).toBe(true);
		});
		dt.html( 'basic' );
		it("start correct on second page", function () {
			test = false;
			$('#example').dataTable( {
				"footerCallback": function ( tfoot, data, start, end, display){
					if (start == 10){
						test = true;
					}
				}
			});
			$('#example_next').click();
			expect(test === true).toBe(true);
		});
		dt.html( 'basic' );
		it("End correct on first page", function () {
			test = false;
			$('#example').dataTable( {
				"footerCallback": function ( tfoot, data, start, end, display){
					if ( end != 10){
						test = true;
					}
				}
			});
			$('#example_next').click();
			expect(test === true).toBe(true);
		});
		dt.html( 'basic' );
		it("Display Length is full data when not filtered", function () {
			test = false;
			$('#example').dataTable( {
				"footerCallback": function ( tfoot, data, start, end, display){
					if ( display.length == 57){
						test = true;
					}
				}
			});
			expect(test === true).toBe(true);
		});
		dt.html( 'basic' );
		it("Display length is 12 when filtering on London ", function () {
			test = false;
			$('#example').dataTable( {
				"footerCallback": function ( tfoot, data, start, end, display){
					console.log(display.length);
					if ( display.length == 12){
						test = true;
					}
				}
			});
			$('#example').DataTable().search('London').draw();
			expect(test === true).toBe(true);
		});

	});

});
