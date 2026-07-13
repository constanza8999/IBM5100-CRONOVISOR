# Changelog

All notable changes to the IBM 5100 Ultimate Collection will be documented in this file.

## [v2025.1.0] - 2026-07-13

### Added
- **Complete project restructure** with organized directory layout
- **Comprehensive README** with badges, documentation, and quick-start guides
- **Modernized web emulator** with enhanced UI:
  - Simulated IBM 5100 physical chassis design
  - Green CRT phosphor terminal with authentic glow effects
  - Interactive function keys (HELP, RUN, LIST, NEW, CLEAR)
  - Tape drive visual indicators
  - Status bar showing mode, memory, and uptime
  - Responsive design for desktop and mobile
- **PWA support** with offline caching and installable web app
- **GitHub Actions CI/CD**:
  - Build workflow (linting, validation)
  - Release workflow (automated tagging and release creation)
- **Release automation** (`scripts/create_release.sh`)
- **Wiki documentation** covering:
  - Home overview
  - Emulator usage guide
  - MAME integration guide
  - AI Bridge setup
  - PALM programming reference
  - Installation instructions

### Web Emulator (v2.0)
- **BASIC Interpreter**: Full line-numbered programming
  - `RUN`, `LIST`, `NEW`, `PRINT`, `GOTO` support
  - Infinite loop detection (500 iteration guard)
  - Program memory management
- **APL Evaluation**: Symbol-based arithmetic (`×`, `÷`)
- **Boot Sequence**: Animated startup with system diagnostics
- **Mode Switching**: Toggle between BASIC and APL interpreters
- **Easter Eggs**: Steins;Gate references (`time travel`, `okabe`)
- **Help System**: Built-in command reference

### Archive
- **IBM 5100 Documentation** (PDFs_5100):
  - Maintenance Information Manual
  - APL Reference & Comm Reference
  - Computer-Assisted Instruction manuals (BASIC & APL)
  - Serial I/O connection guide
  - PALM instruction set documentation
  - Mathematics with APL
- **IBM 5110 Documentation** (PDFs_5110):
  - Maintenance Information Manual
  - Maintenance Analysis Procedures
- **IBM 5120 Documentation** (PDFs_5120):
  - General Information & Site Preparation
  - Software catalog (1985)
- **CORE Historical Archive**:
  - 1981 Disk Brochure
  - 1982 CORE Newsletter
  - 1984 PC-51 User's Manual & Media Kit
- **VCF 2023 Presentation**:
  - "PALM: The Processor That Powered the IBM 5100"
- **PALM Sidescroller**:
  - Complete assembly source code
  - Design documentation (PDF/PPTX)
  - Assembly reference workbook
  - Binary and batch loader

### MAME Integration
- MAME 0.287 with full IBM 5100/5110 support
- Extracted ROS ROM files for both systems
- Complete hash/software list database
- Display font reconstruction

### AI Bridge
- NVIDIA AI integration via API
- Time-travel context switching
- Asset auditing capabilities
- Spanish-language AI responses
- PALM microcode injection

### Infrastructure
- `.gitignore` for clean repository
- GitHub issue templates (implied)
- Release workflow automation
- Changelog tracking

## [Unreleased]

### Planned
- Enhanced BASIC with more statement types (`IF/THEN`, `FOR/NEXT`)
- Save/load program state to local storage
- Multiple CRTTerminal color themes (amber, white)
- Sound effects for key presses and boot sequence
- WASM-based PALM emulator in the browser
- Dark/light theme toggle
- Internationalization (Spanish/Japanese)

---

*This changelog follows [Keep a Changelog](https://keepachangelog.com/) format.*
