var $body = $('body');
var local_email = localStorage['Lelly_login_email'];
var contacts = {};
var photo = [];
var mood;
var geo_location = {};
var star_points = null;
var graph = {
    'label' : GRAPH_LABEL[1],
    'data' : [[2,4,3,6,7,8,3,5,7,8,4,3,5],[7,5,6,6,7,3,2,4,1,8,6,3,1]]
    };

$(document).ready( function() {
    $('body').css('height', $(window).height());
    $('#container').load('resources2.html #window_loginScreen', function() {
        if (local_email) {
            $($('#input_email')).attr('placeholder', local_email);
        }
    });
});
function onDeviceReady() {
    document.addEventListener("backbutton", onBackKeyDown, false);
    console.log(device.platform);
}
$body.on('submit','form', function(e) {
    //cordova.plugins.Keyboard.close();
    e.preventDefault();
});

// ------------------------------ MENU BUTTONS ------------------------------------------------------
$body.on('click', '.btn_menu', function(event){
    $("#window_menu").stop(true,true).animate({width: "100%"},250);
    event.stopPropagation();
});

$body.on('click', '.top-menu, .bot-menu, .bot-menu ul li', function(event) {
    function menuContainerShow() {
            $('#menu_container').fadeIn(400);
    }
    if($(this).hasClass('top-menu')) {
        $('#menu_container').fadeOut(400);
    }
    else {
        switch (this.id) {
            case 'btn_menu_info' :
                hideMenu();
                $('#menu_container').load('resources2.html #window_menu_info', function () {
                    menuContainerShow();
                });
                break;
            case 'btn_menu_overview' :
                hideMenu();
                $('#menu_container').load('resources2.html #window_menu_overview', function () {
                    menuContainerShow();
                    buildgraph(graph);
                });
                break;
            case 'btn_menu_connections':
                hideMenu();
                $('#menu_container').load('resources2.html #window_menu_connections', function () {
                    menuContainerShow();
                });
                break;
            case 'btn_menu_password':
                hideMenu();
                $('#menu_container').load('resources2.html #window_menu_password', function () {
                    menuContainerShow();
                });
                break;
            case 'btn_menu_points':
                hideMenu();
                $('#menu_container').load('resources2.html #window_menu_points', function () {
                    menuContainerShow();
                });
                break;
            case 'btn_menu_expansions' :
                hideMenu();
                $('#menu_container').load('resources2.html #window_menu_expansions', function () {
                    menuContainerShow();
                });
                break;
            default:
                event.stopPropagation();
        }
    }
});

$body.on('click', '.a25', function(){
    hideMenu();
});

$body.on('click','.btn_emergency', function() {
    var names = [];
    menuContainerHide();
    if (localStorage['Lelly_contacts']) {
    names.push(JSON.parse(localStorage['Lelly_contacts']).friend.name);
    names.push(JSON.parse(localStorage['Lelly_contacts']).support.name);
    names.push(JSON.parse(localStorage['Lelly_contacts']).non_urgent);
    names.push(JSON.parse(localStorage['Lelly_contacts']).emergency);
    }
    else {
        request_logged('GET', 'site', 'action', null, function (result) {
            names.push(result.contacts.friend.name);
            names.push(result.contacts.support.name);
        }, requestErrorCallBack)
    }
    $('#container').load('resources2.html #window_emergencyCall', function () {
        $('#contact_friend > p').text(names[0]);
        $('#contact_support > p').text(names[1]);
        $('#btn_callNonUrgent span').text(names[2]);
        $('#btn_callEmergency span').text(names[3]);
        $('#div_callFriend').toggleClass('hide');
    });
});

