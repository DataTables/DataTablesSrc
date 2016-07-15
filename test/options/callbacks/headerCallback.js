describe( "headerCallback Option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {

		dt.html( 'basic' );
		it("Default should not be true", function () {
			$('#example').dataTable();
			expect($('#example').DataTable().settings()[0].aoHeaderCallback).not.toBe(true);
			//$.fn.DataTable.defaults
		});
		dt.html( 'basic' );
		it("Five arguments passed", function () {
			test = -1;
			$('#example').dataTable( {
				"headerCallback": function() {
					test = arguments.length;
				}
			});
			expect(test == 5).toBe(true);
		});
		dt.html( 'basic' );
		it("headerCallback called once per draw", function () {
			test = 0;
			$('#example').dataTable( {
				"headerCallback": function( thead, data, start, end, display ) {
					test++;
				}
			});
			expect(test == 1).toBe(true);
		});

		it("headerCallback called on on paging (ie another draw)", function () {
			$('#example_next').click();
			expect(test == 2).toBe(true);
		});
		dt.html( 'basic' );
		it("headerCallback allows us to alter row information", function () {
			$('#example').dataTable( {
				"headerCallback": function( thead, data, start, end, display ) {
					thead.getElementsByTagName('th')[0].innerHTML = "Displaying "+(end-start)+" records";
				}
			});
			expect($('#example thead th:eq(0)').html() == "Displaying 10 records").toBe(true);
		});
		dt.html( 'basic' );
		it("Data array has length matching original data", function () {
			test = true;
			$('#example').dataTable( {
				"headerCallback": function( thead, data, start, end, display ) {
					if ( data.length != 57){
						test = false;
					}
				}
			});
			expect(test === true).toBe(true);
		});
		dt.html( 'basic' );
		it("Data array has length matching original data", function () {
			test = true;
			$('#example').dataTable( {
				"headerCallback": function( thead, data, start, end, display ) {
					for ( var i=0, length=data.length ; i<length ; i++){
						if ( data[i].length != 6){
							test = false;
						}
					}
				}
			});
			expect(test === true).toBe(true);
		});

		dt.html( 'basic' );
		it("Start correct on first page", function () {
			test = true;
			$('#example').dataTable( {
				"headerCallback": function( thead, data, start, end, display ) {
					if ( start !== 0 ){
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
				"headerCallback": function( thead, data, start, end, display ) {
					if ( start !== 10 ){
						test = true;
					}
				}
			});
			$('#example_next').click();
			expect(test === true).toBe(true);
		});
		dt.html( 'basic' );
		it("end correct on first page", function () {
			test = true;
			$('#example').dataTable( {
				"headerCallback": function( thead, data, start, end, display ) {
					if ( end !== 10 ){
						test = false;
					}
				}
			});

			expect(test === true).toBe(true);
		});
		dt.html( 'basic' );
		it("end correct on second page", function () {
			test = false;
			$('#example').dataTable( {
				"headerCallback": function( thead, data, start, end, display ) {
					if ( end !== 20 ){
						test = true;
					}
				}
			});

			expect(test === true).toBe(true);
		});
		dt.html( 'basic' );
		it("Display length is full data when not filtered", function () {
			test = false;
			$('#example').dataTable( {
				"headerCallback": function( thead, data, start, end, display ) {
					if ( display.length == 57 ){
						test = true;
					}
				}
			});
			expect(test === true).toBe(true);
		});
		dt.html( 'basic' );
		it("Display length is 12 when filtering on London", function () {
			test = false;
			$('#example').dataTable( {
				"headerCallback": function( thead, data, start, end, display ) {
					if ( display.length == 12 ){
						test = true;
					}
				}
			});
			$('#example').DataTable().search('London').draw();
			expect(test === true).toBe(true);
		});
	});


});
