var isIos = (/iPhone|iPad|iPod/i.test(navigator.userAgent)) ? true : false;
var isAndroid = (/Android/i.test(navigator.userAgent)) ? true : false;
//Main selector for click:
var $body = $(document);
//Lock app screen
var wrong_pinCounter = 0;
//var to show pincode screen
var screen_lock = true;
//Received username
var user_name;
var local_email = localStorage['Lelly_login_email'];
//Login form
var _pin;
var _email;
//Data to send from recorder screens
var contacts = {};
var photo = '';
var mood = false;
var geo_location = {};
var task_id;
//User star - points
var star_points = null;
//Options to func request_logged()
var get_task_options = {
    'count': 3,
    'offset': 1
};
// build graph variable
var graph = {
    'label': GRAPH_LABEL[1],
    'data': [[2, 4, 3, 6, 7, 8, 3, 5, 7, 8, 4, 3, 5], [7, 5, 6, 6, 7, 3, 2, 4, 1, 8, 6, 3, 1]]
};

document.addEventListener("deviceready", onDeviceReady, false);

//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/ DOCUMENT READY /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
$(document).ready(function () {
    $('#container').load('resources2.html #window_loginScreen', function () {
        if (local_email) {
            $($('#input_email')).attr('placeholder', local_email);
        }
    });
    $('.top-menu, .bot-menu, .bot-menu ul li').click(clickOnMenuWindow);
    //---------------------------------- SCREEN 31 ---------------------------
    $('#input_lockScreen').click(function () {
        lockPinDialog();
    });
    $('#btn_lockScreen').click(function () {
        var pin_true = localStorage['Lelly_pin'];
        var pin_field = $('#input_lockScreen');
        if (pin_field.val() !== pin_true) {
            pin_field.css('border-color', 'red').addClass('placeholder');
            return false;
        }
        $('#window_pin').fadeOut(300);
        $('#input_lockScreen').val(null);
    });
});
//\/\/\/\/\/\/\/\/\/\/\\//\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/
$(function () {
    $(".menu-open").swipe({
        swipeLeft: function () {
            $("#window_menu").animate({width: '0'}, 250);
        }
    });
});

function onDeviceReady() {
    StatusBar.overlaysWebView(false);
    //$(body).css('height', $(window).height - 20 +'px')
    screen.lockOrientation('portrait');
    document.addEventListener("backbutton", onBackKeyDown, false);
    console.log(isAndroid ? 'Android' : 'Iphone');
    if (isAndroid) {
        $('body').css('height', $(document).height());
        $('#menu_container').css('height', $(document).height());
    }
    window.alert = function (title, txt) {
        navigator.notification.alert(txt, null, title, "OK");
    };
    window.open = cordova.InAppBrowser.open;
}
$body.on('submit', 'form', function (e) {
    //cordova.plugins.Keyboard.close();
    e.preventDefault();
});
//CHECK EMAIL INPUT
$body.on('blur', 'input[type="email"]', function () {
    if (validateEmail($(this))) {
        $(this).css('border-color', '')
            .removeClass('placeholder');
    } else {
        $(this).css('border-color', '#ec5664')
            .addClass('placeholder');
    }
});
// ------------------------------ MENU BUTTONS ------------------------------------------------------

