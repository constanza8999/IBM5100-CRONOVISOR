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
  '   SAVE <name>           - Save current program',
  '   LOAD <name>           - Load saved program',
  '   DIR                   - List saved programs',
  '   LIBRARY               - Show example programs',
  '   USE <number>          - Load example program',
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
  '   THEME <name>          - Change CRT color',
  '   SOUND ON/OFF          - Toggle sound effects',
  '   HISTORY               - Show command history',
  '   KEYBOARD              - Show keyboard reference',
  '   GAME                  - Play number guessing game',
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

// ── Game State ──────────────────────────────────────────────────
let gameActive = false;
let gameNumber = 0;
let gameAttempts = 0;

// ── Program Library ─────────────────────────────────────────────
const PROGRAM_LIBRARY = [
  {
    name: 'Hello World',
    description: 'Classic first program',
    code: {
      10: 'PRINT "HELLO, WORLD!"'
    }
  },
  {
    name: 'Countdown',
    description: 'Countdown from 10 to 1',
    code: {
      10: 'PRINT "COUNTDOWN STARTING..."',
      20: 'FOR I = 10 TO 1 STEP -1',
      30: 'PRINT I',
      40: 'NEXT I',
      50: 'PRINT "LIFTOFF!"'
    }
  },
  {
    name: 'Multiplication Table',
    description: 'Print multiplication table',
    code: {
      10: 'PRINT "MULTIPLICATION TABLE"',
      20: 'PRINT "==================="',
      30: 'FOR I = 1 TO 5',
      40: 'FOR J = 1 TO 5',
      50: 'PRINT I * J',
      60: 'NEXT J',
      70: 'NEXT I'
    }
  },
  {
    name: 'Fibonacci',
    description: 'First 10 Fibonacci numbers',
    code: {
      10: 'PRINT "FIBONACCI SEQUENCE"',
      20: 'PRINT "=================="',
      30: 'A = 0',
      40: 'B = 1',
      50: 'FOR I = 1 TO 10',
      60: 'PRINT A',
      70: 'C = A + B',
      80: 'A = B',
      90: 'B = C',
      100: 'NEXT I'
    }
  },
  {
    name: 'Star Pattern',
    description: 'Draw a pyramid of stars',
    code: {
      10: 'PRINT "STAR PYRAMID"',
      20: 'PRINT "============"',
      30: 'FOR I = 1 TO 5',
      40: 'S = ""',
      50: 'FOR J = 1 TO I',
      60: 'S = S + "* "',
      70: 'NEXT J',
      80: 'PRINT S',
      90: 'NEXT I'
    }
  },
  {
    name: 'Temperature Converter',
    description: 'Celsius to Fahrenheit',
    code: {
      10: 'PRINT "TEMPERATURE CONVERTER"',
      20: 'PRINT "====================="',
      30: 'FOR C = 0 TO 100 STEP 20',
      40: 'F = C * 9 / 5 + 32',
      50: 'PRINT C; "C = "; F; "F"',
      60: 'NEXT C'
    }
  },
  {
    name: 'Simple Interest',
    description: 'Calculate simple interest',
    code: {
      10: 'PRINT "SIMPLE INTEREST CALC"',
      20: 'PRINT "===================="',
      30: 'P = 1000',
      40: 'R = 5',
      50: 'T = 3',
      60: 'I = P * R * T / 100',
      70: 'PRINT "PRINCIPAL: $"; P',
      80: 'PRINT "RATE: "; R; "%"',
      90: 'PRINT "TIME: "; T; " YEARS"',
      100: 'PRINT "INTEREST: $"; I'
    }
  },
  {
    name: 'IBM 5100 Demo',
    description: 'Showcase BASIC features',
    code: {
      10: 'PRINT "*** IBM 5100 EMULATOR ***"',
      20: 'PRINT "========================"',
      30: 'PRINT',
      40: 'PRINT "RELEASED: SEPTEMBER 1975"',
      50: 'PRINT "CPU: IBM PALM 16-BIT"',
      60: 'PRINT "MEMORY: 64KB"',
      70: 'PRINT "LANGUAGES: BASIC, APL"',
      80: 'PRINT',
      90: 'PRINT "FUTURE IS NOW, EL PSY KONGROO"'
    }
  }
];

let loadingInterval;

