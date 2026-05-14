# GMail: search in inbox

<img src="assets/icon.svg" alt="" width="96" height="96">

Firefox and Chromium extension that adds a search-in-inbox button to Gmail's search UI. Clicking it appends `in:inbox` to the current Gmail search query and runs the search.

Shortcut: focus Gmail's search box and press `Ctrl+Enter`. On macOS, `Cmd+Enter` also works.

Firefox Add-ons: https://addons.mozilla.org/en-US/firefox/addon/gmail-search-in-inbox/
Chrome Web Store: https://chromewebstore.google.com/detail/gmail-search-in-inbox/ocfhcfembeelbebmfodaipfdejcgoedl

## Install in Firefox

1. Download the Firefox package from the latest GitHub Actions build or release.
2. Open Firefox and go to `about:debugging#/runtime/this-firefox`.
3. Click `Load Temporary Add-on...`.
4. Select the downloaded Firefox zip file.
5. Open or reload Gmail.

Temporary add-ons are removed when Firefox restarts.

## Install in Chrome or another Chromium browser

1. Download the Chrome package from the latest GitHub Actions build or release.
2. Unpack the downloaded zip file.
3. Open `chrome://extensions/`.
4. Enable `Developer mode`.
5. Click `Load unpacked` and select the unpacked directory.

## Build packages

Run:

```bash
./build.sh
```

This creates:

- `dist/gmail-search-in-inbox-firefox-v1.0.0.zip`
- `dist/gmail-search-in-inbox-chrome-v1.0.0.zip`
- `dist/manifest.firefox.json`
- `dist/manifest.chrome.json`

`manifest.source.json` is the source of truth for extension metadata. The generated manifests in `dist/` are browser-specific build outputs. For local Firefox temporary installs, use the built Firefox zip from `dist/`.

See [PUBLISHING.md](PUBLISHING.md) for the release and store submission flow.

## Store assets

Store screenshots and source artwork can live in `assets/`.

`assets/icon.svg` is the source icon. `build.sh` renders PNG icons from it and includes them in extension packages.
