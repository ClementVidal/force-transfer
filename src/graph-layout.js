(function() {

    "use strict";

    window.forceTransfer = {
        newInstance: function() {

            return {

                test: function() {
                    console.log('Hey from test');
                }
            };
        }
    }


}).call(this);
