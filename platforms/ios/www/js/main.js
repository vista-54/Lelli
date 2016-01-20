var isIos = (/iPhone|iPad|iPod/i.test(navigator.userAgent)) ? true : false;
var isAndroid = (/Android/i.test(navigator.userAgent)) ? true : false;
//Main selector for click:
var $body = $(document);
//Lock app screen
var wrong_pinCounter = 0;
//var to show pincode screen
var screen_lock = false;
//Received username
var user_name;
var local_email = localStorage['Lelly_login_email'];
//Login form
var _pin;
var _email;
// Mood Screen chosen
var user_mood_now;
//Data to send from recorder screens
var contacts = {};
var photo = '';
var mood = false;
var geo_location = {};
var task_id;
//User star - points
var star_points = null;
//Options to func getTasks
var get_task_options = {
    'count': 3,
    'offset': 1
};
//User monitor id
var connection_id;
// build graph variable
var graph = {
    'label': GRAPH_LABEL[1],
    'data': [[2, 4, 3, 6, 7, 8, 3, 5, 7, 8, 4, 3, 5], [7, 5, 6, 6, 7, 3, 2, 4, 1, 8, 6, 3, 1]]
};
//Call info
var call_info = {};
var checkConnection;

document.addEventListener("deviceready", onDeviceReady, false);

//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/ DOCUMENT READY /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
$(document).ready(function () {
    $('#container').load('resources2.html #window_loginScreen', function () {
        //if (local_email) {
        //    $($('#input_email')).attr('placeholder', local_email);
        //}
    });
    //---------------------------------- SCREEN 31 ---------------------------
    $('#input_lockScreen').click(function () {
        lockPinDialog();
    });
    $('#input_lockScreen').focus(function () {
        $(this).val('');
    });
    $('#btn_lockScreen').click(function () {
        var pin_true = localStorage['Lelly_pin'];
        var pin_field = $('#input_lockScreen');
        if (pin_field.val() !== pin_true) {
            pin_field.css('border-color', 'red').addClass('placeholder');
            return false;
        }
        $('#after_pause_block').hide();
        $('#container').css('visibility', 'visible');
        $('#menu_container').css('visibility', 'visible');
        $('#window_pin').fadeOut(300);
        $('#input_lockScreen').val(null);
    });
});
//\/\/\/\/\/\/\/\/\/\/\\//\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/

