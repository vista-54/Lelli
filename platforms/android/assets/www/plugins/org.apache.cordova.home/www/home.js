cordova.define("org.apache.cordova.home.home", function(require, exports, module) { var exec = require('cordova/exec');
var platform = require('cordova/platform');

module.exports = {

    home: function(successCallback, errorCallback) {
        exec(successCallback, null, 'Home', 'goHome', [successCallback, errorCallback]);
    }
};
});
