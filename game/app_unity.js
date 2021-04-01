/**
 * Unity <=> JavaScript
 */
window.addEventListener("message", receiveMessage, false);

var callbackObject;
var successCallbackMethod;
var errorCallbackMethod;
var cancelCallbackMethod;

function requestJson(co, scm, ecm, url, callbackId, parameters) {

    callbackObject = co;
    successCallbackMethod = scm;
    errorCallbackMethod = ecm;

    // リクエストパラメータの連想配列化
    var requestParams = {};
    parameters.forEach(function(value) {
        requestParams[value[0]] = value[1];
    });

    // ユーザーエージェント付与
    requestParams.deviceInfo = navigator.userAgent;

    $.getJSON(url, requestParams).done(function(json)
    {
        var response = {callbackId: callbackId, json: JSON.stringify(json), rc: 200};
        gameInstance.SendMessage(callbackObject, successCallbackMethod, JSON.stringify(response));
    });
}

function requestJson2(co, scm, ecm, url, callbackId, parameters) {

    callbackObject = co;
    successCallbackMethod = scm;
    errorCallbackMethod = ecm;

    // リクエストパラメータの連想配列化
    var requestParams = {};
    parameters.forEach(function(value) {
        requestParams[value[0]] = value[1];
    });

    // ユーザーエージェント付与
    requestParams.deviceInfo = navigator.userAgent;

    // 上位フレームへメソッドコール
    var message = {
            url: url,
            requestParams: requestParams,
            callbackId: callbackId,
            apiType: "makeRequest"
    }

    window.parent.postMessage(message, "*");
}

function requestPayment(co, scm, ecm, ccm, callbackId, itemData) {

    callbackObject = co;
    successCallbackMethod = scm;
    errorCallbackMethod = ecm;
    cancelCallbackMethod = ccm;

    // リクエストパラメータの設定
    var itemParams = {};
    itemData.forEach(function(value) {
        itemParams[value[0]] = value[1];
    });

    // 上位フレームへメソッドコール
    var message = {
            itemParams: itemParams,
            callbackId: callbackId,
            apiType: "payment"
    }

    window.parent.postMessage(message, "*");
}

function requestPerson(co, scm, ecm, callbackId) {

    callbackObject = co;
    successCallbackMethod = scm;
    errorCallbackMethod = ecm;

    $.getJSON('/Api/user/info.json', function(data)
    {
        var json = {displayName: data.userInfo.userName};
        var response = {callbackId: callbackId, json: JSON.stringify(json), rc: 200};
        gameInstance.SendMessage(callbackObject, successCallbackMethod, JSON.stringify(response));
    });
}

function requestPerson2(co, scm, ecm, callbackId) {

    callbackObject = co;
    successCallbackMethod = scm;
    errorCallbackMethod = ecm;

    // 上位フレームへメソッドコール
    var message = {
            callbackId: callbackId,
            apiType: "person"
    }

    window.parent.postMessage(message, "*");
}

function requestInspectionCreate(co, scm, ecm, callbackId, text) {

    callbackObject = co;
    successCallbackMethod = scm;
    errorCallbackMethod = ecm;

    // 上位フレームへメソッドコール
    var message = {
            callbackId: callbackId,
            text: text,
            apiType: "inspectionCreate"
    }

    window.parent.postMessage(message, "*");
}

function requestInspectionFetch(co, scm, ecm, callbackId, textId) {

    callbackObject = co;
    successCallbackMethod = scm;
    errorCallbackMethod = ecm;

    // 上位フレームへメソッドコール
    var message = {
            callbackId: callbackId,
            textId: textId,
            apiType: "inspectionFetch"
    }

    window.parent.postMessage(message, "*");
}

function receiveMessage(event) {
    var json = event.data.json;
    var callbackId = event.data.callbackId;
    var status = event.data.status;
    var rc = event.data.rc ? event.data.rc : 200;

    var response = {callbackId: callbackId, json: JSON.stringify(json), rc: rc};
    switch (status) {
        case 0:
            gameInstance.SendMessage(callbackObject, successCallbackMethod, JSON.stringify(response));
            break;
        case 1:
            gameInstance.SendMessage(callbackObject, errorCallbackMethod, JSON.stringify(response));
            break;
        case 2:
            gameInstance.SendMessage(callbackObject, cancelCallbackMethod, JSON.stringify(response));
            break;
    }
}

