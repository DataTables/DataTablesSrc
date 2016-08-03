describe( "columnDefs option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Default should be null", function () {
				$('#example').dataTable();
				expect($.fn.dataTable.defaults.aoColumnDefs).toBe(null);
		});
		dt.html( 'basic' );
		it(" '_all' targets all columns. ", function () {
			$('#example').dataTable( {
				"columnDefs": [
					{ targets: [0], visible: true},
					{ targets: '_all', visible: false}
				]
			});
			//We know _all works as there are 6 columns that are being selected minus the first '0' column, this gives us 1 column.
			expect($('#example thead').find('th').length === 1).toBe(true);
		});
		dt.html( 'basic' );
		it("Select 1 column using array", function () {
			$('#example').dataTable( {
				"columnDefs": [
					{ targets: [0], visible: false}
				]
			});
			//Check 1 columns has been removed and that 1 column is the name column
			expect($('#example thead').find('th').length === 5 && $('#example thead th:eq(0)').html() == "Position").toBe(true);
		});
		dt.html( 'basic' );
		it("Select 2 columns using array", function () {
			$('#example').dataTable( {
				"columnDefs": [
					{ targets: [0,1], visible: false}
				]
			});
			//Check 2 columns have been removed and that they are the correct columns
			expect($('#example thead').find('th').length === 4 && $('#example thead th:eq(0)').html() == "Office").toBe(true);
		});
		dt.html( 'basic');
		it("Use negative int to select last column", function () {
			$('#example').dataTable( {
				"columnDefs": [
					{ targets: [-1], visible: false}
				]
			});
			//Check 1 column has been removed and that 1 column is the Salary column
			expect($('#example thead').find('th').length === 5 && $('#example thead th:eq(-1)').html() == "Start date").toBe(true);

		});
		dt.html( 'basic' );
		it("Use negative int to select multiple columns", function () {
			$('#example').dataTable( {
				"columnDefs": [
					{ targets: [-1,-2], visible: false}
				]
			});
			//Check 2 columns has been removed and they are the correct columns
			expect($('#example thead').find('th').length === 4 && $('#example thead th:eq(-1)').html() == "Age").toBe(true);
		});
		dt.html( 'basic' );
		it("Mixed negative and positive ints to select columns- remove first and last columns", function () {
			$('#example').dataTable( {
				"columnDefs": [
					{ targets: [0,-1], visible: false}
				]
			});
			//Check 2 columns has been removed and they are the correct columns
			expect($('#example thead').find('th').length === 4 && $('#example thead th:eq(0)').html() == "Position" && $('#example thead th:eq(-1)').html() == "Start date").toBe(true);
		});
		dt.html( 'basic' );
		it("Use string to select column", function () {
			$('#example thead th:eq(0)').addClass('test1');
			$('#example').dataTable( {
				"columnDefs": [
					{ targets: "test1", visible: false}
				]
			});
			//Check	 2 columns has been removed and they are the correct columns
			expect($('#example thead').find('th').length === 5 && $('#example thead th:eq(0)').html() == "Position").toBe(true);

		});
	});

});
