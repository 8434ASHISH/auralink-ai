let currentScreen = "landing";
let mode = "nonverbal";
let lastBlink = 0;
let cooldown = false;

const video = document.getElementById("video");

function goTo(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  currentScreen = id;

  if (id === "detect") startCamera();
}

function selectMode(m) {
  mode = m;
  goTo("detect");
}

function speak(text) {
  if (!document.getElementById("voiceToggle").checked) return;
  const msg = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(msg);
}

function triggerEmergency() {
  goTo("alert");
  speak("Emergency triggered. Help is coming.");
}

function cancelEmergency() {
  goTo("detect");
}

function startCamera() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => video.srcObject = stream);

  const faceMesh = new FaceMesh({
    locateFile: file =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
  });

  faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true
  });

  faceMesh.onResults(onResults);

  const camera = new Camera(video, {
    onFrame: async () => {
      await faceMesh.send({ image: video });
    },
    width: 320,
    height: 240
  });
  camera.start();
}

function onResults(results) {
  if (!results.multiFaceLandmarks) return;

  const lm = results.multiFaceLandmarks[0];
  const eyeTop = lm[159].y;
  const eyeBottom = lm[145].y;
  const blink = Math.abs(eyeTop - eyeBottom);

  const threshold = document.getElementById("blinkThreshold").value;

  if (blink < threshold && !cooldown) {
    cooldown = true;
    document.getElementById("status").innerText = "Long Blink Detected";
    speak("I need assistance");

    setTimeout(() => cooldown = false, 5000);
  }
}
