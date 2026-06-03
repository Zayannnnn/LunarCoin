<p align="center">
  <img src="https://res.cloudinary.com/dhxmwk5of/image/upload/q_auto/f_auto/v1779609291/20260524_132338_wkrjvx.png" alt="LunarCoin" width="96" />
</p>

# LunarCoin — Decentralized Educational Blockchain

**v0.1.0-beta** — Educational Blockchain Platform

A local-first educational blockchain ecosystem: mine blocks, sign transactions, deploy smart contracts, run AI agents — all on your machine.

---

## Quick Links

- [Download Release](https://github.com/Zayannnnn/LunarCoin/releases/tag/v0.1.0-beta)
- [Explore System Architecture](#architecture)

---

## Stats

| Core Modules | Proof | Crypto | Local |
|---|---:|---:|---:|
| 13+ | SHA-256 | secp256k1 | 100% Local-First |

---

## Architecture

Every component is orchestrated through a local API node. The Electron client talks to the blockchain engine, wallet, mempool, miner, P2P layer, smart contracts, governance, AI agents, and LunarFS — all running locally.

![Architecture Illustration](images/explorer.svg)

---

## Screenshots — Project In Action

The following screenshots are taken from the `screen_shots/` folder and demonstrate the running application (dashboard, mining, wallet, mempool, and explorer views).

<p align="center">
  <img src="screen_shots/Screenshot%202026-06-03%20at%209.22.53%E2%80%AFAM.png" alt="Dashboard" width="720" style="max-width:100%;margin:8px;" />
</p>

<p align="center">
  <img src="screen_shots/Screenshot%202026-06-03%20at%209.22.37%E2%80%AFAM.png" alt="Mining" width="360" style="max-width:48%;margin:8px;" />
  <img src="screen_shots/Screenshot%202026-06-03%20at%209.21.52%E2%80%AFAM.png" alt="Transactions" width="360" style="max-width:48%;margin:8px;" />
</p>

<p align="center">
  <img src="screen_shots/Screenshot%202026-06-03%20at%209.20.00%E2%80%AFAM.png" alt="Wallet" width="360" style="max-width:48%;margin:8px;" />
  <img src="screen_shots/Screenshot%202026-06-03%20at%209.19.14%E2%80%AFAM.png" alt="Mempool" width="360" style="max-width:48%;margin:8px;" />
</p>

<p align="center">
  <img src="screen_shots/Screenshot%202026-06-03%20at%209.17.29%E2%80%AFAM.png" alt="Explorer" width="720" style="max-width:100%;margin:8px;" />
</p>

---

## Transaction Lifecycle (illustrated)

| Step | Description |
|---|---|
| ![Client UI](images/client-ui.svg) | Client UI |
| ![REST API](images/api.svg) | REST API |
| ![Wallet Sign](images/wallet-sign.svg) | Wallet Sign |
| ![ECDSA Verify](images/verify.svg) | ECDSA Verify |
| ![Mempool](images/mempool.svg) | Mempool Queue |
| ![Mine](images/mining.svg) | SHA-256 Mining |
| ![Chain](images/chain.svg) | Chain Append |
| ![P2P](images/p2p.svg) | P2P Broadcast |
| ![Peers](images/peers.svg) | Peer Sync |

---

## Core API Endpoints

```
GET  /api/chain              # Returns full blockchain
POST /api/mine               # Trigger mining
POST /api/transactions/new   # Submit signed transaction
GET  /api/mempool            # List pending transactions
POST /api/wallet/create      # Create new wallet (ECDSA)
GET  /api/nodes/register     # Register peer node
POST /api/contracts/deploy   # Deploy smart contract to LunarVM
WS   /ws/chain-events        # Live chain events (WS)
POST /api/governance/propose # Create DAO proposal
POST /api/lunarfs/store      # Store file (LunarFS)
POST /api/nft/mint           # Mint NFT
GET  /api/nodes/resolve      # Resolve forks / consensus
```

---

## Platform Modules (high level)

- ![Mining](images/mining-feature.svg) **Mining Engine** — Real SHA-256 PoW, dynamic difficulty, block rewards.
- ![Wallet](images/wallet-feature.svg) **Wallet Engine** — ECDSA secp256k1 keypairs, local private keys.
- ![Chain](images/chain.svg) **Blockchain Core** — Genesis, validation, hash linking, persistent LevelDB storage.
- ![P2P](images/p2p.svg) **P2P Network** — WebSocket peer-to-peer sync and discovery.
- ![Mempool](images/mempool.svg) **Mempool** — Fee-prioritized transaction queue.
- ![Contracts](images/explorer.svg) **Smart Contracts (LunarVM)** — Deterministic contract execution persisted on-chain.
- ![DAO](images/explorer.svg) **DAO Governance** — On-chain proposals, voting, treasury.
- ![Agents](images/explorer.svg) **AI Agents** — Autonomous on-chain monitoring and actions.
- ![LunarFS](images/explorer.svg) **LunarFS** — Content-addressed distributed storage.
- ![NFTs](images/explorer.svg) **NFTs** — Minting and ownership recorded on-chain.
- ![DApps](images/explorer.svg) **DApps** — Developer API access to wallet, LunarVM, LunarFS.
- ![Explorer](images/explorer.svg) **LunarScan** — Live blockchain explorer embedded in the client.

---

## Module Status

| Module | Technology | Description | Status |
|---|---|---|---|
| Mining Engine | SHA-256 | Proof-of-Work with dynamic difficulty and block rewards | Live |
| Wallet System | secp256k1 | ECDSA key pairs and local storage | Live |
| Blockchain Core | LevelDB | Block validation, hash linking, persistent chain | Live |
| P2P Network | WebSocket | Peer discovery, block sync, consensus | Live |
| Mempool | Python | Fee-prioritized pending transactions | Live |
| Smart Contracts | LunarVM | Deploy & execute contracts, persist state | Live |
| DAO Governance | On-Chain | Proposals, voting, treasury | Live |
| AI Agents | Python/API | On-chain monitoring & automation | Live |
| LunarFS | Content Hash | Content-addressed distributed file storage | Live |
| NFTs | On-Chain | Mint, transfer, verify ownership | Live |
| DApps | API Layer | Decentralized application infra | Live |
| LunarScan Explorer | Electron | Local explorer with fallback node | Live |

---

## Roadmap (short)

- Phase 1–6: Core systems, desktop miner, P2P, governance, agents, LunarFS — shipped.
- Phase 7: Public Beta — in progress.
- Phase 8: Mainnet research — upcoming.

---

## Installation

- Windows: see release `LunarCoinMiner-Setup.exe` ![Windows](images/windows.svg)
- macOS: see release `LunarCoinMiner-mac.zip` ![macOS](images/macos.svg)

Download the latest release: https://github.com/Zayannnnn/LunarCoin/releases/tag/v0.1.0-beta

---

## License & Credits

Built for learning, designed for exploration. See the repository for full credits and license.
