
function onPause() {
    $('#after_pause_block').show();
    setTimeout(function() {
        $('#window_pin').show();
    },500);
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

//PinDialog on Screen 31 (LockScreen)
function lockPinDialog() {
    window.plugins.pinDialog.prompt(" ", function(results) {
        if(results.buttonIndex == 1)
        {
            // OK clicked, show input value
            $('#input_lockScreen').val(results.input1).blur();
        }
        if(results.buttonIndex == 2)
        {
            // Cancel clicked
            $('#input_lockScreen').blur();
            return false;
        }
    }, "Enter PIN", ["OK","Cancel"]);
}
//PinDialog on Screen 6 (Register)
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
// DIALER
function dial(phone) {
    window.location.href = 'tel:' + phone;
}

//PinDialog on Screen 6 (Register)
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
// MENU HIDE
function hideMenu() {
    $("#window_menu").stop(true,true).animate({width: "0"},250);
}
function menuContainerHide() {
    $('#menu_container').fadeOut(400);
}