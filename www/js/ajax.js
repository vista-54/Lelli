var URL = 'http://159.224.220.233/api';
var URL_ip = 'http://159.224.220.233/';
var versions = '/v1/';
$(document).ajaxStop(function () {
    $('.spinner').hide();
});
$(document).ajaxComplete(function () {
    $('.spinner').hide();
});
function startAjaxAnimation() {
    $('.spinner').show();
}
// ------------------------- UNITED AJAX REQUEST FUNCTIONS -------------------------------
function request_logged(type, controller, action, data, successCallBack, requestErrorCallBack) {
    try {
        $.ajax({
            type: type,
            url: URL + versions + controller + '/' + action,
            headers: {
                "Authorization": 'Bearer ' + localStorage['Lelly_auth_key']
            },
            data: data,
            success: successCallBack,
            error: requestErrorCallBack
        })
    }
    catch (err) {
        console.log(err.name + '/r/n' + err.stack + '/r/n' + err.message);
    }
}
function request(type, controller, action, data, successCallBack, requestErrorCallBack) {
    $.ajax({
        type: type,
        url: URL + versions + controller + '/' + action,
        data: data,
        success: successCallBack,
        error: requestErrorCallBack
    })
}

//--------------------------------DEFAULT CALLBACK FUNCTIONS-------------------------------
function request_result(result) {
    console.log(result);
}
function requestErrorCallBack(result) {
    $(".spinner").bind("ajaxError", function () {
        $(this).hide();
    });
    window.alert('Connection error', 'Server is unavailable');
    console.log(result);
    return false;
}
//------------------------------------------------------------------------------------------

// ------------------------------- REQUEST CALLBACKS ---------------------------------------
//REGISTRATION
//Email check for unique
function checkEmail(result) {
    $('#spinner_regEmail').hide();
    console.log(result);
    if (result.email_is_used == true) {
        $('#input_regEmail').css('border-color', 'red');
        $('#input_regEmail').addClass('placeholder');
    }
    else {
        $('#input_regEmail').css({'border-color':'green','color':'green'});
    }
}

//Likes and Struggles
function download_likesAndStruggles(result) {
    console.log(result);
    $('#likes li').remove();
    $('#struggles li').remove();
    $.each(result.likes, function (index, value) {
        $('#likes').append('<li><div class="white-block"><div class="description-block"><span class="upper">' + value + '</span></div><div class="button-block"><input class="likes" id="like' + index + '_0" type="radio" name="' + index + '" value="0" checked><label for="like' + index + '_0"><span class="dislike"></span></label><input class="likes" id="like' + index + '_1" type="radio" name="' + index + '" value="1"><label for="like' + index + '_1"><span class="like"></span></label></div></div></li>');
    });
    $.each(result.struggles, function (index, value) {
        $('#struggles').append('<li><div class="white-block"><div class="button-block2"><input id="struggle' + index + '" name="' + index + '" type="checkbox"><label for="struggle' + index + '"><span class="medium-circle-gray"><i class="fa fa-check fa-3x"></i></span></label></div><div class="description-block2">' + value + '</div></div></li>');
    });
    $(WINDOW_SWITCH_REGISTER_1_2).toggleClass('hide');
}

// Send register form
function register_finish(result) {
    if (result.errors) {
        console.log(result);
        return false;
    }
    else {
        localStorage.setItem('Lelly_login_email', _email);
        localStorage['Lelly_auth_key'] = result.auth_key;
        localStorage['Lelly_pin'] = _pin;
        localStorage['Lelly_contacts'] = JSON.stringify(result.contacts);
        localStorage['Lelly_points'] = result.points;
        user_name = localStorage['Lelly_UserName'] || result.user_name;
        star_points = localStorage['Lelly_points'];
        console.log(result);
        $(WINDOW_SWITCH_REGISTER_4_5).toggleClass('hide');

        //-----------------------------  SCREEN 10 -----------------------------------------------------
        $('#div_registerComplete').click(function () {
            showMoodScreen(result.user_name);
            document.addEventListener("pause", onPause, false);
            document.addEventListener("resume", onResume, false);
        });
        contacts = {};
    }
}

