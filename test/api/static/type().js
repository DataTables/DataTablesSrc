
describe( 'Static method - type', function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables', 'moment' ],
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

			expect( num.className ).toBe( 'dt-type-numeric' );
			expect( typeof num.detect ).toBe( 'object' );
			expect( typeof num.detect.oneOf ).toBe( 'function' );
			expect( typeof num.detect.allOf ).toBe( 'function' );
			expect( typeof num.order ).toBe( 'object' );
			expect( typeof num.order.pre ).toBe( 'function' );
			expect( num.render ).toBe( undefined );
			expect( num.search ).toBe( undefined );
		} );

		it( 'Object has expected parameters - html', function () {
			let num = DataTable.type('html');

			expect( num.className ).toBe( undefined );
			expect( typeof num.detect ).toBe( 'object' );
			expect( typeof num.detect.oneOf ).toBe( 'function' );
			expect( typeof num.detect.allOf ).toBe( 'function' );
			expect( typeof num.order ).toBe( 'object' );
			expect( typeof num.order.pre ).toBe( 'function' );
			expect( typeof num.search ).toBe( 'function' );
			expect( num.render ).toBe( undefined );
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
			expect( ret.render ).toBe( undefined );
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

		dt.html('ISO8601');

		it('Auto renderer - date', function() {
			// Set text to trigger renderer
			$('tbody tr:first-child td:nth-child(4)').text(1234567);

			DataTable.type('date', 'render', DataTable.render.date('D/M/YY'));
			DataTable.type('num', 'render', DataTable.render.number());

			table = new DataTable('#example');

			expect( $('#example tbody tr:first-child td:nth-child(5)').text() ).toBe( '28/11/08' );	
		});

		it('Auto renderer - number', async function() {
			await dt.clickHeader(3);
			await dt.clickHeader(3);

			expect( $('#example tbody tr:first-child td:nth-child(4)').text() ).toBe( '1,234,567' );	
		});

		it('Auto renderer - remove', async function() {
			DataTable.type('date', 'render', null);
			DataTable.type('num', 'render', null);

			delete window.moment;

			expect(1).toBe(1);
		});

		dt.html('basic');

		it('Init val for num-fmt', function() {
			expect(DataTable.type('num-fmt').className).toBe('dt-type-numeric');
		});

		it('Empty string for class', function() {
			DataTable.type('num-fmt', 'className', '');

			expect(DataTable.type('num-fmt').className).toBe('');
		});

		it('No class used for the cells', function() {
			table = new DataTable('#example');

			expect( $('#example tbody tr:first-child td:last-child').hasClass('dt-type-numeric') ).toBe( false );	
		});

		it('Restore', function() {
			DataTable.type('num-fmt', 'className', 'dt-type-numeric');

			expect(DataTable.type('num-fmt').className).toBe('dt-type-numeric');
		});
	});
});