// ── Emulator State ──────────────────────────────────────────────
let inputElement;
let mode = 'basic';
let program = {};
let bootLog = '';
let isBooting = false;
let commandHistory = [];
let historyIndex = -1;
let soundEnabled = true;
let currentTheme = 'green';

// ── DOM Ref ─────────────────────────────────────────────────────
const terminal = document.getElementById('terminal');

// ── Sound Effects ───────────────────────────────────────────────
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
}

function playBeep(frequency = 800, duration = 50, type = 'square') {
  if (!soundEnabled) return;
  try {
    initAudio();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration / 1000);
    
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + duration / 1000);
  } catch (e) {
    // Audio not supported
  }
}

function playKeyClick() {
  playBeep(1200, 10, 'sine');
}

function playReturn() {
  playBeep(600, 80, 'square');
}

function playError() {
  playBeep(200, 150, 'sawtooth');
}

function playBoot() {
  playBeep(400, 100, 'sine');
  setTimeout(() => playBeep(600, 100, 'sine'), 150);
  setTimeout(() => playBeep(800, 100, 'sine'), 300);
}

// ── Theme Management ────────────────────────────────────────────
const THEMES = {
  green: { color: '#00ff41', glow: '#00ff41', name: 'P1 Phosphor (Green)' },
  amber: { color: '#ffb000', glow: '#ffb000', name: 'P3 Phosphor (Amber)' },
  white: { color: '#e0e0e0', glow: '#e0e0e0', name: 'P4 Phosphor (White)' },
  blue: { color: '#00bfff', glow: '#00bfff', name: 'P7 Phosphor (Blue)' },
  retro: { color: '#33ff33', glow: '#33ff33', name: 'Classic Retro' }
};

function setTheme(themeName) {
  if (!THEMES[themeName]) {
    output('Unknown theme. Available: green, amber, white, blue, retro');
    return;
  }
  
  currentTheme = themeName;
  const theme = THEMES[themeName];
  document.documentElement.style.setProperty('--crt-green', theme.color);
  document.documentElement.style.setProperty('--crt-glow', theme.glow);
  
  // Save preference
  localStorage.setItem('ibm5100_theme', themeName);
  
  output(`Theme changed to: ${theme.name}`);
  playBeep(1000, 50);
}

function loadSavedTheme() {
  const saved = localStorage.getItem('ibm5100_theme');
  if (saved && THEMES[saved]) {
    currentTheme = saved;
    const theme = THEMES[saved];
    document.documentElement.style.setProperty('--crt-green', theme.color);
    document.documentElement.style.setProperty('--crt-glow', theme.glow);
  }
}

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

function addToHistory(cmd) {
  if (cmd.trim() && commandHistory[commandHistory.length - 1] !== cmd) {
    commandHistory.push(cmd);
    if (commandHistory.length > 50) {
      commandHistory.shift();
    }
  }
  historyIndex = commandHistory.length;
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
      playBoot();
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
  inputElement.addEventListener('keydown', handleKeyHistory);
  inputElement.addEventListener('input', playKeyClick);
}

// ── Input Handler ───────────────────────────────────────────────
function handleInput(e) {
  if (e.key === 'Enter') {
    const raw = inputElement.value;
    const cmd = raw.trim();
    addToHistory(cmd);
    playReturn();
    output('> ' + cmd);

    const promptEl = document.getElementById('prompt');
    if (promptEl) promptEl.remove();
    const lineEl = document.getElementById('input-line');
    if (lineEl) lineEl.remove();
    inputElement.removeEventListener('keydown', handleInput);
    inputElement.removeEventListener('keydown', handleKeyHistory);
    inputElement = null;

    processCommand(cmd.toLowerCase(), raw);
  }
}

// ── Command History Navigation ──────────────────────────────────
function handleKeyHistory(e) {
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (historyIndex > 0) {
      historyIndex--;
      inputElement.value = commandHistory[historyIndex] || '';
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (historyIndex < commandHistory.length - 1) {
      historyIndex++;
      inputElement.value = commandHistory[historyIndex] || '';
    } else {
      historyIndex = commandHistory.length;
      inputElement.value = '';
    }
  }
}

