
describe( 'Static method - type', function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	it( 'Exists', function () {
		expect( typeof DataTable.type ).toBe( 'function' );
	} );


	describe( 'Single parameter', function() {
		it( 'Gets an object', function () {
			expect( typeof DataTable.type('num') ).toBe( 'object' );
		} );

		it( 'Object has expected parameters - num', function () {
			let num = DataTable.type('num');

			expect( num.className ).toBe( 'dt-right' );
			expect( typeof num.detect ).toBe( 'function' );
			expect( typeof num.order ).toBe( 'object' );
			expect( typeof num.order.pre ).toBe( 'function' );
			expect( num.search ).toBe( undefined );
		} );

		it( 'Object has expected parameters - html', function () {
			let num = DataTable.type('html');

			expect( num.className ).toBe( undefined );
			expect( typeof num.detect ).toBe( 'function' );
			expect( typeof num.order ).toBe( 'object' );
			expect( typeof num.order.pre ).toBe( 'function' );
			expect( typeof num.search ).toBe( 'function' );
		} );
	});

	describe( 'Two parameters', function() {
		let table;

		it( 'Set custom type - return is undefined', function () {
			var ret = DataTable.type('test', {
				className: 'dt-center',
				detect: function (data) {
					return typeof data === 'string' && data.includes('$')
						? true : false
				},
				order: {
					pre: function (d) {
						return d.replace(/[^\d]/g, '') * 1;
					}
				},
				search: function (d) {
					return d.replace(/[^\d]/g, '');
				}
			});

			expect( ret ).toBe( undefined );
		} );

		it('Custom type can be accessed', function() {
			var ret = DataTable.type('test');

			expect( ret.className ).toBe( 'dt-center' );
			expect( typeof ret.detect ).toBe( 'function' );
			expect( typeof ret.order ).toBe( 'object' );
			expect( typeof ret.order.pre ).toBe( 'function' );
			expect( typeof ret.search ).toBe( 'function' );
		});

		dt.html('basic');

		it('Is auto applied to our target column', function() {
			table = new DataTable('#example');

			expect( table.column(5).type() ).toBe( 'test' );
		});

		it('Class is used', async function() {
			expect( $('#example tbody tr:first-child td:last-child').hasClass('dt-center') ).toBe( true );
		});

		it('Ordering is used', async function() {
			await dt.clickHeader(5);

			expect( $('#example tbody tr:first-child td:last-child').text() ).toBe( '$75,650' );
		});

		it('Ordering is used - reverse', async function() {
			await dt.clickHeader(5);

			expect( $('#example tbody tr:first-child td:last-child').text() ).toBe( '$1,200,000' );
		});

		it('Search is used', function() {
			table.search('850000').draw();

			expect( $('#example tbody tr:first-child td:first-child').text() ).toBe( 'Fiona Green' );
		});
	});

	describe( 'Three parameters', function() {
		let table;

		dt.html('basic');

		it('Change class name', function() {
			DataTable.type('test', 'className', 'dt-left');
			table = new DataTable('#example');

			expect( $('#example tbody tr:first-child td:last-child').hasClass('dt-left') ).toBe( true );
		});

		dt.html('basic');

		it('Change detection function', function() {
			DataTable.type('test', 'detect', function () { return false; });
			table = new DataTable('#example');

			expect( table.column(5).type() ).toBe( 'num-fmt' );
		});

		dt.html('basic');

		it('Change sort function', async function() {
			// Restore type detection
			DataTable.type('test', 'detect', function (data) {
				return typeof data === 'string' && data.includes('$')
					? true : false
			});

			DataTable.type('test', 'order', {
				pre: function (d) {
					return d.replace(/[^\d]/g, '') * -1;
				}
			});

			table = new DataTable('#example');

			await dt.clickHeader(5);

			expect( $('#example tbody tr:first-child td:last-child').text() ).toBe( '$1,200,000' );
		});

		it('Ordering is used - reverse', async function() {
			await dt.clickHeader(5);

			expect( $('#example tbody tr:first-child td:last-child').text() ).toBe( '$75,650' );
		});

		dt.html('basic');

		it('Change search function', function() {
			DataTable.type('test', 'search', function (d) {
				return d.replace(',', 'x');
			});

			table = new DataTable('#example');
			table.search('645x750').draw();

			expect( $('#example tbody tr:first-child td:first-child').text() ).toBe( 'Jackson Bradshaw' );	
		});
	});
});
