const analyzeBtn = document.getElementById('analyzeBtn');
const emotionInput = document.getElementById('emotionInput');
const predictedEmotion = document.getElementById('predictedEmotion');
const emotionIcon = document.getElementById('emotionIcon');
const confidenceFill = document.getElementById('confidenceFill');
const confidenceLabel = document.getElementById('confidenceLabel');
const circleLabel = document.getElementById('circleLabel');
const circleProgress = document.getElementById('circleProgress');
const scoreValue = document.getElementById('scoreValue');
const joyFill = document.getElementById('joyFill');
const sadnessFill = document.getElementById('sadnessFill');
const angerFill = document.getElementById('angerFill');
const fearFill = document.getElementById('fearFill');
const surpriseFill = document.getElementById('surpriseFill');
const loveFill = document.getElementById('loveFill');
const joyValue = document.getElementById('joyValue');
const sadnessValue = document.getElementById('sadnessValue');
const angerValue = document.getElementById('angerValue');
const fearValue = document.getElementById('fearValue');
const surpriseValue = document.getElementById('surpriseValue');
const loveValue = document.getElementById('loveValue');
const sampleCards = document.querySelectorAll('.sample-card');
const themeToggle = document.getElementById('themeToggle');
const pageShell = document.querySelector('.page-shell');
const voiceBtn = document.getElementById('voiceBtn');
const clearBtn = document.getElementById('clearBtn');
const assistantMessage = document.getElementById('assistantMessage');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistory');
const resultPanel = document.getElementById('resultCard');
const weeklyChartCtx = document.getElementById('weeklyChart').getContext('2d');
const emotionPieCtx = document.getElementById('emotionPie').getContext('2d');

const emotions = [
  { label: 'Joy', emoji: '😊', theme: 'joy-theme' },
  { label: 'Sadness', emoji: '😔', theme: 'sadness-theme' },
  { label: 'Anger', emoji: '😠', theme: 'anger-theme' },
  { label: 'Fear', emoji: '😨', theme: 'fear-theme' },
  { label: 'Surprise', emoji: '😲', theme: 'surprise-theme' },
  { label: 'Love', emoji: '❤️', theme: 'love-theme' }
];

const assistantResponses = {
  Joy: "That's wonderful — keep celebrating your progress.",
  Sadness: "I'm sorry you're feeling this way. A short break and a supportive friend can help.",
  Anger: "Take a moment to breathe. A calm response is your superpower.",
  Fear: "You are not alone. Grounding exercises can ease that worry.",
  Surprise: "That moment may carry new opportunity. Stay curious.",
  Love: "That warmth is powerful. Cherish the connection."
};

const savedHistoryKey = 'emoSenseHistory';
let historyRecords = JSON.parse(localStorage.getItem(savedHistoryKey) || '[]');
let weeklyChart;
let emotionPie;

const normalizeText = (text) => text.trim().toLowerCase();

const detectEmotion = (text) => {
  const normalized = normalizeText(text);
  if (!normalized) return null;

  const mapping = [
    { pattern: /happy|joy|excited|amazing|great|love|delighted/, emotion: 'Joy', emoji: '😊' },
    { pattern: /sad|alone|down|depressed|heartbroken|lost/, emotion: 'Sadness', emoji: '😔' },
    { pattern: /angry|mad|furious|hate|upset|frustrated/, emotion: 'Anger', emoji: '😠' },
    { pattern: /scared|afraid|fear|terrified|worried|anxious/, emotion: 'Fear', emoji: '😨' },
    { pattern: /surprised|shocked|wow|amazed|unexpected/, emotion: 'Surprise', emoji: '😲' },
    { pattern: /love|cherish|adore|obsessed|romantic/, emotion: 'Love', emoji: '❤️' }
  ];

  const found = mapping.find((item) => item.pattern.test(normalized));
  return found || emotions[Math.floor(Math.random() * emotions.length)];
};

const randomProbabilities = (mainEmotion) => {
  const base = {
    Joy: 0.85,
    Sadness: 0.82,
    Anger: 0.8,
    Fear: 0.78,
    Surprise: 0.84,
    Love: 0.83
  };

  const probabilities = {
    Joy: 0.04,
    Sadness: 0.04,
    Anger: 0.04,
    Fear: 0.04,
    Surprise: 0.04,
    Love: 0.04
  };
  probabilities[mainEmotion] = base[mainEmotion];

  let remaining = 1 - probabilities[mainEmotion];
  const keys = Object.keys(probabilities).filter((key) => key !== mainEmotion);

  keys.forEach((key, index) => {
    const next = index === keys.length - 1 ? remaining : parseFloat((Math.random() * remaining * 0.6).toFixed(2));
    probabilities[key] = next;
    remaining = parseFloat((remaining - next).toFixed(2));
  });

  return Object.fromEntries(
    Object.entries(probabilities).map(([key, value]) => [key, Math.max(0, Math.min(1, value))])
  );
};

