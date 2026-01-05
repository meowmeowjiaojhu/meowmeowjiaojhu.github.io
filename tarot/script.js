const HOLD_MS = 3000;

const holdBtn = document.getElementById("holdBtn");
const ring = document.getElementById("ring");
const cardTitle = document.getElementById("cardTitle");
const cardLine = document.getElementById("cardLine");

let holdTimer = null;
let holdStart = 0;
let rafId = null;

// 先用占位句子，之後換成你的 156 句牌庫
const LINES = [
  "你不需要急著解釋，一次做好一件事就夠了。",
  "今天先把心收回來，先照顧自己。",
  "答案不在外面，在你真正願意面對的那個點。",
  "你已經走很遠了，允許自己慢一點。",
  "把注意力放在可控的部分，其它先放下。"
];

function pickLine(){
  const i = Math.floor(Math.random() * LINES.length);
  return LINES[i];
}

function setProgress(p){
  // p: 0~1
  ring.style.opacity = p > 0 ? 1 : 0;
  ring.style.transform = `translateX(${(-110 + p * 220)}%)`;
}

function startHold(){
  holdStart = Date.now();
  cardTitle.textContent = "抽牌中…";
  cardLine.textContent = "保持按住，讓指引浮現。";

  const tick = () => {
    const elapsed = Date.now() - holdStart;
    const p = Math.min(elapsed / HOLD_MS, 1);
    setProgress(p);

    if (p >= 1) {
      finishHold();
      return;
    }
    rafId = requestAnimationFrame(tick);
  };

  rafId = requestAnimationFrame(tick);

  holdTimer = setTimeout(() => {
    // 保險：若 RAF 被停掉
    finishHold();
  }, HOLD_MS + 80);
}

function cancelHold(){
  clearTimeout(holdTimer);
  holdTimer = null;
  if (rafId) cancelAnimationFrame(rafId);
  rafId = null;

  setProgress(0);
  cardTitle.textContent = "今日塔羅指引";
  cardLine.textContent = "按住按鈕 3 秒，抽一張指引。";
}

function finishHold(){
  clearTimeout(holdTimer);
  holdTimer = null;
  if (rafId) cancelAnimationFrame(rafId);
  rafId = null;

  setProgress(0);

  cardTitle.textContent = "你的指引";
  cardLine.textContent = pickLine();
}

holdBtn.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  if (holdTimer) return;
  startHold();
});

["pointerup", "pointercancel", "pointerleave"].forEach(evt => {
  holdBtn.addEventListener(evt, () => {
    if (holdTimer) cancelHold();
  });
});
