

_api_register( 'exclude()', function ( input, regex, smart, caseInsen ) {
    var ctx = this.context;

    if ( input === undefined ) {
        // get
        return ctx.length !== 0 ?
            ctx[0].oPreviousExclude.sSearch :
            undefined;
    }

    // set
    return this.iterator( 'table', function ( settings ) {
        if ( ! settings.oFeatures.bFilter ) {
            return;
        }

        _fnExcludeComplete( settings, $.extend( {}, settings.oPreviousExclude, {
            "sSearch": input+"",
            "bRegex":  regex === null ? false : regex,
            "bSmart":  smart === null ? true  : smart,
            "bCaseInsensitive": caseInsen === null ? true : caseInsen
        } ), 1 );
    } );
} );
