/**
 * Created by Bohdan on 23.11.2015.
 */
$(document).ready( function() {
    $('#container').load('resources2.html #window_loginScreen', function() {
        if (local_email) {
            $($('#input_email')).attr('placeholder', local_email);
        }
    });
    $('body').css('height', $(document).height());
});
function onDeviceReady() {
}
var $body = $('body');
var local_email = localStorage['Lelly_login_email'];
var contacts = {};
var photo;

//--------------------------- SCREEN 2 ---------------------------
$body.on("focus", '#input_personalPin, #input_newPin, #input_newPinConfirm', function(e) {
    e.preventDefault();
});
$body.on("focus", 'input', function() {
    $(this).css('border-color','');
    $(this).removeClass('placeholder');
});
$body.on("click", '#input_personalPin', function() {
    logPinDialog();
});
$body.on('click', '#btn_logOut', function() {
    request_logged('POST','site','logout','', logOut);
});
$body.on('submit', 'form[name="login"]', function() {
    var $input_email = $('#input_email');
    var input_email_placeholder = $input_email.attr('placeholder');
    var _email;
    var _pin = $('#input_personalPin').val();
    if (checkPin(_pin) == false) {
        $('#input_personalPin').css('border-color','red').addClass('placeholder');
        return false;
    }
    if ($input_email.val().length > 0) {
        _email = $input_email.val();
    }
    else {
        if (input_email_placeholder === 'email') {
            $('#input_email').css('border-color','red').addClass('placeholder');
            return;
        }
        _email = input_email_placeholder;
        $input_email.val(_email);
    }
    // request to server;
    var data = {AppLoginForm:{'email': _email,
                'pin': _pin}};
    $('.spinner').css('display','inline-block');
    request('POST','site','login', data, login);
    show_moodscreen('Bohdan');
});
$body.on("click", "#link_forgotPin", function() {
    $(WINDOW_SWITCH_LOGIN_1_2).toggleClass('hide');
});
$body.on("click", "#btn_goToRegister", function() {
    $('#container').load('resources2.html #window_registerScreen');
});

//--------------------------  SCREEN 3  -----------------------
$body.on("click", "#btn_sendPin", function() {
    var _email = $('#input_recoverEmail').val();
    alert(_email + ' ready to send to server');

    // request to server;

    var data = {};
    data.email = _email;
    request('type','site','send-new-pin-on-email', data, forgotPin, errorCallBack);
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
    $('#container').load('resources2.html #window_loginScreen', function() {
        $(WINDOW_SWITCH_LOGIN_1_2).toggleClass('hide');
    });
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
    console.log(data);
    request('POST','site','email-is-used', data, checkEmail,errorCallBack);
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
        $('#input_newPin').css('border-color','red').addClass('placeholder');
        return false}
    if (_input_name.length == 0 || _input_surname.length == 0 || _input_birthDate.length == 0 || _input_location.length == 0 || _input_email.length == 0) {
        alert('Please, fill in all the fields');
        var form = $('#form_register');
        for (var i=0; i < form.length-1; i++) {
            if(form[i].val()==0) {
                form[i].css('border-color','red').addClass('placeholder');
            }
        }
        return false;
    }
    if (input_emailConfirm !== _input_email) {
        $('#input_regEmailConfirm').css('border-color','red').addClass('placeholder');
        return false;
    }
    if (_input_pin !== input_pinConfirm) {
        $('#input_newPinConfirm').css('border-color','red').addClass('placeholder');
        return false;
    }
    $('#spinner_regInfo').css('display','block');
    request('GET','site','get-likes-struggles-arr','', download_likesAndStruggles,errorCallBack);
    //-----------------------------  SCREEN 7 ------------------------
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
    request('POST','site', 'register-user', data, register_finish);
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
    //var options      = new ContactFindOptions();
    //options.filter   = $('#input_supportName').val();
    //options.multiple = true;
    //options.desiredFields = [navigator.contacts.fieldType.id];
    //options.hasPhoneNumber = true;
    //var fields       = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name];
    //navigator.contacts.find(fields, onSuccess, function(err) {console.log(err)}, options);
    navigator.contacts.pickContact(function (contact) {
        var name = contact.displayName;
        var phone = contact.phoneNumbers[0].value;
        phone = phone.replace(/\-|\x20/g, "");
        contacts.person_support_name = name;
        contacts.person_support_phone = phone;
        $('#input_supportName').val(name);
    });
});
function onSuccess(contacts) {
    alert('Found ' + contacts.length + ' contacts.');
};

