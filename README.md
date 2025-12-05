# Web Serial Terminal [![Ask DeepWiki](<https://deepwiki.com/badge.svg>)](<https://deepwiki.com/NanashiTheNameless/SerialTerminal>)

A nice looking serial terminal in the web. Open-Source, free, and easy to use.

This version: [serial.namelessnanashi.dev](<https://serial.namelessnanashi.dev>)

Static Offline Builds are available under [Releases](<https://github.com/NanashiTheNameless/SerialTerminal/releases/latest>).

## The original is: [SpacehuhnTech/serialterminal](<https://github.com/SpacehuhnTech/serialterminal>)

## Features

- Direct serial port communication via Web Serial API
- Real-time terminal output with timestamps
- Configurable baud rates (50 - 4000000)
- Clean, modern Material-UI interface
- Customizable keyboard shortcuts (Ctrl+L to clear, Ctrl+K for settings)
- Desktop browser support (Chrome, Edge, Opera, Ungoogled Chromium)
- Control character support (Ctrl+C, Ctrl+D)
- Persistent settings via localStorage
- Accessibility features with ARIA labels
- Error boundary for graceful error handling

## Browser Compatibility

This tool requires the [Web Serial API](<https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API>), which is supported in:

- Ungoogled Chromium 89+
- Chrome/Chromium 89+
- Edge 89+
- Opera 75+

### not supported on:
- Firefox (not yet supported)
- Safari (not supported)
- Mobile browsers (not supported due to API limitations)

## Keyboard Shortcuts

- `Ctrl+K` - Open settings
- `Ctrl+L` - Clear terminal history (disabled by default, enable in settings)
- `Ctrl+C` - Send control character (when enabled in settings)
- `Ctrl+D` - Send control character (when enabled in settings)
- `Enter` - Send command

## Development

### Prerequisites

- Node.js 18+ and Yarn 4+
- A browser with WebSerial support

### Local testing/running

```sh
git clone https://github.com/NanashiTheNameless/SerialTerminal
cd SerialTerminal
./localTest.sh
```

The application will open at `http://localhost:3000`

### Building

```sh
yarn build
```

Output will be in the `build/` directory.

### Linting

```sh
yarn lint          # Check for errors
yarn lint:fix      # Auto-fix errors
```

## Local Offline Building

```sh
git clone https://github.com/NanashiTheNameless/SerialTerminal
cd SerialTerminal
bash buildOffline.sh
```

## Troubleshooting

### "Serial not supported" error

- Ensure you're using a Chromium-based browser (Chrome, Edge, Opera)
- Check that you're not on a mobile device
- Verify the browser version supports Web Serial API

### Device not appearing in port selection

- Check USB cable connection
- Ensure device drivers are installed
- Try unplugging and replugging the device
- Check if another application is using the serial port

### Connection drops unexpectedly

- Check physical USB connection
- Verify baud rate matches your device
- Check device power supply
- Review browser console for error messages

### Changes to baud rate not taking effect

- Baud rate changes require disconnecting and reconnecting
- Current connection must be closed first

## License

This software is licensed under the MIT License. See the [license file](<LICENSE>) for details.

### Font License

This project uses the amazing [0xProto](<https://github.com/0xType/0xProto>) font family, which is licensed under the [SIL Open Font License, Version 1.1](<public/fonts/0xProto/LICENSE>).

Copyright (c) 2024, 0xType Project Authors (<https://github.com/0xType>)
