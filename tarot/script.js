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
  "帶著過去學到的經驗，勇敢邁向新的開始。",
  "還沒做好前期準備，勿魯莽行事。",

  "天時地利人和，可以行動。",
  "行動條件尚未齊備，最好再檢視一番。",

  "沉默是金，耐心是美德。",
  "如果你感覺怪怪的，那就是怪怪的，請不要忽略你的直覺。",

  "你有無限的潛能，能為世界帶來生命力。",
  "時間和精力是有限的，請檢視自己的使用方式。",

  "理性與務實能讓你更有安全感。",
  "有時不是你能力不足，而是環境不允許。別硬槓，先讓自己內在穩定下來吧。",

  "真誠啟發智慧，虛心接受指導。",
  "想解開疑難，先抓出重點。",

  "你是受到祝福的。",
  "想打造未來，先活在當下。",

  "踩穩原則和底線，才能捍衛自己的價值觀。",
  "學習調節自己的情緒。",

  "柔能克剛，運用智慧能駕馭力量。",
  "別被衝動控制，向內找回屬於你的力量。",

  "孤獨不等於孤單，智慧能照亮你的路途。",
  "逃避無法解決問題。",

  "幸運之星照亮著你。",
  "人生不是得到就是學到。",

  "小小的行動常常對未來影響重大。",
  "偏見容易蒙蔽雙眼。",

  "換個角度看世界，生命會變得很不一樣。",
  "不要拿著別人的地圖找你的路。",

  "斷捨離的好時機。",
  "面對結束時的態度，決定了你再出發的速度。",

  "反覆釐清與沉澱，能讓你更靠自己的內心。",
  "有來有往，才是維持良好關係的長久之道。",

  "沉迷於世俗的慾望與享受，覺醒方能脫離。",
  "個人力量已經覺醒，該成長了。",

  "有些事看似突如其來，但你其實早就知道原因。",
  "高壓環境逼你成長，須主動才能脫離。",

  "明確的目標在前，主動回饋能讓你獲得更多靈感。",
  "白費工的力氣就不要再花了，做人還是要實際一點。",

  "眼前似乎籠罩暗夜迷霧，與其緊張不如好好休息，等待天明。",
  "當你抓住事物變化的規律，一切都會變得明朗可預期。",

  "愉快光明，處處是機會。",
  "可以耀眼，不要刺眼。",

  "彼此命運環環相扣，過去的時空將交織成今日的結果。",
  "為了容納新事物，你得先騰出空間。",

  "完美的結局。",
  "接受不完美。",

  "小步試錯，大步前行。",
  "虎頭蛇尾的態度無法讓你成功。",

  "不畏挑戰，明確地朝目標前進。",
  "衝動容易引發衝突。",

  "熱情大方地展現你的美好。",
  "以強硬包裹沮喪；以不在乎隱藏傷心，你需要允許情緒流動。",

  "經驗豐富，以身作則，這是身為實力派的擔當。",
  "信守承諾，負起責任。",

  "想像力就是你的超能力。",
  "別再隨波逐流，去找屬於你的生命意義。",

  "實現夢想的機會已經到來，只等你付諸行動。",
  "餅畫得很大，動作卻很小。",

  "以愛為出發點，你能創造出不凡的美。",
  "活在過去對你沒有幫助。",

  "累積的生命智慧讓你能處變不驚。",
  "別太情緒化了，放過別人也放過自己吧。",

  "把你的聰明和機伶用在對的地方。",
  "無心之失易傷人，請謹言慎行。",

  "行動力高是你的優點，但還是請先審慎評估再衝。",
  "慢慢來比較快。",

  "絕對的理智有時讓人覺得無情，請讓你在乎的人懂你。",
  "執著只會讓你更疲憊。",

  "專業與客觀是你的利器。",
  "能天馬行空很厲害，但無作為將難以讓人信服。",

  "積少成多，聚沙成塔。",
  "粗心散漫無法成事。",

  "穩重踏實是你的優點，再加點行動力就會事半功倍。",
  "說得比做得好聽，看似務實，實則懶散。",

  "你的溫暖總是能讓人倍感呵護。",
  "斤斤計較只會讓你更不開心。",

  "務實勤奮，不忘分享，讓你豐盛富足。",
  "金錢非萬能。"
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
