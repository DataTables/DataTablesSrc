describe( "autoWidth option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

  describe("Check Default", function () {
    	dt.html( 'basic' );
    it("Auto Width enabled by default", function () {
      $('#example').dataTable();
      expect($('#example').DataTable().settings()[0].oFeatures.bAutoWidth).toBeTruthy();
    });
    it("First column has a width assigned to it", function () {
      expect($('#example thead th:eq(0)').attr('style').match(/width/i)).toBeTruthy();
    });

  });

  describe("Check can disable", function () {
    dt.html( 'basic' );
    it("Autowidth can be disabled", function () {
      $('#example').dataTable( {
        "autoWidth": false
      });
      expect($('#example').DataTable().settings()[0].oFeatures.bAutoWidth).toEqual(false);
    });
    it("First column does not have a width assigned to it", function () {
      expect($('#example thead th:eq(0)').attr('style')).not.toBeTruthy();
    });
  });

  describe("Check enable override", function () {
    dt.html( 'basic' );
    it("Auto width enabled override", function () {
      $('#example').dataTable( {
        "autoWidth": true
      });
      expect($('#example').DataTable().settings()[0].oFeatures.bAutoWidth).toBeTruthy();
    });
  });
} );