function clickOnMenuWindow(event) {
    if ($(this).hasClass('top-menu')) {
        $('#menu_container').fadeOut(400);
    }
    else {
        switch (this.id) {
            case 'btn_menu_info' :
                $('.info_link').click(function (event) {
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
                hideMenu();
                $('#menu_container').load('resources2.html #window_menu_info', function () {
                    menuContainerShow();
                });
                break;
            case 'btn_menu_overview' :
                hideMenu();
                $('#menu_container').load('resources2.html #window_menu_overview', function () {
                    $('.tabs-control-link').click(function (e) {
                        e.preventDefault();
                        var item = $(this).parent(),
                            contentItem = $(".tabs-item"),
                            itemPosition = item.data("class");

                        contentItem.filter(".tabs-item-" + itemPosition)
                            .add(item)
                            .addClass("active")
                            .siblings()
                            .removeClass("active");
                    });
                    menuContainerShow();
                    buildgraph(graph);
                });
                break;
            case 'btn_menu_connections':
                hideMenu();
                loadUsers
                $('#menu_container').load('resources2.html #window_menu_connections', function () {
                    menuContainerShow();
                    //startAjaxAnimation();
                    //request_logged('GET','',action, null, loadUsers, requestErrorCallBack);
                    var user =
                        $('.connections .descriptions .active').click(function () {
                            $(".disconnect-box").css({"display": "block"});
                        });
                    $('.connections .descriptions .disable').click(function () {
                        $(".connect-box").css({"display": "block"});
                    });
                    $('#btn_disconnect_yes').click(function () {
                        var data = {};
                        request_logged('POST', 'site', action, data, disconnectUser, requestErrorCallBack);
                        $(".disconnect-box").css({"display": "none"});
                    });
                    $('#btn_disconnect_no').click(function () {
                        $(".disconnect-box").css({"display": "none"});
                    });
                    $('#btn_connect_no').click(function () {
                        $(".connect-box").css({"display": "none"});
                    })
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
                    $('#user_points').text(function () {
                        var _local = localStorage['Lelly_points'];
                        var action = 'get-app-user-points';
                        if (localStorage['Lelly_points']) return _local;
                        else {
                            startAjaxAnimation();
                            request_logged('GET', 'site', action, null, function (result) {
                                $(this).text(result.points);
                            }, requestErrorCallBack);
                        }
                    });
                });
                break;
            case 'btn_menu_expansions' :
                hideMenu();
                $('#menu_container').load('resources2.html #window_menu_expansions', function () {
                    $('.expansion_pack').click(function () {
                        var data = {'exp_pack_id': $(this).attr('data-id')};
                        var action = 'unlock-expansion-pack';
                        console.log();
                        request_logged('POST', 'site', action, data, unlockExpansionsPack, requestErrorCallBack)
                    });
                    menuContainerShow();
                    var action = 'get-expansion-packs';
                    startAjaxAnimation();
                    request_logged('GET', 'site', action, null, getExpansionsPack, requestErrorCallBack);
                });
                break;
            default:
                event.stopPropagation();
        }
    }
}

$body.on('click', '.a25', function () {
    hideMenu();
});

// BUTTON EMERGENCY
$body.on('click', '.btn_emergency', function () {
    var names = [];
    menuContainerHide();
    if (localStorage['Lelly_contacts']) {
        names.push(JSON.parse(localStorage['Lelly_contacts']).friend.name);
        names.push(JSON.parse(localStorage['Lelly_contacts']).support.name);
        names.push(JSON.parse(localStorage['Lelly_contacts']).non_urgent);
        names.push(JSON.parse(localStorage['Lelly_contacts']).emergency);
    }
    else {
        var action = 'get-contacts';
        startAjaxAnimation();
        request_logged('GET', 'site', action, null, function (result) {
            localStorage['Lelly_contacts'] = JSON.stringify(result.contacts);
            names.push(result.friend.name);
            names.push(result.support.name);
            names.push(result.non_urgent);
            names.push(result.emergency);
        }, requestErrorCallBack)
    }
    $('#container').load('resources2.html #window_emergencyCall', function () {
        menuButtonInit();
        $('#contact_friend > p').text(names[0]);
        $('#contact_support > p').text(names[1]);
        $('#btn_callNonUrgent span').text(names[2]);
        $('#btn_callEmergency span').text(names[3]);
        $('#div_callFriend').toggleClass('hide');
        $('.call_emergency').click(function () {
            if (this.id === 'btn_callNonUrgent') {
                var phone = $('#btn_callNonUrgent span').text();
                dial(phone);
            }
            if (this.id === 'btn_callEmergency') {
                var phone = $('#btn_callEmergency span').text();
                dial(phone);
            }
        });
        $('.white-block').click(function () {
            if (this.id === 'contact_friend') {
                var phone = JSON.parse(localStorage['Lelly_contacts']).friend.phone;
                setTimeout(function () {
                    $(WINDOW_SWITCH_EMERGENCY_28_32).toggleClass('hide');
                }, 400);
                $('#btn_CallNo').addClass('_no');
                dial(phone);
            }
            if (this.id === 'contact_support') {
                var phone = JSON.parse(localStorage['Lelly_contacts']).support.phone;
                setTimeout(function () {
                    $(WINDOW_SWITCH_EMERGENCY_28_32).toggleClass('hide');
                }, 400);
                $('#btn_CallNo').addClass('_no');
                dial(phone);
            }
            if (this.id === 'contact_other') {
                screen_lock = false;
                navigator.contacts.pickContact(function (contact) {
                    var phone = contact.phoneNumbers[0].value;
                    if (contact.phoneNumbers.length > 0) {
                        $(WINDOW_SWITCH_EMERGENCY_28_32).toggleClass('hide');
                        phone = phone.replace(/\-|\x20/g, "");
                        screen_lock = true;
                        dial(phone);
                    }
                }, function (err) {
                    screen_lock = true;
                    console.log(err);
                });
                $('#btn_CallNo').addClass('_no');
            }
            if (this.id === 'contact_localService') {
                screen_lock = false;
                setTimeout(function () {
                    $(WINDOW_SWITCH_EMERGENCY_32_29).toggleClass('hide');
                    $('#btn_CallNo').removeClass('_no');
                    $('#p_didUCall').text('Did it help?');
                }, 400);
                var link = JSON.parse(localStorage['Lelly_contacts']).local_services.link;
                window.open(link, '_blank', 'location=yes');
                screen_lock = true;
            }
            if (this.id === 'contact_samaritans') {
                setTimeout(function () {
                    $(WINDOW_SWITCH_EMERGENCY_32_29).toggleClass('hide');
                    $('#btn_CallNo').removeClass('_no');
                }, 400);
                var phone = JSON.parse(localStorage['Lelly_contacts']).samaritans.phone;
                dial(phone);
            }
            if (this.id === 'contact_otherWWW') {
                screen_lock = false;
                setTimeout(function () {
                    $('#btn_CallNo').removeClass('_no').addClass('_no2');
                    $('#p_didUCall').text('Did it help?');
                    $(WINDOW_SWITCH_EMERGENCY_32_29).toggleClass('hide');
                }, 400);
                var link = JSON.parse(localStorage['Lelly_contacts']).other;
                window.open(link, '_blank', 'location=yes');
                screen_lock = true;
            }
        });
        $('#btn_CallNo').click(function () {
            if ($(this).hasClass('_no')) {
                $(WINDOW_SWITCH_EMERGENCY_32_29).toggleClass('hide');
                $(this).toggleClass('_no');
            }
            else {
                $(WINDOW_SWITCH_EMERGENCY_32_30).toggleClass('hide');
                $(this).toggleClass('_no');
            }
        });
    });
});
//--------------------------- SCREEN 2 ---------------------------
$body.on("focus", '#input_lockScreen, #input_personalPin, #input_newPin, #input_newPinConfirm', function (e) {
    e.preventDefault();
});
$body.on("focus", 'input', function () {
    $(this).css('border-color', '')
        .removeClass('placeholder');
    if (isIos) {
        window.scrollTo(0, 0);
    }
});
$body.on("focus", 'textarea', function () {
    $(this).removeClass('placeholder');
});
$body.on("click", '#input_personalPin', function () {
    logPinDialog();
});
$body.on('submit', 'form[name="login"]', function () {
    var $input_email = $('#input_email');
    var $input_pin = $('#input_personalPin');
    var input_email_placeholder = $input_email.attr('placeholder');

    function email() {
        if ($input_email.val().length > 0) {
            return $input_email.val();
        }
        else {
            return input_email_placeholder;
        }
    }

    _pin = $('#input_personalPin').val();
    _email = email();

    if (!validateEmail($input_email) || _email.length == 0) {
        animateInvalidInput($input_email);
    }
    if (!checkPin(_pin)) {
        animateInvalidInput($input_pin);
    }
    if (!validateEmail($input_email) || !checkPin(_pin)) {
        return false;
    }
    // request to server;
    var data = {
        AppLoginForm: {
            'email': _email,
            'pin': _pin
        }
    };
    startAjaxAnimation();
    request('POST', 'site', 'login', data, login, requestErrorCallBack);
});
$body.on("click", "#link_forgotPin", function () {
    $(WINDOW_SWITCH_LOGIN_1_2).toggleClass('hide');
});
$body.on("click", "#btn_goToRegister", function () {
    $('#container').load('resources2.html #window_registerScreen');
});

//--------------------------  SCREEN 3  -----------------------
$body.on("click", "#btn_sendPin", function () {
    var _email = $('#input_recoverEmail').val();
    alert(_email + ' ready to send to server');

    // request to server;

    var data = {};
    data.email = _email;
    startAjaxAnimation();
    request('type', 'site', 'send-new-pin-on-email', data, forgotPin, requestErrorCallBack());
});
$body.on("click", "#btn_backToLog", function () {
    $(WINDOW_SWITCH_LOGIN_1_2).toggleClass('hide');
});

//--------------------------  SCREEN 4 ------------------------
$body.on("click", "#btn_backToLog2", function () {
    $(WINDOW_SWITCH_LOGIN_2_3).toggleClass('hide');
    $(WINDOW_SWITCH_LOGIN_1_2).toggleClass('hide');
});

//--------------------------  SCREEN 5 ------------------------
$body.on("click", "#btn_lockedContinue", function () {
    $('#container').load('resources2.html #window_loginScreen', function () {
        $(WINDOW_SWITCH_LOGIN_1_2).toggleClass('hide');
    });
});

//---------------------------  SCREEN 6 ------------------------
$body.on("keyup", "#input_name", function () {
    $("#input_name").val($("#input_name").val().replace(/[^a-zа-яіїєґ]/i, ''));
});
$body.on("keyup", "#input_surname", function () {
    $("#input_surname").val($("#input_surname").val().replace(/[^a-zа-яіїєґ]/i, ''));
});
$body.on('focus', '#input_birthdate', function (e) {
    e.stopPropagation();
    e.preventDefault();
    cordova.plugins.Keyboard.close();
});
$body.on('click', '#input_birthdate', function (event) {
    event.preventDefault();
    event.stopPropagation();
    cordova.plugins.Keyboard.close();
    datePicker.show({date: new Date(), mode: 'date'}, function (date) {
        var month = date.getMonth() + 1;
        var d = date.getFullYear() + '-' + month + '-' + date.getDate();
        $('#input_birthdate').val(d).blur();
    });
});
$body.on("click", '#input_newPin', regPinDialog);
$body.on("click", '#input_newPinConfirm', regPinConfirmDialog);
$body.on("blur", '#input_regEmail', function () {
    var _input_email = $('#input_regEmail').val();
    $('#form_register').find('p.alert').remove();
    // Request to server to identity email
    var data = {};
    data.email = _input_email;
    console.log(data);
    request('POST', 'site', 'email-is-used', data, checkEmail, requestErrorCallBack);
});
$body.on("click", "#btn_backToLogin", function () {
    $('#container').load('resources2.html #window_loginScreen', function () {
        if (local_email) {
            $($('#input_email')).attr('placeholder', local_email);
        }
    });
});
$body.on("click", "#btn_regNextStep", function () {
    //var _input_name = $('#input_name').val();
    //var _input_surname = $('#input_surname').val();
    //var _input_birthDate = $('#input_birthdate').val();
    //var _input_location = $('#input_location').val();
    var _input_pin = $('#input_newPin').val();
    var input_pinConfirm = $('#input_newPinConfirm').val();
    var _input_email = $('#input_regEmail').val();
    var input_emailConfirm = $('#input_regEmailConfirm').val();

    var validate = function validateForm() {
        var valid = true;
        var form = document.getElementById('form_register');
        for (var i = 0; i < form.length; i++) {
            if (form.elements[i].value.length === 0) {
                form.elements[i].style.borderColor = 'red';
                form.elements[i].className = form.elements[i].className + ' placeholder';
                valid = false;
            }
        }
        if (input_emailConfirm !== _input_email) {
            animateInvalidInput($('#input_regEmailConfirm'));
            valid = false;
        }
        if (!checkPin(_input_pin)) {
            animateInvalidInput($('#input_newPin'));
            valid = false;
        }
        if (_input_pin !== input_pinConfirm) {
            animateInvalidInput($('#input_newPinConfirm'));
            valid = false;
        }
        if (!validateEmail($('#input_regEmail'))) {
            animateInvalidInput($('#input_regEmail'));
            valid = false
        }
        return valid;
    };

    if (!validate()) return false;
    startAjaxAnimation();
    request('GET', 'site', 'get-likes-struggles-arr', null, download_likesAndStruggles, requestErrorCallBack);
    //-----------------------------  SCREEN 7 ------------------------
});
$body.on("click", "#btn_backToStep1", function () {
    $(WINDOW_SWITCH_REGISTER_1_2).toggleClass('hide');
});
$body.on("click", "#btn_regNextStep3", function () {
    $(WINDOW_SWITCH_REGISTER_2_3).toggleClass('hide');
});
//-----------------------------  SCREEN 8 ----------------------
$body.on("click", "#btn_backToStep2", function () {
    $(WINDOW_SWITCH_REGISTER_2_3).toggleClass('hide');
});
$body.on("click", "#btn_nextStep4", function () {
    $(WINDOW_SWITCH_REGISTER_3_4).toggleClass('hide');
});

//-----------------------------  SCREEN 9 ----------------------
$body.on("click", "#btn_backToStep3", function () {
    $(WINDOW_SWITCH_REGISTER_3_4).toggleClass('hide');
});
$body.on("click", "#btn_regFinish", function () {
    var info = {
        "first_name": $('#input_name').val(),
        "surname": $('#input_surname').val(),
        "birthday": $('#input_birthdate').val(),
        "city": $('#input_location').val(),
        "email": $('#input_regEmail').val(),
        "pin": $('#input_newPin').val()
    };
    var likes = $('form[name="likes"]').serializeObject();
    var struggles = $('form[name="struggles"]').serializeObject();
    var data = {"User": info, "Likes": likes, "Struggles": struggles, "AppUser": contacts};
    if ($('#input_friendName').val().length == 0) $('#input_friendName').css('border-color', 'red').addClass('placeholder');
    if ($('#input_supportName').val().length == 0) $('#input_supportName').css('border-color', 'red').addClass('placeholder');
    if ($('#input_friendName').val().length == 0 || $('#input_supportName').val().length == 0) {
        return false;
    }
    _email = info.email;
    _pin = info.pin;
    console.log(data);
    startAjaxAnimation();
    request('POST', 'site', 'signup', data, register_finish, requestErrorCallBack);
});
$body.on('click', '#btn_friend', function () {
    $('#input_friendName').css('border-color', '')
        .removeClass('placeholder');
    navigator.contacts.pickContact(function (contact) {
        $('#window_pin').hide();
        $('#after_pause_block').hide();
        var name = contact.name.formatted;
        var phone = contact.phoneNumbers[0].value;
        phone = phone.replace(/\-|\x20/g, "");
        contacts.person_win_name = name;
        contacts.person_win_phone = phone;
        $('#input_friendName').val(name);
    }, function (err) {
        console.log(err);
    });
});
$body.on('click', '#btn_support', function () {
    $('#input_supportName').css('border-color', '')
        .removeClass('placeholder');
    navigator.contacts.pickContact(function (contact) {
        $('#window_pin').hide();
        $('#after_pause_block').hide();
        var name = contact.name.formatted;
        var phone = contact.phoneNumbers[0].value;
        phone = phone.replace(/\-|\x20/g, "");
        contacts.person_support_name = name;
        contacts.person_support_phone = phone;
        $('#input_supportName').val(name);
    });
});

//-----------------------------  SCREEN 13 ----------------------------------------------------------
$body.on('click', '#btn_activityRecDone', function () {
    function foo() {
        var action = 'save-activity';
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
            'Activity': {
                'type': 'activity',
                'activity_type': 'positive',
                'title': title,
                'body': textarea,
                'contact_name': contacts.name,
                'contact_phone': contacts.phone,
                'is_smile': mood,
                'longitude': geo_location.Longitude,
                'latitude': geo_location.Latitude,
                'photo': photo
            }
        };
        //$(WINDOW_SWITCH_MAIN_13_14).toggleClass('hide');
        console.log(data);
        for (var i in data.Activity) {
            var value = data.Activity[i];
            if (value === undefined) {
                delete data.Activity[i];
            }
        }
        console.log(data);
        startAjaxAnimation();
        localStorage['Lelly_last_activity'] = JSON.stringify(data);
        request_logged('POST', 'site', action, data, activityRecorded, recordError);
    }

    if (!isIos) {
        if (cordova.plugins.Keyboard.isVisible) {
            cordova.plugins.Keyboard.close();
            return false;
        }
        else foo();
    }
    else foo();
});

$body.on('click', '.btn_addPhoto', function () {
    var element = $(this);
    photo = '';
    addImage(element);
});
$body.on('click', '.btn_addContact', function () {
    var element = $(this);
    addContact(element);
});
$body.on('click', '.btn_addMood', function () {
    var element = $(this);
    //showMoodModal(element);
    mood = (mood == false);
    if (mood == false) iconChangeColor([], element);
    else {
        iconChangeColor([1], element);
    }
});
$body.on('click', '.btn_addLocation', function () {
    var element = $(this);
    addLocation(element);
});

//-----------------------------  SCREEN 14 / 17 ----------------------------------------------------------
$body.on('click', '#btn_activityComplete, #btn_taskComplete', function () {
    $('#container').load('resources2.html #window_moodScreen', function () {
        showMoodScreen(user_name);
    });
});
//-----------------------------  SCREEN 15 / 19 ----------------------------------------------------------


//-----------------------------  SCREEN 16 ----------------------------------------------------------
$body.on('click', '#btn_taskRecDone', function () {
    function foo() {
        var action = 'save-activity';
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
            'Activity': {
                'type': 'task',
                'task_id': task_id,
                'title': title,
                'body': textarea,
                'contact_name': contacts.name,
                'contact_phone': contacts.phone,
                'is_smile': mood,
                'longitude': geo_location.Longitude,
                'latitude': geo_location.Latitude,
                'photo': photo
            }
        };
        for (var i in data.Activity) {
            var value = data.Activity[i];
            if (value === undefined) {
                delete data.Activity[i];
            }
        }
        //TEMPORARY function for testing without connection
        //$('#reward_for_task_complete').text(result.reward);
        console.log(data);
        startAjaxAnimation();
        request_logged('POST', 'site', action, data, taskRecorded, requestErrorCallBack);
    }

    if (!isIos) {
        if (cordova.plugins.Keyboard.isVisible) {
            cordova.plugins.Keyboard.close();
            return false;
        }
        else foo();
    }
    else foo();
});