//--------------------------- SCREEN 2 ---------------------------
$body.on("focus", '#input_lockScreen, #input_personalPin, #input_newPin, #input_newPinConfirm', function(e) {
    e.preventDefault();
});
$body.on("focus", 'input', function() {
    $(this).css('border-color','');
    $(this).removeClass('placeholder');
});
$body.on("focus", 'textarea', function() {
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
    if (checkPin(_pin) == false) {
        $('#input_personalPin').css('border-color','red').addClass('placeholder');
        return false;
    }
    // request to server;
    var data = {AppLoginForm:{'email': _email,
                'pin': _pin}};
    $('.spinner').css('display','inline-block');
    //request('POST','site','login', data, login);
    show_moodscreen('Bohdan');
    document.addEventListener("pause", onPause, false);
    document.addEventListener("resume", onResume, false);
    localStorage['Lelly_pin'] = _pin;
    localStorage['Lelly_contacts'] = JSON.stringify({
        'friend' : {
            'name' : 'Bohdan Samondros',
            'phone' : '0950017346'},
        'support' : {
            'name' : 'Bohdan',
            'phone' : '0963820290'},
        'samaritans': {
            'name' : 'Samaritans',
            'phone' : '000 00 01'},
        'non_urgent' : '121',
        'emergency' : '212',
        'local_services' : {
            'name' : 'Local counselling services',
            'link': 'http://yandex.ru'},
        'other' : 'http://google.com'
        });
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
    request('POST','site','email-is-used', data, checkEmail,requestErrorCallBack);
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
    if (_input_name.length == 0 || _input_surname.length == 0 || _input_birthDate.length == 0 || _input_location.length == 0 || _input_email.length == 0) {
        var form = document.getElementById('form_register');
        for (var i=0; i < form.length; i++) {
            if(form.elements[i].value.length === 0) {
                form.elements[i].style.borderColor = 'red';
                form.elements[i].className = form.elements[i].className + ' placeholder';
            }
        }
        return false;
    }
    if (input_emailConfirm !== _input_email) {
        $('#input_regEmailConfirm').css('border-color','red').addClass('placeholder');
        return false;
    }
    if (checkPin(_input_pin) == false) {
        $('#input_newPin').css('border-color','red').addClass('placeholder');
        return false}
    if (_input_pin !== input_pinConfirm) {
        $('#input_newPinConfirm').css('border-color','red').addClass('placeholder');
        return false;
    }
    $('#spinner_regInfo').css('display','block');
    request('GET','site','get-likes-struggles-arr','', download_likesAndStruggles,requestErrorCallBack);
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
    if ($('#input_friendName').val().length == 0) $('#input_friendName').css('border-color','red').addClass('placeholder');
    if ($('#input_supportName').val().length == 0) $('#input_supportName').css('border-color','red').addClass('placeholder');
    if ($('#input_friendName').val().length == 0 || $('#input_supportName').val().length == 0) {
        return false;
    }
    console.log(data);
    request('POST','site', 'signup', data, register_finish);
});
$body.on('click', '#btn_friend', function() {
    navigator.contacts.pickContact(function(contact) {
        $('#window_pin').hide();
        $('#after_pause_block').hide();
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
    navigator.contacts.pickContact(function (contact) {
        $('#window_pin').hide();
        $('#after_pause_block').hide();
        var name = contact.displayName;
        var phone = contact.phoneNumbers[0].value;
        phone = phone.replace(/\-|\x20/g, "");
        contacts.person_support_name = name;
        contacts.person_support_phone = phone;
        $('#input_supportName').val(name);
    });
});

//-----------------------------  SCREEN 10 ----------------------------------------------------------
$body.on('click', '.register-complete', function() {
    show_moodscreen(user_name);
    document.addEventListener("pause", onPause, false);
    document.addEventListener("resume", onResume, false);
});
//-----------------------------  SCREEN 11 ----------------------------------------------------------
$body.on('click', '.smile-one', function() {
    var data = $(this).attr('mood');
    var action = 'mood';
    console.log(data);
    if (data === 'happy' || data === 'awesome' || data === 'omg' || data === 'unsure' || data === 'meh' || data === 'horror') {
    //    Mood is positive or neutral
        request_logged('POST', 'site', action, data, request_result);
       $('#container').load('resources2.html #window_moodPositive', function() {
           $('#btn_taskRefresh').hide();
           $('#btn_selectTask').addClass('nomodified');
           $body.on("click", "#btn_selectTask.nomodified",function () {
               $('#btn_activityRec .align').hide();
               $("#btn_activityRec").animate({height: "0%"}, 300);
               $("#block_tasks").animate({height: "50%"}, 300);
               $(this).addClass('modified');
               $(this).removeClass('nomodified');
               setTimeout(function(){
                   $("#btn_taskRefresh").fadeIn(400);
               }, 400);
           });
       });
        $body.on('click','#btn_selectTask.modified', function() {
            $('#btn_taskRefresh').fadeOut(400);
            $(this).removeClass('modified');
            $(this).addClass('nomodified');
            $("#btn_activityRec").animate({height: "50%"}, 300);
            $("#block_tasks").animate({height: "0%"}, 300);
            setTimeout(function() {
                $('#btn_activityRec .align').fadeIn(400);
            }, 400);
        })
    }
    else {
    //    Mood is negative
        request_logged('POST', 'site', action, data, request_result);
        $('#container').load('resources2.html #window_moodNegative', function() {
            $(".tasks").hide();
            $(".block3").click(function () {
                $("br").css({"display":"none"});
                $(".block3").animate({height: "8%"}, 300);
                $(".block2").animate({height: "7%"}, 300);
                setTimeout(function(){
                    //    $(".tasks").show().fadeIn({height: "51%"}, 4000);
                    //}, 700);
                    $(".tasks").fadeIn(400);
                }, 400);
            });
        })
    }
});

//-----------------------------  SCREEN 12 ----------------------------------------------------------
$body.on('click', '#btn_selectTask', function() {
    //$(WINDOW_SWITCH_MAIN_12_15).toggleClass('hide');

});
$body.on('click', '#btn_activityRec', function() {
    $(WINDOW_SWITCH_MAIN_12_13).toggleClass('hide');
});

//-----------------------------  SCREEN 13 ----------------------------------------------------------
$body.on('click', '#btn_activityRecDone', function() {
    var title = $('#input_activityRecTitle').val();
    if (title.length == 0) {
        $('#input_activityRecTitle').addClass('placeholder');
        return false;
    }
    var textarea = $('#textarea_activityRec').val();
    if (textarea.length == 0) {
        $('#textarea_activityRec').addClass('placeholder');
        return false;
    }
    var data = {
        'title': title,
        'text': textarea,
        'photo': photo,
        'contact': contacts
    };
    //TEMPORARY comment for testing without connection
    //$('#reward_for_activity_complete').text(result.reward);
    $(WINDOW_SWITCH_MAIN_13_14).toggleClass('hide');
    photo = [];
    contacts = {};
    geo_location = {};
    mood = null;
    request_logged('POST','site', 'action', data, activityRecorded);
});

$body.on('click', '.btn_addPhoto', function() {
    var element = $(this).find('div');
    //addImage(element);
    addImage2(element);
});
$body.on('click', '.btn_addContact', function() {
    var element = $(this).find('div');
    addContact(element);
});
$body.on('click', '.btn_addMood', function() {
    var element = $(this).find('div');
    showMoodModal(element);
});
$body.on('click', '.btn_addLocation', function() {
    var element = $(this).find('div');
    addLocation(element);
});

//-----------------------------  SCREEN 14 / 17 ----------------------------------------------------------
$body.on('click', '#btn_activityComplete, #btn_taskComplete', function() {
    $('#container').load('resources2.html #window_moodScreen', function() {
        show_moodscreen('Bohdan');
    });
});
//-----------------------------  SCREEN 15 / 19 ----------------------------------------------------------
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
    if (title.length == 0) {
        $('#input_taskRecTitle').addClass('placeholder');
        return false;
    }
    if (textarea.length == 0) {
        $('#textarea_taskRec').addClass('placeholder');
        return false;
    }
    var data = {
        'title': title,
        'text': textarea,
        'photo': photo,
        'contact': contacts
    };
    //TEMPORARY function for testing without connection
    //$('#reward_for_task_complete').text(result.reward);
    $(WINDOW_SWITCH_MAIN_16_17).toggleClass('hide');
    photo = [];
    contacts = {};
    geo_location = {};
    mood = null;
    request_logged('POST', 'site', 'action', data, taskRecorded);
});

