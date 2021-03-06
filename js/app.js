// Most of this code is gotten from A webrtc sample with a few changes
// https://github.com/webrtc/samples/blob/gh-pages/src/content/getusermedia/record/js/main.js

("use strict");

/* globals MediaRecorder */
const mediaSource = new MediaSource();
mediaSource.addEventListener("sourceopen", handleSourceOpen, false);
let mediaRecorder;
let recordedBlobs;
let sourceBuffer;

const errorMsgElement = document.querySelector("span#errorMsg");
const recordedVideo = document.querySelector("video#recorded");
const recordButton = document.querySelector("button#record");
recordButton.addEventListener("click", () => {
  if (recordButton.textContent === "Start Recording") {
    startRecording();
  } else {
    stopRecording();
    recordButton.textContent = "Start Recording";
    playButton.disabled = false;
    downloadButton.disabled = false;
  }
});

const playButton = document.querySelector("button#play");
playButton.addEventListener("click", () => {
  const superBuffer = new Blob(recordedBlobs, { type: "video/mp4" });
  recordedVideo.src = null;
  recordedVideo.srcObject = null;
  recordedVideo.src = window.URL.createObjectURL(superBuffer);
  recordedVideo.controls = true;
  recordedVideo.play();

  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext("2d");
  // if you want to preview the captured image,
  // attach the canvas to the DOM somewhere you can see it.
  const screenshotBtn = document.querySelector(".take-screen-shot");
  screenshotBtn.addEventListener("click", () => {
    ctx.drawImage(recordedVideo, 0, 0, canvas.width, canvas.height);
    const dataURI = canvas.toDataURL("image/jpeg");

    let img = document.querySelector(".screen-shot");
    img.src = dataURI;
  });
});

const downloadButton = document.querySelector("button#download");
downloadButton.addEventListener("click", () => {
  const blob = new Blob(recordedBlobs, { type: "video/mp4" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = "test.mp4";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
});

function handleSourceOpen(event) {
  console.log("MediaSource opened");
  sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="vp8"');
  console.log("Source buffer: ", sourceBuffer);
}

function handleDataAvailable(event) {
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
}

function startRecording() {
  recordedBlobs = [];
  let options = { mimeType: "video/mp4;codecs=vp9" };
  if (!MediaRecorder.isTypeSupported(options.mimeType)) {
    console.error(`${options.mimeType} is not Supported`);
    errorMsgElement.innerHTML = `${options.mimeType} is not Supported`;
    options = { mimeType: "video/mp4;codecs=vp8" };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      console.error(`${options.mimeType} is not Supported`);
      errorMsgElement.innerHTML = `${options.mimeType} is not Supported`;
      options = { mimeType: "video/mp4" };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.error(`${options.mimeType} is not Supported`);
        errorMsgElement.innerHTML = `${options.mimeType} is not Supported`;
        options = { mimeType: "" };
      }
    }
  }

  try {
    mediaRecorder = new MediaRecorder(window.stream, options);
  } catch (e) {
    console.error("Exception while creating MediaRecorder:", e);
    errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(
      e
    )}`;
    return;
  }

  console.log("Created MediaRecorder", mediaRecorder, "with options", options);
  recordButton.textContent = "Stop Recording";
  playButton.disabled = true;
  downloadButton.disabled = true;
  mediaRecorder.onstop = event => {
    console.log("Recorder stopped: ", event);
  };
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start(10); // collect 10ms of data
  console.log("MediaRecorder started", mediaRecorder);
}

function stopRecording() {
  mediaRecorder.stop();
  console.log("Recorded Blobs: ", recordedBlobs);
}

function handleSuccess(stream) {
  recordButton.disabled = false;
  console.log("getUserMedia() got stream:", stream);
  window.stream = stream;

  const gumVideo = document.querySelector("video#gum");
  gumVideo.srcObject = stream;
}

async function init(constraints) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleSuccess(stream);
  } catch (e) {
    console.error("navigator.getUserMedia error:", e);
    errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
  }
}

document.querySelector("button#start").addEventListener("click", async () => {
  const hasEchoCancellation = document.querySelector("#echoCancellation")
    .checked;
  const constraints = {
    audio: {
      echoCancellation: { exact: hasEchoCancellation }
    },
    video: {
      width: 1280,
      height: 720
    }
  };
  console.log("Using media constraints:", constraints);
  await init(constraints);
});

//  -------------- upload image --------------- //
$(function() {
  $(":file").change(function() {
    if (this.files && this.files[0]) {
      var reader = new FileReader();

      reader.onload = imageIsLoaded;
      reader.readAsDataURL(this.files[0]);
    }
  });
});

function imageIsLoaded(e) {
  $("#myImg").attr("src", e.target.result);
  $("#yourImage").attr("src", e.target.result);
}
function previewFile() {
  var preview = document.querySelector("img.image-option"); //selects the query named img
  var file = document.querySelector("input[type=file]").files[0]; //sames as here
  var reader = new FileReader();

  reader.onloadend = function() {
    preview.src = reader.result;
  };

  if (file) {
    reader.readAsDataURL(file); //reads the data as a URL
  } else {
    preview.src = "";
  }
}

previewFile();

//  -------------- upload video --------------- //
var URL = window.URL || window.webkitURL;
var video = document.querySelector("video#video-option");
function onChange() {
  var fileItem = document.getElementById("fileItem");
  var files = fileItem.files;
  var file = files[0];
  var url = URL.createObjectURL(file);
  video.src = url;
  video.load();
}