//-----------------------------  SCREEN 20 ----------------------------------------------------------
$body.on('click', '#btn_lowMoodRecDone', function () {
    function foo() {
        var action = 'save-activity';
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
            'Activity': {
                'type': 'activity',
                'activity_type': 'negative',
                'title': title,
                'body': textarea,
                'contact_name': contacts.name,
                'contact_phone': contacts.phone,
                'is_smile': mood,
                'longitude': geo_location.Longitude,
                'latitude': geo_location.Latitude,
                'photo': photo
            }
        };
        for (var i in data.Activity) {
            var value = data.Activity[i];
            if (value === undefined) {
                delete data.Activity[i];
            }
        }
        //TEMPORARY function for testing without connection
        //$('#reward_for_task_complete').text(result.reward);
        photo = '';
        contacts = {};
        geo_location = {};
        mood = false;
        startAjaxAnimation();
        request_logged('POST', 'site', action, data, lowMoodRecorded, requestErrorCallBack);
    }

    if (!isIos) {
        if (cordova.plugins.Keyboard.isVisible) {
            cordova.plugins.Keyboard.close();
            return false;
        }
        else foo();
    }
    else foo();
});

//---------------------------------- SCREEN 28 -------------------------------------------
$body.on('click', '#btn_CallAFriend_NO', function () {
    $(WINDOW_SWITCH_EMERGENCY_28_29).toggleClass('hide');
});
//---------------------------------- SCREEN 28 / 29 -------------------------------------------
$body.on('click', '#btn_URNotAlone_No', function () {
    $(WINDOW_SWITCH_EMERGENCY_29_30).toggleClass('hide');
    $('.call_emergency').click(function () {
        if (this.id === 'btn_callNonUrgent') {
            var phone = $('#btn_callNonUrgent span').text();
            dial(phone);
        }
        if (this.id === 'btn_callEmergency') {
            var phone = $('#btn_callEmergency span').text();
            dial(phone);
        }
    });
});

//---------------------------------- SCREEN 30 -------------------------------------------
$body.on('click', '#btn_emergency_IAmOk, #btn_URNotAlone_IAmOk, #btn_CallAFriend_IAmOk, #btn_CallYes', function () {
    $('#container').load('resources2.html #window_moodScreen', function () {
        showMoodScreen(user_name);
    });
});