// ── Command Processor ───────────────────────────────────────────
function processCommand(lowerCmd, originalCmd) {
  // Handle game input
  if (gameActive) {
    const gameOver = handleGameGuess(lowerCmd);
    if (!gameOver) {
      return startPrompt();
    }
  }

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
      playBeep(500, 100);
      break;

    case 'okabe':
      output('El Psy Kongroo');
      playBeep(700, 150);
      break;

    case 'library':
    case 'lib':
      showLibrary();
      break;

    case 'dir':
      listSavedPrograms();
      break;

    case 'history':
      showHistory();
      break;

    case 'keyboard':
    case 'kbd':
      showKeyboardRef();
      break;

    case 'game':
      startNumberGame();
      break;

    case 'sound on':
      soundEnabled = true;
      output('Sound effects enabled.');
      playBeep(800, 50);
      break;

    case 'sound off':
      soundEnabled = false;
      output('Sound effects disabled.');
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
          playError();
        }
        return startPrompt();
      }

      // Theme switching
      if (lowerCmd.startsWith('theme ')) {
        const theme = lowerCmd.split(' ')[1];
        setTheme(theme);
        return startPrompt();
      }

      // USE command - load example from library
      if (lowerCmd.startsWith('use ')) {
        const num = parseInt(lowerCmd.split(' ')[1]);
        loadFromLibrary(num);
        return startPrompt();
      }

      // SAVE command
      if (lowerCmd.startsWith('save ')) {
        const name = lowerCmd.substring(5).trim();
        saveProgram(name);
        return startPrompt();
      }

      // LOAD command
      if (lowerCmd.startsWith('load ')) {
        const name = lowerCmd.substring(5).trim();
        loadProgram(name);
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
          playError();
        }
        return startPrompt();
      }

      // Unknown command
      if (lowerCmd) {
        output('SYNTAX ERROR');
        playError();
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
      playError();
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
        playError();
      }
    }
    // Ignore non-command lines (REM, etc.)
    pc++;
  }
  playBeep(500, 50);
}

// ── Program Library Functions ────────────────────────────────────
function showLibrary() {
  output('');
  output('╔══════════════════════════════════════════╗');
  output('║       IBM 5100 PROGRAM LIBRARY           ║');
  output('╠══════════════════════════════════════════╣');
  
  PROGRAM_LIBRARY.forEach((prog, index) => {
    const num = String(index + 1).padStart(2, ' ');
    const name = prog.name.padEnd(20, ' ');
    output(`║ ${num}. ${name} ║`);
    output(`║    ${prog.description.padEnd(36, ' ')} ║`);
    if (index < PROGRAM_LIBRARY.length - 1) {
      output('║                                        ║');
    }
  });
  
  output('╚══════════════════════════════════════════╝');
  output('');
  output('Type USE <number> to load a program');
  output('Example: USE 1');
}

function loadFromLibrary(num) {
  if (num < 1 || num > PROGRAM_LIBRARY.length) {
    output('Invalid program number. Use LIBRARY to see available programs.');
    playError();
    return;
  }
  
  const prog = PROGRAM_LIBRARY[num - 1];
  program = { ...prog.code };
  output(`Loaded: ${prog.name}`);
  output('Type LIST to view, RUN to execute');
  updateStatus(mode.toUpperCase(), `${Object.keys(program).length} LINES`);
  playBeep(800, 50);
}

// ── Save/Load Functions ─────────────────────────────────────────
function saveProgram(name) {
  if (!name) {
    output('Usage: SAVE <name>');
    return;
  }
  
  const saved = JSON.parse(localStorage.getItem('ibm5100_programs') || '{}');
  saved[name] = {
    code: program,
    timestamp: new Date().toISOString(),
    mode: mode
  };
  localStorage.setItem('ibm5100_programs', JSON.stringify(saved));
  output(`Program saved: ${name}`);
  playBeep(800, 50);
}

function loadProgram(name) {
  if (!name) {
    output('Usage: LOAD <name>');
    return;
  }
  
  const saved = JSON.parse(localStorage.getItem('ibm5100_programs') || '{}');
  if (!saved[name]) {
    output(`Program not found: ${name}`);
    playError();
    return;
  }
  
  program = { ...saved[name].code };
  if (saved[name].mode) {
    mode = saved[name].mode;
    updateStatus(mode.toUpperCase(), `${Object.keys(program).length} LINES`);
  }
  output(`Program loaded: ${name}`);
  playBeep(800, 50);
}

