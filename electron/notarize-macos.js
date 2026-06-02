const { notarize } = require('@electron/notarize')
const { execFileSync } = require('child_process')

/**
 * Notarize and staple the macOS app when Apple credentials are present.
 * Skipped automatically for beta/ad-hoc builds.
 */
exports.default = async function notarizeMac(context) {
  if (process.platform !== 'darwin') return

  const identity = process.env.APPLE_SIGNING_IDENTITY || process.env.CSC_NAME
  if (!identity || identity === '-') {
    console.log('[macos-notarize] Skipping notarization (no Developer ID identity).')
    return
  }

  const appleId = process.env.APPLE_ID
  const appleIdPassword = process.env.APPLE_APP_SPECIFIC_PASSWORD
  const teamId = process.env.APPLE_TEAM_ID

  if (!appleId || !appleIdPassword || !teamId) {
    console.log('[macos-notarize] Skipping notarization (missing APPLE_ID / APPLE_APP_SPECIFIC_PASSWORD / APPLE_TEAM_ID).')
    return
  }

  const appName = context.packager.appInfo.productFilename
  const appPath = `${context.appOutDir}/${appName}.app`

  console.log(`[macos-notarize] Submitting ${appPath} to Apple notary service...`)

  await notarize({
    appPath,
    appleId,
    appleIdPassword,
    teamId,
  })

  execFileSync('xcrun', ['stapler', 'staple', appPath], { stdio: 'inherit' })

  console.log('[macos-notarize] Notarization complete and ticket stapled.')
}
