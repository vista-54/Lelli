var wrong_pinCounter = 0;
var user_name;
var URL = 'http://192.168.0.102/api';
var versions = '/v1/';
$(document).ajaxStop(function() {
    $('.spinner').hide();
});
$(document).ajaxComplete(function() {
    $('.spinner').hide();
});
// -------------------------UNITED AJAX REQUEST FUNCTIONS-------------------------------
function request_logged(type, controller, action, data, successCallBack, errorCallBack){
    $.ajax({
        type: type,
        url: URL + versions + controller + '/'+ action,
        headers: {
            "Authorization" : 'Bearer ' + localStorage['Lelly_authKey']
        },
        data: data,
        success:successCallBack,
        error: errorCallBack
    })
}
function request(type, controller, action, data, successCallBack, errorCallBack){
    $.ajax({
        type: type,
        url: URL + versions + controller + '/'+ action,
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
    $(".spinner").bind("ajaxError", function() {
        $(this).hide();
    });
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
        $('#input_regEmail').css('border-color','red');
        $('#input_regEmail').before(function (index) {
            return '<p class="alert red">Email is not available</p>'
        })
    }
    else {
        $('#input_regEmail').css('border-color','green');
    }
}

//Likes and Struggles
function download_likesAndStruggles(result){
    console.log(result);
    $.each(result.likes, function(index,value) {
        $('#likes').append('<li><div class="white-block"><div class="description-block">' + value + '</div><div class="button-block"><input class="likes" id="like' + index + '" type="radio" name="'+ index + '" value="0"><label for="like' + index + '"><i class="fa fa-thumbs-down fa-3x"></i></label><input class="likes" id="like' + index + 'z" type="radio" name="' + index + '"value="1"><label for="like' + index + 'z"><i class="fa rotate fa-thumbs-down fa-3x"></i></label></div></div></li>');
    });
    $.each(result.struggles, function(index,value) {
        $('#struggles').append('<li><div class="white-block"><div class="button-block2"><input id="'+ index + 'gh" name="'+ index +'" type="checkbox"><label for="'+ index + 'gh"><span class="medium-circle-gray"><i class="fa fa-check fa-2x"></i></span></label></div><div class="description-block2">'+value+'</div></div></li>');
    });
    $(WINDOW_SWITCH_REGISTER_1_2).toggleClass('hide');
}

// Send register form
function register_finish(result) {
    if (result == false) {
        console.log('Error:' + result);
        return false;
    }
    else {
        localStorage['Lelly_auth_key'] = result.auth_key;
        user_name = result.user_name;
        $(WINDOW_SWITCH_REGISTER_4_5).toggleClass('hide');
        contacts = {};
    }
}

//LOG OUT
function logOut(result) {
    localStorage.removeItem('Lelly_authKey');
    console.log(result);
}

//LOG IN
function login(result) {
    if(result.auth_key && result.accept) {
        localStorage.setItem('Lelly_login_email', _email);
        localStorage['Lelly_authKey'] = result.auth_key;
        user_name = localStorage['Lelly_UserName'] = result.user_name;
        console.log(result);
        show_moodscreen(user_name);
    }
    else {
        if (result.message === 'wrong pin') wrong_pinCounter += 1;
        if (wrong_pinCounter == 3) {
            $('#container').load('resources2.html #window_locked');
            wrong_pinCounter == 0;
        }
        console.log(result);
    }
}

//MOOD SCREEN CHOOSER
function show_moodscreen(name) {
    var th = ['st','nd', 'th'];
    var today = new Date();
    if (today.getDate() >=3) th[today.getDate()] = 'th';
    var day = WEEK_DAY[today.getDay()] + ' ';
    var date = ''+ today.getDate() + th[today.getDate()]+' ';
    var month_today = MONTH[today.getMonth()];
    $('#container').load('resources2.html #window_moodScreen', function () {
        $('#day_is').text(day);
        $('#date_is').text(date);
        $('#month_is').text(month_today);
        $('#user_name_is').text(name);
    });
}

// PIN RESTORE
function forgotPin(result) {
    console.log(result);
    if(result == true) {
        $(WINDOW_SWITCH_LOGIN_2_3).toggleClass('hide');
    }
    else {console.log(result.errors);
    return false
    }
}

// GET TASKS
function getTasks(result) {
    console.log(result);
    if (!result.tasks || result.tasks.length <=2) {
        return false
    }
    else {
        $('#taskItem_1').html(result.tasks[0]);
        $('#taskItem_2').html(result.tasks[1]);
        $('#taskItem_3').html(result.tasks[2]);
    }
}

//TASK RECORD
function taskRecorded(result) {
    $('#reward_for_task_complete').text(result.reward);
    $(WINDOW_SWITCH_MAIN_16_17).toggleClass('hide');
    photo = null;
    contacts = {};
}

//ACTIVITY RECORD
function activityRecorded(result) {
    $('#reward_for_task_complete').text(result.reward);
    $(WINDOW_SWITCH_MAIN_13_14).toggleClass('hide');
    photo = null;
}