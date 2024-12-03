describe( "Diacritic ordering", function() {
	var table;

	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	dt.html( 'empty' );

	it( 'Type detection', function () {
		table = $('#example').empty().DataTable({
			columns: [
				{
					title: 'Test',
					data: 0
				}
			],
			data: [
				['Été'],
				['sève'],
				['À propos'],
				['Schomberg'],
				['Ökonomie'],
				['étêter'],
				['Oracle'],
				['étirer'],
				['Été'],
				['Schön'],
				['ethnie'],
				['étoffe'],
				['Schubert'],
			]
		});

		expect( table.column(0).type() ).toBe( 'string-utf8' );
	} );

	it( 'Ordering is as expected', async function () {
		expect( $('tbody tr:eq(0) td').text()).toBe('À propos');
		expect( $('tbody tr:eq(1) td').text()).toBe('Été');
		expect( $('tbody tr:eq(2) td').text()).toBe('Été');
		expect( $('tbody tr:eq(3) td').text()).toBe('étêter');
		expect( $('tbody tr:eq(4) td').text()).toBe('ethnie');
		expect( $('tbody tr:eq(5) td').text()).toBe('étirer');
		expect( $('tbody tr:eq(6) td').text()).toBe('étoffe');
		expect( $('tbody tr:eq(7) td').text()).toBe('Ökonomie');
		expect( $('tbody tr:eq(8) td').text()).toBe('Oracle');
		expect( $('tbody tr:eq(9) td').text()).toBe('Schomberg');
	} );

	it( 'Ordering can be reversed', async function () {
		await dt.clickHeader(0);

		expect( $('tbody tr:eq(9) td').text()).toBe('étêter');
		expect( $('tbody tr:eq(8) td').text()).toBe('ethnie');
		expect( $('tbody tr:eq(7) td').text()).toBe('étirer');
		expect( $('tbody tr:eq(6) td').text()).toBe('étoffe');
		expect( $('tbody tr:eq(5) td').text()).toBe('Ökonomie');
		expect( $('tbody tr:eq(4) td').text()).toBe('Oracle');
		expect( $('tbody tr:eq(3) td').text()).toBe('Schomberg');
		expect( $('tbody tr:eq(2) td').text()).toBe('Schön');
		expect( $('tbody tr:eq(1) td').text()).toBe('Schubert');
		expect( $('tbody tr:eq(0) td').text()).toBe('sève');
	} );

	// HTML mixed with utf8 characters
	// https://datatables.net/forums/discussion/80277/
	dt.html( 'empty' );

	it( 'Type detection', function () {
		table = $('#example').empty().DataTable({
			columns: [
				{
					title: 'Test',
					data: 0
				}
			],
			data: [
				['Été <i class="icon icon-wave"></i>'],
				['sève <i class="icon icon-wave"></i>'],
				['À propos <i class="icon icon-wave"></i>'],
				['Schomberg <i class="icon icon-wave"></i>'],
				['Ökonomie <i class="icon icon-wave"></i>'],
				['étêter <i class="icon icon-wave"></i>'],
				['Oracle <i class="icon icon-wave"></i>'],
				['étirer <i class="icon icon-wave"></i>'],
				['Été <i class="icon icon-wave"></i>'],
				['Schön <i class="icon icon-wave"></i>'],
				['ethnie <i class="icon icon-wave"></i>'],
				['étoffe <i class="icon icon-wave"></i>'],
				['Schubert <i class="icon icon-wave"></i>'],
			]
		});

		expect( table.column(0).type() ).toBe( 'html-utf8' );
	} );

	it( 'Ordering is as expected', async function () {
		expect( $('tbody tr:eq(0) td').text().trim()).toBe('À propos');
		expect( $('tbody tr:eq(1) td').text().trim()).toBe('Été');
		expect( $('tbody tr:eq(2) td').text().trim()).toBe('Été');
		expect( $('tbody tr:eq(3) td').text().trim()).toBe('étêter');
		expect( $('tbody tr:eq(4) td').text().trim()).toBe('ethnie');
		expect( $('tbody tr:eq(5) td').text().trim()).toBe('étirer');
		expect( $('tbody tr:eq(6) td').text().trim()).toBe('étoffe');
		expect( $('tbody tr:eq(7) td').text().trim()).toBe('Ökonomie');
		expect( $('tbody tr:eq(8) td').text().trim()).toBe('Oracle');
		expect( $('tbody tr:eq(9) td').text().trim()).toBe('Schomberg');
	} );

	it( 'Ordering can be reversed', async function () {
		await dt.clickHeader(0);

		expect( $('tbody tr:eq(9) td').text().trim()).toBe('étêter');
		expect( $('tbody tr:eq(8) td').text().trim()).toBe('ethnie');
		expect( $('tbody tr:eq(7) td').text().trim()).toBe('étirer');
		expect( $('tbody tr:eq(6) td').text().trim()).toBe('étoffe');
		expect( $('tbody tr:eq(5) td').text().trim()).toBe('Ökonomie');
		expect( $('tbody tr:eq(4) td').text().trim()).toBe('Oracle');
		expect( $('tbody tr:eq(3) td').text().trim()).toBe('Schomberg');
		expect( $('tbody tr:eq(2) td').text().trim()).toBe('Schön');
		expect( $('tbody tr:eq(1) td').text().trim()).toBe('Schubert');
		expect( $('tbody tr:eq(0) td').text().trim()).toBe('sève');
	} );

	// https://datatables.net/forums/discussion/79878
	dt.html( 'empty' );

	it( 'Load with null data', function () {
		let shareholders = [
			{"name":"ABC Company","surname":"Müller"},
			{"name":"Mark Müller","surname":null}
		];
		
		let shareholdersTable = $('#example').empty().DataTable({
			data: shareholders,
			columns: [
				{
					data: "name",
					title: "Full Name"
				},
				{
					data: "surname",
					title: "Surname"
				}
			]
		});

		expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('ABC Company');
	});

	it( 'Can order on second column', async function () {
		await dt.clickHeader(1);

		expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Mark Müller');
	});
} );