//-----------------------------  SCREEN 18 -------------------------------------------------------
$body.on('click', '.connections .descriptions .active', function(){
    $(".disconnect-box").css({"display": "block"});
});

$body.on('click','.tabs-control-link', function(e){
    e.preventDefault();
    var item = $(this).closest(".tabs-controls-item"),
        contentItem = $(".tabs-item"),
        itemPosition = item.data("class");

    contentItem.filter(".tabs-item-" + itemPosition)
        .add(item)
        .addClass("active")
        .siblings()
        .removeClass("active");
});

//-----------------------------  SCREEN 19 ----------------------------------------------------------
$body.on('click', '#btn_watsWrong', function() {
    $(WINDOW_SWITCH_MAIN_19_20).toggleClass('hide');
});

//-----------------------------  SCREEN 20 ----------------------------------------------------------
$body.on('click', '#btn_lowMoodRecDone', function() {
    var title = $('#input_lowMoodTitle').val();
    var textarea = $('#textarea_lowMood').val();
    if (title.length == 0) {
        $('#input_lowMoodTitle').addClass('placeholder');
        return false;
    }

    if (textarea.length == 0) {
        $('#textarea_lowMood').addClass('placeholder');
        return false;
    }
    var data = {
        'title': title,
        'text': textarea,
        'photo': photo,
        'contact': contacts
    };
    //TEMPORARY function for testing without connection
    //$('#reward_for_task_complete').text(result.reward);
    $('#container').load('resources2.html #window_moodPositive', function() {
        $(WINDOW_SWITCH_MAIN_20_14).toggleClass('hide');
    });
    photo = [];
    contacts = {};
    geo_location = {};
    mood = null;
    //request_logged('POST', 'site', 'action', data, taskRecorded);
});
//---------------------------------- SCREEN 22 -------------------------------------------
$body.on('click', '.info_link',function (event) {
    event.preventDefault();
    switch (this.id) {
        case '#link_connections':
            break;
        case '#link_password':
            break;
        case '#link_about':
            break;
    }
});
//---------------------------------- SCREEN 28 -------------------------------------------
$body.on('click', '#btn_CallAFriend_NO', function() {
    $(WINDOW_SWITCH_EMERGENCY_28_29).toggleClass('hide');
});
//---------------------------------- SCREEN 28 / 29 -------------------------------------------
$body.on('click', '#btn_URNotAlone_No', function() {
    $(WINDOW_SWITCH_EMERGENCY_29_30).toggleClass('hide');
});

