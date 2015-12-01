/**
 * Created by Bohdan on 23.11.2015.
 */

var $body = $('body');
var local_email = localStorage['Lelly_login_email'];
var WINDOW_SWITCH_LOGIN_1_2 = '#div_login, #div_forgotPin';
var WINDOW_SWITCH_LOGIN_2_3 = '#div_forgotPin, #div_sendPin';
var WINDOW_SWITCH_REGISTER_1_2 = '#div_registerInfo, #div_registerLikes';
var WINDOW_SWITCH_REGISTER_2_3 = '#div_registerLikes, #div_registerStruggles';
var WINDOW_SWITCH_REGISTER_3_4 = '#div_registerStruggles, #div_registerContacts';
var WINDOW_SWITCH_REGISTER_4_5 = '#div_registerContacts, #div_registerComplete';
var contacts = {"person_win_name": 'Vasya',
                "person_win_phone": '0950017346',
                "person_support_name": 'Petya',
                "person_support_phone": '0963820290'
                };
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
function logPinDialog() {
    window.plugins.pinDialog.prompt(" ", function(results) {
        if(results.buttonIndex == 1)
        {
            // OK clicked, show input value
            $('#input_personalPin').val(results.input1).blur();
        }
        if(results.buttonIndex == 2)
        {
            // Cancel clicked
            $('#input_personalPin').blur();
            return false;
        }
    }, "Enter PIN", ["OK","Cancel"]);
}
function regPinDialog() {
    window.plugins.pinDialog.prompt(" ", function(results) {
        if(results.buttonIndex == 1)
        {
            // OK clicked, show input value
            $('#input_newPin').val(results.input1).blur();
        }
        if(results.buttonIndex == 2)
        {
            // Cancel clicked
            return false;
        }
    }, "Enter PIN", ["OK","Cancel"]);
}
function regPinConfirmDialog() {
    window.plugins.pinDialog.prompt(" ", function(results) {
        if(results.buttonIndex == 1)
        {
            $('#input_newPinConfirm').val(results.input1).blur();
        }
        if(results.buttonIndex == 2)
        {
            return false;
        }
    }, "Confirm PIN", ["OK","Cancel"]);
}
$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
//--------------------------- SCREEN 2 ---------------------------
$body.on("focus", '#input_personalPin, #input_newPin, #input_newPinConfirm', function(e) {
    e.preventDefault();
});
$body.on("click", '#input_personalPin', function() {
    logPinDialog();
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
    var data = {'email': _email,
                'pin': _pin};
    var url = URL + '/v1/site/login';
    $.post(url, data, onAjaxSuccess, onAjaxError);
    //startLoadingAnimation();
    console.log(data);
    function onAjaxSuccess(_result) {
        //stopLoadingAnimation();
        console.log(_result);
        if(_result == true) {
            localStorage.setItem('Lelly_login_email', _email);
            alert(data + ' ready to send to server');
        }
        else {
            console.log('Error: ' + _result)
        }
    }
    // Response true CallBack
    function onAjaxError() {
        alert("Could't connect to server");
        return false;
    }
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
$body.on('focus', '#input_birthdate', function(e) {
    e.preventDefault();
});
$body.on('click', '#input_birthdate', function() {
    datePicker.show({date: new Date(),mode: 'date'}, function(date){
        var month = date.getMonth() + 1;
        var d = date.getFullYear() + '-'+ month +'-'+date.getDate();
        $('#input_birthdate').val(d).blur();
    });
});
$body.on("click", '#input_newPin', regPinDialog);
$body.on("click", '#input_newPinConfirm', regPinConfirmDialog);
$body.on("blur", '#input_regEmail', function() {
    var _input_email = $('#input_regEmail').val();
    $('#form_register').find('p.alert').remove();
    // Request to server to identity email
    var data = {};
    data.email = _input_email;
    var url = URL + '/v1/site/email-is-used';
    //data = JSON.stringify(data);
    console.log(data);
    try {
        $.post(url, data, function (result) {
            $('#input_regEmail').before(function (index) {
                console.log(result);
                if (result.email_is_used == true) {
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
    $('#container').load('resources2.html #window_loginScreen', function() {
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
    var url = URL + '/v1/site/get-likes-struggles-arr';
    try {
        $.get(url, function(_result) {
            $.each(_result.likes, function(index,value) {
                $('#likes').append('<li><span>' +  value + '</span><input type="radio" name="' + index + '" value="1"><input type="radio" name="' + index + '" value="0"  checked></li>');
            });
            $.each(_result.struggles, function(index,value) {
                $('#struggles').append('<li><span>' + value + '</span><input type="checkbox" name="' + index + '"></li>')
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
    var info = {"first_name": $('#input_name').val(),
        "surname": $('#input_surname').val(),
        "birthday": $('#input_birthdate').val(),
        "city": $('#input_location').val(),
        "email": $('#input_regEmail').val(),
        "pin": $('#input_newPin').val()};
    var likes = $('form[name="likes"]').serializeObject();
    var struggles = $('form[name="struggles"]').serializeObject();
    var data = {"User" : info, "Likes" : likes, "Struggles" : struggles, "AppUser": contacts};
    console.log(data);
    url = URL + '/v1/site/signup';
    try {
        $.post(url, data, function(result) {
            console.log(result);
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
        var phone = contact.phoneNumbers[0].value;
        phone = phone.replace(/\-|\x20/g,"");
        contacts.person_win_name = name;
        contacts.person_win_phone = phone;
        $('#input_friendName').val(name);
    }, function(err) {
        console.log(err);
    });
});
$body.on('click', '#btn_support', function() {
    navigator.contacts.pickContact(function(contact) {
        var name = contact.displayName;
        var phone = contact.phoneNumbers[0].value;
        phone = phone.replace(/\-|\x20/g,"");
        contacts.person_support_name = name;
        contacts.person_support_phone = phone;
        $('#input_supportName').val(name);
    }, function(err) {
        console.log(err);
    });
});
//-----------------------------  SCREEN 9 ----------------------
$body.on("click", "#btn_regComplete", function() {
    $('#container').load('resources2.html #window_loginScreen', function() {
        if (local_email) {
            $($('#input_email')).attr('placeholder', local_email);
        }
    });
});

$(document).ready( function() {
    $('#container').load('resources2.html #window_loginScreen', function() {
        if (local_email) {
            $($('#input_email')).attr('placeholder', local_email);
        }
    });
    $('body').css('height', $(document).height());
});