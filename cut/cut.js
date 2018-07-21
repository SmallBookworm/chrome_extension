/**
 * Created by peng on 2017/4/11.
 */

//cut
//只允许打开一个截屏页面
let cut_state = true;
/**
 * @param {int} width 弹出窗口宽度（包含边框），以像素为单位
 * @param {int} height 弹出窗口高度（包含边框），以像素为单位
 * @param {int} top 窗口与屏幕顶部的距离，以像素为单位
 * @param {int} left 窗口与屏幕左侧的距离，以像素为单位
 * @param {function} func 截图完成后回调此方法,需要一个参数接收截图结果数据(类似ImageData)
 *
*@description (注意，不能在屏幕边缘弹出截屏窗口，也就是说窗口刚弹出时不能一部分不在屏幕内)
*/
function cut_cut(width, height, top, left, func) {
    if (cut_state) {
        cut_state = false;
        chrome.tabs.captureVisibleTab(null, {

            format: "png",

            quality: 100

        }, function (data) {
            chrome.windows.create({
                url: '/cut/index.html',
                width: width,
                height: height,
                top: top,
                left: left,
                type: 'panel'
            }, function (window) {
                chrome.tabs.onUpdated.addListener(function onUpdated(tabId, changeInfo, tab) {
                    if ((tabId == window.tabs[0].id) && (changeInfo.status == 'complete')) {
                        chrome.tabs.sendMessage(window.tabs[0].id, {id: 'cut', data: data}, function (response) {
                            func(response);
                            cut_state = true;
                        });
                        chrome.tabs.onUpdated.removeListener(onUpdated);
                    }

                });
            });
        });
    } else
        throw 'cutscreen is opened'
}