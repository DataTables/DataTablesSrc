describe( "language.lengthMenu option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Menu language is 'Show _MENU_ entries' by default ", function () {
			$('#example').dataTable();
			expect($('#example').DataTable().settings()[0].oLanguage.sLengthMenu  === "Show _MENU_ entries").toBe(true);
		});
		it("_MENU_ macro is replaced by select menu in DOM", function () {
			expect($('div.dataTables_length select').length == 1).toBe(true);
		});

		it("A label input is used", function () {
			expect( $('div.dataTables_length label').length == 1 ).toBe(true);
		});
		it("Default is put into DOM", function () {
			var anChildren = $('div.dataTables_length label')[0].childNodes;

			expect(bReturn = anChildren[0].nodeValue == "Show " && anChildren[2].nodeValue == " entries").toBe(true);
		});
		dt.html( 'basic' );
		it("Menu length can be defined - no _MENU_ macro", function () {
			$('#example').dataTable( {
				"language": {
					"lengthMenu": "unit test"
				}
			});
			expect($('#example').DataTable().settings()[0].oLanguage.sLengthMenu == "unit test").toBe(true);
		});
		it("Menu length language definition is in the dom", function () {
			expect($('div.dataTables_length label').text() == "unit test").toBe(true);
		});
		dt.html( 'basic' );
		it("Menu length language can be defined - with _MENU_ macro", function () {
			$('#example').dataTable( {
				"language": {
					"lengthMenu": "unit _MENU_ test"
				}
			});
			var anChildren = $('div.dataTables_length label')[0].childNodes;
			expect(bReturn = anChildren[0].nodeValue == "unit " && anChildren[2].nodeValue == " test").toBe(true);
		});
		dt.html('basic');
		it("Only the _MENU_ macro", function () {
			$('#example').dataTable( {
				"language": {
					"lengthMenu": "_MENU_"
				}
			});
			var anChildren = $('div.dataTables_length')[0].childNodes;
			expect(anChildren.length).toBe(2);
			expect($('div.dataTables_length select').length).toBe(1);
		});

		dt.html('basic');
		it("Default DOM structure", function () {
			$('#example').DataTable();

			expect($('div.dataTables_length > label').length).toBe(1);
			expect($('div.dataTables_length > label > select').length).toBe(1);
			expect($('div.dataTables_length').children().length).toBe(1);
		});

		it('Has for and id attributes', function () {
			expect($('div.dataTables_filter > label').attr('for'))
				.toBe($('div.dataTables_filter > input').attr('id'));
		});

		dt.html('basic');
		it("DOM structure - at start", function () {
			$('#example').DataTable({
				language: {
					lengthMenu: '_MENU_ postfix'
				}
			});

			expect($('div.dataTables_length > label').length).toBe(1);
			expect($('div.dataTables_length > select').length).toBe(1);
			expect($('div.dataTables_length > select + label').length).toBe(1);
			expect($('div.dataTables_length').children().length).toBe(2);

			expect($('div.dataTables_filter > label').attr('for'))
				.toBe($('div.dataTables_filter > input').attr('id'));
		});

		dt.html('basic');
		it("DOM structure - at end", function () {
			$('#example').DataTable({
				language: {
					lengthMenu: 'prefix _MENU_'
				}
			});

			expect($('div.dataTables_length > label').length).toBe(1);
			expect($('div.dataTables_length > select').length).toBe(1);
			expect($('div.dataTables_length > label + select').length).toBe(1);
			expect($('div.dataTables_length').children().length).toBe(2);

			expect($('div.dataTables_filter > label').attr('for'))
				.toBe($('div.dataTables_filter > input').attr('id'));
		});

		dt.html('basic');
		it("DOM structure - in middle", function () {
			$('#example').DataTable({
				language: {
					lengthMenu: 'prefix _MENU_ postfix'
				}
			});

			expect($('div.dataTables_length > label').length).toBe(1);
			expect($('div.dataTables_length > label > select').length).toBe(1);
			expect($('div.dataTables_length').children().length).toBe(1);

			expect($('div.dataTables_filter > label').attr('for'))
				.toBe($('div.dataTables_filter > input').attr('id'));
		});
	});
});
