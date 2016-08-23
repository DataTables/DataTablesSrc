describe( "number rendering helper", function() {
	var numberRenderer;

	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	dt.html( 'basic' );

	it( 'Number renderer exists', function () {
		numberRenderer = $.fn.dataTable.render.number;

		expect( typeof numberRenderer ).toBe( 'function' );
	} );

	it( 'Number renderer returns an object with a display property', function () {
		expect( typeof numberRenderer().display ).toBe( 'function' );
	} );

	it( 'Simple use case - 1 (thousands - comma)', function () {
		expect( numberRenderer(',', '.', 0).display(1) ).toBe( '1' );
	} );

	it( 'Simple use case - 10 (thousands - comma)', function () {
		expect( numberRenderer(',', '.', 0).display(10) ).toBe( '10' );
	} );

	it( 'Simple use case - 100 (thousands - comma)', function () {
		expect( numberRenderer(',', '.', 0).display(100) ).toBe( '100' );
	} );

	it( 'Simple use case - 1000 (thousands - comma)', function () {
		expect( numberRenderer(',', '.', 0).display(1000) ).toBe( '1,000' );
	} );

	it( 'Simple use case - 10000 (thousands - comma)', function () {
		expect( numberRenderer(',', '.', 0).display(10000) ).toBe( '10,000' );
	} );

	it( 'Simple use case - 100000 (thousands - comma)', function () {
		expect( numberRenderer(',', '.', 0).display(100000) ).toBe( '100,000' );
	} );

	it( 'Simple use case - 1000000 (thousands - comma)', function () {
		expect( numberRenderer(',', '.', 0).display(1000000) ).toBe( '1,000,000' );
	} );

	it( 'Simple use case - 10000000 (thousands - comma)', function () {
		expect( numberRenderer(',', '.', 0).display(10000000) ).toBe( '10,000,000' );
	} );

	it( 'Simple use case - 1 (thousands - apos)', function () {
		expect( numberRenderer("'", '.', 0).display(1) ).toBe( '1' );
	} );

	it( 'Simple use case - 10 (thousands - apos)', function () {
		expect( numberRenderer("'", '.', 0).display(10) ).toBe( '10' );
	} );

	it( 'Simple use case - 100 (thousands - apos)', function () {
		expect( numberRenderer("'", '.', 0).display(100) ).toBe( '100' );
	} );

	it( 'Simple use case - 1000 (thousands - apos)', function () {
		expect( numberRenderer("'", '.', 0).display(1000) ).toBe( '1\'000' );
	} );

	it( 'Simple use case - 10000 (thousands - apos)', function () {
		expect( numberRenderer("'", '.', 0).display(10000) ).toBe( '10\'000' );
	} );

	it( 'Simple use case - 100000 (thousands - apos)', function () {
		expect( numberRenderer("'", '.', 0).display(100000) ).toBe( '100\'000' );
	} );

	it( 'Simple use case - 1000000 (thousands - apos)', function () {
		expect( numberRenderer("'", '.', 0).display(1000000) ).toBe( '1\'000\'000' );
	} );

	it( 'Simple use case - 10000000 (thousands - apos)', function () {
		expect( numberRenderer("'", '.', 0).display(10000000) ).toBe( '10\'000\'000' );
	} );



	it( 'Simple use case - 1 (decimal)', function () {
		expect( numberRenderer(',', '.', 0).display(1) ).toBe( '1' );
	} );

	it( 'Simple use case - 0.5 (decimal - float)', function () {
		expect( numberRenderer(',', '.', 1).display(0.5) ).toBe( '0.5' );
	} );

	it( 'Simple use case - 1000.5 (decimal + thous)', function () {
		expect( numberRenderer(',', '.', 1).display(1000.5) ).toBe( '1,000.5' );
	} );

	it( 'Simple use case - 1000 (decimal - no thous)', function () {
		expect( numberRenderer('', ',', 1).display(1000) ).toBe( '1000,0' );
	} );

	it( 'Simple use case - 1000 (decimal - euro)', function () {
		expect( numberRenderer('.', ',', 1).display(1000) ).toBe( '1.000,0' );
	} );



	it( 'Precision - 0 dp - round down', function () {
		expect( numberRenderer(',', '.', 0).display(3.141592) ).toBe( '3' );
	} );

	it( 'Precision - 0 dp - round up', function () {
		expect( numberRenderer(',', '.', 0).display(0.999860600) ).toBe( '1' );
	} );

	it( 'Precision - 1 dp - round down', function () {
		expect( numberRenderer(',', '.', 1).display(3.141592) ).toBe( '3.1' );
	} );

	it( 'Precision - 1 dp - round up', function () {
		expect( numberRenderer(',', '.', 1).display(0.999860600) ).toBe( '1.0' );
	} );

	it( 'Precision - 2 dp - round down', function () {
		expect( numberRenderer(',', '.', 2).display(3.141592) ).toBe( '3.14' );
	} );

	it( 'Precision - 2 dp - round up', function () {
		expect( numberRenderer(',', '.', 2).display(0.999860600) ).toBe( '1.00' );
	} );

	it( 'Precision - 3 dp - round down', function () {
		expect( numberRenderer(',', '.', 3).display(3.141111) ).toBe( '3.141' );
	} );

	it( 'Precision - 3 dp - round up', function () {
		expect( numberRenderer(',', '.', 3).display(0.999860600) ).toBe( '1.000' );
	} );

	it( 'Precision - 4 dp - round down', function () {
		expect( numberRenderer(',', '.', 4).display(3.141111) ).toBe( '3.1411' );
	} );

	it( 'Precision - 4 dp - round up', function () {
		expect( numberRenderer(',', '.', 4).display(0.999860600) ).toBe( '0.9999' );
	} );

	it( 'Precision - 4 dp - thous', function () {
		expect( numberRenderer(',', '.', 4).display(1003.141111) ).toBe( '1,003.1411' );
	} );


	it( 'Prefix - single char - 1', function () {
		expect( numberRenderer(',', '.', 0, '$').display(1) ).toBe( '$1' );
	} );

	it( 'Prefix - single char - 1050.5', function () {
		expect( numberRenderer(',', '.', 1, '$').display(1050.5) ).toBe( '$1,050.5' );
	} );
	
	it( 'Prefix - multi char - 1', function () {
		expect( numberRenderer(',', '.', 0, 'test').display(1) ).toBe( 'test1' );
	} );

	it( 'Prefix - multi char - 1050.5', function () {
		expect( numberRenderer(',', '.', 1, 'bob').display(1050.5) ).toBe( 'bob1,050.5' );
	} );


	it( 'Postfix - single char - 1', function () {
		expect( numberRenderer(',', '.', 0, '', 'c').display(1) ).toBe( '1c' );
	} );

	it( 'Postfix - single char - 1050.5', function () {
		expect( numberRenderer(',', '.', 1, '', 'c').display(1050.5) ).toBe( '1,050.5c' );
	} );

	it( 'Postfix - multi char - 1', function () {
		expect( numberRenderer(',', '.', 0, '', 'frank').display(1) ).toBe( '1frank' );
	} );

	it( 'Postfix - multi char - 1050.5', function () {
		expect( numberRenderer(',', '.', 1, '', 'fred').display(1050.5) ).toBe( '1,050.5fred' );
	} );


	it( 'Prefix and postfix - single char - 1', function () {
		expect( numberRenderer(',', '.', 0, '$', 'c').display(1) ).toBe( '$1c' );
	} );

	it( 'Prefix and postfix - single char - 1050.5', function () {
		expect( numberRenderer(',', '.', 1, '$', 'c').display(1050.5) ).toBe( '$1,050.5c' );
	} );


	it( 'Prefix and postfix - multi char - 1', function () {
		expect( numberRenderer(',', '.', 0, 'frances', 'fiona').display(1) ).toBe( 'frances1fiona' );
	} );

	it( 'Prefix and postfix - multi char - 1050.5', function () {
		expect( numberRenderer(',', '.', 1, 'fabia', 'fable').display(1050.5) ).toBe( 'fabia1,050.5fable' );
	} );


	it( 'Non-numeric data is not renderer', function () {
		expect( numberRenderer(',', '.', 1, 'a', 'b').display('fiona') ).toBe( 'fiona' );
	} );

	it( 'Non-numeric HTML data is escaped', function () {
		expect( numberRenderer(',', '.', 1, 'a', 'b').display('<span>1</span>') ).toBe( '&lt;span&gt;1&lt;/span&gt;' );
	} );
} );