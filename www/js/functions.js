
function onPause() {
    $('#after_pause_block').show();
    //setTimeout(function() {
        $('#window_pin').show();
    //},500);
}
function onResume() {
    setTimeout(function() {
        $('#after_pause_block').hide();
    },300);
}
function onBackKeyDown() {
    navigator.home.home(function() {console.log('Home success')} , function(err){console.log('Error:' + err)})
}
// Check the Pin length UNIVERSAL Function
function checkPin(value) {
    if (value == 0) {
        return false;
    }
    if (value.length < 4) {
        return false;
    }
}
//PinDialog on Screen 2 (login)
function logPinDialog() {
    if (device.platform === 'Android') {
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
    else return;
}

//PinDialog on Screen 31 (LockScreen)
function lockPinDialog() {
    if (device.platform === 'Android') {
        window.plugins.pinDialog.prompt(" ", function (results) {
            if (results.buttonIndex == 1) {
                // OK clicked, show input value
                $('#input_lockScreen').val(results.input1).blur();
            }
            if (results.buttonIndex == 2) {
                // Cancel clicked
                $('#input_lockScreen').blur();
                return false;
            }
        }, "Enter PIN", ["OK", "Cancel"]);
    }
    else return;
}
//PinDialog on Screen 6 (Register)
function regPinDialog() {
    if (device.platform === 'Android') {
        window.plugins.pinDialog.prompt(" ", function (results) {
            if (results.buttonIndex == 1) {
                // OK clicked, show input value
                $('#input_newPin').val(results.input1).blur();
            }
            if (results.buttonIndex == 2) {
                // Cancel clicked
                return false;
            }
        }, "Enter PIN", ["OK", "Cancel"]);
    }
    else return;
}
// DIALER
function dial(phone) {
    window.location.href = 'tel:' + phone;
}

//PinDialog on Screen 6 (Register)
function regPinConfirmDialog() {
    if (device.platform === 'Android') {
        window.plugins.pinDialog.prompt(" ", function (results) {
            if (results.buttonIndex == 1) {
                $('#input_newPinConfirm').val(results.input1).blur();
            }
            if (results.buttonIndex == 2) {
                return false;
            }
        }, "Confirm PIN", ["OK", "Cancel"]);
    }
    else return;
}

//SERIALIZE OBJECT
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

// CHANGE ICONS OF FEATURES ADDED
function iconChangeColor(result, element) {
    if (result.length >= 1) {
        element.removeClass('medium-circle-green');
        element.addClass('medium-circle-red');
        return true;
    }
    else {
        element.removeClass('medium-circle-red');
        element.addClass('medium-circle-green');
        return false;
    }
}

//ADD CONTACT TO TASK/ACTIVITY
function addContact(element) {
    reloadPauseLisneter();
    $('#after_pause_block').show();
    navigator.contacts.pickContact(function(contact) {
        $('#window_pin').hide();
        $('#after_pause_block').hide();
        var contact_array = [contact];
        iconChangeColor(contact_array, element);
        var name = contact.displayName;
        var phone = contact.phoneNumbers[0].value;
        phone = phone.replace(/\-|\x20/g,"");
        contacts.name = name;
        contacts.phone = phone;
    }, function(err) {
        console.log(err);
    });
}

// ADD IMAGE TO TASK/ACTIVITY
function addImage(element){
    photo = {};
    reloadPauseLisneter();
    $('#after_pause_block').show();
    window.imagePicker.getPictures(
        function(results) {
            $('#window_pin').hide();
            $('#after_pause_block').hide();
            iconChangeColor(results, element);
            for (var i = 0; i < results.length; i++) {
                console.log('Image URI: ' + results[i]);
                photo[i] = 'Image URI: ' + results[i]
            }
        }, function (error) {
            console.log('Error: ' + error);
        }
    );
}
// ADD MOOD TO TASK/ACTIVITY

function showMoodModal(element) {
    mood = '';
    var result = [1];
    $('#overlay').fadeIn(200,
        function(){
            $('#modal-form')
                .css('display', 'block')
                .animate({opacity: 1, top: '50%'}, 350);
        });
    document.removeEventListener("backbutton", onBackKeyDown, false);
    document.addEventListener("backbutton", closeMoodModal, false);
    $('.modal_mood').click(function() {
        switch ($(this).attr('mood')) {
            case 'unsure': mood = 'unsure'; break;
            case 'meh': mood = 'meh'; break;
            case 'horror': mood = 'horror' ;break;
            case 'happy': mood = 'happy'; break;
            case 'awesome': mood = 'awesome'; break;
            case 'omg': mood = 'omg'; break;
            case 'sad': mood = 'sad'; break;
            case 'angry': mood = 'angry'; break;
            case 'crying': mood = 'crying'; break;
            default: result = [];
        }
        closeMoodModal();
        iconChangeColor(result, element);
    });
    $('#overlay').click( function(){
        result = [];
        mood = '';
        closeMoodModal();
        iconChangeColor(result, element);
    });
}
function closeMoodModal() {
    $('#modal-form')
        .animate({opacity: 0, top: '-25%'}, 350,
            function(){
                $(this).css('display', 'none');
                $('#overlay').fadeOut(200);
            }
        );
    document.removeEventListener("backbutton", closeMoodModal, false);
    document.addEventListener("backbutton", onBackKeyDown, false);
}

// ADD LOCATION
function addLocation(element) {
    geo_location = {};
    reloadPauseLisneter();
    //$('#after_pause_block').show();
    var options = {
        maximumAge: 0,
        timeout: 15000,
        enableHighAccuracy: true
    };
    navigator.geolocation.getCurrentPosition(function(pos) {
        console.log(pos);
        $('#window_pin').hide();
        $('#after_pause_block').hide();
        iconChangeColor(results, element);
        geo_location = {'Latitude' : pos.coords.latitude,
            'Longitude': pos.coords.longitude,
            'Altitude': pos.coords.altitude,
            'Accuracy': pos.coords.accuracy}
    }, function(error) {
        console.log('code: '    + error.code    + '\n' +
            'message: ' + error.message + '\n');
    }, options);
}

// MENU HIDE
function hideMenu() {
    $("#window_menu").stop(true,true).animate({width: "0"},250);
}
function menuContainerHide() {
    $('#menu_container').fadeOut(400);
}
function reloadPauseLisneter() {
    document.removeEventListener("pause", onPause, false);
    setTimeout(function() {
        document.addEventListener("pause", onPause, false);
    },1000);
}