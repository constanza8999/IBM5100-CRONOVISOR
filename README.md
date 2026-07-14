# IBM 5100 Ultimate Collection 🖥️

<div align="center">

![IBM 5100](https://img.shields.io/badge/IBM-5100-00AA00?style=for-the-badge&labelColor=1a1a1a)
![Language](https://img.shields.io/badge/Language-BASIC%20%7C%20APL-00CC00?style=flat-square)
![MAME](https://img.shields.io/badge/MAME-0.287-FF6600?style=flat-square)
![License](https://img.shields.io/badge/License-GPL%20v2-blue?style=flat-square)

**The complete IBM 5100 experience — Web emulator, MAME integration, AI bridge, PALM assembly, and full documentation archive**

[🚀 Live Demo](#-web-emulator) • [📖 Docs](#-documentation) • [🎮 MAME Guide](#-mame-integration) • [🤖 AI Bridge](#-ai-bridge) • [⚡ PALM Assembly](#-palm-programming)

</div>

---

## 📋 Overview

This repository is the ultimate collection of everything related to the **IBM 5100** — one of the first portable computers, released in **September 1975**. It includes:

| Component | Description |
|-----------|-------------|
| 🌐 **Web Emulator** | Browser-based IBM 5100 with BASIC/APL interpreters, CRTTerminal |
| 🎮 **MAME Integration** | Full MAME 0.287 with IBM 5100/5110 ROM support |
| 🤖 **AI Bridge** | NVIDIA AI-powered Python assistant for the IBM 5100 |
| 📚 **Documentation** | 40+ original IBM manuals, service docs, and schematics |
| ⚡ **PALM Programming** | Real PALM assembly code (side-scroller demo for VCF 2025) |
| 🏛️ **Archive** | Complete CORE newsletter collection, brochures, and media |

## 🌐 Web Emulator

The built-in web emulator runs entirely in your browser — no downloads needed.

### Features

- **BASIC Mode**: Full line-numbered BASIC interpreter
  - `10 PRINT "HELLO WORLD"` — create programs
  - `RUN`, `LIST`, `NEW` — program management
  - `GOTO`, `PRINT <expr>` — control flow and evaluation
- **APL Mode**: Mathematical operations with APL symbols
  - `2+2`, `3×4`, `10÷2` — arithmetic with × and ÷
- **Boot Sequence**: Authentic IBM 5100 startup simulation
- **Easter Eggs**: Hidden Steins;Gate references

### Quick Start

```bash
# Open in browser
open emulator/index.html
# Or just double-click the file!
```

### Commands Reference

| Command | Mode | Description |
|---------|------|-------------|
| `help` | Both | Display command reference |
| `info` | Both | IBM 5100 system information |
| `clear` | Both | Clear terminal (keeps boot log) |
| `mode basic` | Both | Switch to BASIC mode |
| `mode apl` | Both | Switch to APL mode |
| `<number> <code>` | BASIC | Add program line |
| `run` | BASIC | Execute program |
| `list` | BASIC | List program lines |
| `new` | BASIC | Clear program memory |
| `print <expr>` | BASIC | Evaluate expression |
| `<expr>` | APL | Evaluate APL expression |
| `time travel` | Both | 🥚 Easter egg |
| `okabe` | Both | 🥚 El Psy Kongroo |

## 🎮 MAME Integration

This repository includes **MAME 0.287** with full IBM 5100 and IBM 5110 ROM support.

### Requirements

- **Windows**: Run `mame.exe ibm5100` directly
- **Linux/macOS**: Compile from [MAME source](https://github.com/mamedev/mame)

### Running the IBM 5100

```bash
# Launch IBM 5100
mame.exe ibm5100

# Launch with window
mame.exe ibm5100 -window

# Skip warnings
mame.exe ibm5100 -window -skip_gameinfo
```

### Controls

| Key | Function |
|-----|----------|
| **Enter** | ↵ (Return) |
| **Backspace** | ← (Backspace) |
| **Shift+Enter** | ATTN (Attention) |
| **Ctrl+Z** | RST (Reset) |
| **F1** | PROCEED |
| **F2** | EXECUTE |
| **F3** | PRINT |
| **Esc** | Enter/Exit Console |

### ROM Files

The `roms/ibm5100/` directory contains the extracted ROS (Read-Only Storage) files:

| File | Description |
|------|-------------|
| `c2.ros`, `c4.ros` | System ROS (extracted by Tom Stepleton, 2019) |
| `d2.ros`, `d4.ros` | System ROS continuation |
| `e2.ros` | I/O control microcode |
| `h2.ros`, `h4.ros` | Display character generator (reconstructed) |
| `j2.ros` | Additional system routines |

> **Credits**: The ROS extraction was done by Tom Stepleton (2019) using an innovative OCR approach on die photographs. Display ROS was reconstructed by matching the original IBM 5100 character set.

## 🤖 AI Bridge

The `IBM5100_BRIDGE.py` connects the IBM 5100 (via MAME) to **NVIDIA AI** for intelligent interaction.

### Features

- **AI Assistant**: Query NVIDIA's LLMs through the IBM 5100 terminal
- **Time Travel**: Change the system year context for AI interactions
- **Asset Auditing**: Scan USDT.z assets on the network
- **APL Injection**: Send commands directly to the PALM processor

### Setup

```bash
# Install dependencies
pip install openai pyautogui

# Set your NVIDIA API key in the script
# Then run:
python IBM5100_BRIDGE.py
```

### Bridge Commands

| Command | Function |
|---------|----------|
| `AI: <question>` | Query NVIDIA AI in Spanish |
| `VIAJE: <year>` | Time-travel the system context |
| `AUDITAR` | Scan and audit assets |
| `EXIT` | Exit the bridge |

## ⚡ PALM Programming

The `archive/SIDESCROLLER/` directory contains a complete **demoscene-style horizontal side-scroller** written in PALM machine code (2025).

### Files

- `sidescroll.asm` — Main assembly source
- `sidescroll.bin` — Compiled binary
- `palm_Assembly_REV3.xlsx` — Assembly reference workbook
- `scroller_program_design_REV1.pdf/pptx` — Design documentation
- `go_sidescroll.bat` — Quick-launch batch file

### Credits

- **Author**: Programmed and presented at VCF Southwest 2025
- **Video**: [YouTube demo](https://www.youtube.com/watch?v=sRAxKGkXC1I)
- **Publication**: Featured in COMPUTE! Gazette (December 2025)

## 📚 Documentation

The `archive/` directory contains **40+ original IBM documents**:

### IBM 5100 (PDFs_5100)
- Maintenance Information Manual (SY31-0405-2)
- APL Reference / Comm Reference
- APL & BASIC Computer-Assisted Instruction manuals
- Mathematics with APL guide
- Serial I/O connection guide
- PALM instruction set & microcode documentation

### IBM 5110 (PDFs_5110)
- Maintenance Information Manual (SY31-0550-1)
- Maintenance Analysis Procedures (SY31-0553-1)

### IBM 5120 (PDFs_5120)
- General Information & Site Preparation (GA34-0130-1)
- Software catalog (1985)

### CORE Archive
- 1981 Disk Brochure
- 1982 CORE Newsletter
- 1984 PC-51 User's Manual
- PC-51 Media Release & Ads

### Conference Materials
- **VCF 2023**: "PALM: The Processor That Powered the IBM 5100" presentation
- Complete slide deck with speaker notes

## 🏗️ Project Structure

```
IBM5100/
├── emulator/                    # Web-based emulator
│   ├── index.html              # Main emulator page
│   ├── css/
│   │   └── style.css           # Modern retro styling
│   └── js/
│       └── script.js           # Emulator logic
├── mame.exe               # Windows binary
├── roms/ibm5100/          # IBM 5100 ROM files
├── hash/                  # Software lists
├── bridge/
│   └── IBM5100_BRIDGE.py      # NVIDIA AI bridge
├── archive/
│   ├── IBM_5100_DOCS-main/    # Original documentation
│   │   ├── PDFs_5100/         # IBM 5100 manuals
│   │   ├── PDFs_5110/         # IBM 5110 manuals
│   │   ├── PDFs_5120/         # IBM 5120 manuals
│   │   ├── MAME_ROMS/         # ROM extraction info
│   │   ├── SIDESCROLLER/      # PALM assembly project
│   │   ├── CORE/              # Historical archive
│   │   └── VCF2023/           # Conference presentation
├── docs/                      # MAME documentation
├── scripts/
│   └── create_release.sh      # Release automation
├── .github/workflows/         # CI/CD pipelines
├── CHANGELOG.md
└── README.md
```

## 🚀 Getting Started

### Prerequisites: Git LFS

This repository uses **Git Large File Storage (LFS)** to manage large binary files (MAME executables, ROM archives, etc.). These files exceed GitHub's 100MB limit and require LFS to clone properly.

> ⚠️ **Important**: If you don't have Git LFS installed, you'll only get text pointer files instead of actual binaries. The emulator and MAME won't work!

#### Installation

**Windows:**
```bash
# Download and install from https://git-lfs.github.com/
# Or use winget:
winget install GitHub.GitLFS
git lfs install
```

**macOS:**
```bash
brew install git-lfs
git lfs install
```

**Linux (Debian/Ubuntu):**
```bash
sudo apt install git-lfs
git lfs install
```

#### Cloning with LFS

```bash
# If cloning fresh, LFS files are pulled automatically
git clone https://github.com/constanza8999/IBM5100-CRONOVISOR.git

# If you already cloned without LFS, run:
git lfs install
git lfs pull
```

#### LFS-Tracked Files

| Pattern | Description | Size Example |
|---------|-------------|---------------|
| `*.exe` | MAME and tool executables | mame.exe (368MB) |
| `*.sym` | Symbol files | mame.sym (165MB) |
| `*.zip` | ROM archives | Various |
| `*.chd` | CHD disk images | Various |
| `*.7z` | 7-Zip archives | Various |

> 💡 **Troubleshooting**: If you see `.git/lfs/objects/` errors or have pointer files instead of real binaries, run:
> ```bash
> git lfs install
> git lfs pull
> ```

---

### Web Emulator (No Install)

1. Open `emulator/index.html` in your browser
2. Wait for the boot sequence to complete
3. Type `help` to see available commands
4. Write BASIC programs or use APL mode!

### MAME (Full Experience)

```bash
# Windows
mame.exe ibm5100 -window

# Skip game info warning
mame.exe ibm5100 -window -skip_gameinfo
```

### AI Bridge

```bash
pip install openai pyautogui
python bridge/IBM5100_BRIDGE.py
```

## 🤝 Contributing

Contributions are welcome! See the `archive/SIDESCROLLER/` for an example of a community contribution. Whether it's:

- New PALM assembly programs
- Documentation improvements
- Emulator feature additions
- Historical research

Please open an issue or PR!

## 📜 License

- **MAME**: GPL v2 (see `COPYING`)
- **Documentation**: Public domain / fair use
- **Original code**: MIT
- **Hash files**: CC0 (public domain)

## 🙏 Credits

- **Tom Stepleton** — IBM 5100 ROS extraction via OCR (2019)
- **Christian Corti** — IBM 5110 ROS extraction via startup steering
- **MAMEdev** — The amazing MAME emulator project
- **VCF Southwest** — 2023 PALM presentation
- **COMPUTE! Gazette** — Feature article (Dec 2025)
- **Steins;Gate** — El Psy Kongroo

---

<div align="center">
  <sub>Built with 💚 for the IBM 5100 — the machine that started the portable revolution</sub>
</div>
