/**
 * Created by peng on 2017/4/12.
 */
/**
 * Created by peng on 2017/4/11.
 */
let canvas;
let context;
document.addEventListener('DOMContentLoaded', init);
function init() {
    canvas = document.getElementById('can');
    context = canvas.getContext("2d");
    chrome.runtime.onMessage.addListener(function close(message, sender, sendResponse) {
        if (message.id == 'cut') {
            screenShot(message.data, sendResponse);
            return true;
        }
    });

}

function screenShot(data, func) {
    let image = new Image();

    image.onload = function () {


        canvas.style.width = '' + document.body.clientWidth;
        canvas.style.height = '' + document.body.clientHeight;
        canvas.width = image.width;
        canvas.height = image.height;

        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        screenChoose(func);
    };

    image.src = data;
}

function screenChoose(func) {
    let box = new Box(canvas);

    function move(event) {
        box.end = [event.clientX, event.clientY];
    }

    canvas.addEventListener('mousedown', function (event) {
        box.begin = [event.clientX, event.clientY];
        box.end = [event.clientX, event.clientY];
        canvas.addEventListener('mousemove', move);
    });
    canvas.addEventListener('mouseup', function (event) {
        box.end = [event.clientX, event.clientY];
        let imagedata=box.getImageData();
        func({data:Array.from(imagedata.data),height:imagedata.height,width:imagedata.width});
        window.close();
    });
}

class Box {
    constructor(canvas) {
        this._begin = [0, 0];
        this._end = [0, 0];
        this.width = 0;
        this.height = 0;
        this.canvas = canvas;
        this.context = canvas.getContext('2d');

        this.styleWidth = parseInt(this.canvas.style.width);
        this.styleHeight = parseInt(this.canvas.style.height);

        this.chooseCanvas = document.createElement('canvas');
        this.chooseContext = this.chooseCanvas.getContext('2d');
        this.chooseCanvas.width = canvas.width;
        this.chooseCanvas.height = canvas.height;

        this.cacheCanvas = document.createElement('canvas');
        this.cacheContext = this.cacheCanvas.getContext('2d');
        this.cacheCanvas.width = canvas.width;
        this.cacheCanvas.height = canvas.height;
        this.cacheContext.drawImage(this.canvas, 0, 0);

    }

    change() {
        this.width = this._end[0] - this._begin[0];
        this.height = this._end[1] - this._begin[1];
        this.chooseContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.chooseContext.strokeRect(...this._begin, this.width, this.height);
        this.context.drawImage(this.cacheCanvas, 0, 0);
        this.context.drawImage(this.chooseCanvas, 0, 0);
    }

    getImageData() {
        return this.cacheContext.getImageData(...this._begin, this.width, this.height);
    }

    transferPosition(array) {
        return [this.canvas.width * array[0] / this.styleWidth, this.canvas.height * array[1] / this.styleHeight];
    }

    set begin(array) {
        this._begin = this.transferPosition(array);
        this.change();
    }

    get begin() {
        return this._begin;
    }

    set end(array) {
        this._end = this.transferPosition(array);
        this.change();
    }

    get end() {
        return this._end;
    }
}