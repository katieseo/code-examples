// Utility
if ( typeof Object.create !== 'function' ) {
    Object.create = function( obj ) {
        function F() {};
        F.prototype = obj;
        return new F();
    };
}

(function( $, window, document, undefined ){
    var App = {
        init: function( options, elem ) {
            var self = this;

            self.elem = elem;
            self.$elem = $( elem );

            self.url = 'scripts/data.json';

            self.search = ( typeof options === 'string' ) 
                ? options
                : options.search; // object was passed

            self.options = $.extend( {}, $.fn.queryApp.options, options );

            //self.cycle();
            self.refresh(1);
        },

        refresh: function( length ){
            var self = this;

            setTimeout(function() {
                self.fetch().done(function( results ) {
                    results = self.limit( results.results, self.options.limit );

                    self.buildFrag( results );

                    self.display();

                    if ( typeof self.options.onComplete === 'function' ) {
                        self.options.onComplete.apply( self.elem, arguments );
                    }

                    if ( self.options.refresh ) {
                        self.refresh();
                    }
                });
            }, length || self.options.refresh );
        },

        fetch: function(){
            return $.ajax({
                url: this.url,
                dataType: 'json'
                // data: {q: this.search},
                // dataType: 'jsonp'
            });
        },

        buildFrag: function( results ){
            var self = this;

            self.text = $.map( results, function( obj, i) {
                return $( self.options.wrapEachWith ).append ( obj.text )[0];
            });
        },

        display: function(){
            var self = this;

            if ( self.options.transition === 'none' || !self.options.transition ) {
                self.$elem.html( self.text ); // that's available??
            } else {
                self.$elem[ self.options.transition ]( 500, function() {
                    $(this).html( self.text )[ self.options.transition ]( 500 );
                });
            }
        },

        limit: function( obj, count ) {
            return obj.slice( 0, count );
        }
    };    

    $.fn.queryApp = function( options ){
        return this.each(function(){

            var app = Object.create( App );
            app.init( options, this );

            $.data( this, 'queryApp', app );
        });
    };

    $.fn.queryApp.options = {
        search: 'default',
        wrapEachWith: '<li></li>',
        limit: 5,
        refresh: null,
        onComplete: null,
        transition: 'fadeToggle'
    };

})( jQuery, window, document );