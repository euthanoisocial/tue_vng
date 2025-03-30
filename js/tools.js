if (typeof setCookie == "undefined"){
    function setCookie(cname, cvalue) {
        if (window.location.protocol === "https:"){
            document.cookie = cname + "=" + cvalue + ";path="+cookiePath+";SameSite=None;Secure;";
        }else{
            document.cookie = cname + "=" + cvalue + ";path="+cookiePath+";";
        }
    }
}

if (typeof deleteCookie == "undefined"){
    function deleteCookie(cname) {
        document.cookie = cname + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

if (typeof getCookie == "undefined"){
    function getCookie(cname) {
        var name = cname + "=";
        // var decodedCookie = decodeURIComponent(document.cookie);
        var decodedCookie = document.cookie;
        // console.log(decodedCookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
}

function clickPopupLogin(urlLogin){
    var height = 600;
    var width = 600;
    var left = (screen.width/2)-(width/2);
    var top = (screen.height/2)-(height/2);

    var newWin=window.open(urlLogin,'_blank', "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=no,width="+width+",height="+height+', top='+top+', left='+left);
    newWin.document.title = 'Login';
    newWin.focus();
}

function copyLink() {
    let link = document.getElementById("text-invite").value;
    let copyText = document.createElement('input');
    copyText.value = link;
    copyText.style.cssText = 'opacity:0;';
    document.body.appendChild(copyText);
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy", false);
    copyText.remove();
    if (typeof copySuccessText == "undefined") copySuccessText = 'Bạn đã sao chép thành công';
    alert(copySuccessText, false);
}

function click2copy($this) {
    let value = $($this).data('value');
    let copyText = document.createElement('input');
    copyText.value = value;
    copyText.style.cssText = 'opacity:0;';
    document.body.appendChild(copyText);
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy", false);
    copyText.remove();
    if (typeof copySuccessText == "undefined") copySuccessText = 'Bạn đã sao chép thành công';
    alert(`${copySuccessText}:<br>`+value, false);
}

function _click2copy($this) {
    let value = $($this).data('value');
    let copyText = document.createElement('input');
    copyText.value = value;
    copyText.style.cssText = 'opacity:0;';
    document.body.appendChild(copyText);
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy", false);
    copyText.remove();
    if (typeof copySuccessText == "undefined") copySuccessText = 'Bạn đã sao chép thành công';
    alert(`${copySuccessText} UserID:<br>`+value, false);
}

if (typeof isLogout != "undefined" && isLogout === 1){
    setCookie("isLogined", 0);
}

// if (typeof isLogin != "undefined" && isLogin === 1) {
//     if (getCookie("isLogined") == 0){
//         setCookie("isLogined", 1);
//         window.close()
//     }
// }

if (typeof noticeText === "undefined") {noticeText = ''}
// function alert(msg) {Swal.fire({title: noticeText, html: msg, icon: 'info', 'heightAuto': false})}
function alert(msg, isRedirect = false) {
    let element = $('.pm__inform');
    if (element.length > 0){
        element.addClass('active').css('display','').find('.pm__text-inform').html(msg);
        element.addClass('active').css('display','').find('.pm__inform-text').html(msg);
        $('.popupH').css('display','block');
        if (!isRedirect) {return;}
        element.find('.pm__close-popup').click(function () {window.location.reload()});
        $('#popupH').click(function () {window.location.reload()});
    }else {
        Swal.fire({title: noticeText, html: msg, 'heightAuto': false}).then((result) => {
            if (result.value && isRedirect) { window.location.reload() }
        });
    }
}
// function alertError(msg) {Swal.fire({title: noticeText, html: msg, icon: 'error', 'heightAuto': false})}
function alertError(msg, isRedirect = false) {
    let element = $('.pm__inform');
    if (element.length > 0){
        element.addClass('active').css('display','');
        
        let textInform = element.find('.pm__text-inform, .pm__inform-text');
        textInform.html(msg).addClass('error');
        
        if (!isRedirect) {return;}
        element.find('.pm__close-popup').click(function () {window.location.reload()});
    }else {
        Swal.fire({title: noticeText, html: msg, icon: 'error', 'heightAuto': false}).then((result) => {
            if (result.value && isRedirect) { window.location.reload() }
        });
    }
}
function inform(msg, isRedirect = true) {
    let element = $('.pm__inform');
    if (element.length > 0){
        element.addClass('active').css('display','');

        let textInform = element.find('.pm__text-inform, .pm__inform-text');
        textInform.html(msg).removeClass('error');
        
        if (!isRedirect) {return;}
        element.find('.pm__close-popup').click(function () {window.location.reload()});
    } else {
        Swal.fire({title: typeof noticeText == 'undefined' ? 'Thông Báo' : noticeText, html: msg, 'heightAuto': false}).then((result) => {
            if (result.value && isRedirect) { window.location.reload() }
        });
    }
}

function validatePhoneNumber(phone, code = null) {
    phone = `${phone}`; // parse to string
    switch (code) {
        case '60': return /^(0?1)[0-46-9]\-*[0-9]{7,8}$/.test(phone);
        case '62': return /^(^\+62|62|^08)(\d{3,4}-?){1}\d{1,4}$/.test(phone);
        case '63': return /(\+?\d{2}?\s?\d{3}\s?\d{3}\s?\d{4})|([0]\d{3}\s?\d{3}\s?\d{4})$/.test(phone);
        case '65': return /^0?(6|8|9)\d{7}$/.test(phone);
        case '66': return /(^[0-9]{10}$)|(^\+[0-9]{2}\s+[0-9]{2}[0-9]{8}$)|(^[0-9]{3}-[0-9]{4}-[0-9]{4}$)/.test(phone);
        case '84': return /^(0?[3|5|7|8|9])([0-9]{8})$/.test(phone);
        default: return phone.length == 10;
    }
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 * @param distance
 * @param sendby: sms | email
 */
function countDown(distance, sendby = "sms") {
    let element;
    let sessionkey;
    switch (sendby) {
        case "email": {
            element = $('.pm__emailotp-countdown');
            sessionkey = 'get-emailotp';
            break;
        }
        case "sms":
        default:
            element = $('.pm__otp-countdown');
            sessionkey = 'get-otp';
            break;
    }

    let x = setInterval(function () {
        distance--;
        sessionStorage.setItem(sessionkey, distance.toString());
        element.text(` (${distance})`);
        if (distance <= 0) {
            clearInterval(x);
            element.text('');
        }
    }, 1000);
}

function sendSmS(phone = 0, code = null, params = {}) {
    let request;
    request = $.ajax({
        url: `${baseURL}/ajax/sendSms`,
        type: "post",
        dataType: 'json',
        data: { phone: phone, code: code, module: module, type: 'sms', ...params}
    });

    request.done(function (response) {
        if (response.data.status === 1){
            countDown(60, 'sms');
            alert(response.data.msg, false);
        }else{
            alert(response.data.msg, false);
        }
    });

    // Callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown) {
        console.error(
            "The following error occurred: " +
            textStatus, errorThrown
        );
    });
}

function sendEmailOTP(email, params = {}) {
    let request;
    request = $.ajax({
        url: `${baseURL}/ajax/sendOTP`,
        type: "post",
        dataType: 'json',
        data: { email: email, module: module, type: 'email' , ...params}
    });

    request.done(function (response) {
        if (response.data.status === 1){
            countDown(60, 'email');
            alert(response.data.msg, false);
        }else{
            alert(response.data.msg, false);
        }
    });

    // Callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown) {
        console.error(
            "The following error occurred: " +
            textStatus, errorThrown
        );
    });
}

