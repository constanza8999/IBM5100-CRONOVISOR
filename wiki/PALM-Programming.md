# PALM Programming

The **PALM** (Put All Logic in Microcode) processor is the 16-bit CPU at the heart of the IBM 5100. It's a unique microprocessor where the instruction set is defined entirely in microcode.

## Architecture

- **Word size**: 16-bit
- **Addressing**: 16-bit address bus (64 KB addressable)
- **Microcode**: 32-bit microinstructions stored in ROS (Read-Only Storage)
- **Clock**: ~1.9 MHz (microcycle)
- **Registers**: 16 general-purpose (R0–R15)
- **Memory**: Up to 64 KB of RWS (Read-Write Storage)

## PALM Side-scroller Demo

The `archive/SIDESCROLLER/` directory contains a complete PALM assembly project — a demoscene-style horizontal side-scroller that runs on real IBM 5100 hardware.

### Files

| File | Description |
|------|-------------|
| `sidescroll.asm` | Main assembly source code |
| `sidescroll.bin` | Compiled binary |
| `palm_Assembly_REV3.xlsx` | Assembly reference workbook |
| `scroller_program_design_REV1.pdf` | Design documentation |
| `scroller_program_design_REV1.pptx` | Design presentation |
| `scroller_program_detailed_REV1.xlsx` | Detailed instruction trace |
| `go_sidescroll.bat` | Batch loader |
| `ibm5100.txt` | IBM 5100 emulator file |

### Running on Real Hardware

Load `sidescroll.bin` onto a DC300 tape cartridge (or use the MAME emulator's tape support). The program generates a real-time scrolling display on the 5-inch CRT.

### How It Works

The side-scroller demonstrates:

1. **CRT memory mapping**: Direct manipulation of the display buffer
2. **Tight loops**: Cycle-accurate timing for smooth scrolling
3. **Character generation**: Custom glyph encoding
4. **I/O control**: Tape drive and keyboard interaction

## Resources

- `archive/PDFs_5100/IBM5100_ISA_opcodes_micro-instruction_set.pdf` — Complete PALM instruction set
- `archive/PDFs_5100/misc1.pdf`, `misc2.pdf`, `misc3_mystery_program.pdf` — Additional technical notes
- `archive/PDFs_5100/AssemblerGenerator.pdf` — Assembler documentation
- `archive/PDFs_5100/equates.pdf` — System equates
- `archive/VCF2023/` — "PALM: The Processor That Powered the IBM 5100" presentation

## Example PALM Concepts

### Memory Map

```
0000–3FFF: RWS (main memory)
4000–7FFF: ROS (system firmware)
8000–BFFF: I/O space
C000–FFFF: Display buffer
```

### Key Instructions

PALM uses 16-bit instruction words. Common operations:

- `LDA addr` — Load accumulator from memory
- `STA addr` — Store accumulator to memory
- `ADD addr` — Add memory to accumulator
- `SUB addr` — Subtract memory from accumulator
- `JMP addr` — Jump to address
- `BZ addr` — Branch if zero
- `BNZ addr` — Branch if not zero

## Credits

The side-scroller was created and presented at **VCF Southwest 2025**. See the [YouTube demo](https://www.youtube.com/watch?v=sRAxKGkXC1I) and the December 2025 issue of COMPUTE! Gazette for the full backstory.
