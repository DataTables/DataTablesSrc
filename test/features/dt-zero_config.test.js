describe( "Basic Datatables Test", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );



  doc = window.document;


  describe('Sanity Checks for Datatables with DOM data', function(){
    dt.html( 'basic' ); //Reload basic.html
    it('jQuery.dataTable function', function(){
      expect(jQuery().dataTable).toEqual(jasmine.any(Function));
    });
    it('jQuery.dataTableSettings storage array', function(){
      expect(jQuery().dataTableSettings).toEqual(jasmine.any(Object));
    });
    it('jQuery.dataTableExt Plugin Object', function(){
      expect(jQuery().dataTableExt).toEqual(jasmine.any(Object));
    });
  }); // End Sanity Checks




  describe('Basic checks', function(){
    dt.html( 'basic' ); //Reload basic.html
    it('Length changing div exists', function(){
      $('#example').DataTable();
      expect(doc.getElementById('example_length')).not.toBeNull();
    });

    it("Filtering div exists", function () {
      expect(doc.getElementById('example_filter')).not.toBeNull();
    });
    it("Information div exists", function () {
      expect(doc.getElementById('example_info')).not.toBeNull();
    });
    it("Pagination div exists", function () {
      expect(doc.getElementById('example_paginate')).not.toBeNull();
    });
    it("Processing div exists", function () {
      expect(doc.getElementById('example_processing')).toBeNull();
    });
    it("10 rows shown on the first page", function () {
      expect($('#example tbody tr').length == 10).toBeTruthy();
    });
    it("Initial sort occured //todo make sure this is correct", function () {
      expect($('#example tbody td:eq(0)').html() == "Airi Satou").toBeTruthy();
    });
    it("Sorting (first click) on second column", function () {
      $('#example thead th:eq(1)').click();
      expect($('#example tbody td:eq(1)').html() == "Accountant").toBeTruthy();
    });
    it("Sorting (second click) on second column", function () {
      $('#example thead th:eq(1)').click();
      expect($('#example tbody td:eq(1)').html() == "Technical Author").toBeTruthy();
    });
    it("Sorting (third click) on second column //todo", function () {
      // $('#example thead th:eq(1)').click();
      // $('#example thead th:eq(1)').click();
      // expect($('#example tbody td:eq(1)').html() == "Technical Author").toBeTruthy();
    });

    it("Sorting (first click) on numeric column", function () {
      $('#example thead th:eq(3)').click();
      expect($('#example tbody td:eq(3)').html() == "19").toBeTruthy();
    });
    it("Sorting (second click) on numeric column", function () {
      $('#example thead th:eq(3)').click();
      expect($('#example tbody td:eq(3)').html() == "66").toBeTruthy();
    });
    it("Sorting multi-column (first click) //Couldn't get working", function () {
      // $('#example thead th:eq(3)').click();
      // var clickEvent = $.Event('click');
      // clickEvent.shiftKey = event.shiftKey;
      // $('#example thead th:eq(5)').trigger(clickEvent);
      // expect($('#example tbody td:eq(5)').html() == "$86,000").toBeTruthy();
      // expect($('#example tbody td:eq(3)').html() == "66").toBeTruthy();
    });
    dt.html( 'basic' ); //Reload basic.html
    it("Paging to second page", function () {
      $('#example').DataTable();
      $('#example_next').click();
      expect($('#example tbody td:eq(1)').html() == "Regional Director").toBeTruthy();
    });
    it("Paging to the first page", function () {
      $('#example_previous').click();
      expect($('#example tbody td:eq(1)').html() == "Accountant").toBeTruthy();
    });
    it("Attempting to page back beyong the first page", function () {
      $('#example_previous').click();
      expect($('#example tbody td:eq(1)').html() == "Accountant").toBeTruthy();
    });
  }); //End Basic Tests


  describe("Changing Length", function () {
    dt.html( 'basic' ); //Reload basic.html
    it("Changing table length to 25 records", function () {
      $('#example').DataTable();
      $('select[name=example_length]').val('25').change();
      expect($('#example tbody tr').length == 25).toBeTruthy();
    });

    it("Changing table length to 50 records", function () {
      $('select[name=example_length]').val('50').change();
      expect($('#example tbody tr').length == 50).toBeTruthy();
    });
    it("Changing table length to 100 records", function () {
      $('select[name=example_length]').val('100').change();
      expect($('#example tbody tr').length == 57).toBeTruthy();
    });
    it("Changing table length to 10 records from 50 records", function () {
      $('select[name=example_length]').val('10').change();
      expect($('#example tbody tr').length == 10).toBeTruthy();
    });
  }); //End Changing length tests

  describe("Information element", function () {
    dt.html( 'basic' ); //Reload basic.html

    it("Information on zero config", function () {
      $('#example').DataTable();
      expect(doc.getElementById('example_info').innerHTML == "Showing 1 to 10 of 57 entries").toBeTruthy();
    });
    it("Information on second page", function () {
      $('#example_next').click();
      expect(doc.getElementById('example_info').innerHTML == "Showing 11 to 20 of 57 entries").toBeTruthy();
    });
    it("Information on third page", function () {
      $('#example_next').click();
      expect(doc.getElementById('example_info').innerHTML == "Showing 21 to 30 of 57 entries").toBeTruthy();
    });
    it("Information on last page", function () {
      $('#example_next').click();
      $('#example_next').click();
      $('#example_next').click();
      expect(doc.getElementById('example_info').innerHTML == "Showing 51 to 57 of 57 entries").toBeTruthy();
    });
    it("Information back on first page", function () {
      $('#example_previous').click();
      $('#example_previous').click();
      $('#example_previous').click();
      $('#example_previous').click();
      $('#example_previous').click();
      expect(doc.getElementById('example_info').innerHTML == "Showing 1 to 10 of 57 entries").toBeTruthy();
    });
    it("Information with 25 records", function () {
      $('select[name=example_length]').val('25').change();
      expect(doc.getElementById('example_info').innerHTML == "Showing 1 to 25 of 57 entries").toBeTruthy();
    });
    it("Information with 25 records- second page", function () {
      $('#example_next').click();
      expect(doc.getElementById('example_info').innerHTML == "Showing 26 to 50 of 57 entries").toBeTruthy();
    });
    it("Information with 100 records", function () {
      $('select[name=example_length]').val('100').change();
      expect(doc.getElementById('example_info').innerHTML == "Showing 1 to 57 of 57 entries").toBeTruthy();
    });
    it("Information back to 10 records", function () {
      $('select[name=example_length]').val('10').change();
      $('#example_previous').click();
      expect(doc.getElementById('example_info').innerHTML == "Showing 1 to 10 of 57 entries").toBeTruthy();
    });
    it("Information with filter 'London'", function () {
      $('#example_filter input').val("London").keyup();
      expect(doc.getElementById('example_info').innerHTML == "Showing 1 to 10 of 12 entries (filtered from 57 total entries)").toBeTruthy();
    });
    it("Information with filter 'London'- second page", function () {
      $('#example_next').click();
      expect(doc.getElementById('example_info').innerHTML == "Showing 11 to 12 of 12 entries (filtered from 57 total entries)").toBeTruthy();
    });
    it("Information with filter 'London' back to first page", function () {
      $('#example_previous').click();
      expect(doc.getElementById('example_info').innerHTML == "Showing 1 to 10 of 12 entries (filtered from 57 total entries)").toBeTruthy();
    });
    it("Information with filter 'London'- second page- second time", function () {
      $('#example_next').click();
      expect(doc.getElementById('example_info').innerHTML == "Showing 11 to 12 of 12 entries (filtered from 57 total entries)").toBeTruthy();
    });
    it("Information with filter increased to 'London 66'", function () {
      $('#example_filter input').val("London 66").keyup();
      expect(doc.getElementById('example_info').innerHTML == "Showing 1 to 1 of 1 entries (filtered from 57 total entries)").toBeTruthy();
    });
    it("Information with filter decreased to 'London'", function () {
      $('#example_filter input').val("London").keyup();
      expect(doc.getElementById('example_info').innerHTML == "Showing 1 to 10 of 12 entries (filtered from 57 total entries)").toBeTruthy();
    });
    it("Information with filter 'London'- second page- third time", function () {
      $('#example_next').click();
      expect(doc.getElementById('example_info').innerHTML == "Showing 11 to 12 of 12 entries (filtered from 57 total entries)").toBeTruthy();
    });
    it("Information with filter removed", function () {
      $('#example_filter input').val("").keyup();
      expect(doc.getElementById('example_info').innerHTML == "Showing 1 to 10 of 57 entries").toBeTruthy();
    });
  });


  describe("Filtering", function () {
    dt.html( 'basic' );
    it("Filter 'W'- rows", function () {
      $('#example').dataTable();
      $('#example_filter input').val("W").keyup();
      expect($('#example tbody tr:eq(0) td:eq(0)').html() == "Bradley Greer").toBeTruthy();
    });
    it("Filter 'W'- info", function () {
      expect(doc.getElementById('example_info').innerHTML == "Showing 1 to 10 of 20 entries (filtered from 57 total entries)").toBeTruthy();
    });
    it("Filter 'Lon'", function () {
      $('#example_filter input').val("Lon").keyup();
      expect(doc.getElementById('example_info').innerHTML == "Showing 1 to 10 of 12 entries (filtered from 57 total entries)").toBeTruthy();
    });
    it("Filter 'Lon'- sorting column 1", function () {
      $('#example thead th:eq(1)').click();
      expect($('#example tbody tr:eq(0) td:eq(1)').html() == "Chief Executive Officer (CEO)").toBeTruthy();
    });
    it("Filter 'Lon'- sorting column 1 reverse", function () {
      $('#example thead th:eq(1)').click();
      expect($('#example tbody tr:eq(0) td:eq(1)').html() == "Technical Author").toBeTruthy();
    });
    it("Filter 'London'- sorting column 1 reverse", function () {
      $('#example_filter input').val("London").keyup();
      expect($('#example tbody tr:eq(0) td:eq(1)').html() == "Technical Author").toBeTruthy();
    });
    it("Filter 'London'- sorting column 3", function () {
      $('#example thead th:eq(3)').click();
      expect($('#example tbody tr:eq(0) td:eq(3)').html() == "19").toBeTruthy();
    });
    it("Filter 'London'- sorting column 3", function () {
      $('#example thead th:eq(3)').click();
      expect($('#example tbody tr:eq(0) td:eq(3)').html() == "66").toBeTruthy();
    });
    it("Filter 'London'- sorting col 3- reversed info", function () {
      $('#example_filter input').val("Lon").keyup();
      expect(doc.getElementById('example_info').innerHTML == "Showing 1 to 10 of 12 entries (filtered from 57 total entries)").toBeTruthy();
    });
    it("Filter 'nothingishere'", function () {
      $('#example_filter input').val("nothingishere").keyup();
      expect($('#example tbody tr:eq(0) td:eq(0)').html() == "No matching records found").toBeTruthy();
    });
    it("Filter 'nothingishere' info", function () {
      expect(doc.getElementById('example_info').innerHTML == "Showing 0 to 0 of 0 entries (filtered from 57 total entries)").toBeTruthy();
    });
    it("Filter back to blank and 1st column sorting", function () {
      $('#example_filter input').val("").keyup();
			$('#example thead th:eq(0)').click();
      expect(doc.getElementById('example_info').innerHTML == "Showing 1 to 10 of 57 entries").toBeTruthy();
    });
    it("Prefixing a filter entry", function () {
      $('#example_filter input').val("Author").keyup();
      $('#example_filter input').val("TechnicalAuthor").keyup();
      expect(doc.getElementById('example_info').innerHTML == "Showing 0 to 0 of 0 entries (filtered from 57 total entries)").toBeTruthy();
    });
    it("Prefixing a filter entry with space", function () {
      $('#example_filter input').val("Author").keyup();
      $('#example_filter input').val("Technical Author").keyup();
      expect(doc.getElementById('example_info').innerHTML == "Showing 1 to 2 of 2 entries (filtered from 57 total entries)").toBeTruthy();
    });
    dt.clean();
  });

} );