function getCurrentTime() {
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = ("0" + date_ob.getHours()).slice(-2);
    let minutes = ("0" + date_ob.getMinutes()).slice(-2);
    let seconds = ("0" + date_ob.getSeconds()).slice(-2);
    let currentDate = year + "-" + month + "-" + date;
    let currentTime = hours + ":" + minutes + ":" + seconds;
    let currentDateTime = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

    return currentDateTime;
}

function dict(key, arReplace = []) {
    let text = langs[key];
    if (text) {
        for (let k in arReplace) {
            text = text.replace(k, arReplace[k]);
        }
    }

    return text || key;
}

function setSessionStorage(key, value) {
    try {
        window.sessionStorage.setItem(key, value)
    } catch (e) {
        // ignore
    }
}

function getSessionStorage(key) {
    try {
        return window.sessionStorage.getItem(key)
    } catch (e) {
        // ignore
    }
    return null
}

function removeSessionStorage(key) {
    try {
        window.sessionStorage.removeItem(key);
    } catch (e) {
        // ignore
    }
}

let PromotionTools = {
    init() {
        this.anchorScroll();
        this.postMessageToLanding();
        this.listenMessageFromLanding();
        this.ajaxPagination();
        this.setCurrentDateTime();
    },
    postMessageToLanding() {
        $('.pm__module.pm__login-module #sso-login-form .btn-submit, .pm__btn-login').click(function () {
            setSessionStorage('reload', 1)
        });
        $('.pm__logout').click(function () {
            setSessionStorage('reload', 1);
            window.top.postMessage("logout", "*");
        });

        // message reload
        let reload = getSessionStorage('reload');
        if (parseInt(reload) === 1) {
            removeSessionStorage('reload');
            window.top.postMessage("reload", "*");
        }

        // send to Landing Page message logged/logout
        if (isLogin == 1) {
            window.top.postMessage("logged", "*");
        }
    },
    listenMessageFromLanding() {
        // listen event from Landing Page
        window.onmessage = function(e) {
            switch (e.data) {
                case 'history':
                    $('.pm__menu-history').get(0)?.click();
                    break;
                case 'login':
                    $('.pm__login').get(0)?.click();
                    break;
            }
        };
    },
    anchorScroll() {
        // event click class pm__anchor
        $(document).on('click', '.pm__anchor', function () {
            setSessionStorage('PMAnchor', window.pageYOffset)
        });

        // scroll prev position
        const offsetY = getSessionStorage('PMAnchor') || null;
        if (!!offsetY) {
            setTimeout(function () {
                window.scrollTo({ top: offsetY, behavior: 'auto' });
                // sessionStorage.removeItem('PMAnchor');
            }, 0);
        }
    },
    
    ajaxPagination() {
        $(document).on('click', '.pm__ajax-pagination .pm__pagination a', function (e) {
            e.preventDefault();

            let loading = $('.pm__loading-module');
            let ajaxView = $(this).closest('.pm__ajax-pagination').find('.pm__ajax-view');
            let url = $(this).attr('href');
            
            let request;
            request = $.ajax({
                url: url,
                type: "post",
                dataType: 'html',
                beforeSend: function () {
                    loading.addClass('active')
                },
                complete: function() {
                    loading.removeClass('active')
                },
            });

            request.done(function (response) {
                ajaxView.html(response)
            });

            // Callback handler that will be called on failure
            request.fail(function (jqXHR, textStatus, errorThrown) {
                console.error(
                    "The following error occurred: " +
                    textStatus, errorThrown
                );
            });
        })
    },

    setCurrentDateTime() {
        let element = $('.pm__current-time');
        if (element) {
            element.html(currentDateTime)
        }
    },
};

$(function () { PromotionTools.init() });
