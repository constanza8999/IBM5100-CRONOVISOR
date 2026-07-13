# Welcome to the IBM 5100 Ultimate Collection Wiki 🌐

This wiki provides comprehensive documentation for the **IBM 5100 Ultimate Collection** — a complete archive of everything related to the IBM 5100 portable computer (1975).

## Quick Navigation

- [[Emulator Guide]] — Using the web-based IBM 5100 emulator
- [[MAME Integration]] — Running the IBM 5100 in MAME
- [[AI Bridge]] — Setting up the NVIDIA AI assistant
- [[PALM Programming]] — Writing PALM assembly code
- [[Installation]] — Setup instructions for all components

## About the IBM 5100

Released in September 1975, the IBM 5100 was one of the world's first portable computers. It featured:

- **CPU**: IBM PALM (16-bit, microcoded)
- **Memory**: 16 KB to 64 KB
- **Display**: 5-inch green phosphor CRT (16×64 characters)
- **Storage**: DC300 tape cartridge drive
- **Languages**: BASIC and APL interpreters in ROM
- **Weight**: ~55 lbs (25 kg)
- **Price**: $9,000–$24,000 (1975)

## Repository Structure

| Path | Contents |
|------|----------|
| `emulator/` | Web-based IBM 5100 emulator (HTML/CSS/JS) |
| `mame/` | MAME v0.287 with IBM 5100/5110 support |
| `bridge/` | Python AI bridge (NVIDIA integration) |
| `archive/` | Documentation, ROMs, PALM assembly, historical materials |
| `docs/` | MAME documentation |

## Quick Start

### Web Emulator
Open `emulator/index.html` in any modern browser. Type `HELP` for commands.

### MAME Emulator
```bash
mame.exe ibm5100 -window -skip_gameinfo
```

### AI Bridge
```bash
pip install openai pyautogui
python bridge/IBM5100_BRIDGE.py
```

## Documentation Archive

The `archive/` directory contains 40+ original IBM documents:

- IBM 5100 Maintenance Manual (SY31-0405-2)
- APL & BASIC reference manuals
- PALM instruction set documentation
- IBM 5110/5120 service manuals
- CORE newsletters & brochures (1981-1984)
- VCF 2023 presentation materials
- Complete PALM side-scroller project

## Credits

- **Tom Stepleton** — IBM 5100 ROS extraction (2019)
- **Christian Corti** — IBM 5110 ROS extraction
- **MAMEdev** — The MAME emulator project
- **VCF Southwest** — 2023 PALM presentation
