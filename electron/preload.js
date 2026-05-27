const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('lunarDesktop', {
  backendUrl: 'http://127.0.0.1:5000',
  dataDirectory: '~/LunarCoinData',
  platform: process.platform,
})
