var URL = 'http://159.224.220.233/lelly/api';
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
function request_sync(type, controller, action, data, successCallBack, requestErrorCallBack) {
    try {
        $.ajax({
            type: type,
            async: false,
            url: URL + versions + controller + '/' + action,
            headers: {
                "Accept": 'application/json'
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
function requestPayment(action, data, successCallBack, requestErrorCallBack) {
    $.ajax({
        type: 'POST',
        url: action,
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
        $('#input_regEmail').css({'border-color': 'green', 'color': 'green'});
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
        localStorage['Lelly_auth_key'] = result.auth_key;
        localStorage['Lelly_pin'] = _pin;
        localStorage['Lelly_contacts'] = JSON.stringify(result.contacts);
        user_name = localStorage['Lelly_UserName'] || result.user_name;
        star_points = result.points;
        console.log(result);
        $(WINDOW_SWITCH_REGISTER_4_5).toggleClass('hide');
        setTimeout(function () {
            showMoodScreen(result.user_name);
            document.addEventListener("pause", onPause, false);
            document.addEventListener("resume", onResume, false);
        }, 3000);
        contacts = {};
        screen_lock = true;
    }
}

//LOG IN
function login(result) {
    console.log(result);
    if (result.auth_key && !result.errors) {
        local_email = _email;
        localStorage['Lelly_auth_key'] = result.auth_key;
        localStorage['Lelly_pin'] = _pin;
        localStorage['Lelly_contacts'] = JSON.stringify(result.contacts);
        user_name = localStorage['Lelly_UserName'] || result.user_name;
        star_points = result.points;
        showMoodScreen(result.user_name);
        document.addEventListener("pause", onPause, false);
        document.addEventListener("resume", onResume, false);
        recordUnsavedActivities();
        screen_lock = true;
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
    PlaySound('sound');
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
    PlaySound('sound');
    photo = '';
    contacts = {};
}

function getExpansionsPack(result) {
    console.log(result);
    if (result.errors) {
        return false;
    } else {
        star_points = result.app_user_points;
        var position = 'left';
        for (var i = 0; i < result.expansion_packs.length; i++) {
            if (position == 'left') {
                position = 'right';
                $('<div class="eat-block"></div>').appendTo("#expansion_container");
                var container = $('.eat-block')[i / 2];
                $('<div data-id="' + result.expansion_packs[i].id + '" data-points="' + result.expansion_packs[i].points + '" class="expansion_pack eat">' +
                    '<img src="' + result.expansion_packs[i].photo + '" alt="">' +
                    '<p>' + result.expansion_packs[i].name + '</p>' +
                    '</div>').appendTo(container);
            } else {
                position = 'left';
                var container = $('.eat-block')[i / 2 - 0.5];
                $('<div data-id="' + result.expansion_packs[i].id + '" data-points="' + result.expansion_packs[i].points + '" class="expansion_pack eat">' +
                    '<img src="' + result.expansion_packs[i].photo + '" alt="">' +
                    '<p>' + result.expansion_packs[i].name + '</p>' +
                    '</div>').appendTo(container);

            }
        }
        $('.expansion_pack').click(function () {
            var title = $(this).find('p').text();
            var cost = $(this).attr('data-points');
            var data = {'exp_pack_id': $(this).attr('data-id')};
            var action = 'unlock-expansion-pack';
            if (cost > star_points) {
                navigator.notification.confirm('Your star-points is enough to purchase this expansion pack?\r\nIt costs ' + cost + ' star points but you have only ' + star_points + '.\r\nWould you like to buy this pack?', function (button) {
                    if (button == 1) {
                        //TODO Buy function
                        //var clientID = 'AV2UW69wdcyBDfNUhLC3uEhuzXBGWOS3VDIlAheiyG_9Zsf22Wn8E_-LUKjqxwi4S5IyjJ4VtmPQ_Mu1';
                        //var password = 'EC6_d2KccyDDyzJ8QtgF1lKuWAOwcF6fAODBDgdhMw8dlSGsjYC7NW58ij9dJ6HZVEm_j6EH9tbDFMlk';
                        //var action = 'https://' + clientID + ':' + password + '@api.sandbox.paypal.com/v1/oauth2/token';
                        //var data = "grant_type=client_credentials";
                        //requestPayment(action,data,request_result,requestErrorCallBack);
                        //window.open();
                    }
                    else {
                        return;
                    }
                }, title, ['Buy Now!', 'Cancel']);
                return;
            }
            navigator.notification.confirm('Do you want to purchase this expansion pack?\r\nIt will cost ' + cost + ' star points.', function (button) {
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
        $.each(result.connections, function (index, value) {
            var user_status = value.status === 'active' ? 'enable' : 'disable';
            var monitor_id = value.monitor_id;
            var connection = value.id;
            var external_password = value.external_password;
            var name = value.name;
            $('#tab_users').append('<tr connection-id=' + connection + ' class="white-block ' + user_status + '">' +
                '<td class="td-one">' +
                '<p class="bold">' + name + '</p>' +
                '</td>' +
                '<td class="td-two circle">' +
                '<div class="small-circle-red"></div>' +
                '</td>' +
                '<td class="td-three">' +
                '<p>' + monitor_id + '</p>' +
                '</td>' +
                '<td class="td-three">' +
                '<p>' + external_password + '</p>' +
                '</td>' +
                '</tr>');
        });
        connectionsOnclickInit();
        $('#btn_disconnect_yes').click(function () {
            var data = {connection_id: connection_id};
            var action = 'cut-connection';
            startAjaxAnimation();
            request_logged('POST', 'site', action, data, disconnectUser, requestErrorCallBack);
            $(".disconnect-box").css({"display": "none"});
        });
        $('#btn_connect_yes').click(function () {
            var data = {connection_id: connection_id};
            var action = 'recover-connection';
            startAjaxAnimation();
            request_logged('POST', 'site', action, data, connectUser, requestErrorCallBack);
            $(".connect-box").css({"display": "none"});
        });
        $('#btn_disconnect_no').click(function () {
            $(".disconnect-box").css({"display": "none"});
        });
        $('#btn_connect_no').click(function () {
            $(".connect-box").css({"display": "none"});
        })
    }
}
function recordError(result) {
    console.log(result);
    navigator.notification.alert("Don't worry your activity will be recorded when the connection is restored.", function () {
            var date = new Date();
            var timestamp = '' + date.getFullYear() + date.getMonth() + date.getHours() + date.getMinutes() + date.getSeconds();
            var data = localStorage['Lelly_last_activity'];
            localStorage.setItem('Lelly_undone_' + local_email + '_' + timestamp, data);
            localStorage.removeItem('Lelly_last_activity');
            showMoodScreen(user_name);
            if (checkConnection) {
                return;
            }
            checkConnection = setInterval(function () {
                    if (navigator.connection.type === 'none') {
                        return;
                    } else {
                        screen_lock = false;
                        window.clearInterval(checkConnection);
                        recordUnsavedActivities();
                    }
                }
                ,
                1000
            )
            ;
        },
        'No connection', "OK"
    )
    ;
}
function addConnection(result) {
    console.log(result);
    showConnections();
    connection_id = '';
    $('.bot-menu ul li:eq(4)').removeClass('active');
    $('.bot-menu ul li:eq(3)').addClass('active');
}
function disconnectUser(result) {
    console.log(result);
    if (result === true) {
        $('#tab_users tr[connection-id="' + connection_id + '"]').removeClass('enable').addClass('disable');
        connectionsOnclickInit();
        connection_id = '';
    }
}
function connectUser(result) {
    console.log(result);
    if (result === true) {
        $('#tab_users tr[connection-id="' + connection_id + '"]').removeClass('disable').addClass('enable');
        connectionsOnclickInit();
        connection_id = '';
    }
}

function historyWrite(result) {
    console.log(result);
    if (!result.errors && result.connections.length > 0) {
        for (var i = 0; i < result.connections.length; i++) {
            var item = result.connections[i];
            operator:
            {
                if (item.status !== 'active') break operator;
                var action = 'get-mood-history';
                //historyShow();
                request_logged('POST', 'site', action, null, historyShow, requestErrorCallBack);
                break;
            }
        }
    }
    else {
        return false;
    }
}
//Show history after request
function historyShow(result) {
    console.log(result);
    var result_data = result;
    $('ul.tabs-controls li[data-class="third"] a img').remove();
    $('ul.tabs-list li.tabs-item-third').html($('<div/>').addClass('history')
        .append('<div class="swiper-container"><div class="swiper-wrapper"></div></div>'));
    $.each(result_data, function (i, value) {
        $('.swiper-wrapper').append('<div class="swiper-slide"><p>' + value.month + ' ' + value.year + '</p><div class="graph"><span class="graph-number-one">1</span><span class="graph-number-two">' + result_data[i].data.length + '</span><div id="ct-chart' + i + '" class="ct-chart ct-perfect-fifth"></div></div></div>');
        //$('.history').append('<div class="graph"><div id="ct-chart'+ i +'" class="ct-chart ct-perfect-fifth"></div></div>');
        var data = {
            'label': new Array(result_data[i].data.length),
            'data': result_data[i].data
        };
        $.each(value.data, function (index, val) {
            if (val == null) {
                delete result_data[i].data[index];
            }
        });
        buildgraph('#ct-chart' + i, data);
    });
}

function getGraphData(result) {
    var result_data = result;
    $('.tabs-list li.tabs-item-first .month').text(result_data.month);
    $('.tabs-list li.tabs-item-first .graph-number-two').text(result_data.data.length);
    $.each(result_data.data, function (i, value) {
        if (value == null) {
            delete result_data.data[i];
        }
    });
    var data = {
        'label': new Array(result_data.data.length),
        'data': result_data.data
    };
    console.log(data);
    buildgraph('#ct-chart', data);
}