# LunarCoin Local CPU Mining Guide

Welcome to the **LunarCoin Miner** local CPU mining guide. This guide explains how to install, launch, and use the desktop miner to mine block rewards directly on your local computer.

## Overview

LunarCoin uses a **local-first, desktop-miner architecture**. 
- Mining occurs entirely on your device's CPU.
- Real SHA256 proof-of-work is calculated locally on your CPU threads.
- Block ledgers, transaction histories, wallet accounts, and decentralized file chunks are stored entirely on your computer's local hard drive.
- No cloud dependencies or Render services are used.
- When the app is closed, all mining computations and node servers terminate immediately.

---

## Getting Started

### 1. Download & Installation
Depending on your operating system, choose the appropriate installer from the landing page:
- **Windows:** Download the setup executable `LunarCoinMiner-Setup.exe` (or ZIP archive). Open it and follow the installation wizard.
- **macOS:** Download the package `LunarCoinMiner.dmg` (or ZIP archive). Drag the `LunarCoin Miner` icon to your `Applications` folder.

### 2. Launching the App
When you open **LunarCoin Miner**:
1. It automatically boots the underlying python node server (`api.py`) on your local IP (`http://127.0.0.1:5000`).
2. It mounts the local blockchain database from your user profile.
3. It starts the React user interface to visualize blocks, run contracts, and coordinate consensus.

### 3. Toggling the Mining Engine
To start mining:
1. Navigate to the **Mining Control Room** on the sidebar.
2. Ensure you see the `LOCAL CPU MINING` status card.
3. Click the prominent **Start Engine** button.
4. Your CPU threads will immediately begin hashing block headers. You will see your real hashrate (Hashes/sec), attempt logs, candidate nonces, and mempool queue updates live.

---

## Where is Blockchain Data Stored?

All state records are persisted inside the user's home folder directory:
- **Mac/Linux:** `~/LunarCoinData/` (or `/Users/<username>/LunarCoinData/`)
- **Windows:** `C:\Users\<username>\LunarCoinData\`

### Folder Contents:
- `chain.json`: The complete blockchain ledger register block database.
- `wallet.json`: Cryptographic digital signature PEM keys and public keys.
- `wallet_history.json`: Historical transaction hashes and block reward logs.
- `peers.json`: Addresses of other discovered local network peers.
- `reputation.json`: Peer responsiveness and consensus trust scores.
- `storage/`: A directory for decentralized content storage files managed by **LunarFS**.

---

## CLI Setup (For Developers)

If you prefer to run the backend manually or develop on top of the LunarCoin environment, follow these steps:

1. **Clone the repositories:**
   ```bash
   git clone https://github.com/Zayannnnn/lunar-miner.git
   git clone https://github.com/zayannnnn/lunar-coin-blockchain-explorer.git
   ```

2. **Start the local API backend:**
   ```bash
   cd lunar-miner
   python3 -m pip install -r requirements.txt
   python3 api.py
   ```

3. **Start the explorer dashboard in dev mode:**
   ```bash
   cd lunar-coin-blockchain-explorer
   npm install
   npm run dev
   ```

4. Open `http://localhost:3000/dashboard/mining` in your browser.
