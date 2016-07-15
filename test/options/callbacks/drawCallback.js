describe( "drawCallback option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Default should not be true", function () {
			$('#example').dataTable();
			expect($('#example').DataTable().settings()[0].aoDrawCallback).not.toBe(true);
			//$.fn.DataTable.defaults
		});
		dt.html( 'basic' );
		it("One argument passed", function () {
			test = -1;
			$('#example').dataTable( {
				"drawCallback": function() {
					test = arguments.length;

				}
			});
			expect(test == 1).toBe(true);
		});
		dt.html( 'basic' );
		it("That one argument is the settings object", function () {
			$('#example').dataTable( {
				"drawCallback": function (settings){
					test = settings;
				}
			});
			expect($('#example').DataTable().settings()[0] == test).toBe(true);
		});
		dt.html( 'basic' );
		it("drawCallback called once on first draw", function () {
			test = 0;
			$('#example').dataTable( {
				"drawCallback": function(){
					test++;
				}
			});
			expect(test == 1).toBe(true);
		});
		it("drawCallback called once each draw thereafter as well", function () {
			$('#example_next').click();
			$('#example_next').click();
			$('#example_next').click();
			expect(test == 4).toBe(true);
		});
	});

});
