describe( "info option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

  dt.html( 'basic' );


  describe("Check Default", function () {
    //Check default

    it("Info div exists by default", function () {
			$('#example').dataTable();
      expect(document.getElementById('example_info')).toBeTruthy();

    });
    dt.html( 'basic' ); //reload table
    //Check can disable
    it("Info can be disabled", function () {

      $('#example').dataTable({
        'info': false
      });

      expect(document.getElementById('example_info')).not.toBeTruthy();
    });

    dt.html( 'basic' ); //reload table

    //Enable makes no difference
    it("Info enable override", function () {

      $('#example').dataTable( {
				"Info": true
			} );
      expect(document.getElementById('example_info')).toBeTruthy();
    });
  });
} );
