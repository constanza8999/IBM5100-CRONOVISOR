/* ── IBM 5100 Emulator ────────────────────────────────────────────
 *  Complete BASIC/APL interpreter with CRT terminal simulation
 * ──────────────────────────────────────────────────────────────── */

// ── Constants ──────────────────────────────────────────────────
const IS_TOUCH_DEVICE = 'ontouchstart' in window ||
  navigator.maxTouchPoints > 0 ||
  window.matchMedia('(pointer: coarse)').matches;

const BOOT_MESSAGES = [
  'IBM 5100 PERSONAL COMPUTER - MODEL 5100',
  'PALM MICROCODE MONITOR 1.0',
  'BASIC/APL HYBRID FIRMWARE © IBM 1975',
  '',
  'MEMORY SIZE: 64,000 BYTES    TAPE: DC300',
  'TERMINAL: 16x64   PHOSPHOR: P1 (GREEN)',
  '',
  'SELF TEST ................. OK',
  'ROM CHECK ................. OK',
  'TAPE DRIVE ................ OK',
  '',
  'READY.',
  'Type HELP for commands.',
  ''
];

const HELP_TEXT = [
  'Available Commands:',
  '',
  ' BASIC MODE:',
  '   [line#] statement     - Add program line',
  '   RUN                   - Execute program',
  '   LIST                  - List program lines',
  '   NEW                   - Clear program memory',
  '   PRINT <expression>    - Evaluate immediately',
  '   GOTO <line#>          - Jump to line',
  '',
  ' APL MODE:',
  '   Enter expressions using:',
  '   +  -  × (multiply)  ÷ (divide)',
  '   Examples: 2+2, 3×4, 10÷2',
  '',
  ' GENERAL:',
  '   MODE BASIC            - Switch to BASIC',
  '   MODE APL              - Switch to APL',
  '   INFO                  - System information',
  '   CLEAR                 - Clear terminal',
  '   HELP                  - This message',
  '',
  ' EASTER EGGS:',
  '   TIME TRAVEL           - 🥚',
  '   OKABE                 - 🥚',
  ''
];

const INFO_TEXT = [
  '┌─────────────────────────────────────────────┐',
  '│         IBM 5100 SYSTEM INFORMATION          │',
  '├─────────────────────────────────────────────┤',
  '│ Released:   September 1975                   │',
  '│ Weight:     ~55 lbs (25 kg)                  │',
  '│ CPU:       IBM PALM (16-bit)                 │',
  '│ Clock:     1.9 MHz (approx.)                 │',
  '│ RAM:       16 KB to 64 KB                    │',
  '│ ROM:       BASIC + APL interpreters          │',
  '│ Storage:   DC300 tape cartridge drive         │',
  '│ Display:   5-inch CRT, 16×64 characters      │',
  '│ I/O:       RS-232, IEEE-488                  │',
  '│ Price:     ~$9,000 - $24,000 (1975)          │',
  '│ Significance: Predecessor to IBM PC (1981)    │',
  '└─────────────────────────────────────────────┘',
  ''
];

const LOADING_SUBTEXTS = [
  'Initializing PALM microcode...',
  'Loading BASIC interpreter...',
  'Loading APL interpreter...',
  'Calibrating CRT phosphor...',
  'Testing memory...',
  'Ready.'
];

let loadingInterval;

// ── Emulator State ──────────────────────────────────────────────
let inputElement;
let mode = 'basic';
let program = {};
let bootLog = '';
let isBooting = false;

// ── DOM Ref ─────────────────────────────────────────────────────
const terminal = document.getElementById('terminal');

// ── Helpers ─────────────────────────────────────────────────────
function output(text) {
  const prompt = document.getElementById('prompt');
  if (prompt) {
    prompt.insertAdjacentHTML('beforebegin', text + '\n');
  } else {
    terminal.innerHTML += text + '\n';
  }
  terminal.scrollTop = terminal.scrollHeight;
}

function updateStatus(mode_text, mem_text) {
  const modeVal = document.getElementById('mode-value');
  const memVal = document.getElementById('memory-value');
  if (modeVal) modeVal.textContent = mode_text || mode.toUpperCase();
  if (memVal) memVal.textContent = mem_text || `${Object.keys(program).length} LINES`;
}