//LOG OUT
function logOut(result) {
    localStorage.removeItem('Lelly_auth_key');
    localStorage.removeItem('Lelly_pin');
    console.log(result);
}

//LOG IN
function login(result) {
    console.log(result);
    if (result.auth_key && !result.errors) {
        localStorage.setItem('Lelly_login_email', _email);
        localStorage['Lelly_auth_key'] = result.auth_key;
        localStorage['Lelly_pin'] = _pin;
        localStorage['Lelly_contacts'] = JSON.stringify(result.contacts);
        localStorage['Lelly_points'] = result.points;
        user_name = localStorage['Lelly_UserName'] || result.user_name;
        star_points = localStorage['Lelly_points'] || result.points;
        showMoodScreen(result.user_name);
        document.addEventListener("pause", onPause, false);
        document.addEventListener("resume", onResume, false);
        if (localStorage['Lelly_last_activity']) {
            //TODO this block
            $('#lastActivitySendPopup').fadeIn(400);
            var data = JSON.parse(localStorage['Lelly_last_activity']);
            request_logged('POST','site','save-activity',data, recordLastActivity, errRecordLastActivity)
        }
    }
    else {
        if (result.errors.pin) {
            wrong_pinCounter += 1;
            window.alert('Sorry', result.errors.pin[0]);
            if (wrong_pinCounter == 3) {
                $('#container').load('resources2.html #window_locked');
                wrong_pinCounter == 0;
            }
        }
        else if (result.errors.email) {
            window.alert('Sorry', result.errors.email[0]);
        }
        else {
            window.alert('Sorry', 'An unexpected login error');
        }
    }
}

// PIN RESTORE
function forgotPin(result) {
    console.log(result);
    if (result == true) {
        $(WINDOW_SWITCH_LOGIN_2_3).toggleClass('hide');
    }
    else {
        console.log(result.errors);
        return false
    }
}

// GET TASKS
function getTasks(result) {
    console.log(result);
    var refresher = $('.task_refresh');
    refresher.fadeOut(150);
    setTimeout(function () {
        refresher.attr('src', 'img/refresh.png').fadeIn(150);
    }, 150);
    if (result.tasks.length > 2) {
        get_task_options.offset++;
        for (var i = 1; i < result.tasks.length + 1; i++) {
            var element = '.task' + i;
            var element_name = '.task' + i + ' > p';
            var element_points = '.task' + i + ' .tasks-star-point > p';
            $(element).attr('data-id', result.tasks[i - 1].id);
            $(element_name).text(result.tasks[i - 1].name);
            $(element_points).text(result.tasks[i - 1].points);
        }
        //$('.task1 > p').text(result.tasks[0].name);
        //$('.task1 .tasks-star-point > p').text(result.tasks[0].points);
        //$('.task2 > p').text(result.tasks[1].name);
        //$('.task2 .tasks-star-point > p').text(result.tasks[1].points);
        //$('.task3 > p').text(result.tasks[2].name);
        //$('.task3 .tasks-star-point > p').text(result.tasks[2].points);
    }
    $('.task1 > p').animate({"left": "+=100%"}, 300);
    $('.task1 .tasks-star-point').animate({"right": "+=200%"}, 300);
    setTimeout(function () {
        $('.task2 > p').animate({"left": "+=100%"}, 300);
        $('.task2 .tasks-star-point').animate({"right": "+=200%"}, 300);
    }, 150);
    setTimeout(function () {
        $('.task3 > p').animate({"left": "+=100%"}, 300);
        $('.task3 .tasks-star-point').animate({"right": "+=200%"}, 300);
    }, 300);
}

