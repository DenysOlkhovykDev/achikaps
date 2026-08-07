# Achikaps

A small resource-management game prototype built with PixiJS, TypeScript, and
Vite. Connect buildings, automate production and delivery, construct an Engine,
and use it to explore the world.

## Gameplay

- Select a Platform to open the construction menu.
- Pick a building and place its blueprint on the map.
- Builder workers collect the required resources automatically.
- Production workers operate buildings, while delivery workers move ingredients
  through the road network.
- Windmills generate Batteries, one of the components required to construct an
  Engine.
- Select an Engine to reveal the on-screen joystick. You can also steer with
  `WASD` or the arrow keys.

## Local development

Requires a current Node.js LTS release.

```bash
npm install
npm run dev
```

Vite prints the local URL after startup (normally `http://localhost:5173`).

## Useful commands

```bash
npm run dev        # start the development server
npm run typecheck  # run the strict TypeScript check
npm run build      # create a production build in dist/
npm run check      # typecheck and build
npm test           # run Playwright visual scenarios
```

Playwright needs its Chromium runtime before the first test run:

```bash
npx playwright install chromium
```

## Project structure

- `src/buildings` — buildings, blueprints, construction recipes, and animation.
- `src/resources` — resource models and visuals.
- `src/workers` — worker movement and job execution.
- `src/dashboard` — task scheduling and route selection.
- `src/tutorial-overlay` — pointers, compass, and messages.
- `tests/scenarios` — deterministic visual gameplay scenarios.

See `IMPROVEMENTS.md` for the latest maintenance and gameplay pass.
