/**
 * Created by Bohdan on 23.11.2015.
 */

var $body = $('body');
var WINDOW_SWITCH_LOGIN_1_2 = '#input_personalPin, label[for="input_personalPin"], #input_regEmail, #input_recoverEmail, label[for="input_recoverEmail"], #btn_goToRegister, #btn_sendPin, #btn_forgotPin, input[value="Log in"], #btn_backToLog, p';
var WINDOW_SWITCH_REGISTER_1_2 = '#btn_regNextStep2, #btn_backToStep1, #btn_regNextStep, #btn_backToLogin, #input_newPin1, label[for="input_newPin1"],#input_newPin2, label[for="input_newPin2"]';
var WINDOW_SWITCH_REGISTER_2_3 = '#btn_regNextStep2, #btn_backToStep1, #input_newPin2, label[for="input_newPin2"], #input_regEmail, label[for="input_regEmail"], #btn_regFinish, #btn_backToFirstStep';
//---------------- LOGIN SCREEN One ---------------------------
$body.on('submit', 'form[name="login"]', function() {
   // request to server;
});
$body.on("click", "#btn_forgotPin", function() {
    $(WINDOW_SWITCH_LOGIN_1_2).toggleClass('hide');
});
$body.on("click", "#btn_goToRegister", function() {
    $('#container').load('resources.html #registerScreen');
});
//---------------- FORGOT PIN Screen --------------------------
$body.on("click", "#btn_backToLog", function() {
    $(WINDOW_SWITCH_LOGIN_1_2).toggleClass('hide');
});
//---------------- REGISTER SCREEN One ------------------------
$body.on("click", "#btn_regNextStep", function() {
    $(WINDOW_SWITCH_REGISTER_1_2).toggleClass('hide');
});
$body.on("click", "#btn_backToLogin", function() {
    $('#container').load('resources.html #LoginScreen');
});
//---------------- REGISTER SCREEN Two ------------------------
$body.on("click", "#btn_backToStep1", function() {
    $(WINDOW_SWITCH_REGISTER_1_2).toggleClass('hide');
});
$body.on("click", "#btn_regNextStep2", function() {
    var $inputs = $('input[name="pin"]');
    if ($($inputs[0]).val()!==$($inputs[1]).val()) {
        alert('The entered PIN-code is not the same as the previous');
        return false;
    }
    $(WINDOW_SWITCH_REGISTER_2_3).toggleClass('hide');
});
//---------------- REGISTER SCREEN Three ----------------------
$body.on("click", "#btn_backToFirstStep", function() {
    $(WINDOW_SWITCH_REGISTER_2_3).toggleClass('hide');
    $(WINDOW_SWITCH_REGISTER_1_2).toggleClass('hide');
});
$body.on("submit", "#form_register", function() {
    // Send request to server
});
$(document).ready( function() {
    $('#container').load('resources.html #LoginScreen');
    //document.addEventListener("pause", onPause , false)
});