// ===== TIMER =====
let timerEl, pbEl, elapsed = 0, totalSecs = 3600, timerInterval;

function initTimer() {
  timerEl = document.getElementById('timer');
  pbEl = document.getElementById('progress-fill');
  updateTimerDisplay();
}

function startTimer() {
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    elapsed++;
    updateTimerDisplay();
    updateAgendaAuto();
  }, 1000);
}

function updateTimerDisplay() {
  const left = totalSecs - elapsed;
  if (left < 0) { clearInterval(timerInterval); return; }
  const m = Math.floor(left / 60);
  const s = left % 60;
  if (timerEl) {
    timerEl.textContent = (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
    timerEl.className = 'timer-display' + (left < 300 ? ' warn' : '');
  }
  if (pbEl) pbEl.style.width = Math.min((elapsed / totalSecs) * 100, 100) + '%';
}

// ===== AGENDA AUTO PROGRESS =====
const agendaTimes = [0, 300, 1200, 2400, 3300, 3600]; // seconds for each phase

function updateAgendaAuto() {
  const items = document.querySelectorAll('.agenda-item');
  items.forEach((item, i) => {
    item.classList.remove('active', 'done');
    if (elapsed >= agendaTimes[i + 1]) {
      item.classList.add('done');
      item.querySelector('.ai-dot').style.background = 'var(--l1)';
    } else if (elapsed >= agendaTimes[i]) {
      item.classList.add('active');
    }
  });
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
  startTimer();
}

// ===== MULTIPLE CHOICE =====
function answerMC(btn, isCorrect, feedbackId, scoreKey) {
  const opts = btn.parentElement.querySelectorAll('.ex-opt');
  opts.forEach(o => { o.disabled = true; });
  btn.classList.add(isCorrect ? 'correct' : 'wrong');
  if (!isCorrect) {
    opts.forEach(o => { if (o.dataset.correct === 'true') o.classList.add('correct'); });
  }
  const fb = document.getElementById(feedbackId);
  if (fb) {
    fb.textContent = isCorrect ? '✓ Correct! Well done.' : '✗ Not quite. See the correct answer above.';
    fb.className = 'ex-feedback ' + (isCorrect ? 'ok' : 'err');
  }
  if (scoreKey) {
    if (isCorrect) sessionStorage.setItem(scoreKey, '1');
    else sessionStorage.setItem(scoreKey, '0');
  }
}

// ===== FILL IN THE BLANK =====
function checkFill(inputId, correct, feedbackId, scoreKey) {
  const input = document.getElementById(inputId);
  const val = input.value.trim().toLowerCase();
  const ok = val === correct.toLowerCase();
  input.disabled = true;
  input.className = 'fill-in ' + (ok ? 'correct' : 'wrong');
  const fb = document.getElementById(feedbackId);
  if (fb) {
    fb.innerHTML = ok ? '✓ Perfect!' : `✗ The correct answer is: <strong>${correct}</strong>`;
    fb.className = 'ex-feedback ' + (ok ? 'ok' : 'err');
  }
  if (scoreKey) sessionStorage.setItem(scoreKey, ok ? '1' : '0');
}

// ===== SCORE CALC =====
function calcScore(keys) {
  return keys.reduce((sum, k) => sum + (parseInt(sessionStorage.getItem(k) || '0')), 0);
}

window.addEventListener('DOMContentLoaded', () => {
  initTimer();
  // start timer when user first interacts
  document.addEventListener('click', () => startTimer(), { once: true });
  document.addEventListener('keydown', () => startTimer(), { once: true });
});
