const { app, BrowserWindow, nativeTheme } = require('electron')
const { spawn } = require('child_process')
const fs = require('fs')
const http = require('http')
const https = require('https')
const path = require('path')

const FRONTEND_PORT = process.env.LUNARSCAN_PORT || '3000'
const BACKEND_URL = 'http://127.0.0.1:5000'
const FRONTEND_URL = process.env.ELECTRON_START_URL || `http://127.0.0.1:${FRONTEND_PORT}`

let mainWindow = null
let backendProcess = null
let frontendProcess = null

function resolveBackendDir() {
  const candidates = [
    process.env.LUNAR_MINER_BACKEND_DIR,
    app.isPackaged ? path.join(process.resourcesPath, 'lunar-miner') : null,
    path.resolve(app.getAppPath(), '..', 'lunar-miner'),
    path.resolve(app.getAppPath(), '..', '..', 'lunar-miner'),
  ].filter(Boolean)

  return candidates.find((candidate) => fs.existsSync(path.join(candidate, 'api.py')))
}

async function waitForUrl(url, timeoutMs = 30000) {
  const startedAt = Date.now()
  let lastError

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const statusCode = await requestStatus(url)
      if (statusCode >= 200 && statusCode < 500) return
    } catch (error) {
      lastError = error
    }
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  throw lastError || new Error(`Timed out waiting for ${url}`)
}

async function waitForBackend(timeoutMs = 30000) {
  const startedAt = Date.now()
  let lastError

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const { body } = await requestText(`${BACKEND_URL}/status`)
      const data = JSON.parse(body)
      if ('balance' in data && 'address' in data && ('mining' in data || 'running' in data)) return
    } catch (error) {
      lastError = error
    }
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  throw lastError || new Error(`Timed out waiting for ${BACKEND_URL}/status`)
}

function requestStatus(url) {
  return requestText(url).then(({ statusCode }) => statusCode)
}

function requestText(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http
    const request = client.get(url, (response) => {
      let body = ''
      response.setEncoding('utf8')
      response.on('data', (chunk) => {
        body += chunk
      })
      response.on('end', () => {
        resolve({ statusCode: response.statusCode || 0, body })
      })
    })

    request.setTimeout(1000, () => {
      request.destroy(new Error(`Timed out requesting ${url}`))
    })

    request.on('error', reject)
  })
}

function spawnProcess(command, args, options) {
  const child = spawn(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    ...options,
  })

  child.on('error', (error) => {
    console.error(`[desktop] Failed to start ${command}:`, error)
  })

  return child
}

async function startBackend() {
  try {
    await waitForBackend(1000)
    console.log('[desktop] LunarMiner backend already running')
    return
  } catch {
    // No backend is listening yet, so Electron will own the process.
  }

  const backendDir = resolveBackendDir()
  if (!backendDir) {
    throw new Error('Unable to find local LunarMiner backend api.py')
  }

  backendProcess = spawnProcess('python3', ['api.py'], {
    cwd: backendDir,
    env: {
      ...process.env,
      LUNARCOIN_DATA_DIR: path.join(app.getPath('home'), 'LunarCoinData'),
    },
  })

  await waitForBackend(30000)
}

async function startFrontend() {
  if (process.env.ELECTRON_START_URL) {
    await waitForUrl(FRONTEND_URL, 30000)
    return
  }

  const mode = process.env.ELECTRON_RENDERER_MODE || (app.isPackaged ? 'start' : 'dev')
  const script = mode === 'start' ? 'start' : 'dev'
  const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'

  frontendProcess = spawnProcess(npmCommand, ['run', script, '--', '-p', FRONTEND_PORT], {
    cwd: app.getAppPath(),
    env: {
      ...process.env,
      NEXT_PUBLIC_API_URL: BACKEND_URL,
      NEXT_PUBLIC_WS_URL: '',
      NEXT_PUBLIC_USE_MOCK_API: 'false',
      BROWSER: 'none',
    },
  })

  await waitForUrl(FRONTEND_URL, 45000)
}

function createWindow() {
  nativeTheme.themeSource = 'dark'

  mainWindow = new BrowserWindow({
    width: 1320,
    height: 900,
    minWidth: 1024,
    minHeight: 720,
    title: 'LunarCoin Desktop Miner',
    backgroundColor: '#05070d',
    icon: path.join(app.getAppPath(), 'public', 'images', 'lunar-logo.png'),
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.loadURL(`${FRONTEND_URL}/dashboard/mining`)
}

async function boot() {
  try {
    await startBackend()
  } catch (error) {
    console.warn('[desktop] LunarMiner backend was not ready before UI launch:', error)
  }

  await startFrontend()
  createWindow()
}

function stopProcess(child) {
  if (!child || child.killed) return

  if (process.platform === 'win32') {
    spawn('taskkill', ['/pid', child.pid, '/f', '/t'])
    return
  }

  child.kill('SIGTERM')
}

app.whenReady().then(() => {
  boot().catch((error) => {
    console.error('[desktop] Startup failed:', error)
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('before-quit', () => {
  stopProcess(backendProcess)
  stopProcess(frontendProcess)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
