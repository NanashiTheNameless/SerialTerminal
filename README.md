# SerialTerminal (Electron fuckery branch)

> ⚠️ This is a personal “just-for-fun” experiment branch. It is **unofficial, unsupportable, and offered as-is**. Use it only if you enjoy tinkering.
>
> - No maintenance, no warranties, no releases, and it may break/dissappear at any time.
> - Not for production use; Please don’t file issues or support requests based on this branch.

A minimal Electron wrapper around <https://serial.namelessnanashi.dev> that enables Web Serial on the desktop with a native serial-port picker and packaging for Linux/Windows/macOS.

## Features

- Loads the web SerialTerminal app inside an Electron shell (WebSerial enabled via `enableBlinkFeatures: 'Serial'`).
- Custom serial-port picker dialog (replaces the default Chromium picker) with IPC bridge.
- Context menu for copy/paste/select all and element inspection (when debugging).
- Cross‑platform icons and build targets (deb/rpm/AppImage, NSIS, dmg universal).

## Requirements

- Node.js 18+ (Electron 28 compatible).
- Yarn 4 (managed via Corepack).
- macOS, Windows, or Linux with serial devices accessible to the user.

## Setup

```bash
corepack enable
corepack prepare yarn@4.12.0 --activate   # optional: pin to repo version
yarn install
```

## Develop / Run

```bash
yarn start           # launch the app
# add --debug to open DevTools automatically
yarn start -- --debug
```

## Build

```bash
yarn build           # build for current platform
# or platform-specific
yarn build:linux
yarn build:win
yarn build:mac
# or all supported targets
yarn build:all
```

Artifacts are produced in `dist/` (per electron-builder defaults).

## Files

- `main.js` — creates the BrowserWindow, enables WebSerial, handles serial port selection, and sets menus.
- `preload.js` — exposes minimal version info via `window.electron`.
- `port-picker.html` — modal dialog UI for selecting a serial port.

## Notes

- Serial permission checks are allowed by default in the session handlers.
- Bluetooth is disabled on launch to avoid BlueZ LL privacy log noise.
- The app loads the hosted web UI; network access to `serial.namelessnanashi.dev` is required at runtime.


## License

MIT. See `LICENSE`.
