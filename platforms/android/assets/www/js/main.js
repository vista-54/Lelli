/**
 * Created by Bohdan on 23.11.2015.
 */

var $body = $('body');
var pincode;
var local_email = localStorage['Lelly_login_email'];
var WINDOW_SWITCH_LOGIN_1_2 = '#div_login, #div_forgotPin';
var WINDOW_SWITCH_LOGIN_2_3 = '#div_forgotPin, #div_sendPin';
var WINDOW_SWITCH_REGISTER_1_2 = '#div_registerInfo, #div_registerLikes';
var WINDOW_SWITCH_REGISTER_2_3 = '#div_registerLikes, #div_registerStruggles';
var WINDOW_SWITCH_REGISTER_3_4 = '#div_registerStruggles, #div_registerContacts';
var WINDOW_SWITCH_REGISTER_4_5 = '#div_registerContacts, #div_registerComplete';

// Check the Pin length UNIVERSAL Function
function checkPin(value) {
    if (value == 0) {
        alert('PIN-Code is empty');
        return false;
    }
    if (value.length < 4) {
        alert('PIN-Code must have 4 character length');
        return false;
    }
}
//--------------------------- SCREEN 2 ---------------------------
$body.on("keyup", "#input_pinMask", function() {
    var $input_pinMask = $("#input_pinMask");
    var $input_personalPin = $("#input_personalPin");
    var inputLength = $input_pinMask.val().length;
    var pinLength = $input_personalPin.val().length;
    if (inputLength > pinLength) {
        var inputLastChar = $input_pinMask.val().charAt(inputLength-1);
        $input_personalPin.val($input_personalPin.val() + inputLastChar);
    } else {
        $input_personalPin.val($input_personalPin.val().substring(0, $input_pinMask.val().length));
    }
    var i = 0;
    var maskPassword = "";
    while (i < $input_pinMask.val().length) {
        maskPassword += "•";
        i++;
    }
    $input_pinMask.val(maskPassword);
});
$("#input_pinMask").blur(function() {
    var $input_personalPin = $("#input_personalPin");
    $input_personalPin.focus();
    $input_personalPin.blur();
});

$body.on('submit', 'form[name="login"]', function() {
    var $input_email = $('#input_email');
    var input_email_placeholder = $input_email.attr('placeholder');
    var _email;
    var _pin = $('#input_personalPin').val();
    if (checkPin(_pin) == false) {return}
    if ($input_email.val().length > 0) {
        _email = $input_email.val();
    }
    else {
        if (input_email_placeholder === 'email') {
            alert('Enter your email please');
            return;
        }
        _email = input_email_placeholder;
        $input_email.val(_email);
    }
    // request to server;
    var form_login = $('form[name="login"]').serialize();
    var data = ['login', form_login];

    // Response true CallBack
    localStorage.setItem('Lelly_login_email', _email);
    alert(data + ' ready to send to server');
    // Error CallBack
    //alert("Email doesn't exist or pin was wrong");
    //$(WINDOW_SWITCH_LOGIN_1_4).toggleClass('hide');
});
$body.on("click", "#link_forgotPin", function() {
    $(WINDOW_SWITCH_LOGIN_1_2).toggleClass('hide');
});
$body.on("click", "#btn_goToRegister", function() {
    $('#container').load('resources.html #window_registerScreen');
});
//--------------------------  SCREEN 3  -----------------------
$body.on("click", "#btn_sendPin", function() {
    var _email = $('#input_recoverEmail').val();
    alert(_email + ' ready to send to server');

    // request to server;

    var url = 'http://simple.com';
    var data = {};
    data.id = 'forgotPin';
    data.body = _email;
    data = JSON.stringify(data);
    try {
        $.post(url, data, function (result) {
            console.log('Success request' + url + data);
            $(WINDOW_SWITCH_LOGIN_2_3).toggleClass('hide');
        });
    }
    catch (err) {
        console.log('Error request' + err.name + ' ' + err.message);
    }

    //Error callback
    //alert('Whats was wrong');

});
$body.on("click", "#btn_backToLog", function() {
    $(WINDOW_SWITCH_LOGIN_1_2).toggleClass('hide');
});

//--------------------------  SCREEN 4 ------------------------
$body.on("click", "#btn_backToLog2", function() {
    $(WINDOW_SWITCH_LOGIN_2_3).toggleClass('hide');
    $(WINDOW_SWITCH_LOGIN_1_2).toggleClass('hide');
});

//--------------------------  SCREEN 5 ------------------------
$body.on("click", "#btn_lockedContinue", function() {
    navigator.app.exitApp();
});

