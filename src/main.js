var video = document.getElementById("videoElement");
var labels = document.getElementById("js-labels");
var errorMsg = document.getElementById('js-error-msg');
var facingMode = 'environment';

// Get the exact size of the video element.
var width = 300;
var height = 300;

var takePicture = function () {
    var hidden_canvas = document.querySelector('canvas');
    const url = 'api/img-processing';
    // Context object for working with the canvas.
    var context = hidden_canvas.getContext('2d');
    // Set the canvas to the same dimensions as the video.
    hidden_canvas.width = width;
    hidden_canvas.height = height;

    // Draw a copy of the current frame from the video on the canvas.
    context.drawImage(video, 0, 0, width, height);

    // Get an image dataURL from the canvas.
    var imageDataURL = hidden_canvas.toDataURL('image/png');
    var courseLang = document.querySelector('#courseLanguage').value;
    return fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ img: imageDataURL, courseLang: courseLang })
    }).then(response => response.json())
        .then(response => {
            const listLabels = response && response.map((word) => {
                return `<div>${word.courseLang} ( ${word.text})</div>`
            }).join('');
            labels.innerHTML = `<label><h2> You pointed at: </h2> </label>
                    <div class='words-list'>${listLabels}</div>`;
        });
}

var loadCamera = function (facingMode) {
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: {
                    exact: facingMode
                }
            }
        })
            .then(function (stream) {
                // errorMsg.innerHTML = "";
                video.srcObject = stream;
                video.play();
            })
            .catch(function (error) {
                // errorMsg.innerHTML = error.message + ' ' + error.name;
                console.log("Something went wrong!", error);
            });
    }
};

var switchCamera = function () {
    facingMode = facingMode === 'environment' ? 'user' : 'enviroment';
    video.pause()
    video.srcObject = null
    loadCamera(facingMode);
};

var init = function () {
    document.getElementById('js-take-pic').addEventListener('click', (e) => {
        takePicture();
    });

    document.getElementById('js-switch-camera').addEventListener('click', (e) => {
        switchCamera();
    });

    loadCamera(facingMode);
}

init();