const applyEmotionTheme = (emotion) => {
  const themeClasses = emotions.map((item) => item.theme);
  pageShell.classList.remove(...themeClasses);
  resultPanel.classList.remove(...themeClasses);
  const matched = emotions.find((item) => item.label === emotion);
  if (matched) {
    pageShell.classList.add(matched.theme);
    resultPanel.classList.add(matched.theme);
  }
};

const safePercent = (value) => `${Math.round(Math.max(0, Math.min(100, value)))}%`;

const updateResults = (emotion, emoji, confidence) => {
  const probabilities = randomProbabilities(emotion);
  applyEmotionTheme(emotion);
  predictedEmotion.textContent = `${emotion} → ${confidence}%`;
  emotionIcon.textContent = emoji;
  confidenceFill.style.width = `${confidence}%`;
  confidenceLabel.textContent = `${confidence}%`;
  circleLabel.textContent = emoji;
  circleProgress.style.background = `conic-gradient(var(--secondary) 0%, var(--secondary) ${confidence}%, rgba(255,255,255,0.06) ${confidence}%, rgba(255,255,255,0.06) 100%)`;
  scoreValue.textContent = `${confidence}%`;

  joyFill.style.width = safePercent(probabilities.Joy * 100);
  sadnessFill.style.width = safePercent(probabilities.Sadness * 100);
  angerFill.style.width = safePercent(probabilities.Anger * 100);
  fearFill.style.width = safePercent(probabilities.Fear * 100);
  surpriseFill.style.width = safePercent(probabilities.Surprise * 100);
  loveFill.style.width = safePercent(probabilities.Love * 100);

  joyValue.textContent = safePercent(probabilities.Joy * 100);
  sadnessValue.textContent = safePercent(probabilities.Sadness * 100);
  angerValue.textContent = safePercent(probabilities.Anger * 100);
  fearValue.textContent = safePercent(probabilities.Fear * 100);
  surpriseValue.textContent = safePercent(probabilities.Surprise * 100);
  loveValue.textContent = safePercent(probabilities.Love * 100);

  const response = generateAssistantReply(emotion, emotionInput.value);
  assistantMessage.textContent = response;
  addHistoryRecord(emotionInput.value.trim(), emotion, confidence);
};

const setLoadingState = () => {
  analyzeBtn.textContent = 'Analyzing...';
  analyzeBtn.disabled = true;
  analyzeBtn.style.opacity = '0.72';
};

const clearLoadingState = () => {
  analyzeBtn.textContent = 'Analyze Emotion';
  analyzeBtn.disabled = false;
  analyzeBtn.style.opacity = '1';
};

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
};

const addHistoryRecord = (text, emotion, confidence) => {
  if (!text) return;
  const record = {
    id: Date.now(),
    text,
    emotion,
    confidence,
    timestamp: new Date().toISOString()
  };
  historyRecords.unshift(record);
  historyRecords = historyRecords.slice(0, 12);
  localStorage.setItem(savedHistoryKey, JSON.stringify(historyRecords));
  renderHistory();
  updateCharts();
};

const renderHistory = () => {
  historyList.innerHTML = '';
  if (!historyRecords.length) {
    historyList.innerHTML = '<p class="history-empty">No entries yet. Analyze a message to build your emotion journal.</p>';
    return;
  }

  historyRecords.forEach((record) => {
    const item = document.createElement('div');
    item.className = 'history-item';
    item.innerHTML = `
      <strong>${record.emotion} • ${record.confidence}%</strong>
      <p>${record.text}</p>
      <span>${formatDate(record.timestamp)}</span>
    `;
    historyList.appendChild(item);
  });
};

const getEmotionAnalytics = () => {
  const counts = {
    Joy: 0,
    Sadness: 0,
    Anger: 0,
    Fear: 0,
    Surprise: 0,
    Love: 0
  };
  const weekly = [0, 0, 0, 0, 0, 0, 0];

  historyRecords.forEach((record) => {
    if (counts[record.emotion] !== undefined) counts[record.emotion] += 1;
    const date = new Date(record.timestamp);
    const weekday = date.getDay();
    weekly[weekday === 0 ? 6 : weekday - 1] += 1;
  });

  return { counts, weekly };
};