// ── Boot Sequence ───────────────────────────────────────────────
function bootSequence() {
  isBooting = true;
  let i = 0;
  let lines = BOOT_MESSAGES;

  // Speed up boot on subsequent loads
  const delay = bootLog ? 100 : 400;

  function showLine() {
    if (i < lines.length) {
      output(lines[i]);
      bootLog += lines[i] + '\n';
      i++;
      setTimeout(showLine, delay);
    } else {
      isBooting = false;
      startPrompt();
      updateStatus();
    }
  }
  showLine();
}

// ── Prompt ──────────────────────────────────────────────────────
function startPrompt() {
  if (inputElement && inputElement.parentNode) {
    inputElement.remove();
  }
  const promptEl = document.getElementById('prompt');
  if (promptEl) promptEl.remove();

  const promptSpan = document.createElement('span');
  promptSpan.id = 'prompt';
  promptSpan.className = 'prompt-char';
  promptSpan.textContent = '> ';

  inputElement = document.createElement('input');
  inputElement.id = 'input';
  inputElement.type = 'text';
  inputElement.autofocus = true;
  inputElement.autocomplete = 'off';
  inputElement.spellcheck = false;
  inputElement.setAttribute('aria-label', 'Command input');

  const lineSpan = document.createElement('span');
  lineSpan.id = 'input-line';
  lineSpan.appendChild(promptSpan);
  lineSpan.appendChild(inputElement);

  terminal.appendChild(lineSpan);
  inputElement.focus();

  inputElement.addEventListener('keydown', handleInput);
}

// ── Input Handler ───────────────────────────────────────────────
function handleInput(e) {
  if (e.key === 'Enter') {
    const raw = inputElement.value;
    const cmd = raw.trim();
    output('> ' + cmd);

    const promptEl = document.getElementById('prompt');
    if (promptEl) promptEl.remove();
    const lineEl = document.getElementById('input-line');
    if (lineEl) lineEl.remove();
    inputElement.removeEventListener('keydown', handleInput);
    inputElement = null;

    processCommand(cmd.toLowerCase(), raw);
  }
}