//-----------------------------  SCREEN 10 ----------------------------------------------------------
$body.on('click', 'btn_regComplete', function() {
    show_moodscreen(user_name);
});
//-----------------------------  SCREEN 11 ----------------------------------------------------------
$body.on('click', '.smile-one', function() {
    var data = $(this).attr('mood');
    var action = 'mood';
    console.log(data);
    if (data === 'happy' || data === 'awesome' || data === 'omg' || data === 'unsure' || data === 'meh' || data === 'horror') {
    //    Mood is positive or neutral
        request_logged('POST', 'site', action, data, request_result);
       $('#container').load('resources2.html #window_moodPositive')
    }
    else {
    //    Mood is negative
        request_logged('POST', 'site', action, data, request_result);
        $('#container').load('resources2.html #window_moodNegative')
    }
});
$body.on('click', '.btn_menu',function() {
    $('#container').load('resources2.html #window_loginScreen');
});
$body.on('click','.btn_emergency', function() {
    $('#container').load('resources2.html #window_loginScreen');
});

//-----------------------------  SCREEN 12 ----------------------------------------------------------
$body.on('click', '#btn_selectTask', function() {
    $(WINDOW_SWITCH_MAIN_12_15).toggleClass('hide');
});
$body.on('click', '#btn_activityRec', function() {
    $(WINDOW_SWITCH_MAIN_12_13).toggleClass('hide');
});

//-----------------------------  SCREEN 13 ----------------------------------------------------------
$body.on('click', '#btn_activityRecDone', function() {
    var title = $('#input_activityRecTitle').val();
    var textarea = $('#textarea_activityRec').val();
    var data = {
        'title': title,
        'text': textarea,
        'photo': photo,
        'contact': contacts
    };
    //TEMPORARY comment for testing without connection
    //$('#reward_for_activity_complete').text(result.reward);
    $(WINDOW_SWITCH_MAIN_13_14).toggleClass('hide');
    photo = null;
    request_logged('POST','site', 'action', data, activityRecorded);
});
$body.on('click', '#btn_activityAddPhoto', function() {
    var element = $(this).find('div');
    addImage(element);
});
$body.on('click', '#btn_activityAddContact', function() {
    var element = $(this).find('div');
    addContact(element);
});
//-----------------------------  SCREEN 14 ----------------------------------------------------------
$body.on('click', '#btn_activityComplete', function() {
    $('#container').load('resources2.html #window_moodScreen');
});
//-----------------------------  SCREEN 15 ----------------------------------------------------------
$body.on('click', '.task-block', function() {
    var item = $(this);
    var item_value = item.find('p').text();
    $('#container').load('resources2.html #window_taskRecorder', function() {
        $('#input_taskRecTitle').val(item_value);
    })
});
$body.on('click', '#btn_taskRefresh', function() {
    var action = 'task-refresh';
    request_logged('GET','site', action, null, getTasks);
});

//-----------------------------  SCREEN 16 ----------------------------------------------------------
$body.on('click', '#btn_taskRecDone', function() {
    var title = $('#input_taskRecTitle').val();
    var textarea = $('#textarea_taskRec').val();
    var data = {
        'title': title,
        'text': textarea,
        'photo': photo,
        'contact': contacts
    };
    //TEMPORARY function for testing without connection
    //$('#reward_for_task_complete').text(result.reward);
    $(WINDOW_SWITCH_MAIN_16_17).toggleClass('hide');
    request_logged('POST', 'site', 'action', data, taskRecorded);
});
$body.on('click', '#btn_taskAddPhoto', function() {
    var element = $(this).find('div');
    addImage(element);
});
$body.on('click', '#btn_taskAddContact', function() {
    var element = $(this).find('div');
    addContact(element);
});

//-----------------------------  SCREEN 17 ----------------------------------------------------------
$body.on('click', '#btn_taskComplete', function() {
    $('#container').load('resources2.html #window_moodScreen');
});