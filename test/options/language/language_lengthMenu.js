describe( "language.lengthMenu option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Menu language is '_MENU_ entries' by default ", function () {
			$('#example').dataTable();
			expect($('#example').DataTable().settings()[0].oLanguage.sLengthMenu  === "_MENU_ _ENTRIES_ per page").toBe(true);
		});
		it("_MENU_ macro is replaced by select menu in DOM", function () {
			expect($('div.dt-length select').length == 1).toBe(true);
		});

		it("A label input is used", function () {
			expect( $('div.dt-length label').length == 1 ).toBe(true);
		});
		it("Default is put into DOM", function () {
			var anChildren = $('div.dt-length')[0].childNodes;

			expect(anChildren[0].nodeName.toLowerCase() == "select").toBe(true);
			expect(anChildren[1].nodeName.toLowerCase() == "label").toBe(true);
			expect(anChildren[1].textContent).toBe(' entries per page');
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
			expect($('div.dt-length label').text() == "unit test").toBe(true);
		});
		dt.html( 'basic' );
		it("Menu length language can be defined - with _MENU_ macro", function () {
			$('#example').dataTable( {
				"language": {
					"lengthMenu": "unit _MENU_ test"
				}
			});
			var anChildren = $('div.dt-length label')[0].childNodes;
			expect(bReturn = anChildren[0].nodeValue == "unit " && anChildren[2].nodeValue == " test").toBe(true);
		});
		dt.html('basic');
		it("Only the _MENU_ macro", function () {
			$('#example').dataTable( {
				"language": {
					"lengthMenu": "_MENU_"
				}
			});
			var anChildren = $('div.dt-length')[0].childNodes;
			expect(anChildren.length).toBe(2);
			expect($('div.dt-length select').length).toBe(1);
		});

		dt.html('basic');
		it("Default DOM structure", function () {
			$('#example').DataTable();

			expect($('div.dt-length > label').length).toBe(1);
			expect($('div.dt-length > select').length).toBe(1);
			expect($('div.dt-length > select + label').length).toBe(1);
			expect($('div.dt-length').children().length).toBe(2);
		});

		it('Has for and id attributes', function () {
			expect($('div.dt-search > label').attr('for'))
				.toBe($('div.dt-search > input').attr('id'));
		});

		dt.html('basic');
		it("DOM structure - at start", function () {
			$('#example').DataTable({
				language: {
					lengthMenu: '_MENU_ postfix'
				}
			});

			expect($('div.dt-length > label').length).toBe(1);
			expect($('div.dt-length > select').length).toBe(1);
			expect($('div.dt-length > select + label').length).toBe(1);
			expect($('div.dt-length').children().length).toBe(2);

			expect($('div.dt-search > label').attr('for'))
				.toBe($('div.dt-search > input').attr('id'));
		});

		dt.html('basic');
		it("DOM structure - at end", function () {
			$('#example').DataTable({
				language: {
					lengthMenu: 'prefix _MENU_'
				}
			});

			expect($('div.dt-length > label').length).toBe(1);
			expect($('div.dt-length > select').length).toBe(1);
			expect($('div.dt-length > label + select').length).toBe(1);
			expect($('div.dt-length').children().length).toBe(2);

			expect($('div.dt-search > label').attr('for'))
				.toBe($('div.dt-search > input').attr('id'));
		});

		dt.html('basic');
		it("DOM structure - in middle", function () {
			$('#example').DataTable({
				language: {
					lengthMenu: 'prefix _MENU_ postfix'
				}
			});

			expect($('div.dt-length > label').length).toBe(1);
			expect($('div.dt-length > label > select').length).toBe(1);
			expect($('div.dt-length').children().length).toBe(1);

			expect($('div.dt-search > label').attr('for'))
				.toBe($('div.dt-search > input').attr('id'));
		});

		dt.html('basic');
		it("Can have a span in the language string", function () {
			$('#example').DataTable({
				language: {
					lengthMenu: '<span>My span:</span> _MENU_'
				}
			});

			expect($('div.dt-length span').length).toBe(1);
			expect($('div.dt-length select').length).toBe(1);
			expect($('div.dt-length').text()).toBe('My span: 102550100');
		});
	});
});
