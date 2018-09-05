describe( "infoCallback Option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {

		dt.html( 'basic' );
		it("Default should not be true", function () {
			$('#example').dataTable();
			expect($.fn.dataTable.defaults.fnInfoCallback).not.toBe(true);
			//$.fn.DataTable.defaults
		});
		dt.html( 'basic' );
		it("Argument length", function () {
			test = 0;
			$('#example').dataTable( {
				"infoCallback": function ( settings, start, end, max, total, pre ) {
					test = arguments.length;
					return pre;
				}
			});
			expect( test == 6).toBe(true);
		});
		dt.html( 'basic' );
		it("Check first argument is settings object", function () {
			test = false;
			$('#example').dataTable( {
				"infoCallback": function ( settings, start, end, max, total, pre ) {
					test = (settings == $('#example').DataTable().settings()[0] ? true : false);
					return pre;
				}
			});
			expect( test === true).toBe(true);
		});
		dt.html( 'basic' );
		it("check start argument", function () {
			$('#example').dataTable( {
				"infoCallback": function ( settings, start, end, max, total, pre ) {
					return start;
				}
			});
			expect($('div.dataTables_info').html() == "1" ).toBe(true);
		});
		dt.html( 'basic' );
		it("Check end argument", function () {
			$('#example').dataTable( {
				"infoCallback": function ( settings, start, end, max, total, pre ) {
					return end;
				}
			});
			expect($('div.dataTables_info').html() == "10" ).toBe(true);
		});
		dt.html( 'basic' );
		it("Check max argument", function () {
			$('#example').dataTable( {
				"infoCallback": function ( settings, start, end, max, total, pre ) {
					return max;
				}
			});
			expect($('div.dataTables_info').html() == "57" ).toBe(true);
		});

		it("Max argument- filtering", function () {
			$('#example').DataTable().search('London').draw();
			expect($('div.dataTables_info').html() == "57" ).toBe(true);
		});
		dt.html( 'basic' );
		it("total argument", function () {
			$('#example').dataTable( {
				"infoCallback": function ( settings, start, end, max, total, pre ) {
					return total;
				}
			});
			expect($('div.dataTables_info').html() == "57" ).toBe(true);
		});
		it("total argument- filter", function () {
			$('#example').DataTable().search('London').draw();
			expect($('div.dataTables_info').html() == "12").toBe(true);
		});


	});


});
