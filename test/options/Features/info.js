describe( "info option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );
	
  describe("Check Default", function () {
		dt.html( 'basic' );
    it("Info div exists by default", function () {
      $('#example').dataTable();
      expect(document.getElementById('example_info')).toBeTruthy();
    });
  });

	describe("Check can disable", function () {
		dt.html( 'basic' );
		it("Info can be disabled", function () {

      $('#example').dataTable({
        'info': false
      });
      expect(document.getElementById('example_info')).not.toBeTruthy();
    });
	});

	describe("Enable makes no difference", function () {
		dt.html( 'basic' );
    it("Info enable override", function () {
      $('#example').dataTable( {
				"info": true
			} );
      expect(document.getElementById('example_info')).toBeTruthy();
    });
	});
} );
