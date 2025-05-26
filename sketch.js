let video;
let handpose;
let predictions = [];
let circleX, circleY;
let noseX, noseY;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // 初始化 Handpose 模型
  handpose = ml5.handpose(video, modelReady);
  handpose.on("predict", results => {
    predictions = results;
  });

  // 初始圓的位置（鼻子）
  circleX = width / 2;
  circleY = height / 2;
}

function modelReady() {
  console.log("Handpose model loaded!");
}

function draw() {
  background(220);

  // 顯示攝影機畫面
  image(video, 0, 0, width, height);

  // 繪製圓
  fill(255, 0, 0);
  noStroke();
  ellipse(circleX, circleY, 50);

  // 處理手勢
  if (predictions.length > 0) {
    const hand = predictions[0];
    const landmarks = hand.landmarks;

    // 偵測鼻子（假設鼻子在畫面中心）
    noseX = width / 2;
    noseY = height / 2;

    // 偵測手勢
    const gesture = detectGesture(landmarks);

    // 根據手勢移動圓的位置
    if (gesture === "scissors") {
      circleX = noseX;
      circleY = noseY - 100; // 額頭
    } else if (gesture === "rock") {
      circleX = noseX - 100; // 左臉頰
      circleY = noseY;
    } else if (gesture === "paper") {
      circleX = noseX + 100; // 右臉頰
      circleY = noseY;
    }
  }
}

// 偵測手勢的函式
function detectGesture(landmarks) {
  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];
  const middleTip = landmarks[12];
  const ringTip = landmarks[16];
  const pinkyTip = landmarks[20];

  // 偵測剪刀手勢（食指和中指伸出）
  if (
    dist(indexTip[0], indexTip[1], middleTip[0], middleTip[1]) > 50 &&
    dist(middleTip[0], middleTip[1], ringTip[0], ringTip[1]) < 50
  ) {
    return "scissors";
  }

  // 偵測石頭手勢（所有手指靠近）
  if (
    dist(thumbTip[0], thumbTip[1], indexTip[0], indexTip[1]) < 50 &&
    dist(indexTip[0], indexTip[1], middleTip[0], middleTip[1]) < 50 &&
    dist(middleTip[0], middleTip[1], ringTip[0], ringTip[1]) < 50 &&
    dist(ringTip[0], ringTip[1], pinkyTip[0], pinkyTip[1]) < 50
  ) {
    return "rock";
  }

  // 偵測布手勢（所有手指伸直）
  if (
    dist(thumbTip[0], thumbTip[1], indexTip[0], indexTip[1]) > 50 &&
    dist(indexTip[0], indexTip[1], middleTip[0], middleTip[1]) > 50 &&
    dist(middleTip[0], middleTip[1], ringTip[0], ringTip[1]) > 50 &&
    dist(ringTip[0], ringTip[1], pinkyTip[0], pinkyTip[1]) > 50
  ) {
    return "paper";
  }

  return null;
}
