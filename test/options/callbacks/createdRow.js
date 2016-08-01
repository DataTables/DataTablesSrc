describe( "createdRow option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {

		dt.html( 'basic' );
		it("Row created is called once for each row on init", function () {
			 tmp = 0;
			$('#example').dataTable( {
				"createdRow": function() {
					tmp++;
				}
			});
			$('#example').DataTable().search('Accountant').draw();
			expect(tmp === 57).toBe(true);
		});

		it("Created isn't called back on other draws", function () {
			$('#example th:eq(1)').click();
			expect(tmp === 57).toBe(true);
		});
		dt.html( 'basic' );
		it("Three arguments for the function", function () {
			tmp = true;
			$('#example').dataTable( {
				"createdRow": function() {
					if( arguments.length !== 3){
						tmp = false;
					}
				}
			});
			expect(tmp === true).toBe(true);
		});
		dt.html( 'basic' );
		it("First argument is a TR element", function () {
			tmp= true;
			$('#example').dataTable( {
				"createdRow": function() {
					if( arguments[0].nodeName !== "TR"){
						tmp = false;
					}
				}
			});
			expect(tmp === true).toBe(true);
		});
		dt.html( 'basic' );
		it("Second Argument is an array with 5 elements", function () {
			tmp= true;
			$('#example').dataTable( {
				"createdRow": function() {
					if( arguments[1].length !== 6){
						tmp = false;
					}
				}
			});
			expect(tmp === true).toBe(true);
		});
		dt.html( 'basic' );
		it("Third argument is the data source for the row", function () {
			tmp= true;
			$('#example').dataTable( {
				"createdRow": function() {
					if( arguments[1] !== $('#example').DataTable.settings[0].aoData[ arguments[2] ]._aData){
						tmp = false;
					}
				}
			});
			expect(tmp === true).toBe(true);
		});
		dt.html( 'basic' );
		it("TR element is tied to the correct data", function () {
			tmp= false;
			$('#example').dataTable( {
				"createdRow": function(tr, data, index) {
					if ( data[0] === "Airi Satou"){
						if( $('td:eq(3)', tr).html() == "33"){
							tmp = true;
						}
					}
				}
			});
			expect(tmp === true).toBe(true);
		});
		dt.html( 'basic' );
		it("createdRow allows manipulation of TR elements", function () {
			$('#example').dataTable( {
				"createdRow": function( row, data, dataIndex) {
					if( data[1] == "Accountant"){
						$(row).addClass('unit-test');

					}

				}
			});
			expect($('#example tbody tr:eq(0)').hasClass('unit-test')).toBe(true);
		});
		dt.html( 'basic' );
		it("createdRow dataIndex refers to correct rows/index", function () {
			$('#example').dataTable( {
				"createdRow": function( row, data, dataIndex){
					if( dataIndex == 2){
						console.log(row);
						$(row).addClass('unit-test2');
					}
				}
			});
			expect($('#example tbody tr:eq(2)').hasClass('unit-test2') && $('#example tbody tr:eq(2) td').html() == "Ashton Cox").toBe(true);

		});
		var counter = 0;
		dt.html( 'basic');
		it("createdRow- row parameter is correct", function () {
			$('#example').dataTable( {
				"createdRow": function( row, data, dataIndex){
					counter++;
					$(row).addClass("row-"+counter);
				}
			});
			expect($('#example tbody tr:eq(0)').hasClass('row-5')).toBe(true);

		});

	});

});
