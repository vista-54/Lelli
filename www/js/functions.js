function onPause() {
    console.log('app have been paused');
    if (screen_lock == false) return false;
    $('#container').css('visibility', 'hidden');
    $('#menu_container').css('visibility', 'hidden');
    $('#after_pause_block').show();
    $("#window_menu").css('width', '0%');
}
function onResume() {
    console.log('app was resumed');
    if(screen_lock == false) {
        $('#container').css('visibility', 'visible');
        $('#menu_container').css('visibility', 'visible');
        setTimeout(function() {
            $('#after_pause_block').hide();
        },200);
    } else {
        $('#window_pin').show();
    }
}
function onBackKeyDown() {
    navigator.home.home(function() {console.log('Home success')} , function(err){console.log('Error:' + err)})
}
// Check the Pin length UNIVERSAL Function
function checkPin(value) {
    if (value.length < 4) {
        return false;
    }
    else return true;
}
//PinDialog on Screen 2 (login)
function logPinDialog() {
    if (isAndroid) {
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
    else return false;
}

//PinDialog on Screen 31 (LockScreen)
function lockPinDialog() {
    if (isAndroid) {
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
    if (isAndroid) {
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
    window.open('tel:' + phone, '_system');
}

//PinDialog on Screen 6 (Register)
function regPinConfirmDialog() {
    if (isAndroid) {
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
// AFTER MOOD SCREEN WAS SHOWED
//------------------------- SCREEN 11 -----------------------------------
function choiseMood(element) {
    var data = $(element).attr('mood');
    var action = 'save-mood';
    var request_data = {'mood' : data};
    console.log(request_data);
    if (data === 'happy' || data === 'awesome' || data === 'omg' || data === 'unsure' || data === 'meh') {
        //    Mood is positive or neutral
        user_mood_now = 'positive';
        console.log(request_data);
        request_logged('POST', 'site', action, request_data, request_result);
        // ----------------- SCREEN 12 ----------------------------------
        showPositiveScreen();
    }
    else {
        //    Mood is negative
        user_mood_now = 'negative';
        request_logged('POST', 'site', action, request_data, request_result);
        // ----------------- SCREEN 19 ----------------------------------
        showNegativeScreen();
    }
}
// CHANGE ICONS WHEN THE FEATURES WAS ADDED
function iconChangeColor(result, element) {
    if (result.length >= 1) {
        element.removeClass('medium-circle-green');
        element.addClass('medium-circle-red');
    }
    else {
        element.removeClass('medium-circle-red');
        element.addClass('medium-circle-green');
    }
}

//ADD CONTACT TO TASK/ACTIVITY
function addContact(element) {
    screen_lock = false;
    cordova.plugins.Keyboard.close();
    navigator.contacts.pickContact(function(contact) {
        reloadPauseListener();
        var contact_array = [contact];
        iconChangeColor(contact_array, element);
        var name = contact.name.formatted;
        var phone = contact.phoneNumbers[0].value;
        phone = phone.replace(/\-|\x20/g,"");
        contacts.name = name;
        contacts.phone = phone;
    }, function(err) {
        console.log(err);
    });
}

// ADD IMAGE TO TASK/ACTIVITY

function addImage(element) {
    photo = '';
    screen_lock = false;
    function foo(element) {
        var cameraOptions = {
            quality : 50,
            destinationType : 2,
            sourceType : 0
        };

// camera fail
        function onFail(message) {
            console.log('Failed because: ' + message);
        }
        function cameraSuccess(imageURI) {
            $('#after_pause_block').hide();
            iconChangeColor([1], element);
            console.log(imageURI);
            //Hotfix (error404)
            imageURI = imageURI.replace('%', encodeURIComponent('%'));
            photo = imageURI;
        }
        navigator.camera.getPicture(cameraSuccess, onFail, cameraOptions);
    }
    if (cordova.plugins.Keyboard.isVisible) {
        cordova.plugins.Keyboard.close();
        setTimeout(foo(element), 400)
    }
    else foo(element);
}
// ADD MOOD TO TASK/ACTIVITY

//function showMoodModal(element) {
//    mood = '';
//    var result = [1];
//    $('#overlay').fadeIn(200,
//        function(){
//            $('#modal-form')
//                .css('display', 'block')
//                .animate({opacity: 1, top: '50%'}, 350);
//        });
//    document.removeEventListener("backbutton", onBackKeyDown, false);
//    document.addEventListener("backbutton", closeMoodModal, false);
//    $('.modal_mood').click(function() {
//        switch ($(this).attr('mood')) {
//            case 'unsure': mood = 'unsure'; break;
//            case 'meh': mood = 'meh'; break;
//            case 'horror': mood = 'horror' ;break;
//            case 'happy': mood = 'happy'; break;
//            case 'awesome': mood = 'awesome'; break;
//            case 'omg': mood = 'omg'; break;
//            case 'sad': mood = 'sad'; break;
//            case 'angry': mood = 'angry'; break;
//            case 'crying': mood = 'crying'; break;
//            default: result = [];
//        }
//        closeMoodModal();
//        iconChangeColor(result, element);
//    });
//    $('#overlay').click( function(){
//        result = [];
//        mood = '';
//        closeMoodModal();
//        iconChangeColor(result, element);
//    });
//}
//function closeMoodModal() {
//    $('#modal-form')
//        .animate({opacity: 0, top: '-25%'}, 350,
//            function(){
//                $(this).css('display', 'none');
//                $('#overlay').fadeOut(200);
//            }
//        );
//    document.removeEventListener("backbutton", closeMoodModal, false);
//    document.addEventListener("backbutton", onBackKeyDown, false);
//}

// ADD LOCATION
function addLocation(element) {
    geo_location = {};
    screen_lock = false;
    //$('#after_pause_block').show();
    var options = {
        maximumAge: 0,
        timeout: 15000,
        enableHighAccuracy: true
    };
    navigator.geolocation.getCurrentPosition(function(pos) {
        reloadPauseListener();
        console.log(pos);
        $('#window_pin').hide();
        $('#after_pause_block').hide();
        iconChangeColor([1], element);
        geo_location = {'Latitude' : pos.coords.latitude,
            'Longitude': pos.coords.longitude
        }
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
function reloadPauseListener() {
    setTimeout(function() {
        screen_lock = (screen_lock == false);
    },3000);
}
function buildgraph(item, graph){
    var options = {
        fullWidth: true,
        fullHeight: true,
        high: 10,
        showArea: true,
        showLine: false,
        showLabel: true,
        showPoint: false,
        chartPadding: 0,
        low: 0,
        axisX: {
            showLabel: false,
            showGrid: true,
            offset: 0,
            labelOffset: {
                x: 0,
                y: 0
            }
        },
        axisY: {
            showLabel: false,
            showGrid: false,
            offset: 0,
            labelOffset: {
                x: 0,
                y: 0
            }
        }
    };
    var data = {
        labels: graph.label,
        series: [
            graph.data
        ]
    };

    new Chartist.Line(item, data, options);
}
function ajaxAnimationTasks(refresher) {
    refresher.fadeOut(150);
    setTimeout(function() {
        refresher.attr('src','img/spinner2.gif').fadeIn(150);
    },150);
    $('.task1 > p').animate({"left":"-=100%"},300);
    $('.task1 .tasks-star-point').animate({"right":"-=200%"},300);
    setTimeout(function() {
        $('.task2 > p').animate({"left":"-=100%"},300);
        $('.task2 .tasks-star-point').animate({"right":"-=200%"},300);
    },150);
    setTimeout(function() {
        $('.task3 > p').animate({"left":"-=100%"},300);
        $('.task3 .tasks-star-point').animate({"right":"-=200%"},300);
    },300);
}
function menuContainerShow() {
    $('#menu_container').fadeIn(400);
    menuButtonInit();
}
//Animate invalid input
function animateInvalidInput(jq_element) {
    jq_element.css('border-color', '#ec5664').addClass('placeholder');
    setTimeout(function() {
        jq_element.css('border-color', '').removeClass('placeholder');
    },450);
    setTimeout(function() {
        jq_element.css('border-color', '#ec5664').addClass('placeholder');
    },900);
}
//VALIDATE EMAIL
function validateEmail(jq_element) {
    if (jq_element.val().length == 0) {
        return true;
    }
    var pattern = /^([a-z0-9_\.-])+@([a-z0-9-]+)(\.[a-z0-9-]{2,6})?\.[a-z]{2,4}$/i;
    return pattern.test(jq_element.val());
}
//MOOD SCREEN CHOOSER
function showMoodScreen(name) {
    var th = ['st', 'nd', 'th'];
    var today = new Date();
    if (today.getDate() >= 3) th[today.getDate()] = 'th';
    var day = WEEK_DAY[today.getDay()] + ' ';
    var date = '' + today.getDate() + th[today.getDate()] + ' ';
    var month_today = MONTH[today.getMonth()];
    $('#container').load('resources2.html #window_moodScreen', function () {
        menuButtonInit();
        $('#day_is').text(day);
        $('#date_is').text(date);
        $('#month_is').text(month_today);
        $('#user_name_is').text(name);
        $('.smile-one').click(function () {
            choiseMood(this);
        });
    });
    $(function() {
        $('.top-menu, .bot-menu, .bot-menu ul li').swipe({
            tap: clickOnMenuWindow
        });
    });
    $(function () {
        $('#window_menu').swipe({
            swipeLeft: function () {
                $("#window_menu").animate({width: '0'}, 250);
            }
        });
    });
    $(function () {
        $('#container, #menu_container').swipe({
            swipeRight: function () {
                $("#window_menu").animate({width: '100%'}, 250);
            }
        });
    });
}
function menuButtonInit() {
    $('.btn_menu').click(function (event) {
        $("#window_menu").stop(true, true).animate({width: "100%"}, 250);
        return false;
    });
}

function showPositiveScreen() {
    $('#container').load('resources2.html #window_moodPositive', function () {
        menuButtonInit();
        console.log(get_task_options);
        request_logged('POST', 'site', 'get-tasks', get_task_options, function (result) {
            console.log(result);
            if (!result.tasks || result.tasks.length <= 2) {
                return false
            }
            else {
                get_task_options.offset++;
                for (var i=1;i < result.tasks.length + 1; i++) {
                    var element = '.task'+ i;
                    var element_name = '.task'+ i + ' > p';
                    var element_points = '.task' + i + ' .tasks-star-point > p';
                    $(element).attr('data-id', result.tasks[i-1].id);
                    $(element_name).text(result.tasks[i-1].name);
                    $(element_points).text(result.tasks[i-1].points);
                }
            }
        }, requestErrorCallBack);
        console.log('Positive Screen loaded');
        $('#btn_taskRefresh').hide();
        $('#btn_selectTask').addClass('nomodified');
        $('#btn_taskRefresh').click(function(event) {
            var action = 'get-tasks';
            var data = get_task_options;
            console.log(data);
            ajaxAnimationTasks($(this));
            request_logged('POST','site', action, data, getTasks, getTasks);
            event.stopPropagation();
        });
        $('#btn_selectTask').click(function () {
            console.log('select task button clicked');
            if ($(this).hasClass('nomodified')) {
                $('#btn_activityRec .align').hide();
                $("#btn_activityRec").animate({height: "0%"}, 300);
                $("#block_tasks").animate({height: "50%"}, 300);
                $(this).toggleClass('nomodified');
                setTimeout(function () {
                    $("#btn_taskRefresh").fadeIn(400);
                }, 400);
            }
            else {
                $(this).toggleClass('nomodified');
                $('#btn_taskRefresh').fadeOut(400);
                $("#btn_activityRec").animate({height: "50%"}, 300);
                $("#block_tasks").animate({height: "0%"}, 300);
                setTimeout(function () {
                    $('#btn_activityRec .align').fadeIn(400);
                }, 400);
            }
        });
        $('#btn_activityRec').click(function () {
            console.log('activity rec button');
            get_task_options.offset = 1;
            $(WINDOW_SWITCH_MAIN_12_13).toggleClass('hide');
        });
        $('.btn_backToPositive').click(function(event) {
            event.preventDefault();
            $(WINDOW_SWITCH_MAIN_12_13).toggleClass('hide');
        });
        $('.task-block').click(function() {
            var item = $(this);
            var item_value = item.children('p').text();
            task_id = item.attr('data-id');
            get_task_options.offset = 1;
            $('#container').load('resources2.html #window_taskRecorder', function() {
                menuButtonInit();
                $('.btn_backToPositive').click(function(event) {
                    event.preventDefault();
                    showPositiveScreen();
                });
                $('#input_taskRecTitle').val(item_value);
            })
        });
        $('.btn_backToMood').click(function(event) {
            event.preventDefault();
            showMoodScreen(user_name);
        });
    });
}
function showNegativeScreen() {
    $('#container').load('resources2.html #window_moodNegative', function() {
        menuButtonInit();
        $('#btn_watsWrong').click(function() {
            $(WINDOW_SWITCH_MAIN_19_20).toggleClass('hide');
        });
        request_logged('POST','site', 'get-tasks', get_task_options, function(result) {
            console.log(result);

            if (!result.tasks || result.tasks.length <=2) {
                return false
            }
            else {
                get_task_options.offset++;
                $('.task1 > p').text(result.tasks[0].name);
                $('.task2 > p').text(result.tasks[1].name);
                $('.task3 > p').text(result.tasks[2].name);
                $('.task1 .tasks-star-point > p').text(result.tasks[0].points);
                $('.task2 .tasks-star-point > p').text(result.tasks[1].points);
                $('.task3 .tasks-star-point > p').text(result.tasks[2].points);
            }
        }, requestErrorCallBack);
        $(".tasks").hide();
        $(".block3").click(function () {
            $("br").css({"display":"none"});
            $(".block3").animate({height: "8%"}, 300);
            $(".block2").animate({height: "7%"}, 300);
            setTimeout(function(){
                $(".tasks").fadeIn(400);
            }, 400);
        });
        $('#btn_lowMoodRefresh').click(function(event) {
            var action = 'get-tasks';
            var data = get_task_options;
            console.log(data);
            ajaxAnimationTasks($(this));
            request_logged('POST','site', action, data, getTasks, getTasks);
            event.stopPropagation();
        });
        $('.task-block').click(function() {
            var item = $(this);
            var item_value = item.children('p').text();
            task_id = item.attr('data-id');
            get_task_options.offset = 1;
            $('#container').load('resources2.html #window_taskRecorder', function() {
                menuButtonInit();
                $('.btn_backToPositive').click(function(event) {
                    event.preventDefault();
                    showNegativeScreen();
                });
                $('#input_taskRecTitle').val(item_value);
            })
        });
        $('.btn_backToMood').click(function(event) {
            event.preventDefault();
            showMoodScreen(user_name);
        });
        $('.btn_backToNegative').click(function(event) {
            event.preventDefault();
            showNegativeScreen();
        });
    })
}
function showConnections() {
    $('#menu_container').load('resources2.html #window_menu_connections', function () {
        menuContainerShow();
        //$('#tab_users tbody tr').remove();
        var action = 'get-connections';
        startAjaxAnimation();
        request_logged('GET','site',action, null, loadUsers, requestErrorCallBack);
    });
}
function recordUnsavedActivities(){
    var query = 'Lelly_undone_' + local_email;
    var local_items = [];
    for (var i in localStorage) {
        if (localStorage.hasOwnProperty(i)) {
            if (i.match(query)) {
                local_items.push(i);
            }
        }
    }
    var item_count = local_items.length;
    checkConnection = false;
    if (item_count === 0) {return}
    navigator.notification.confirm('You have ' + item_count + ' unsaved activities or tasks.\n\rDo you want to save that?', function (button) {
            if (button === 1) {
                function sendData(item) {
                    screen_lock = true;
                    request_sync('POST','site', action, data, function(result) {
                        console.log(result);
                        var received_points = +result.points;
                        var title = result.title;
                        localStorage.removeItem(item);
                        PlaySound('sound');
                        window.alert(title, 'Your activity has already recorded.\n\rYou have earned '+ received_points +' star points for this!');
                    }, function() {
                        window.alert('Connection error', 'Your activities will be recorded after re-log in.');
                    });
                }
                for (var k=0; k < local_items.length; k++) {
                    var item = local_items[k];
                    var data = JSON.parse(localStorage[item]);
                    var action = 'save-activity';
                    if (data.Activity.photo) {
                        DataPhoto(data.Activity.photo, function(a){
                            data.Activity.photo = a;
                            screen_lock = true;
                            sendData(item);
                        })
                    }
                    else {
                        startAjaxAnimation();
                        sendData(item);
                    }
                }
                received_points = 0;
                screen_lock = true;
            } else return;
        }
        ,
        'Hi!', ['Confirm', 'Cancel']
    );
}
// Convert image URI to dataURI Base64
function DataPhoto(imageURI, callback) {
    screen_lock = false;
    $('#window_loader, .spinner .two').show();
    setTimeout(function () {
        var img = new Image();
        img.src = imageURI;
        img.onload = function() {
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            var dataUri = canvas.toDataURL('image/jpg');
            $('#window_loader, .spinner .two').hide();
            callback(dataUri);
    }},250);
}
//Play sound
function PlaySound(sound) {
    var source = '/android_asset/www/css/'+ sound +'.mp3';
    if (isIos) {
        source = 'css/'+ sound +'.mp3';
    }
    var my_media = new Media(source);
    //my_media.volume = 0.2;
    my_media.play();
}
//Hack for iOS when the non-button elements doesn't clicked on
function connectionsOnclickInit() {
    $('#tab_users tr').click(function () {
        if ($(this).hasClass('enable')) {
            $(".disconnect-box").css({"display": "block"});
        } else {
            $(".connect-box").css({"display": "block"});
        }
        connection_id = $(this).attr('connection-id');

    });
}
function initSlider() {
    var slider = $("#lightSlider").lightSlider(sliderOptions);
    $(function () {
        $('#lightSlider').swipe({
            swipeLeft: function () {
                slider.goToPrevSlide();
            }
        });
    });
    $(function () {
        $('#lightSlider').swipe({
            swipeLeft: function () {
                slider.goToNextSlide();
            }
        });
    });
}