$body.on('click', '.white-block', function() {
    if (this.id === 'contact_friend') {
        var phone = JSON.parse(localStorage['Lelly_contacts']).friend.phone;
        setTimeout(function() {
            $(WINDOW_SWITCH_EMERGENCY_28_32).toggleClass('hide');
        },400);
        $('#btn_CallNo').removeClass('_no2').addClass('_no');
        dial(phone);
    }
    if (this.id === 'contact_support') {
        var phone = JSON.parse(localStorage['Lelly_contacts']).support.phone;
        setTimeout(function() {
            $(WINDOW_SWITCH_EMERGENCY_28_32).toggleClass('hide');
        },400);
        $('#btn_CallNo').removeClass('_no2').addClass('_no');
        dial(phone);
    }
    if (this.id === 'contact_other') {
        $('#btn_CallNo').removeClass('_no2').addClass('_no');
        navigator.contacts.pickContact(function(contact) {
            var phone = contact.phoneNumbers[0].value;
            if (contact.phoneNumbers.length > 0) {
                $(WINDOW_SWITCH_EMERGENCY_28_32).toggleClass('hide');
                phone = phone.replace(/\-|\x20/g,"");
                dial(phone);
            }
        }, function(err) {
            console.log(err);
        });
    }
    if (this.id === 'contact_localService') {
        setTimeout(function() {
            $(WINDOW_SWITCH_EMERGENCY_32_29).toggleClass('hide');
            $('#btn_CallNo').removeClass('_no').addClass('_no2');
            $('#p_didUCall').text('Did it help?');
        },400);
        var link = JSON.parse(localStorage['Lelly_contacts']).local_services.link;
        window.location.href = link;
     }
    if (this.id === 'contact_samaritans') {
        setTimeout(function() {
            $(WINDOW_SWITCH_EMERGENCY_32_29).toggleClass('hide');
            $('#btn_CallNo').removeClass('_no').addClass('_no2');
        },400);
        var phone = JSON.parse(localStorage['Lelly_contacts']).samaritans.phone;
        dial(phone);
        }
    if (this.id === 'contact_otherWWW') {
        setTimeout(function() {
            $('#btn_CallNo').removeClass('_no').addClass('_no2');
            $('#p_didUCall').text('Did it help?');
            $(WINDOW_SWITCH_EMERGENCY_32_29).toggleClass('hide');
        },400);
        var link = JSON.parse(localStorage['Lelly_contacts']).other;
        window.location.href = link;
    }
});
//---------------------------------- SCREEN 30 -------------------------------------------
$body.on('click', '#btn_emergency_IAmOk, #btn_URNotAlone_IAmOk, #btn_CallAFriend_IAmOk, #btn_CallYes', function() {
    $('#container').load('resources2.html #window_moodScreen', function() {
        show_moodscreen('Bohdan');
    });
});

$body.on('click', '.call_emergency', function() {
    if (this.id === 'btn_callNonUrgent') {
        var phone = $('#btn_callNonUrgent span').text();
        dial(phone);
    }
    if (this.id === 'btn_callEmergency') {
        var phone = $('#btn_callEmergency span').text();
        dial(phone);
    }
});
//---------------------------------- SCREEN 31 -------------------------------------------
$('#input_lockScreen').click(function () {
    lockPinDialog();
});
$('#btn_lockScreen').click(function () {
    var pin_true = localStorage['Lelly_pin'];
    var pin_field = $('#input_lockScreen');
    if (pin_field.val() !== pin_true) {
        pin_field.css('border-color','red').addClass('placeholder');
        return false;
    }
    $('#window_pin').fadeOut(300);
    $('#input_lockScreen').val(null);
});

//---------------------------------- SCREEN 32 -------------------------------------------
$body.on('click', '._no', function() {
    $(WINDOW_SWITCH_EMERGENCY_32_29).toggleClass('hide');
});
$body.on('click', '._no2', function () {
    $(WINDOW_SWITCH_EMERGENCY_32_30).toggleClass('hide');
    (this).removeClass('not-help-for-me');
});
//---------------------------- MODAL SMILES ----------------------------------------------
$body.on('click', '.modal_mood', function(event) {

});
$body.on('click', '.modal_mood', function(event) {

});