//---------------------------  SCREEN 6 ------------------------
$body.on("keyup", "#input_name", function() {
    $("#input_name").val($("#input_name").val().replace(/[^a-zа-яіїєґ]/i, ''));
});
$body.on("keyup", "#input_surname", function() {
    $("#input_surname").val($("#input_surname").val().replace(/[^a-zа-яіїєґ]/i, ''));
});
$body.on("blur", '#input_regEmail', function() {
    var _input_email = $('#input_regEmail').val();
    $('#form_register').find('p.alert').remove();
    // Request to server to identity email
    var url = 'http://simple.com';
    var data = {};
    data.id = 'registerEmail';
    data.body = _input_email;
    try {
        $.post(url, data, function (result) {
            $('#input_regEmail').before(function (index) {
                if (result == false) {
                    return '<p class="alert red">Email is not available</p>'
                }
                else {
                    return '<p class="alert green">Email is available</p>'
                }
            });
        });
    }
    catch (err) {
        console.log('Error:' + err.name + ' ' + err.message);
        $('#input_regEmail').before(function (index) {
                return '<p class="alert red">' + err.name + ' '+ err.message +'</p>';
        });
    }
});
$body.on("click", "#btn_backToLogin", function() {
    $('#container').load('resources.html #window_loginScreen', function() {
        if (local_email) {
            $($('#input_email')).attr('placeholder', local_email);
        }
    });
});
$body.on("click", "#btn_regNextStep", function() {
    var _input_name = $('#input_name').val();
    var _input_surname = $('#input_surname').val();
    var _input_birthDate = $('#input_birthdate').val();
    var _input_location = $('#input_location').val();
    var _input_pin = $('#input_newPin').val();
    var input_pinConfirm = $('#input_newPinConfirm').val();
    var _input_email = $('#input_regEmail').val();
    var input_emailConfirm = $('#input_regEmailConfirm').val();
    if (checkPin(_input_pin) == false) {
        return false}
    if (_input_name.length == 0 || _input_surname.length == 0 || _input_birthDate.length == 0 || _input_location.length == 0 || _input_email.length == 0) {
        alert('Please, fill in all the fields');
        return false;
    }
    if (input_emailConfirm !== _input_email) {
        alert('Please enter the same emails');
        return false;
    }
    if (_input_pin !== input_pinConfirm) {
        alert('Please enter the same PIN-Codes');
        return false;
    }
    var url = 'http://simple.com';
    var data = ['regOptionsList'];
    try {
        $.post(url,data, function(_result) {
            var result = _result;
            $.each(result.likes, function(index,value) {
                $('#likes').append('<li><span>' + value + '</span><input type="radio" name="' + value + '" value="0"><input type="radio" name="' + value + '" value="1"></li>');
            });
            $.each(result.struggles, function(index,value) {
                $('#struggles').append('<li><span>' + value + '</span><input type="checkbox" name="' + value + '"></li>')
            })
        })
    }
    catch (err) {
        console.log('Request Error: '+ err.name + ' ' + err.message);
    }
    //-----------------------------  SCREEN 7 ------------------------

    $(WINDOW_SWITCH_REGISTER_1_2).toggleClass('hide');
});
$body.on("click", "#btn_backToStep1", function() {
    $(WINDOW_SWITCH_REGISTER_1_2).toggleClass('hide');
});
$body.on("click", "#btn_regNextStep3", function() {
    $(WINDOW_SWITCH_REGISTER_2_3).toggleClass('hide');
});
//-----------------------------  SCREEN 8 ----------------------
$body.on("click", "#btn_backToStep2", function() {
    $(WINDOW_SWITCH_REGISTER_2_3).toggleClass('hide');
});
$body.on("click", "#btn_nextStep4", function() {
    $(WINDOW_SWITCH_REGISTER_3_4).toggleClass('hide');
});

//-----------------------------  SCREEN 9 ----------------------
$body.on("click", "#btn_backToStep3", function() {
    $(WINDOW_SWITCH_REGISTER_3_4).toggleClass('hide');
});
$body.on("click", "#btn_regFinish", function() {
    var form_info = $('form[name="info"]').serialize();
    var form_likes = $('form[name="likes"]').serialize();
    var form_struggles = $('form[name="struggles"]').serialize();
    var form_contacts = $('form[name="contacts"]').serialize();
    var form = form_info + '&' + form_likes + '&' + form_struggles +'&'+ form_contacts;
    var url= 'http://simple.com';
    var data = ['registerForm', form];
    data = JSON.stringify(data);
    try {
        $.post(url, data, function(result) {
            if (result == false) {
                alert('Error:' + result);
                return false;
            }
            else {
                alert('Data: '+ data + 'Request: '+ result);
                $(WINDOW_SWITCH_REGISTER_4_5).toggleClass('hide');
            }
        })
    }
    catch (err) {
        console.log('error: ' + err.name +' '+ err. message +' '+ err.stack);
    }
});
$body.on('click', '#btn_friend', function() {
    navigator.contacts.pickContact(function(contact) {
        var name = contact.displayName;
        $('#input_friend').val(name);
    }, function(err) {
        console.log(err);
    });
});
$body.on('click', '#btn_support', function() {
    navigator.contacts.pickContact(function(contact) {
        var name = contact.displayName;
        $('#input_support').val(name);
    }, function(err) {
        console.log(err);
    });
});
//-----------------------------  SCREEN 9 ----------------------
$body.on("click", "#btn_regComplete", function() {
    $('#container').load('resources.html #window_loginScreen', function() {
        if (local_email) {
            $($('#input_email')).attr('placeholder', local_email);
        }
    });
});

$(document).ready( function() {
    $('#container').load('resources.html #window_loginScreen', function() {
        if (local_email) {
            $($('#input_email')).attr('placeholder', local_email);
        }
    });
});