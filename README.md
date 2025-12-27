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

## Development

### Setup

```bash
npm install
```

### Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

## Deployment to GitHub Pages

### Prerequisites

1. Ensure your repository is on GitHub
2. Repository should be named `moxfield-collection-converter` (or update the `base` in `vite.config.ts`)

### Automatic Deployment

The project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically builds and deploys to GitHub Pages on every push to the `main` branch.

### Manual Setup

1. Push your code to the `main` branch
2. Go to your repository settings on GitHub
3. Navigate to Pages section
4. Ensure "Deploy from a branch" is selected
5. Select the branch where the workflow runs and the `/root` folder (or use actions workflow)

The app will be live at: `https://<your-username>.github.io/moxfield-collection-converter/`

## Project Structure

```
├── src/
│   ├── App.svelte              # Main application component
│   ├── main.ts                 # Application entry point
│   ├── app.css                 # Global styles
│   └── lib/
│       └── moxfieldConverter.ts # CSV parsing and conversion logic
├── index.html                   # HTML entry point
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
└── .github/workflows/
    └── deploy.yml              # GitHub Actions deployment workflow
```

## Technologies

- **Svelte 5**: Progressive JavaScript framework
- **Vite**: Next generation build tool
- **TailwindCSS**: Utility-first CSS framework
- **TypeScript**: Typed JavaScript

## License

MIT
