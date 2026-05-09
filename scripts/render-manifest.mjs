import fs from "node:fs";
import path from "node:path";

const [, , browser, outputPath] = process.argv;

if (!browser || !outputPath) {
  console.error("Usage: node scripts/render-manifest.mjs <firefox|chrome> <output-path>");
  process.exit(1);
}

const rootDir = path.resolve(import.meta.dirname, "..");
const sourcePath = path.join(rootDir, "manifest.source.json");
const source = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const browserManifest = source.browser_manifests?.[browser];

if (!browserManifest) {
  console.error(`Unknown browser manifest: ${browser}`);
  process.exit(1);
}

const {browser_manifests: _browserManifests, ...sharedManifest} = source;
const manifest = {
  manifest_version: browserManifest.manifest_version,
  ...sharedManifest,
  ...Object.fromEntries(
    Object.entries(browserManifest).filter(([key]) => key !== "manifest_version")
  )
};

fs.mkdirSync(path.dirname(outputPath), {recursive: true});
fs.writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`);