function onDeviceReady() {
    StatusBar.overlaysWebView(false);
    screen.lockOrientation('portrait');
    document.addEventListener("backbutton", onBackKeyDown, false);
    console.log(isAndroid ? 'Android' : 'Iphone');
    console.log(navigator.connection.type);
    if (isAndroid) {
        $('body').css('height', $(document).height());
        $('#container').css('height', $(document).height());
        $('#menu_container').css('height', $(document).height());
        $('#after_pause_block').css('height', $(document).height());
    }
    window.alert = function (title, txt) {
        navigator.notification.alert(txt, null, title, "OK");
    };
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
        $('.menu_item').removeClass('active');
    }
    else {
        if ($(this).hasClass('menu_item')) {
            $(this).addClass('active')
                .siblings()
                .removeClass('active');
        }
        switch ($(this).attr('id')) {
            case 'btn_menu_main' :
                hideMenu();
                showMoodScreen(user_name);
                $('#menu_container').fadeOut(400);
                $('.menu_item').removeClass('active');
                break;
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
                    var action = 'get-app-user-points';
                    startAjaxAnimation();
                    request_logged('GET', 'site', action, null, function (result) {
                        console.log(result);
                        $('.user_points').text(result.points);
                    }, requestErrorCallBack);
                    buildgraph(graph);
                });
                break;
            case 'btn_menu_connections':
                hideMenu();
                showConnections();
                break;
            case 'btn_menu_password':
                hideMenu();
                $('#menu_container').load('resources2.html #window_menu_password', function () {
                    menuContainerShow();
                    $('#btn_check_monitor').click(function () {
                        var input = $('#input_monitor_connect').val();
                        var data = {monitor_username : input};
                        var action = 'check-monitor';
                        request_logged('POST','site',action, data, function(result) {
                            console.log(result);
                            if (result === true) {
                                connection_id = input;
                                $('#btn_generate_password').prop('disabled', false);
                                window.alert('Result', 'User have been found');
                            }
                            else {
                                $('#btn_generate_password').prop('disabled', true);
                                window.alert('Result', 'User not found');
                            }
                        }, requestErrorCallBack)
                    });
                    $('#btn_generate_password').click(function () {
                        var password = Math.random().toString(36).slice(-8);
                        $('#generated_password').val(password);
                        $('#p_password').css('visibility', 'visible');
                    });
                    $('#btn_add_connection').click(function () {
                        var action = 'save-connection';
                        var password = $('#generated_password').val();
                        var data= {
                            monitor_username : connection_id,
                            external_password : password
                        };
                        startAjaxAnimation();
                        request_logged('POST','site',action, data, addConnection, requestErrorCallBack);
                    })

                });
                break;
            case 'btn_menu_points':
                hideMenu();
                $('#menu_container').load('resources2.html #window_menu_points', function () {
                    menuContainerShow();
                    var action = 'get-app-user-points';
                    startAjaxAnimation();
                    request_logged('GET', 'site', action, null, function (result) {
                        console.log(result);
                        $('.user_points').text(result.points);
                    }, requestErrorCallBack);
                });
                break;
            case 'btn_menu_expansions' :
                hideMenu();
                $('#menu_container').load('resources2.html #window_menu_expansions', function () {
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
                var action = 'save-used-help';
                var data = {UsedHelp: {
                    help_type : 'non_urgent_help'
                }};
                request_logged('POST','site', action, data, request_result);
                dial(phone);
            }
            if (this.id === 'btn_callEmergency') {
                var phone = $('#btn_callEmergency span').text();
                var action = 'save-used-help';
                var data = {UsedHelp: {
                    help_type : 'emergency'
                }};
                request_logged('POST','site', action, data, request_result);
                dial(phone);
            }
        });
        $('.white-block').click(function () {
            if (this.id === 'contact_friend') {
                var phone = JSON.parse(localStorage['Lelly_contacts']).friend.phone;
                call_info = {UsedHelp: {
                    help_type : 'person_win'
                }};
                setTimeout(function () {
                    $(WINDOW_SWITCH_EMERGENCY_28_32).toggleClass('hide');
                }, 400);
                $('#btn_CallNo').addClass('_no');
                dial(phone);
            }
            if (this.id === 'contact_support') {
                var phone = JSON.parse(localStorage['Lelly_contacts']).support.phone;
                call_info = {UsedHelp : {
                    help_type : 'person_support'
                }};
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
                    var name = contact.name.formatted;
                    if (contact.phoneNumbers.length > 0) {
                        $(WINDOW_SWITCH_EMERGENCY_28_32).toggleClass('hide');
                        phone = phone.replace(/\-|\x20/g, "");
                        screen_lock = true;
                        dial(phone);
                    }
                    call_info = {UsedHelp : {
                        contact_name : phone,
                        contact_phone : name,
                        help_type : 'other_contact'
                    }};
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
                    $('#btn_CallNo').removeClass('_no').addClass('_no2');
                    $('#p_didUCall').text('Did it help?');
                }, 400);
                call_info = {UsedHelp : {
                    help_type : 'local_counselling_services',
                    it_help : 1
                }};
                var link = JSON.parse(localStorage['Lelly_contacts']).local_services.link;
                window.open(link, '_blank', 'location=yes');
                screen_lock = true;
            }
            if (this.id === 'contact_samaritans') {
                setTimeout(function () {
                    $(WINDOW_SWITCH_EMERGENCY_32_29).toggleClass('hide');
                    $('#btn_CallNo').removeClass('_no');
                }, 400);
                call_info = {UsedHelp:{
                    help_type : 'samaritans'
                }};
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
                call_info = {UsedHelp: {
                    help_type : 'other_help',
                    it_help : 1
                }};
                var link = JSON.parse(localStorage['Lelly_contacts']).other;
                window.open(link, '_blank', 'location=yes');
                screen_lock = true;
            }
        });
        $('#btn_CallNo').click(function () {
            if ($(this).hasClass('_no')) {
                $(WINDOW_SWITCH_EMERGENCY_32_29).toggleClass('hide');
                $(this).toggleClass('_no');
            } else
            if ($(this).hasClass('_no2')) {
                $(WINDOW_SWITCH_EMERGENCY_32_30).toggleClass('hide');
                $(this).toggleClass('_no2');
                var action = 'save-used-help';
                call_info.UsedHelp.it_help = 0;
                request_logged("POST", 'site', action, call_info,request_result);
            }
            else {
                $(WINDOW_SWITCH_EMERGENCY_32_30).toggleClass('hide');
                $(this).toggleClass('_no');
            }
        });
        $('#btn_CallYes').click(function() {
            var action = 'save-used-help';
            console.log(call_info);
            request_logged('POST', 'site', action, call_info, request_result);
            showMoodScreen(user_name);
        })
    });
});

