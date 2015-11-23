/**
 * Created by Bohdan on 23.11.2015.
 */

var $body = $('body');

$body.on("click", "#btn_goToRegister", function() {
    $('#container').load('resources.html #registerScreen');
});

$body.on("click", "#btn_regNextStep", function() {
    $('#btn_regNextStep2, #btn_backToStep1, #btn_regNextStep, #btn_backToLogin, ').toggleClass('hide');
});

$body.on("click", "#btn_forgotPin", function() {

});

$(document).ready( function() {
    //document.addEventListener("pause", onPause , false)
});