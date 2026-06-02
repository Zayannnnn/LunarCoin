#!/usr/bin/env bash
set -euo pipefail

ARTIFACT="${1:-}"

if [[ -z "$ARTIFACT" ]]; then
  echo "Usage: bash scripts/verify-macos-artifact.sh <path-to-app-or-zip>"
  exit 1
fi

WORK_DIR="$(mktemp -d /tmp/lunar-verify.XXXXXX)"
cleanup() {
  rm -rf "$WORK_DIR"
}
trap cleanup EXIT

resolve_app_path() {
  local input="$1"

  if [[ "$input" == *.app ]]; then
    printf '%s\n' "$input"
    return
  fi

  if [[ "$input" == *.zip ]]; then
    unzip -q "$input" -d "$WORK_DIR"
    find "$WORK_DIR" -maxdepth 2 -name '*.app' | head -n 1
    return
  fi

  if [[ "$input" == *.dmg ]]; then
    hdiutil attach -nobrowse -readonly -mountpoint "$WORK_DIR/mount" "$input" >/dev/null
    find "$WORK_DIR/mount" -maxdepth 2 -name '*.app' | head -n 1
    return
  fi

  echo "Unsupported artifact type: $input" >&2
  exit 1
}

APP_PATH="$(resolve_app_path "$ARTIFACT")"
if [[ -z "$APP_PATH" || ! -d "$APP_PATH" ]]; then
  echo "Unable to locate .app bundle in: $ARTIFACT" >&2
  exit 1
fi

echo "Verifying app bundle: $APP_PATH"
echo

echo "== Bundle structure =="
/usr/libexec/PlistBuddy -c "Print CFBundleIdentifier" "$APP_PATH/Contents/Info.plist"
/usr/libexec/PlistBuddy -c "Print CFBundleExecutable" "$APP_PATH/Contents/Info.plist"
/usr/libexec/PlistBuddy -c "Print LSMinimumSystemVersion" "$APP_PATH/Contents/Info.plist"
ls -la "$APP_PATH/Contents/MacOS/"
echo

echo "== Executable architectures =="
file "$APP_PATH/Contents/MacOS/"*
if [[ -f "$APP_PATH/Contents/Frameworks/Electron Framework.framework/Versions/A/Electron Framework" ]]; then
  file "$APP_PATH/Contents/Frameworks/Electron Framework.framework/Versions/A/Electron Framework"
fi
echo

echo "== codesign --verify --deep --strict =="
set +e
codesign --verify --deep --strict "$APP_PATH" 2>&1
CODESIGN_EXIT=$?
set -e
echo "exit: $CODESIGN_EXIT"
echo

echo "== spctl -a -vv =="
set +e
spctl -a -vv "$APP_PATH" 2>&1
SPCTL_EXIT=$?
set -e
echo "exit: $SPCTL_EXIT"
echo

echo "== codesign -dv =="
codesign -dv --verbose=4 "$APP_PATH" 2>&1 || true
echo

if [[ "$ARTIFACT" == *.zip ]]; then
  echo "== zip integrity =="
  unzip -t "$ARTIFACT" | tail -3
  echo
fi

if [[ "$CODESIGN_EXIT" -ne 0 ]]; then
  echo "FAIL: codesign verification failed."
  exit "$CODESIGN_EXIT"
fi

echo "PASS: Bundle structure and codesign verification succeeded."
if [[ "$SPCTL_EXIT" -ne 0 ]]; then
  echo "NOTE: spctl may reject beta/ad-hoc builds until notarized. Users can launch via right-click -> Open."
fi