const INPUT_TEXT_TYPE_PROFILE = 1; // プロフィールコメント用
const INPUT_TEXT_TYPE_SEARCH = 1; // ID検索用
const INPUT_TEXT_TYPE_RUNE_MYSET = 2; // 装備マイセット名用
const INPUT_TEXT_TYPE_DECK_NAME = 3; // デッキ名用

function showInputText(co, ok, cancel, defaultText, maxlength, type) {
    $("#input-text-popup").removeClass("profile-input-text-popup");
    $("#input-text-popup").removeClass("rune-myset-input-text-popup");
    $("#input-text-popup").removeClass("deck-name-input-text-popup");

    switch (type) {
        case INPUT_TEXT_TYPE_PROFILE:
            $("#input-text-popup").addClass("profile-input-text-popup");
            break;
        case INPUT_TEXT_TYPE_RUNE_MYSET:
            $("#input-text-popup").addClass("rune-myset-input-text-popup");
            break;
        case INPUT_TEXT_TYPE_DECK_NAME:
            $("#input-text-popup").addClass("deck-name-input-text-popup");
            break;
    }

    // 表示
    $("#input-text-popup-base").show();
    $("#input-text-popup").show();
    $("#input-text-popup").removeClass("inactive");
    $("#input-text-popup").addClass("active");

    $("#popup-input-text").attr("maxlength", maxlength);
    $("#popup-input-text").val(defaultText);

    // 文字数表示の更新
    updateTextCount(maxlength);
    $("#popup-input-text").keyup(function(){
    	console.log("keyup");
        updateTextCount(maxlength);
    });

    // 各ボタンのコールバック
    $("#popup-ok-btn").click(function(){
        hideInputText();
        // コールバック
        gameInstance.SendMessage(co, ok, $("#popup-input-text").val());
    });
    $("#popup-cancel-btn").click(function(){
        hideInputText();
        // コールバック
        gameInstance.SendMessage(co, cancel);
    });
    $("#popup-close-btn").click(function(){
        hideInputText();
        // コールバック
        gameInstance.SendMessage(co, cancel);
    });

//    $("#input-text-popup-base").not('.input-text-popup').click(function(){
//        hideInputText();
//        // コールバック
//        gameInstance.SendMessage(co, cancel);
//    });

    $("#input-text-popup-base").on('click', function(e) {
        if(!$(e.target).is('#input-text-popup, #input-text-popup div, #input-text-popup textarea, #input-text-popup div div')) {
            hideInputText();
            // コールバック
            gameInstance.SendMessage(co, cancel);
        }
    });

    $("#popup-text-clear").click(function(){
        clearText();
        updateTextCount(maxlength);
    });
}

function hideInputText() {
    $("#input-text-popup-base").hide();
    $("#input-text-popup").removeClass("active");
    $("#input-text-popup").addClass("inactive");
    setTimeout(function() {
        $("#input-text-popup").hide();
    }, 100);
}

function updateTextCount(maxlength) {
    var textCount = $("#popup-input-text").val().length;
    if (textCount > maxlength) {
        textCount = maxlength;
    }
    $("#popup-text-count").text(textCount + "/" + maxlength);
}

function clearText() {
    $("#popup-input-text").val("");
}

function copyTextClipboard(co, cm, text) {
    var clipArea = document.createElement('div');
    clipArea.appendChild(document.createElement('pre')).textContent = text;
    var s = clipArea.style;
    s.position = 'fixed';
    s.left = '-100%';

    document.body.appendChild(clipArea);
    document.getSelection().selectAllChildren(clipArea);
    var result = document.execCommand('copy');

    document.body.removeChild(clipArea);

    gameInstance.SendMessage(co, cm, result ? '1' : '0');
}

$(function() {
    $("#input-text-popup-base").hide();
    $("#input-text-popup").hide();
});

// textareaの改行禁止
$(function(){
    $("#popup-input-text").on("keydown", function(e) {
        if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
            return false;
        }
    }).bind('blur', function() {
        // テキストの改行コードを全削除＆文頭文末の半全角スペースを削除
        var $textarea = $(this),
            text = $textarea.val(),
            new_text = text.replace(/\n/g, "");
            new_text = new_text.replace(/^[\s|　]+|[\s|　]+$/g,'');
        if (new_text != text) {
            $textarea.val(new_text);
        }
        updateTextCount($("#popup-input-text").attr("maxlength"));
    });
});

// reloadメソッドによりページをリロード
function webglReload() {
    window.location.reload();
}