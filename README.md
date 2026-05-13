# Virtual Whiteboard

A feature-rich virtual whiteboard built with React as a hands-on learning project. Draw, write, erase, and export your work — all in the browser.

**Live Demo:** [virtual-white-board-seven.vercel.app](https://virtual-white-board-seven.vercel.app/)

**Repository:** [github.com/Han9128/virtual_white_board](https://github.com/Han9128/virtual_white_board)

## Features

### Drawing Tools
- **Brush** — freehand drawing with smooth strokes
- **Line** — straight lines
- **Rectangle** — rectangles and squares
- **Circle** — ellipses and circles
- **Arrow** — directional arrows
- **Text** — clickable text input anywhere on the canvas
- **Eraser** — erase individual elements by clicking or dragging

### Tool Configuration
- **Stroke color** — pick from presets or use the color picker
- **Fill color** — for shapes, with a no-fill option
- **Size** — adjustable stroke width and font size

### History
- **Undo** — `Ctrl + Z` or toolbar button
- **Redo** — `Ctrl + Y` or toolbar button
- Each action (draw, erase, text) is individually undoable
- Erasing multiple elements in one stroke creates separate undo steps

### Export
- **Download** — saves the canvas as a PNG image

---

## Tech Stack

| Library | Purpose |
|---|---|
| [React](https://react.dev/) | UI framework |
| [Rough.js](https://roughjs.com/) | Sketchy/hand-drawn style shapes |
| [Perfect Freehand](https://github.com/steveruizok/perfect-freehand) | Smooth brush strokes |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| [React Icons](https://react-icons.github.io/react-icons/) | Toolbar icons |

---

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/Han9128/virtual_white_board
cd virtual_white_board

# Install dependencies
npm install

# Start the development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

---

## Project Structure

```
src/
├── components/
│   ├── Board/          # Canvas rendering and mouse event handling
│   ├── ToolBar/        # Tool selection sidebar
│   └── ToolConfigBox/  # Stroke, fill, and size controls
├── store/
│   ├── BoardProvider.js      # Drawing state, history, undo/redo
│   ├── ToolBarProvider.js    # Active tool state
│   └── ToolConfigProvider.js # Per-tool color and size config
├── constants/
│   └── constants.js    # Tool definitions, color palette, type lists
└── utils/
    ├── generateRoughEle.js   # Creates rough.js elements by tool type
    └── math.js               # Arrow coordinate calculations
```

---

## Architecture

State is managed with **React Context + useReducer** across three providers:

- **BoardProvider** — owns the `elements` array, drawing history, and all canvas actions
- **ToolBarProvider** — tracks which tool is currently selected
- **ToolConfigProvider** — stores per-tool configuration (color, fill, size)

The `Board` component renders everything onto an HTML `<canvas>` using `useLayoutEffect` to redraw synchronously whenever `elements` changes.

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + Z` | Undo |
| `Ctrl + Y` | Redo |

---

## Learning Notes

This project was built as a React learning exercise. Concepts explored and documented in [learning.md](learning.md):

- `useRef` — accessing DOM elements directly
- `useEffect` / `useLayoutEffect` — side effects and canvas rendering
- `useReducer` — managing complex state with actions
- `useContext` — sharing state across components without prop drilling
- `useCallback` — memoizing functions to prevent unnecessary re-renders
- Immutable state updates — avoiding direct mutation in reducers
