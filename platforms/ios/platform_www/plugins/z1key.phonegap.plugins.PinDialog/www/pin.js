cordova.define("z1key.phonegap.plugins.PinDialog.PinDialog", function(require, exports, module) { 
module.exports = {

    prompt: function(message, resultCallback, title, buttonLabels) {
        var _message = (message || "Message");
        var _title = (title || "Title");
        var _buttonLabels = (buttonLabels || ["OK","Cancel"]);
        cordova.exec(resultCallback, errorCallBacksd, "PinDialog", "prompt", [_message, _title, _buttonLabels]);
    }

};
function errorCallBacksd(err) {
    console.log(err);
}
});
