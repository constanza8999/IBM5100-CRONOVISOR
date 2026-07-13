# AI Bridge

The `IBM5100_BRIDGE.py` script connects the MAME-based IBM 5100 emulator to **NVIDIA AI** through their API, creating a unique retro-futuristic interface.

## Features

- **AI Assistant**: Ask questions in Spanish through the IBM 5100 terminal
- **Time Travel**: Change the system's temporal context
- **Asset Auditing**: Scan and analyze USDT.z assets
- **PALM Injection**: Send commands directly to the IBM 5100's processor

## Installation

```bash
# Install dependencies
pip install openai pyautogui
```

## Configuration

1. Open `IBM5100_BRIDGE.py`
2. Set your NVIDIA API key:

```python
NVIDIA_API_KEY = "your-nvidia-api-key-here"
```

3. Verify the MAME directory path if needed

## Usage

```bash
python bridge/IBM5100_BRIDGE.py
```

The script will:
1. Launch MAME with the IBM 5100
2. Wait for the system to boot
3. Present a command prompt

### Commands

| Command | Function |
|---------|----------|
| `AI: <question>` | Send a question to NVIDIA AI (Spanish) |
| `VIAJE: <year>` | Time-travel — changes system year context |
| `AUDITAR` | Scan assets on the network |
| `#TS` | Timestamp command |
| `[ value` | Assignment (←) |
| `EXIT` | Exit the bridge |

### Examples

```
[2025] NVIDIA_CMD> AI: ¿Cuál es la arquitectura del procesador PALM?
[2025] NVIDIA_CMD> VIAJE: 2038
[2025] NVIDIA_CMD> AUDITAR
```

## How It Works

1. The script uses `pyautogui` to send keystrokes to the MAME window
2. Communication with NVIDIA uses the OpenAI-compatible API endpoint
3. The AI model (Meta Llama 3.1 405B) processes queries with a system prompt that provides context about the user, assets, and mission

## Troubleshooting

**"NVIDIA API KEY NOT DETECTED"**
Set your API key in the script. Get one from [NVIDIA's API catalog](https://build.nvidia.com/).

**MAME doesn't launch**
Check `MAME_DIR` in the script points to your MAME installation.

**Keystrokes not working**
Make sure the MAME window is active. Try running MAME in windowed mode.
