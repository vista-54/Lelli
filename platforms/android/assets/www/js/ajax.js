/**
 * Created by Bohdan on 30.11.2015.
 */
var URL = 'http://192.168.0.102/api';
var versions = '/v1/';
$(document).ajaxStop(function() {
    $('.spinner').hide();
});
$(document).ajaxComplete(function() {
    $('.spinner').hide();
});
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
function logOut(result) {
    localStorage.removeItem('Lelly_authKey');
        console.log(result);
}
function request(type, controller, action, data, successCallBack, errorCallBack){
    $.ajax({
        type: type,
        url: URL + versions + controller + '/'+ action,
        data: data,
        success:
        successCallBack,
        error: errorCallBack
    })
}
function login(result) {
        //stopLoadingAnimation();
        if(result.auth_key) {
            //localStorage.setItem('Lelly_login_email', _email);
            var auth_key = localStorage['Lelly_authKey'] = result.auth_key;
            console.log(result);
            console.log('AuthKey: ' + auth_key);
        }
        else {
            console.log(result);
        }
}
function errorCallBack(result) {
    $(".spinner").bind("ajaxError", function() {
    $(this).hide();
    });
    console.log(result);
    return false;
}
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
function forgotPin(result) {
        console.log(result);
    if(result == true) {
        $(WINDOW_SWITCH_LOGIN_2_3).toggleClass('hide');
    }
    else {console.log(result.errors);
    return false
    }
}
function download_likesAndStruggles(result){
    $.each(result.likes, function(index,value) {
        $('#likes').append('<li><div class="white-block"><div class="description-block">' + value + '</div><div class="button-block"><input class="likes" id="like' + index + '" type="radio" name="'+ index + '" value="0"><label for="like' + index + '"><i class="fa fa-thumbs-down fa-3x"></i></label><input class="likes" id="like' + index + 'z" type="radio" name="' + index + '"value="1"><label for="like' + index + 'z"><i class="fa rotate fa-thumbs-down fa-3x"></i></label></div></div></li>');
    });
    $.each(result.struggles, function(index,value) {
        $('#struggles').append('<li><div class="white-block"><div class="button-block2"><input id="'+ index + 'gh" name="'+ index +'" type="checkbox"><label for="'+ index + 'gh"><span class="medium-circle-gray"><i class="fa fa-check fa-2x"></i></span></label></div><div class="description-block2">'+value+'</div></div></li>');
    });
    $(WINDOW_SWITCH_REGISTER_1_2).toggleClass('hide');
}
function checkConnection() {
    try {
        if(typeof(navigator.connection) === 'undefined'){
            return true;  // is browser
        }
        var networkState = navigator.connection.type;

        var states = {};
        states[Connection.UNKNOWN] = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI] = 'WiFi connection';
        states[Connection.CELL_2G] = 'Cell 2G connection';
        states[Connection.CELL_3G] = 'Cell 3G connection';
        states[Connection.CELL_4G] = 'Cell 4G connection';
        states[Connection.CELL] = 'Cell generic connection';
        states[Connection.NONE] = 'No network connection';

      console.log('Connection type: ' + states[networkState]);
        if (networkState === Connection.NONE) {
            return false;
        }
        return true;

    } catch (error) {
        console.log(error.message);
    }
}