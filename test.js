/**
 * Created by peng on 2017/4/10.
 */

/**
 * 测试用例,点击浏览器标签激活插件，点击页面弹出截屏窗口，鼠标框选截图，在背景输出数据*/
let choosing_state = 1;
chrome.browserAction.onClicked.addListener(function (tab) {
    if (choosing_state) {
        init();
        choosing_state = 0;
    } else {
        end();
        choosing_state = 1;
    }
});

//在这里调用了cut函数
function quote(message, sender, sendResponse) {
    if (message.id == '1' && message.text == 'begin') {
        try {
            cut_cut((message.width), (message.height), (message.top), (message.left), function (res) {
                console.log(res);
            });
        }
        catch (e) {
            console.log(e);
        }
    }
}

function init() {
    chrome.browserAction.setIcon({path: 'icon.png'});
    chrome.tabs.executeScript(null, {file: "content.js"});
    chrome.runtime.onMessage.addListener(quote);

}
function end() {
    chrome.browserAction.setIcon({path: 'icon1.png'});
    chrome.runtime.onMessage.removeListener(quote);
    close();
}
function close() {
    message_send({id: 'cut', text: 'close'}, function (response) {
        console.log(response);
    });

}

function message_send(message, func) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message, func);
    });
}