const updateCharts = () => {
  const { counts, weekly } = getEmotionAnalytics();
  const summary = Object.values(counts);

  if (weeklyChart) {
    weeklyChart.data.datasets[0].data = weekly;
    weeklyChart.update();
  }
  if (emotionPie) {
    emotionPie.data.datasets[0].data = summary;
    emotionPie.update();
  }
};

const generateAssistantReply = (emotion, text) => {
  const statusPhrases = [/stress|stressed|anxious|worried|overwhelmed/gi, /tired|exhausted|drained/gi];
  if (statusPhrases[0].test(text)) {
    return 'I’m sorry you’re feeling stressed. Try a short walk and gentle breathing exercises.';
  }
  if (statusPhrases[1].test(text)) {
    return 'Rest is important. A short pause and some self-care could help you reset.';
  }
  return assistantResponses[emotion] || 'I’m here to support you with calm and thoughtful guidance.';
};

const handleAnalyze = (text) => {
  setLoadingState();
  setTimeout(() => {
    const detected = detectEmotion(text);
    const confidence = Math.floor(82 + Math.random() * 14);
    if (detected) {
      updateResults(detected.emotion, detected.emoji, confidence);
    }
    clearLoadingState();
  }, 900);
};

const handleVoiceInput = () => {
  if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
    assistantMessage.textContent = 'Voice input is not supported by this browser.';
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  voiceBtn.textContent = 'Listening…';

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    emotionInput.value = transcript;
    assistantMessage.textContent = `Heard: "${transcript}". Predicting emotion now...`;
    handleAnalyze(transcript);
  };

  recognition.onerror = () => {
    assistantMessage.textContent = 'Voice capture failed. Please try again.';
  };

  recognition.onend = () => {
    voiceBtn.textContent = '🎤 Voice Input';
  };

  recognition.start();
};

const resetInput = () => {
  emotionInput.value = '';
  assistantMessage.textContent = 'Type how you feel and receive calm, helpful guidance from your AI companion.';
};

const clearHistory = () => {
  historyRecords = [];
  localStorage.removeItem(savedHistoryKey);
  renderHistory();
  updateCharts();
};

const initCharts = () => {
  weeklyChart = new Chart(weeklyChartCtx, {
    type: 'bar',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Emotions this week',
        data: [0, 0, 0, 0, 0, 0, 0],
        borderRadius: 12,
        backgroundColor: ['#7c3aed', '#06b6d4', '#ec4899', '#f59e0b', '#22c55e', '#38bdf8', '#a855f7']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true, ticks: { stepSize: 1 } }
      }
    }
  });

  emotionPie = new Chart(emotionPieCtx, {
    type: 'doughnut',
    data: {
      labels: ['Joy', 'Sadness', 'Anger', 'Fear', 'Surprise', 'Love'],
      datasets: [{
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: ['#facc15', '#60a5fa', '#f87171', '#38bdf8', '#fb7185', '#ec4899']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom', labels: { color: '#cbd5e1' } }
      }
    }
  });

  updateCharts();
};

analyzeBtn.addEventListener('click', () => {
  const value = emotionInput.value;
  if (!value.trim()) {
    emotionInput.focus();
    return;
  }
  handleAnalyze(value);
});

voiceBtn.addEventListener('click', handleVoiceInput);
clearBtn.addEventListener('click', resetInput);
clearHistoryBtn.addEventListener('click', clearHistory);

sampleCards.forEach((card) => {
  card.addEventListener('click', () => {
    const sampleText = card.dataset.sample;
    const emotion = card.dataset.emotion;
    const emoji = card.dataset.emoji;
    emotionInput.value = sampleText;
    setLoadingState();
    setTimeout(() => {
      const randomConfidence = 84 + Math.floor(Math.random() * 12);
      updateResults(emotion, emoji, randomConfidence);
      clearLoadingState();
    }, 850);
  });
});

themeToggle.addEventListener('click', () => {
  pageShell.classList.toggle('light-mode');
  const isLight = pageShell.classList.contains('light-mode');
  document.documentElement.style.colorScheme = isLight ? 'light' : 'dark';
  themeToggle.style.transform = isLight ? 'translateX(24px)' : 'translateX(0)';
});

window.addEventListener('load', () => {
  const darkMedia = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (!darkMedia) {
    pageShell.classList.add('light-mode');
    themeToggle.style.transform = 'translateX(24px)';
  }
  renderHistory();
  initCharts();
});