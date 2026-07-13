# IBM 5100 Emulator
A web-based emulator of the **IBM 5100**, one of the first portable computers released in **1975**. Experience the classic green-phosphor CRT terminal and run programs in **BASIC** or **APL**, just like the original machine.

## Features
- **BASIC Mode**:  
  - Enter numbered lines or inline `print` statements  
  - Commands: `run`, `list`, `new`, `print <expr>`  
- **APL Mode**:  
  - Minimal APL evaluation with `×` → `*`, `÷` → `/`  
  - Example: `2+2`, `3×4`, `10÷2`  
- **Global Commands**:  
  - `help` – display available commands  
  - `info` – IBM 5100 info  
  - `clear` – clear the terminal (retains boot log)  
  - Fun Easter eggs: `time travel`, `okabe`  
- **Nostalgic Boot Sequence** simulating the original IBM 5100 startup.

## Usage

1. Clone or download this repository.  
2. Open `index.html` in your browser.  
3. Type commands into the terminal prompt and press **Enter**.

### Using BASIC Mode
- Enter **numbered lines** to create a program, e.g.:  
10 print "HELLO WORLD"
20 print 2+2
- Commands:  
- `run` – execute your program  
- `list` – display all program lines  
- `new` – clear the program  
- `print <expression>` – evaluate a quick expression immediately  
- Switch to BASIC mode (if in APL) with:  mode basic

### Using APL Mode
- Enter simple calculations using `+`, `-`, `×` (multiplication), and `÷` (division), e.g.:  2+2,  3×4,  10÷2
  
## Built With

- HTML  
- CSS  
- JavaScript
