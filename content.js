/**
 * Created by peng on 2017/4/11.
 */
chrome.runtime.onMessage.addListener(function close(message, sender, sendResponse) {
    if (message.id == 'cut') {
        chrome.runtime.onMessage.removeListener(close);
        document.removeEventListener('mousedown', mouseup);
        sendResponse({id: '1', text: 'finish'});
    }
});
document.addEventListener('mousedown', mouseup);
function mouseup(event) {
    chrome.runtime.sendMessage({id: '1', text: 'begin',width:window.innerWidth,height:window.innerHeight,top:window.screenTop+window.outerHeight-window.innerHeight,left:window.screenLeft}, function (response) {

    });


}