//BACK BUTTONS
$body.on("click", "#btn_backToLogin", function () {
    $('#container').load('resources2.html #window_loginScreen', function () {
        if (local_email) {
            $($('#input_email')).attr('placeholder', local_email);
        }
    });
});
$body.on("click", "#btn_goToMoodScreen", function () {
    showMoodScreen(user_name);
    $('#menu_container').fadeOut(400);
    $('.menu_item').removeClass('active');
});
//--------------------------- SCREEN 2 ---------------------------
$body.on("focus", '#input_lockScreen, #input_personalPin, #input_newPin, #input_newPinConfirm', function (e) {
    e.preventDefault();
});
$body.on("focus", 'input', function () {
    $(this).css({'border-color':'','color':''})
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
    $('#container').load('resources2.html #window_registerScreen',function() {
        $('#input_friendName, #input_supportName').setCli
        $('#btn_friend, #input_friendName').click(function () {
            $('#input_friendName').css('border-color', '')
                .removeClass('placeholder');
            navigator.contacts.pickContact(function (contact) {
                $('#window_pin').hide();
                $('#after_pause_block').hide();
                $('#container').css('visibility', 'visible');
                $('#menu_container').css('visibility', 'visible');
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
        $('#btn_support, #input_supportName').click(function () {
            $('#input_supportName').css('border-color', '')
                .removeClass('placeholder');
            navigator.contacts.pickContact(function (contact) {
                $('#window_pin').hide();
                $('#after_pause_block').hide();
                $('#container').css('visibility', 'visible');
                $('#menu_container').css('visibility', 'visible');
                var name = contact.name.formatted;
                var phone = contact.phoneNumbers[0].value;
                phone = phone.replace(/\-|\x20/g, "");
                contacts.person_support_name = name;
                contacts.person_support_phone = phone;
                $('#input_supportName').val(name);
            });
        });
    });
});

//--------------------------  SCREEN 3  ----------------------------
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
    if (!validateEmail($('#input_regEmail'))) {
        animateInvalidInput($('#input_regEmail'));
        return;
    }
    // Request to server to identity email
    var data = {};
    data.email = _input_email;
    console.log(data);
    request('POST', 'site', 'email-is-used', data, checkEmail, requestErrorCallBack);
});

$body.on("click", "#btn_regNextStep", function () {
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
$body.on("click", "#btn_backTo6", function () {
    $(WINDOW_SWITCH_REGISTER_1_2).toggleClass('hide');
});
$body.on("click", "#btn_regNextStep3", function () {
    //var like_count = 0;
    ////TODO Function
    //$('input[value="1"].likes:checked').each(function() {
    //    like_count++;
    //});
    if ( $('input[value="1"].likes:checked').length === 0) {
        window.alert('Lelly', 'Please choise more then one like.');
        return false;
    }
    $(WINDOW_SWITCH_REGISTER_2_3).toggleClass('hide');
});
//-----------------------------  SCREEN 8 ----------------------
$body.on("click", "#btn_backTo7", function () {
    $(WINDOW_SWITCH_REGISTER_2_3).toggleClass('hide');
});
$body.on("click", "#btn_nextStep4", function () {
    $(WINDOW_SWITCH_REGISTER_3_4).toggleClass('hide');
});

//-----------------------------  SCREEN 9 ----------------------
$body.on("click", "#btn_backTo8", function () {
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
        for (var i in data.Activity) {
            var value = data.Activity[i];
            if (value === undefined) {
                delete data.Activity[i];
            }
        }
        localStorage['Lelly_last_activity'] = JSON.stringify(data);
        if (photo.length > 1) {
            DataPhoto(data.Activity.photo, function(a){
                data.Activity.photo = a;
                screen_lock = true;
                startAjaxAnimation();
                request_logged('POST', 'site', action, data, activityRecorded, recordError);
            })
        }
        else {
            startAjaxAnimation();
            request_logged('POST', 'site', action, data, activityRecorded, recordError);
        }
        console.log(data);
        photo = '';
        contacts = {};
        geo_location = {};
        mood = false;
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
                'activity_type': user_mood_now,
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
        localStorage['Lelly_last_activity'] = JSON.stringify(data);
        if (photo.length > 1) {
            DataPhoto(data.Activity.photo, function(a){
                data.Activity.photo = a;
                screen_lock = true;
                startAjaxAnimation();
                request_logged('POST', 'site', action, data, taskRecorded, recordError);
            })
        }
        else {
            startAjaxAnimation();
            request_logged('POST', 'site', action, data, taskRecorded, recordError);
        }
        photo = '';
        contacts = {};
        geo_location = {};
        mood = false;
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
        if (photo.length > 1) {
            DataPhoto(data.Activity.photo, function(a){
                data.Activity.photo = a;
                screen_lock = true;
                startAjaxAnimation();
                request_logged('POST', 'site', action, data, lowMoodRecorded, recordError);
            })
        }
        else {
            startAjaxAnimation();
            request_logged('POST', 'site', action, data, lowMoodRecorded, recordError);
        }
        photo = '';
        contacts = {};
        geo_location = {};
        mood = false;
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
$body.on('click', '#btn_emergency_IAmOk, #btn_URNotAlone_IAmOk, #btn_CallAFriend_IAmOk', function () {
    showMoodScreen(user_name);
});

