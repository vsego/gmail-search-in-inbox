# Publishing

## Before tagging a release

1. Update `version` in [manifest.source.json](manifest.source.json).
2. Run `./build.sh`.
3. Verify the Firefox package:

```bash
NO_UPDATE_NOTIFIER=1 web-ext lint --source-dir dist/gmail-search-in-inbox-firefox-v<version>.zip
```

4. Test the Firefox package with `about:debugging`.
5. Test the Chrome package with `chrome://extensions`.
6. Prepare screenshots in `assets/`.
7. Update icon source/artwork in `assets/` if needed.

## GitHub release flow

1. Commit the release changes.
2. Tag the release:

```bash
git tag v<version>
git push
git push origin v<version>
```

3. Wait for the GitHub Actions build to complete.
4. Download the built zip artifacts from GitHub Actions, or attach them to a GitHub Release.

## Firefox submission

1. Submit `dist/gmail-search-in-inbox-firefox-v<version>.zip` to AMO.
2. Add store listing text, screenshots, and links in the AMO dashboard.
3. Wait for approval/publication.

## Chrome submission

1. Submit the Chrome package contents to the Chrome Web Store.
2. Add store listing text, screenshots, and links in the dashboard.
3. Wait for publication.

## After publication

1. Add the Firefox and Chrome store URLs to [README.md](README.md).
2. Install the published versions locally from the store pages.
