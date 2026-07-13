# MAME Integration

This project includes **MAME 0.287** with full IBM 5100 and IBM 5110 ROM support for the most accurate emulation experience.

## Requirements

- **Windows**: Run the included `mame.exe` directly
- **Linux/macOS**: You'll need to compile MAME from source (see [MAMEdev.org](https://www.mamedev.org))

## Quick Start

```bash
mame.exe ibm5100 -window
```

On first launch, MAME shows a "WARNING: the game is not working" screen. Press `OK` to continue. The IBM 5100 will boot into its self-test, then the APL prompt (`#`) will appear.

### Skip Warnings

```bash
mame.exe ibm5100 -window -skip_gameinfo
```

## Keyboard Controls

| Key | IBM 5100 Function |
|-----|-------------------|
| **Enter** | ↵ (Return) |
| **Backspace** | ← (Backspace) |
| **Shift+Enter** | ATTN (Attention) |
| **Ctrl+Z** | RST (Reset) |
| **F1** | PROCEED |
| **F2** | EXECUTE |
| **F3** | PRINT |
| **F4** | CH (Channel) |
| **F5** | SYS (System) |
| **F6** | ADV (Advance) |
| **F7** | BACK |
| **F8** | STOP |
| **Esc** | Enter/Exit MAME console |

## ROM Files

The IBM 5100 ROMs (ROS — Read-Only Storage) are in `roms/ibm5100/`:

| File | Description |
|------|-------------|
| `c2.ros` | System ROS (lower) |
| `c4.ros` | System ROS (upper) |
| `d2.ros` | System ROS continuation |
| `d4.ros` | System ROS continuation |
| `e2.ros` | I/O control microcode |
| `h2.ros` | Display character generator (lower) |
| `h4.ros` | Display character generator (upper) |
| `j2.ros` | Additional system routines |

### Extraction Credits

- **IBM 5100**: Tom Stepleton (2019) — used innovative OCR on die photographs
- **IBM 5110**: Christian Corti — used startup address line steering technique
- **Display font**: Reconstructed by matching original output

## IBM 5110

To run the IBM 5110 (a more advanced model):

```bash
mame.exe ibm5110 -window
```

The IBM 5110 has a built-in floppy drive (optional on the 5100) and different ROM layout.

## MAME Controls

| Key | Function |
|-----|----------|
| **Pause** | Pause emulation |
| **F11** | Toggle throttle (full speed) |
| **Scroll Lock** | Toggle speed display |
| **Tab** | MAME menu |
| **~** | MAME console |
| **F4** | Toggle UI |

## Configuration

The `cfg/` directory stores MAME configurations. The `ui.ini` file in the root controls display and UI settings.

