# Design Brief

## Direction

Game-Focused Minimalist — A single-player tic-tac-toe interface with brutalist clarity and electric teal accents.

## Tone

Brutalist/no-nonsense with sharp focus on gameplay; dark mode maximizes board visibility and reduces visual fatigue.

## Differentiation

Electric teal accent sparingly applied to player moves and interactive states, centered board composition with intentional negative space around the 3×3 grid.

## Color Palette

| Token      | OKLCH         | Role                       |
| ---------- | ------------- | -------------------------- |
| background | 0.12 0.0 0    | Page background (near-black) |
| foreground | 0.9 0.0 0     | Primary text               |
| card       | 0.16 0.0 0    | Game cell background       |
| primary    | 0.75 0.2 145  | Player accent (electric teal) |
| muted      | 0.2 0.0 0     | Secondary surface          |
| destructive| 0.55 0.22 25  | Warning/error state        |

## Typography

- Display: JetBrains Mono — game title and status labels
- Body: Figtree — game instructions and UI text
- Scale: title `text-4xl font-bold tracking-tight`, labels `text-sm font-semibold uppercase`, body `text-base`

## Elevation & Depth

No shadows; flat, layered surfaces with borders only. Game cells have minimal border contrast to maintain focus on piece state.

## Structural Zones

| Zone      | Background    | Border       | Notes                              |
| --------- | ------------- | ------------ | ---------------------------------- |
| Header    | bg-background | —            | Game title and current status      |
| Board     | bg-background | border-border| 3×3 grid cells with teal highlights |
| Controls  | bg-background | —            | Reset button and game state message |

## Spacing & Rhythm

Tight vertical rhythm (1rem gaps between zones) with centered board; spacious padding around game board to isolate it as the focal point.

## Component Patterns

- Buttons: square game cells (border-border, hover bg-primary/10, cursor-pointer)
- Active cells: text-primary (teal) for X moves, text-muted-foreground (dark) for O
- Reset button: primary accent background with bold typography

## Motion

- Hover: subtle 0.3s smooth transition on game cells (background fade)
- Entrance: none (instant state updates for gameplay clarity)
- Decorative: none

## Constraints

- No gradients or decorative elements
- Monochrome foundation with single accent color (teal) for interactions
- High contrast between player (X) and AI (O) via text color only
- Center the board; let negative space around it create focus
- Sharp borders (0-2px) for game grid; no rounded corners on cells

## Signature Detail

Electric teal accent applied only to player interactions (X moves and reset button hover), creating a visual indicator of player agency against an AI opponent.