//TASK RECORD
function taskRecorded(result) {
    console.log(result);
    $('#reward_for_task_complete').text(result.points);
    $(WINDOW_SWITCH_MAIN_16_17).toggleClass('hide');
    star_points += result.points;
    photo = '';
    contacts = {};
    geo_location = {};
    mood = false;
    task_id = null;
}

function lowMoodRecorded(result) {
    console.log(result);
    $('#container').load('resources2.html #window_moodPositive', function () {
        $(WINDOW_SWITCH_MAIN_20_14).toggleClass('hide');
        $('#reward_for_activity_complete').text(result.points);
    });
    photo = '';
    contacts = {};
    geo_location = {};
    mood = false;
    task_id = null;
}

//ACTIVITY RECORD
function activityRecorded(result) {
    console.log(result);
    $('#reward_for_activity_complete').text(result.points);
    $(WINDOW_SWITCH_MAIN_13_14).toggleClass('hide');
    localStorage.removeItem('Lelly_last_activity');
    photo = '';
    contacts = {};
}

function getExpansionsPack(result) {
    console.log(result);
    if (result.errors) {
        return false;
    } else {
        var position = 'left';
        for (var i=0; i < result.expansion_packs.length; i++) {
            if(position == 'left') {
                position = 'right';
                $('<div class="eat-block"></div>').appendTo("#expansion_container");
                var container = $('.eat-block')[i/2];
                $('<div data-id="'+ result.expansion_packs[i].id +'" data-points="'+ result.expansion_packs[i].points +'" class="expansion_pack eat">' +
                    '<img src="' + result.expansion_packs[i].photo+'" alt="">' +
                    '<p>'+ result.expansion_packs[i].name +'</p>' +
                    '</div>').appendTo(container);
            } else {
                position = 'left';
                var container = $('.eat-block')[i/2-0.5];
                $('<div data-id="'+ result.expansion_packs[i].id +'" data-points="'+ result.expansion_packs[i].points +'" class="expansion_pack eat">' +
                    '<img src="'+ result.expansion_packs[i].photo+'" alt="">' +
                    '<p>'+ result.expansion_packs[i].name +'</p>' +
                    '</div>').appendTo(container);

            }
        }
        $('.expansion_pack').click(function () {
            var title = $(this).find('p').text();
            var cost = $(this).attr('data-points');
            var data = {'exp_pack_id': $(this).attr('data-id')};
            var action = 'unlock-expansion-pack';
            navigator.notification.confirm('Do you want to purchase this expansion pack?\r\nIt will cost '+ cost +' star points.', function(button) {
                if (button == 1) {
                    startAjaxAnimation();
                    request_logged('POST', 'site', action, data, unlockExpansionsPack, requestErrorCallBack)
                }
                else {
                    return;
                }
            }, title, ['Purchase', 'Cancel']);

        });
    }
}

function unlockExpansionsPack(result) {
    console.log(result);
    if (!result.errors) {
        window.alert('Congratulations!', 'You have unlocked an expansion pack "' + result.name + '"');
    }
    else {
        window.alert('Sory', result.errors);
    }
}
function loadUsers(result) {
    console.log(result);
    if (result.errors) {
        return false;
    }
    else {
        $.each(result.likes, function (index, value) {
            $('#tab_users').append();
        });
    }
}
function recordError(result) {
    console.log(result);
    window.alert('No connection' ,"Don't worry your activity will be recorded when you re-logged.");
}
function recordLastActivity(result) {
    console.log(result);
    if (result.errors) return false;
    else {
        var type = result.type;
        var title = result.title;
        var points = result.points;
        $('#lastActivitySendPopup').hide();
        window.alert('Saved ' + type + ' recorded', 'Congratulations!\n\rTitle: "' + title +'"\n\rYou have got ' + points + '!');
        localStorage.removeItem('Lelly_last_activity');
    }
}
function errRecordLastActivity (result) {
    console.log(resiult);
    window.alert('Sory','Server error.\n\rIt was a problem to record your saved data.')
}