// ── Command Processor ───────────────────────────────────────────
function processCommand(lowerCmd, originalCmd) {
  // BASIC line definition (e.g., "10 PRINT "HELLO"")
  if (mode === 'basic' && /^\d+\s/.test(lowerCmd)) {
    const parts = originalCmd.split(' ');
    const lineNum = parseInt(parts[0]);
    const code = originalCmd.substring(originalCmd.indexOf(' ') + 1);
    program[lineNum] = code;
    updateStatus(mode.toUpperCase(), `${Object.keys(program).length} LINES`);
    return startPrompt();
  }

  switch (lowerCmd) {
    case 'help':
      HELP_TEXT.forEach(l => output(l));
      break;

    case 'info':
      INFO_TEXT.forEach(l => output(l));
      break;

    case 'clear':
      terminal.innerHTML = bootLog;
      break;

    case 'time travel':
      output('Current Worldline Divergence Number: 1.048596 (Steins;Gate)');
      break;

    case 'okabe':
      output('El Psy Kongroo');
      break;

    default:
      // Mode switching
      if (lowerCmd.startsWith('mode ')) {
        const newMode = lowerCmd.split(' ')[1];
        if (newMode === 'apl') {
          mode = 'apl';
          output('Switched to APL mode.');
          updateStatus('APL');
        } else if (newMode === 'basic') {
          mode = 'basic';
          output('Switched to BASIC mode.');
          updateStatus('BASIC');
        } else {
          output('SYNTAX ERROR');
        }
        return startPrompt();
      }

      // BASIC commands
      if (mode === 'basic') {
        if (lowerCmd.startsWith('print ')) {
          const expr = originalCmd.replace(/^print\s+/i, '');
          try {
            output(String(eval(expr)));
          } catch {
            output(expr.replace(/"/g, ''));
          }
          return startPrompt();
        }
        if (lowerCmd === 'list') {
          Object.keys(program).map(Number).sort((a, b) => a - b)
            .forEach(n => output(n + ' ' + program[n]));
          return startPrompt();
        }
        if (lowerCmd === 'run') {
          runProgram();
          return startPrompt();
        }
        if (lowerCmd === 'new') {
          program = {};
          output('Program cleared.');
          updateStatus(mode.toUpperCase(), '0 LINES');
          return startPrompt();
        }
      }

      // APL evaluation (× → *, ÷ → /)
      if (mode === 'apl' && lowerCmd) {
        try {
          const expr = lowerCmd.replace(/×/g, '*').replace(/÷/g, '/');
          output(String(eval(expr)));
        } catch {
          output('DOMAIN ERROR');
        }
        return startPrompt();
      }

      // Unknown command
      if (lowerCmd) {
        output('SYNTAX ERROR');
      }
  }

  startPrompt();
}

// ── BASIC Program Runner ────────────────────────────────────────
function runProgram() {
  const lines = Object.keys(program).map(Number).sort((a, b) => a - b);
  let pc = 0;
  let loopGuard = 0;

  while (pc < lines.length) {
    if (loopGuard++ > 500) {
      output('** INFINITE LOOP DETECTED **');
      break;
    }

    const code = program[lines[pc]];
    if (!code) { pc++; continue; }

    const lowerCode = code.toLowerCase();

    if (lowerCode.startsWith('print ')) {
      const expr = code.replace(/^print\s+/i, '');
      try {
        output(String(eval(expr)));
      } catch {
        output(expr.replace(/"/g, ''));
      }
    } else if (lowerCode.startsWith('goto ')) {
      const target = parseInt(code.replace(/^goto\s+/i, ''));
      const idx = lines.indexOf(target);
      if (idx >= 0) {
        pc = idx;
        continue;
      } else {
        output('** UNDEFINED LINE NUMBER **');
      }
    }
    // Ignore non-command lines (REM, etc.)
    pc++;
  }
}

// ── Loading Screen ──────────────────────────────────────────────
function initLoadingScreen() {
  const loadingScreen = document.querySelector('.loading-screen');
  const loadingSubtext = document.getElementById('loading-subtext');
  const fillBar = document.querySelector('.loading-bar');
  if (!loadingScreen) return;

  let subIdx = 0;
  if (loadingSubtext) {
    loadingSubtext.textContent = LOADING_SUBTEXTS[0];
    loadingInterval = setInterval(() => {
      subIdx = (subIdx + 1) % LOADING_SUBTEXTS.length;
      loadingSubtext.textContent = LOADING_SUBTEXTS[subIdx];
    }, 500);
  }

  function hideLoading() {
    clearInterval(loadingInterval);
    loadingScreen.classList.add('hidden');
    if (!IS_TOUCH_DEVICE) {
      document.body.classList.add('custom-cursor');
    }
    // Start the emulator
    bootSequence();
  }

  // Hide when loading bar animation completes
  if (fillBar) {
    fillBar.addEventListener('animationend', hideLoading, { once: true });
  }
  // Fallback timeout
  setTimeout(hideLoading, 4000);
}

// ── Particle Canvas Background ──────────────────────────────────
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let animId;
  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const PARTICLE_COUNT = Math.min(60, Math.floor(window.innerWidth / 20));

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width ||
          this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 255, 65, ${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    // Draw connections
    if (!IS_TOUCH_DEVICE) {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 255, 65, ${0.05 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    animId = requestAnimationFrame(animate);
  }
  animate();
}

// ── Scroll Progress Bar ─────────────────────────────────────────
function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;

  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = progress + '%';
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

// ── Back to Top ─────────────────────────────────────────────────
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  const toggle = () => {
    btn.classList.toggle('visible', window.scrollY > 300);
  };

  window.addEventListener('scroll', toggle, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  toggle();
}

// ── Keyboard shortcuts (function keys) ──────────────────────────
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl+Shift+H = Help
    if (e.ctrlKey && e.shiftKey && e.key === 'H') {
      e.preventDefault();
      helpClick();
    }
  });
}

// ── Button Handlers ─────────────────────────────────────────────
function helpClick() {
  if (isBooting) return;
  if (inputElement) {
    inputElement.value = 'help';
    inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
  }
}

function runClick() {
  if (isBooting || mode !== 'basic') return;
  if (inputElement) {
    inputElement.value = 'run';
    inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
  }
}

function listClick() {
  if (isBooting || mode !== 'basic') return;
  if (inputElement) {
    inputElement.value = 'list';
    inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
  }
}

function newClick() {
  if (isBooting || mode !== 'basic') return;
  if (inputElement) {
    inputElement.value = 'new';
    inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
  }
}

function clearClick() {
  if (isBooting) return;
  if (inputElement) {
    inputElement.value = 'clear';
    inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
  }
}

// ── Service Worker Registration ───────────────────────────────
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {
      // Service worker not supported or offline - emulator still works
    });
  }
}

// ── Init ────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  registerServiceWorker();
  initParticles();
  initScrollProgress();
  initBackToTop();
  initKeyboardShortcuts();
  initLoadingScreen();

  // Expose button handlers globally
  window.helpClick = helpClick;
  window.runClick = runClick;
  window.listClick = listClick;
  window.newClick = newClick;
  window.clearClick = clearClick;
});
