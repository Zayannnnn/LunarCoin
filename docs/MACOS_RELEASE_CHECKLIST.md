# macOS Release Checklist — LunarCoin Miner

Use this checklist for every desktop release. Do not upload unsigned or partially signed artifacts.

## Root cause reference

The `"damaged and can't be opened"` dialog on macOS is caused by **broken ad-hoc linker signatures** when `"identity": null` disables bundle signing. The ZIP itself is valid; Gatekeeper rejects the inconsistent signature and shows a misleading *damaged* message.

Beta builds must be **ad-hoc signed with hardened runtime entitlements**. Production builds must be **Developer ID signed, notarized, and stapled**.

---

## 1. Build

### Beta (no Apple Developer credentials)

Apple Silicon:

```bash
cd lunar-coin-blockchain-explorer
npm ci
npm run dist:mac:arm64
```

Intel:

```bash
cd lunar-coin-blockchain-explorer
npm ci
npm run dist:mac:x64
```

Outputs:

- `release/LunarCoinMiner-mac-arm64.zip` and `.dmg`
- `release/LunarCoinMiner-mac-x64.zip` and `.dmg`

For backward-compatible download URLs, rename the Apple Silicon ZIP when uploading:

```bash
cp release/LunarCoinMiner-mac-arm64.zip release/LunarCoinMiner-mac.zip
```

### Release (Developer ID + notarization)

```bash
export APPLE_SIGNING_IDENTITY="Developer ID Application: Your Name (TEAMID)"
export APPLE_ID="you@example.com"
export APPLE_APP_SPECIFIC_PASSWORD="xxxx-xxxx-xxxx-xxxx"
export APPLE_TEAM_ID="TEAMID"

cd lunar-coin-blockchain-explorer
npm ci
npm run dist:mac:release
```

---

## 2. Sign

Signing is handled automatically by `electron/sign-macos.js` during `electron-builder`.

| Build type | Identity | Hardened runtime | Entitlements |
|---|---|---|---|
| Beta | ad-hoc (`-`) | yes | `electron/entitlements.mac.plist` |
| Release | Developer ID Application | yes | same + inherit plist |

Manual re-sign (only if needed):

```bash
LUNARCOIN_MAC_SIGNING=beta node -e "require('./electron/sign-macos.js').default({ app: 'release/mac-arm64/LunarCoin Miner.app' })"
```

---

## 3. Notarize

Automatic when release env vars are set (`electron/notarize-macos.js`).

Manual notarization:

```bash
xcrun notarytool submit release/LunarCoinMiner-mac-arm64.zip \
  --apple-id "$APPLE_ID" \
  --password "$APPLE_APP_SPECIFIC_PASSWORD" \
  --team-id "$APPLE_TEAM_ID" \
  --wait
```

Beta/ad-hoc builds are **not notarized** and will show Gatekeeper prompts until the user chooses **Open**.

---

## 4. Staple

After notarization succeeds (release builds only):

```bash
xcrun stapler staple "release/mac-arm64/LunarCoin Miner.app"
```

Re-package ZIP/DMG after stapling if the staple was applied post-build.

---

## 5. Zip

`electron-builder` produces ZIP targets automatically. Do not re-zip manually unless you stapled after build; manual zipping can strip extended attributes incorrectly.

If you must re-zip:

```bash
ditto -c -k --keepParent "release/mac-arm64/LunarCoin Miner.app" release/LunarCoinMiner-mac-arm64.zip
```

---

## 6. Upload Release Asset

Upload to GitHub Releases:

| Asset | Architecture | Suggested URL name |
|---|---|---|
| `LunarCoinMiner-mac-arm64.zip` | Apple Silicon | `LunarCoinMiner-mac.zip` (alias) |
| `LunarCoinMiner-mac-x64.zip` | Intel | keep `-x64` suffix |
| `LunarCoinMiner-mac-arm64.dmg` | Apple Silicon | optional |
| `LunarCoinMiner-mac-x64.dmg` | Intel | optional |

Verify before upload:

```bash
npm run verify:mac -- release/LunarCoinMiner-mac-arm64.zip
```

---

## Verification commands

### Apple Silicon (arm64)

```bash
curl -fsSL -o /tmp/LunarCoinMiner-mac-arm64.zip "<release-url>"
unzip -q /tmp/LunarCoinMiner-mac-arm64.zip -d /tmp/lunar-arm64
APP="/tmp/lunar-arm64/LunarCoin Miner.app"

xattr -dr com.apple.quarantine "$APP" 2>/dev/null || true
codesign --verify --deep --strict "$APP"
spctl -a -vv "$APP"
file "$APP/Contents/MacOS/"*
npm run verify:mac -- /tmp/LunarCoinMiner-mac-arm64.zip
```

Expected beta results:

- `codesign --verify` → exit `0`
- `spctl -a -vv` → `rejected` (until notarized)
- Launch via **right-click → Open** (first launch only)

### Intel (x64)

```bash
curl -fsSL -o /tmp/LunarCoinMiner-mac-x64.zip "<release-url>"
unzip -q /tmp/LunarCoinMiner-mac-x64.zip -d /tmp/lunar-x64
APP="/tmp/lunar-x64/LunarCoin Miner.app"

xattr -dr com.apple.quarantine "$APP" 2>/dev/null || true
codesign --verify --deep --strict "$APP"
spctl -a -vv "$APP"
file "$APP/Contents/MacOS/"*
npm run verify:mac -- /tmp/LunarCoinMiner-mac-x64.zip
```

Expected architecture:

- Apple Silicon build → `Mach-O 64-bit executable arm64`
- Intel build → `Mach-O 64-bit executable x86_64`

---

## End-user beta install steps

1. Download ZIP from GitHub Releases.
2. Unzip and move `LunarCoin Miner.app` to `/Applications`.
3. If macOS blocks launch, run:

```bash
xattr -dr com.apple.quarantine "/Applications/LunarCoin Miner.app"
```

4. Right-click the app → **Open** → confirm **Open**.

This avoids the misleading *damaged* dialog caused by the previous unsigned release.

---

## Auto-update compatibility

`package.json` includes GitHub `publish` provider metadata for future `electron-updater` integration. Signed + notarized release artifacts remain compatible with Squirrel/Electron auto-update channels.

---

## Files in this pipeline

| File | Purpose |
|---|---|
| `package.json` | electron-builder targets, scripts, publish config |
| `electron/sign-macos.js` | ad-hoc (beta) or Developer ID (release) signing |
| `electron/notarize-macos.js` | Apple notarization hook |
| `electron/entitlements.mac.plist` | hardened runtime entitlements |
| `electron/entitlements.mac.inherit.plist` | helper/framework inherit entitlements |
| `scripts/verify-macos-artifact.sh` | pre-upload verification |
