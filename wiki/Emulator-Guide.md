# Emulator Guide

The IBM 5100 web emulator runs entirely in your browser. It simulates the original IBM 5100 terminal experience with both **BASIC** and **APL** interpreters.

## Getting Started

1. Open `emulator/index.html` in your browser
2. Watch the authentic boot sequence
3. When `READY` appears, type commands at the prompt
4. Press **Enter** to execute commands

## BASIC Mode

The emulator defaults to BASIC mode. Enter **numbered lines** to create programs:

```basic
10 PRINT "HELLO WORLD"
20 PRINT "WELCOME TO IBM 5100"
30 END
RUN
```

### Line Numbers
- Lines are automatically sorted by number
- Reusing a line number replaces the old line
- Line numbers can be any positive integer

### Commands

| Command | Description |
|---------|-------------|
| `RUN` | Execute the program |
| `LIST` | Display all program lines |
| `NEW` | Clear program memory |
| `PRINT <expr>` | Evaluate expression immediately |
| `GOTO <line>` | Jump to a line number |
| `<line> <code>` | Add/edit a program line |

### Examples

**Countdown:**
```basic
10 FOR I = 5 TO 1 STEP -1
20 PRINT I
30 NEXT I
40 PRINT "BLAST OFF!"
RUN
```

**Simple math:**
```basic
10 PRINT "AREA CALCULATOR"
20 A = 5
30 B = 10
40 PRINT A * B
RUN
```

## APL Mode

Switch to APL mode with `MODE APL`. APL uses special symbols:

| Symbol | Meaning | Example |
|--------|---------|---------|
| `+` | Add | `2+2` → 4 |
| `-` | Subtract | `5-3` → 2 |
| `×` | Multiply | `3×4` → 12 |
| `÷` | Divide | `10÷2` → 5 |
| `()` | Grouping | `(2+3)×4` → 20 |

Return to BASIC with `MODE BASIC`.

## General Commands

| Command | Description |
|---------|-------------|
| `HELP` | Display command reference |
| `INFO` | System information |
| `CLEAR` | Clear terminal (preserves boot log) |
| `TIME TRAVEL` | 🥚 Easter egg |
| `OKABE` | 🥚 El Psy Kongroo |

## Tips

- The boot log is preserved when you use `CLEAR`
- Use the function buttons (HELP, RUN, LIST, NEW, CLR) for quick access
- Programs are held in memory until you use `NEW` or refresh the page
- There's a 500-iteration loop guard to prevent infinite loops
