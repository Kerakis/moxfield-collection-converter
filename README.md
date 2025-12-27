# Moxfield Deck Converter

A minimalistic web application that converts Moxfield CSV collection exports to the Moxfield text format.

## Usage

### Input Format

The application expects a CSV file with the following columns:

- `Count`: Number of copies (e.g., 2, 1, 4)
- `Name`: Card name
- `Edition`: Set code (e.g., ZEN, LTB)
- `Collector Number`: Card collector number
- `Foil`: Foil status (empty, "foil", or "etched")

### Output Format

Each line in the output follows this format:

```
{Count} {Name} ({Edition}) {Collector Number} {Foil}
```

Where foil markers are:

- `*F*` for regular foil
- `*E*` for etched foil
- Empty for non-foil

Example:

```
2 Mountain (ZEN) 123
1 Lightning Bolt (LTB) 456 *F*
3 Forest (STX) 789 *E*
```

## Technologies

- **Svelte 5**: Progressive JavaScript framework
- **Vite**: Next generation build tool
- **TailwindCSS**: Utility-first CSS framework
- **TypeScript**: Typed JavaScript

## License

MIT
