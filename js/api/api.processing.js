
_api_register( 'processing()', function ( show ) {
    return this.iterator( 'table', function ( ctx ) {
        _fnProcessingDisplay( ctx, show );
    } );
} );
