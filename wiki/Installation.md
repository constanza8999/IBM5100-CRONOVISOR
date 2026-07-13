# Installation Guide

## Web Emulator (No Installation Required)

The web emulator runs entirely in your browser:

1. Navigate to `emulator/index.html`
2. Double-click to open
3. Wait for boot sequence
4. Start typing commands

Works in all modern browsers (Chrome, Firefox, Edge, Safari).

## MAME Integration

### Windows

The included `mame.exe` runs directly:

```bash
mame.exe ibm5100 -window
```

### Linux

MAME requires compilation on Linux:

```bash
# Install dependencies
sudo apt-get install build-essential git python3 libsdl2-dev libflac-dev libjpeg-dev

# Clone MAME
git clone https://github.com/mamedev/mame.git
cd mame

# Build (this takes a while)
make SUBTARGET=mess

# Copy ROMs
cp -r /path/to/roms/ibm5100 roms/
./mame ibm5100
```

### macOS

```bash
# Using Homebrew
brew install mame

# Or compile from source
git clone https://github.com/mamedev/mame.git
cd mame
make
```

## AI Bridge

### Prerequisites

- Python 3.8+
- NVIDIA API key

### Setup

```bash
# Clone the repository
git clone https://github.com/constanza8999/IBM5100-Ultimate.git
cd IBM5100-Ultimate

# Install Python dependencies
pip install openai pyautogui

# Configure your API key
# Edit bridge/IBM5100_BRIDGE.py and set NVIDIA_API_KEY

# Run the bridge
python bridge/IBM5100_BRIDGE.py
```

### Get an NVIDIA API Key

1. Visit [NVIDIA's API catalog](https://build.nvidia.com/)
2. Sign up for an account
3. Generate an API key
4. Add it to `IBM5100_BRIDGE.py`

## PALM Assembly Development

### Tools Needed

- PALM assembler (see `archive/PDFs_5100/AssemblerGenerator.pdf`)
- MAME emulator for testing
- Optional: DC300 tape drive for real hardware

### Workflow

1. Edit `.asm` files with a text editor
2. Assemble using the PALM assembler
3. Load binary into MAME or real hardware
4. Test and debug

## Troubleshooting

**Emulator doesn't start**
- Make sure JavaScript is enabled
- Try a modern browser (Chrome 90+, Firefox 88+, Edge 90+)
- Check for browser console errors (F12)

**MAME shows "ROM missing"**
- Verify `roms/ibm5100/` contains the `.ros` files
- Check that `mame.ini` has the correct ROM path

**AI Bridge "API Key not detected"**
- Set `NVIDIA_API_KEY` in `IBM5100_BRIDGE.py`
- Verify your API key is active
- Check internet connectivity