function listSavedPrograms() {
  const saved = JSON.parse(localStorage.getItem('ibm5100_programs') || '{}');
  const names = Object.keys(saved);
  
  if (names.length === 0) {
    output('No saved programs.');
    output('Use SAVE <name> to save the current program.');
    return;
  }
  
  output('');
  output('SAVED PROGRAMS:');
  output('===============');
  names.forEach(name => {
    const prog = saved[name];
    const lines = Object.keys(prog.code).length;
    const date = new Date(prog.timestamp).toLocaleDateString();
    output(`  ${name} (${lines} lines, ${date})`);
  });
  output('');
  output('Use LOAD <name> to load a program.');
}

// ── Command History ─────────────────────────────────────────────
function showHistory() {
  if (commandHistory.length === 0) {
    output('No command history.');
    return;
  }
  
  output('');
  output('COMMAND HISTORY:');
  output('================');
  const recent = commandHistory.slice(-20);
  recent.forEach((cmd, i) => {
    output(`  ${String(i + 1).padStart(2, ' ')}: ${cmd}`);
  });
  output('');
  output('Use ↑/↓ arrows to navigate history.');
}

// ── Keyboard Reference ─────────────────────────────────────────
const KEYBOARD_REF = [
  '╔═══════════════════════════════════════════════════╗',
  '║          IBM 5100 KEYBOARD REFERENCE             ║',
  '╠═══════════════════════════════════════════════════╣',
  '║  FUNCTION KEYS:                                  ║',
  '║    F1     - PROCEED                              ║',
  '║    F2     - EXECUTE                              ║',
  '║    F3     - PRINT                                ║',
  '║    F5     - Reload Emulator (Electron)           ║',
  '║    F11    - Toggle Fullscreen (Electron)         ║',
  '║                                                   ║',
  '║  SPECIAL KEYS:                                   ║',
  '║    Enter  - Return / Execute command              ║',
  '║    Back   - Backspace / Delete                    ║',
  '║    Shift+Enter - ATTN (Attention/Break)          ║',
  '║    Esc    - Exit MAME console                     ║',
  '║                                                   ║',
  '║  NAVIGATION:                                     ║',
  '║    ↑      - Previous command from history        ║',
  '║    ↓      - Next command from history            ║',
  '╚═══════════════════════════════════════════════════╝'
];

function showKeyboardRef() {
  KEYBOARD_REF.forEach(l => output(l));
}

// ── Number Guessing Game ────────────────────────────────────────
function startNumberGame() {
  if (gameActive) {
    output('Game already in progress! Type QUIT to exit.');
    return;
  }
  gameNumber = Math.floor(Math.random() * 100) + 1;
  gameAttempts = 0;
  gameActive = true;
  
  output('');
  output('╔══════════════════════════════════════════╗');
  output('║     NUMBER GUESSING GAME - IBM 5100      ║');
  output('╠══════════════════════════════════════════╣');
  output('║  I am thinking of a number between       ║');
  output('║  1 and 100. Can you guess it?            ║');
  output('║                                          ║');
  output('║  Type a number to guess!                 ║');
  output('║  Type QUIT to exit the game.             ║');
  output('╚══════════════════════════════════════════╝');
  output('');
  output('Your guess: ');
}

function handleGameGuess(guess) {
  if (guess === 'quit' || guess === 'exit') {
    gameActive = false;
    output('Game ended. The number was: ' + gameNumber);
    return true;
  }
  
  const num = parseInt(guess);
  if (isNaN(num) || num < 1 || num > 100) {
    output('Please enter a number between 1 and 100.');
    output('Your guess: ');
    return false;
  }
  
  gameAttempts++;
  
  if (num === gameNumber) {
    gameActive = false;
    output('');
    output('*** CONGRATULATIONS! ***');
    output('You guessed it in ' + gameAttempts + ' attempts!');
    output('The number was: ' + gameNumber);
    playBeep(800, 100);
    setTimeout(() => playBeep(1000, 100), 150);
    setTimeout(() => playBeep(1200, 200), 300);
    return true;
  } else if (num < gameNumber) {
    output('Too LOW! Try again.');
    playBeep(400, 50);
  } else {
    output('Too HIGH! Try again.');
    playBeep(300, 50);
  }
  
  output('Attempts: ' + gameAttempts + ' | Your guess: ');
  return false;
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
