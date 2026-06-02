const { execFileSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const ENTITLEMENTS = path.join(__dirname, 'entitlements.mac.plist')
const ENTITLEMENTS_INHERIT = path.join(__dirname, 'entitlements.mac.inherit.plist')

function collectSignables(appPath) {
  const signables = []

  function walk(currentPath) {
    if (!fs.existsSync(currentPath)) return

    let stat
    try {
      stat = fs.lstatSync(currentPath)
    } catch {
      return
    }

    if (stat.isDirectory()) {
      if (currentPath.endsWith('.app') || currentPath.endsWith('.framework') || currentPath.endsWith('.xpc')) {
        signables.push(currentPath)
      }

      for (const entry of fs.readdirSync(currentPath)) {
        walk(path.join(currentPath, entry))
      }
      return
    }

    if (!stat.isFile()) return

    try {
      execFileSync('file', ['-b', currentPath], { encoding: 'utf8' })
    } catch {
      return
    }

    const fileType = execFileSync('file', ['-b', currentPath], { encoding: 'utf8' })
    if (fileType.includes('Mach-O')) {
      signables.push(currentPath)
    }
  }

  walk(appPath)
  return [...new Set(signables)].sort((a, b) => b.length - a.length)
}

function signPath(targetPath, identity, inherit) {
  const args = [
    '--force',
    '--sign',
    identity,
    '--options',
    'runtime',
    '--timestamp=none',
    '--entitlements',
    inherit ? ENTITLEMENTS_INHERIT : ENTITLEMENTS,
  ]

  args.push(targetPath)
  execFileSync('codesign', args, { stdio: 'inherit' })
}

function resolveIdentity() {
  if (process.env.APPLE_SIGNING_IDENTITY) {
    return process.env.APPLE_SIGNING_IDENTITY
  }

  if (process.env.CSC_NAME) {
    return process.env.CSC_NAME
  }

  if (process.env.LUNARCOIN_MAC_SIGNING === 'beta') {
    return '-'
  }

  if (process.env.CSC_IDENTITY_AUTO_DISCOVERY === 'false') {
    return '-'
  }

  try {
    const identities = execFileSync(
      'security',
      ['find-identity', '-v', '-p', 'codesigning'],
      { encoding: 'utf8' },
    )
    const developerId = identities
      .split('\n')
      .map((line) => line.match(/"([^"]+)"/))
      .filter(Boolean)
      .map((match) => match[1])
      .find((name) => name.startsWith('Developer ID Application:'))

    if (developerId) {
      return developerId
    }
  } catch {
    // Fall through to explicit failure for release builds.
  }

  return null
}

/**
 * Custom macOS signing hook for electron-builder.
 * Beta builds ad-hoc sign the bundle; release builds use Developer ID when configured.
 */
exports.default = async function signMac(configuration) {
  const appPath = configuration.app || configuration.appPath
  if (!appPath || process.platform !== 'darwin') {
    return
  }

  const identity = resolveIdentity()
  if (!identity) {
    throw new Error(
      '[macos-sign] No signing identity found. Use dist:mac:beta for ad-hoc builds or set APPLE_SIGNING_IDENTITY for release builds.',
    )
  }

  console.log(`[macos-sign] Signing ${appPath} with identity: ${identity === '-' ? 'adhoc (-)' : identity}`)

  for (const targetPath of collectSignables(appPath)) {
    const inherit =
      targetPath.endsWith('.framework') ||
      targetPath.includes('.framework/Versions/') ||
      targetPath.endsWith('.xpc')
    signPath(targetPath, identity, inherit)
  }

  signPath(appPath, identity, false)

  execFileSync('codesign', ['--verify', '--deep', '--strict', '--verbose=2', appPath], {
    stdio: 'inherit',
  })
}
