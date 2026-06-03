<p align="center">
  <img src="https://res.cloudinary.com/dhxmwk5of/image/upload/q_auto/f_auto/v1779609291/20260524_132338_wkrjvx.png" alt="LunarCoin Logo" width="300" />
</p>

# LunarCoin

### Educational Local-First Blockchain Ecosystem

> A fully-featured, simulated, local-first blockchain ecosystem designed to teach decentralized systems architecture, proof-of-work consensus, elliptic curve cryptography, stack-based smart contracts, and DAO governance in a sandboxed desktop environment.

<p align="center">
  <img src="https://img.shields.io/badge/Architecture-Local--First-00E5FF?style=for-the-badge&logo=electron" alt="Architecture" />
  <img src="https://img.shields.io/badge/Consensus-Proof--of--Work-7F00FF?style=for-the-badge&logo=server" alt="Consensus" />
  <img src="https://img.shields.io/badge/VM-LunarVM--Stack-FF007F?style=for-the-badge&logo=webassembly" alt="VM" />
  <img src="https://img.shields.io/badge/Storage-LunarFS--Gossip-00FF66?style=for-the-badge&logo=ipfs" alt="Storage" />
  <img src="https://img.shields.io/badge/Security-ECDSA--secp256r1-FFFF00?style=for-the-badge&logo=keycdn" alt="Security" />
</p>

---

## 1. What is LunarCoin?

LunarCoin is a local-first blockchain client and simulation sandbox designed for educational transparency. Rather than interacting with black-box cloud systems or paying volatile gas fees, developers, students, and blockchain architects can run a complete, multi-threaded node directly on their local machine.

### Key Philosophies

*   **Local-First & Offline Resilience**: Operating entirely within the user's workspace using a Python Flask core and an Electron-React wrapper. Ledger databases (`chain.json`) are stored natively in `~/LunarCoinData/`.
*   **Decentralized Learning Playground**: Designed to teach the full ledger lifecycle. All subsystems—from cryptographic key derivation to transaction sign/verify, P2P network gossip, block mining, stack VM execution, and governance voting—are exposed through high-fidelity visual interfaces.
*   **Fully Deterministic Simulation**: Features standard CPU hashing loops, actual SECP256R1 signatures, a stack-based smart contract runtime, and peer-to-peer network routing simulation that behaves exactly like production-grade public protocols.

---

## 2. Core Features

LunarCoin organizes its features into modular, technical components:

| Feature | Purpose | Inputs | Outputs | Blockchain Interactions |
| :--- | :--- | :--- | :--- | :--- |
| **Dashboard** | Monitors system health and network synchronization. | Connected peer telemetry, local block tip height. | System metrics (TPS, Block tip, Peer counts). | Read-only ledger queries to track tip state. |
| **Mining Control** | Executes CPU-based mining work loops. | Nonce search range, candidate block template. | Solved candidate block, block reward. | Appends verified blocks to the local chain ledger. |
| **Blocks Explorer** | Chronological blockchain examiner. | Path to ledger database file. | Detailed table listing height, difficulty, nonce, hash. | Scans entire block history sequentially. |
| **Analytics Dashboard** | Computes transaction and mining metrics. | Historical block times, gas fees. | Workload delta charts, hashrate history graph. | Computes rolling averages of block generation rates. |
| **Transactions Ledger** | Tracks completed value transfers. | Path to transaction ledger database. | Transaction list (amounts, fees, timestamps). | Queries state changes within historical block heights. |
| **Wallet Manager** | Manages local identities and funds. | SECP256R1 keypair file. | Public address, spendable balance, mined rewards. | Resolves UTXOs and transaction balances. |
| **Send Coins** | P2P value transfer compiler. | Recipient address, token amount, transaction fee. | Broadcastable signed transaction payload. | Pulls UTXOs, signs inputs, publishes to mempool. |
| **Smart Contracts** | LunarVM stack bytecode workbench. | JSON array program assembler, call gas. | Stack traces, storage map updates, outputs. | Appends contract code to block, updates storage. |
| **DAO Governance** | Staking-weighted parameters control. | Locked staker deposit, vote selection. | Staked balance receipt, voting weight boost. | Locks balances, applies voting modifiers. |
| **AI Agents Hub** | Sandboxed threat auditing and monitoring. | Ledger metrics, difficulty sliders. | Risk assessment logs, tokenomic forecast charts. | Scans blocks for structural anomalies. |
| **LunarFS Manager** | Content-addressed storage tracker. | Local file upload path. | Unique content hash identifier, replication nodes. | Logs content hash ownership to contract state. |
| **NFT Registry** | Media collector registry system. | Metadata path, LunarFS hash, owner address. | Minted collectible card metadata. | Compiles contract variable mappings on LunarVM. |
| **DApps Workbench** | Precompiled starter pack compiler. | Selected template, constructor inputs. | Instance address, deployed program logs. | Deploys contract templates to the network. |
| **System Settings** | Configures network endpoints and miner bounds. | Flask URL, thread count, difficulty mask. | Updated configuration file. | Adjusts the active difficulty verification mask. |
| **P2P Network** | Live topology controller. | Remote peer socket address. | Topography map, latency relays, sync status. | Propagates consensus blocks, syncs chain tips. |
| **Node Reputation** | Evaluates compliance across connected nodes. | Peer block solutions, latency audits. | Active trust metrics table, infraction logs. | Bans malicious IP addresses from block propagation. |

---

## 3. Complete System Architecture

LunarCoin's internal layers are split between a presentation/desktop layer (Electron + React) and a local-first blockchain engine (Python Flask). Communication happens over low-latency REST endpoints and P2P sockets.

```mermaid
graph TD
    User([User Client]) <--> Frontend[Electron React UI Wrapper]
    
    subgraph Frontend Client
        Frontend <--> Explorer[Blockchain Explorer Module]
        Frontend <--> Workbench[Smart Contract / DApp Workbench]
        Frontend <--> WalletManager[Wallet Core]
    end

    Frontend <--> |HTTP API / REST| APILayer[Flask API Layer - Port 5000]

    subgraph Blockchain Core Core Node Engine
        APILayer <--> Core[Blockchain Core State Engine]
        APILayer <--> WalletSys[Wallet Key Signer Engine]
        APILayer <--> VM[LunarVM Stack Sandbox]
        
        Core <--> Mempool[Mempool Queuer]
        Core <--> Miner[CPU Mining Engine Worker]
        Core <--> Consensus[Consensus Engine PoW Validator]
        
        Consensus <--> P2P[P2P Network gossip/Sockets Relay]
        Core <--> Storage[Storage Layer - JSON DBs & LunarFS Chunks]
    end
    
    P2P <--> |TCP Socket Mesh| RemotePeers[Remote LunarNodes LAN]
    Storage <--> |Local File Reads| LocalDisk[(Local Filesystem ~/LunarCoinData/)]
    
    style User fill:#00E5FF,stroke:#000,stroke-width:2px,color:#000
    style Frontend fill:#1E293B,stroke:#00E5FF,stroke-width:1px,color:#fff
    style APILayer fill:#1E293B,stroke:#7F00FF,stroke-width:1px,color:#fff
    style Blockchain Core fill:#0B0F19,stroke:#FF007F,stroke-width:2px,color:#fff
    style LocalDisk fill:#1E293B,stroke:#00FF66,stroke-width:1px,color:#fff
```

---

## 4. Blockchain Lifecycle

The execution lifecycle of transactions, block validation, state updates, and visualization conforms to standard decentralization logic:

```mermaid
flowchart TD
    A[Wallet: Compile Transaction Data] --> B[ECDSA Signature: Sign with Private Key]
    B --> C[Signature Verification: Node audits Tx Hash & Public Key]
    C -->|Valid Signature| D[Mempool Queue: Cache transaction locally]
    D --> E[Miner Node: Select transactions & build candidate block]
    E --> F[Proof of Work: Solve SHA-256 difficulty constraints]
    F -->|Nonce Discovered| G[Block Creation: Construct block header + body]
    G --> H[Chain Validation: Peers re-run transaction validations & hash checks]
    H -->|Consensus Reached| I[Balance Update: Apply transfers to ledger state]
    I --> J[Local Storage: Write block to chain.json]
    J --> K[Explorer UI: Update dashboards, analytics, and transaction logs]
    
    style A fill:#1E293B,stroke:#00E5FF,stroke-width:1px,color:#fff
    style F fill:#7F00FF,stroke:#fff,stroke-width:1px,color:#fff
    style H fill:#FF007F,stroke:#fff,stroke-width:1px,color:#fff
    style K fill:#00FF66,stroke:#000,stroke-width:1px,color:#000
```

---

## 5. Mining Architecture

Mining in LunarCoin is powered by a multi-threaded CPU engine enforcing a strict Proof of Work consensus rule.

```mermaid
graph LR
    subgraph Mining Loop
        Candidate[Block Header Template] --> HashFn[SHA-256 Hash Engine]
        Nonce[Incremental Nonce] --> HashFn
        HashFn --> CheckDiff{Starts with Difficulty Zeros?}
        CheckDiff -->|No: Increment Nonce| Nonce
        CheckDiff -->|Yes: Block Solved| Submit[Submit Block to Core Node]
    end
    
    subgraph Block Reward Distribution
        Submit --> Mint[Mint +1 LUNAR Reward]
        Submit --> Sweep[Sweep 10% APY / +0.1 LUNAR to DAO Treasury]
        Mint --> MinerWallet[Credited to Miner Address]
        Sweep --> Treasury[(Decentralized Treasury Pool)]
    end
    
    style CheckDiff fill:#7F00FF,stroke:#fff,color:#fff
    style Treasury fill:#1E293B,stroke:#00E5FF,color:#fff
```

### Mining Specifications
*   **Hashing Core**: `SHA-256` operates on the block header fields: `index + previous_hash + timestamp + transactions_root + nonce`.
*   **Difficulty Adjustment**: Enforced via a prefix mask (e.g., Difficulty Mask `4` requires hex hashes to start with four zeros: `0000...`).
*   **Treasury Split**: For every block solved, `1.0 LUNAR` is minted. `0.9 LUNAR` is awarded to the miner's address, and `0.1 LUNAR` (10%) is automatically swept into the DAO treasury smart contract to fund network governance and staking APY yield projections.

---

## 6. Wallet Architecture

LunarCoin Wallets manage account balances and security through asymmetric elliptic curve cryptography.

```mermaid
flowchart TD
    Secp256r1[Generate Private Key: SECP256R1 Elliptic Curve] --> PubKey[Derive Public Key]
    PubKey --> Hash256[SHA-256 Hash of Public Key]
    Hash256 --> Take16[Extract First 16 Hex Characters]
    Take16 --> Upper[Convert to Uppercase]
    Upper --> Addr[Final Address: 0xa32922df8101f4e8]
    
    style Secp256r1 fill:#1E293B,stroke:#00E5FF,color:#fff
    style Addr fill:#00FF66,stroke:#000,color:#000
```

### Key Derivation Rules
*   **Elliptic Curve Standard**: The node uses standard `secp256r1` parameters to sign and verify transactions.
*   **Cryptographic Address Derivation**:
    $$\text{Address} = \text{HexSubstring}(\text{SHA-256}(\text{Public Key}), 0, 16)\text{.toUpperCase()}$$
    This yields a clean, readable 16-character hexadecimal address identifier.

---

## 7. Transaction Lifecycle

Below is the sequential communication map of an asset transfer:

```mermaid
sequenceDiagram
    autonumber
    actor User as User Interface
    participant Wallet as Wallet Manager
    participant Node as Flask API Node
    participant Miner as Mining Engine
    participant Ledg as Local JSON DB
    
    User->>Wallet: Enter recipient and amount
    Wallet->>Wallet: Retrieve SECP256R1 Private Key
    Wallet->>Wallet: Sign SHA-256 (Transaction Data)
    Wallet->>Node: POST /transactions/new (Signed Payload)
    Note over Node: Node validates signature & funds
    Node->>Node: Add to Mempool Queue
    Node-->>User: Return transaction confirmation toast
    Miner->>Node: Poll transactions from mempool
    Node-->>Miner: Return transaction list
    loop Nonce Hashing
        Miner->>Miner: Increment nonce & compute SHA-256
    end
    Miner->>Node: POST /blocks/mine (Solved Block)
    Node->>Node: Validate block hash & difficulty mask
    Node->>Ledg: Commit block to chain.json
    Node->>Node: Update balance states
    Node-->>User: Push WebSockets explorer dashboard update
```

---

## 8. Peer-to-Peer (P2P) Network

Nodes discover each other locally using a decentralized socket topology, ensuring that ledgers remain in sync without central oversight.

```mermaid
graph TD
    subgraph Local Mesh Topology
        NodeA[Local Node A] <-->|Gossip Protocol| NodeB[Local Node B]
        NodeB <-->|Longest-Chain Sync| NodeC[Local Node C]
        NodeC <-->|Gossip Protocol| NodeA
    end
    
    subgraph Synchronization Rules
        NodeA -->|Query block heights| NodeB
        NodeB -->|Returns height status| NodeA
        NodeA -->|Checks Tip| TipCompare{Tip Out of Sync?}
        TipCompare -->|Yes: Request Missing Blocks| SyncChain[Download Blocks]
        TipCompare -->|No: Active State| Gossip[Active Block/Tx Relay]
    end
    
    style TipCompare fill:#FF007F,stroke:#fff,color:#fff
```

*   **Peer Discovery**: Nodes bootstrap by connecting to a designated local bootstrap server URL (default `127.0.0.1:5002`) and registering their socket connection strings.
*   **Gossip Protocol**: Newly generated transactions and mined blocks are broadcast to all connected peer socket relays instantly.
*   **The Longest Chain Rule**: If two competing blocks are mined at the same height, nodes track both forks. The node will automatically switch its active validation path to the fork containing the highest cumulative proof-of-work difficulty.

---

## 9. Smart Contracts (LunarVM)

LunarCoin includes **LunarVM**, a custom stack-based execution sandbox running deterministic instruction bytecodes.

```mermaid
flowchart TD
    Compile[Compile Assembler Code] --> CheckGas{Within Gas Limit?}
    CheckGas -->|No: Error| GasError[Out of Gas Failure]
    CheckGas -->|Yes| PushStack[Push Values to Execution Stack]
    PushStack --> ExecOp[Execute OP_CODE]
    ExecOp --> StorageMap[Store Outputs to Contract State Storage]
    StorageMap --> Return[Push Return Value to Output Console]
    
    style CheckGas fill:#7F00FF,stroke:#fff,color:#fff
```

*   **Assembly Syntax Example**:
    ```json
    [
      ["PUSH", 21],
      ["PUSH", 2],
      ["MUL"],
      ["STORE", "answer"],
      ["LOAD", "answer"],
      ["RETURN"]
    ]
    ```
*   **State Persistence**: Execution storage is decoupled from the node's local files. Contracts read and write strictly to their unique sandboxed storage mapping tables, committed directly onto the chain.

---

## 10. DAO Governance

Ecosystem parameter changes (such as staking rates and reward splits) are controlled democratically via the Decentralized Autonomous Organization (DAO) portal.

```mermaid
graph TD
    subgraph Staking Pool
        UserBal[User Balance] -->|Lock LUNAR| StakePool[Staking Reservoir]
        StakePool -->|Yield Generation| APYBonus[8% APY Compound Yield]
        StakePool -->|Governance Weight| PowerBoost[2.0x Voting Weight Boost]
    end
    
    subgraph Decision Engine
        PowerBoost --> Vote[Cast Staking Weighted Vote]
        Vote --> Proposal{Meets Quorum?}
        Proposal -->|Yes: Execute| ApplyChanges[Commit Protocol Shift]
        Proposal -->|No: Reject| Reject[Discard Proposal]
    end
    
    style Proposal fill:#FF007F,stroke:#fff,color:#fff
```

*   **Treasury Mechanics**: Block reward sweeps dynamically accrue inside the DAO treasury pool. These assets cannot be transferred unless authorized by a quorum proposal.
*   **Staking Weights**: Users lock LUNAR tokens to earn an 8% APY yield projection while gaining a `2.0x` voting power multiplier.

---

## 11. AI Agents Hub

A sandbox monitor controls autonomous agents acting as compliance sentinels, tokenomic predictors, and smart contract auditors.

```mermaid
graph LR
    subgraph AI Sandbox
        Agent[Autonomous AI Node] --> Audit[Audit VM Transactions]
        Agent --> Forecast[Predict Price Trajectory]
        Agent --> Risk[Consensus Threat Assessment]
    end
    
    Audit --> SecurityCheck[Identify Re-entrancy / Stack Overflow]
    Forecast --> Simulations[Compute Price Projections]
    Risk --> AttackCheck[Monitor Active Sybil/DDoS LAN Peaks]
    
    style Agent fill:#1E293B,stroke:#00E5FF,color:#fff
```

*   **Auditing Sentinels**: Scans blocks for signature verification speeds and transaction volume spikes to flag anomalous client behavior.
*   **Tokenomic Projections**: Simulates price vectors using random-walk simulations influenced by active mining difficulty masks and node counts.

---

## 12. LunarFS Storage & NFT Framework

LunarFS is a decentralized, local-first content-addressed storage engine designed to manage NFT media data.

```mermaid
flowchart TD
    File[Upload Local File] --> Fragment[Fragment file into 64KB Chunks]
    Fragment --> GenHash[Generate SHA-256 Content Hash]
    GenHash --> RegisterNFT[Compile Pre-Compiler VM Instructions]
    RegisterNFT --> CommitChain[Commit NFT Metadata to Blockchain Explorer]
    Fragment --> Heatmap[Distribute to Replication Matrix Heatmap]
    
    style GenHash fill:#00FF66,stroke:#000,color:#000
```

*   **Fragmentation**: Large files are split into deterministic `64KB` chunk segments.
*   **Replication Heatmap**: Monitors replica counts across LAN peers to ensure chunks remain available (Highly Seeded, Healthy, or Single Node).
*   **NFT Registration**: Media identifiers are tied directly to LunarVM contract states (`nft_owner`, `nft_media_hash`), preventing digital asset duplication.

---

## 13. Folder Architecture

The codebase layout isolates visual execution modules from backend blockchain validation engines:

```text
lunar-coin-blockchain-explorer/
├── electron/                  # Electron main/preload process managers
│   └── main.js                # Desktop window and native process bindings
├── app/                       # React frontend source files
│   ├── components/            # UI modules (Mining Room, Wallet, DAO, LunarFS, etc.)
│   ├── lib/                   # Utility layers, LunarVM client, and ECDSA key helpers
│   ├── hooks/                 # React states hooks for blocks, peers, and mempool APIs
│   ├── styles/                # Vanilla CSS styling files (Glassmorphism layout)
│   └── index.html             # Application entry markup file
├── backend/                   # Python Flask blockchain simulation engine
│   ├── core/                  # Blockchain ledger, Block, and Tx structures
│   ├── consensus/             # CPU mining routines and block reward rules
│   ├── vm/                    # LunarVM bytecode parser and executor
│   ├── p2p/                   # Socket-based P2P networking protocols
│   └── storage/               # Native file storage modules (~/LunarCoinData/)
├── screen_shots/              # UI walkthrough asset images
├── package.json               # Frontend dependencies and packaging scripts
├── requirements.txt           # Python backend dependencies
└── README.md                  # System documentation and handbook
```

---

## 14. Tech Stack

LunarCoin is built using highly-responsive, low-overhead tools:

| Category | Technology | Usage |
| :--- | :--- | :--- |
| **Frontend** | React / JavaScript | High-fidelity interactive dashboards and real-time state visualization. |
| **Styling** | Vanilla CSS | Custom cyberpunk gradients, glowing buttons, and responsive glassmorphic cards. |
| **Desktop Wrapper** | Electron | Connects frontend React components to native system APIs and Python processes. |
| **Backend Core** | Python Flask | Lightweight REST API server processing blockchain state transactions. |
| **Cryptography** | ECDSA (secp256r1) / SHA-256 | Signature validation, block puzzle hashing, and address derivation. |
| **Storage** | Local JSON Database | Flat-file JSON databases (`chain.json` / `wallet.json`) for data persistence. |
| **Storage (FS)** | LunarFS | Fragmented content-addressed storage for decentralized media files. |
| **P2P Networking** | WebSockets / TCP Sockets | Real-time transaction gossip and block propagation across local networks. |

---

## 15. Security Model

LunarCoin maintains a strict blockchain security model, protecting the ledger from manipulation:

*   **Non-Custodial Key Security**: Private keys are generated locally via secp256r1 curves. They are written to `~/LunarCoinData/wallet.json` and are never broadcast over HTTP APIs.
*   **Digital Signatures**: Every ledger state transfer must include a valid ECDSA signature. The backend validates `SHA-256(TxData)` against the sender's public key before queuing the transaction.
*   **Ledger Verification**: On node startup, the backend sweeps the local database. It recalculates the hash chain sequentially from genesis to verify that block hashes and transaction merkle roots remain unmanipulated.

---

## 16. Platform Walkthrough

Explore a typical user session with the LunarCoin client, from launching the miner to deploying contracts and auditing peer networks:

### Step 1: Client Startup & Miner Idle HUD
The desktop miner launches. The **Mining Control Room** loads in an idle state. No CPU threads are active, the balance shows `17.5 LUN`, and hashes/sec reads zero.
<p align="center">
  <img src="screen_shots/Screenshot 2026-06-03 at 9.12.02 AM.png" alt="Client Startup" width="90%" style="border-radius: 8px; border: 1px solid #1E293B;" />
</p>

### Step 2: Hashing Engine Activated
Clicking **Start Engine** launches the mining loops. CPU threads immediately start scanning nonce spaces. The hash speed climbs to `58,190.39 H/s`, and the node quickly finds block #355, raising the wallet balance to `18.4 LUN`.
<p align="center">
  <img src="screen_shots/Screenshot 2026-06-03 at 9.12.35 AM.png" alt="Mining Engine Activated" width="90%" style="border-radius: 8px; border: 1px solid #1E293B;" />
</p>

### Step 3: Hashing Diagnostics & Sockets Status
Scrolling down the mining control board displays the live nonce (`9,363,025`) alongside the exact candidate hex hash. The network log tracks local websocket bindings and active console outputs.
<p align="center">
  <img src="screen_shots/Screenshot 2026-06-03 at 9.13.03 AM.png" alt="Diagnostics and Socket Status" width="90%" style="border-radius: 8px; border: 1px solid #1E293B;" />
</p>

### Step 4: Live Mining Analytics Charts
Switching to the **Work Diagnostics** tab reveals realtime performance charts. The graphs plot hashrate trends and workload delta. A green notification slides in to announce `+1 LUNAR BLOCK FOUND!`.
<p align="center">
  <img src="screen_shots/Screenshot 2026-06-03 at 9.14.32 AM.png" alt="Live Mining Analytics Charts" width="90%" style="border-radius: 8px; border: 1px solid #1E293B;" />
</p>

### Step 5: Chain Block Browser
Navigating to the **Blocks** tab displays the network ledger database. The table catalogs block heights, execution hashes, difficulty masks, timestamps, and block rewards.
<p align="center">
  <img src="screen_shots/Screenshot 2026-06-03 at 9.14.56 AM.png" alt="Blocks Explorer" width="90%" style="border-radius: 8px; border: 1px solid #1E293B;" />
</p>

### Step 6: Fee Analytics & Gas Estimator
The **Fee Analytics** view displays the gas cost curves of transactions across different priority queues. High-priority transfers can be structured to bypass the standard mempool queue.
<p align="center">
  <img src="screen_shots/Screenshot 2026-06-03 at 9.15.22 AM.png" alt="Fee Analytics" width="90%" style="border-radius: 8px; border: 1px solid #1E293B;" />
</p>

### Step 7: Completed Transactions Ledger
The **Transactions** screen lists confirmed transactions. Clicking a tx hash displays input metrics, target recipient addresses, fee metrics, and execution status.
<p align="center">
  <img src="screen_shots/Screenshot 2026-06-03 at 9.15.51 AM.png" alt="Transactions Ledger" width="90%" style="border-radius: 8px; border: 1px solid #1E293B;" />
</p>

### Step 8: Cryptographic Wallet Dashboard
The **Wallet** page displays the node's local account data. The private keys stored in `wallet.json` resolve to the public address `0xa32922df8101f4e8`. The wallet balance is updated to `40.9 LUN`.
<p align="center">
  <img src="screen_shots/Screenshot 2026-06-03 at 9.16.07 AM.png" alt="Wallet Dashboard" width="90%" style="border-radius: 8px; border: 1px solid #1E293B;" />
</p>

### Step 9: Compiling Value Transactions
Selecting the **Send Coins** tab opens the transfer utility. The interface enables the user to specify a recipient address, transfer amount, and transaction fee before signing the transaction payload.
<p align="center">
  <img src="screen_shots/Screenshot 2026-06-03 at 9.16.31 AM.png" alt="Send Coins Compilation" width="90%" style="border-radius: 8px; border: 1px solid #1E293B;" />
</p>

### Step 10: Smart Contract Deployment Form
The **Smart Contracts Workbench** displays assembly bytecode designed to multiply two numbers. Clicking **Compile & Deploy** queues the contract deployment transaction in the mempool.
<p align="center">
  <img src="screen_shots/Screenshot 2026-06-03 at 9.17.17 AM.png" alt="Smart Contract Compiler" width="90%" style="border-radius: 8px; border: 1px solid #1E293B;" />
</p>

### Step 11: Contract Execution Console
Under **Execution Console**, the compiled contract is invoked. The virtual machine executes the multiplication bytecode in 0.028 ms, storing the result (`42`) and outputting a JSON execution log.
<p align="center">
  <img src="screen_shots/Screenshot 2026-06-03 at 9.17.29 AM.png" alt="Smart Contract Executor" width="90%" style="border-radius: 8px; border: 1px solid #1E293B;" />
</p>

### Step 12: DAO Governance Dashboard
The **Governance** dashboard manages proposal voting and reward distributions. Locking LUN tokens yields 8% APY and scales voting weight by 2.0x.
<p align="center">
  <img src="screen_shots/Screenshot 2026-06-03 at 9.17.49 AM.png" alt="DAO Governance Dashboard" width="90%" style="border-radius: 8px; border: 1px solid #1E293B;" />
</p>

### Step 13: Spawning AI Sandbox Nodes
The **AI Agents Hub** displays active agents auditing transactions and predicting tokenomics. A tokenomics simulator runs pricing models based on difficulty targets and node counts.
<p align="center">
  <img src="screen_shots/Screenshot 2026-06-03 at 9.18.15 AM.png" alt="AI Agent Sandbox" width="90%" style="border-radius: 8px; border: 1px solid #1E293B;" />
</p>

### Step 14: Content-Addressable Storage
Under **LunarFS**, the user uploads a screenshot. The file is fragmented into 64KB chunks. The right panel displays the compiler code generated to register the file as an NFT.
<p align="center">
  <img src="screen_shots/Screenshot 2026-06-03 at 9.19.01 AM.png" alt="LunarFS Upload" width="90%" style="border-radius: 8px; border: 1px solid #1E293B;" />
</p>

### Step 15: NFT Media Gallery Catalog
Scrolling down the LunarFS tab reveals the **Ecosystem Media Collectibles (NFT Gallery)**. The uploaded file is registered as a "Lunar Cyberpunk Badge" developer token owned by the user.
<p align="center">
  <img src="screen_shots/Screenshot 2026-06-03 at 9.19.14 AM.png" alt="NFT Media Gallery" width="90%" style="border-radius: 8px; border: 1px solid #1E293B;" />
</p>

### Step 16: Block Mined Success Alert
A success modal confirms `Block Successfully Mined!`. The transaction has been sealed onto the blockchain, committing the state transitions to the ledger.
<p align="center">
  <img src="screen_shots/Screenshot 2026-06-03 at 9.20.00 AM.png" alt="Block Mined Modal" width="90%" style="border-radius: 8px; border: 1px solid #1E293B;" />
</p>

### Step 17: Precompiled DApps Catalog
The **DApps** screen lists precompiled smart contract templates. The catalog includes templates for ERC-20 utility tokens, escrow contracts, and decentralized voting tools.
<p align="center">
  <img src="screen_shots/Screenshot 2026-06-03 at 9.21.52 AM.png" alt="DApps Catalog Templates" width="90%" style="border-radius: 8px; border: 1px solid #1E293B;" />
</p>

### Step 18: System Node Config Settings
The **Settings** dashboard enables node configuration. Users can set difficulty limits, allocate CPU mining threads, and view directory paths for local databases.
<p align="center">
  <img src="screen_shots/Screenshot 2026-06-03 at 9.22.20 AM.png" alt="Node Settings Config" width="90%" style="border-radius: 8px; border: 1px solid #1E293B;" />
</p>

### Step 19: P2P LAN Topography Map
The **P2P Network** dashboard displays local network topology. The screen includes peer synchronization lists and tools to link remote LAN node endpoints.
<p align="center">
  <img src="screen_shots/Screenshot 2026-06-03 at 9.22.37 AM.png" alt="P2P Network Deck" width="90%" style="border-radius: 8px; border: 1px solid #1E293B;" />
</p>

### Step 20: Node Compliance Ledger
The **Node Reputation** system displays peer trust indexes. The ledger audits connected nodes, logging infractions and updating trust scores (+5 for valid blocks, -25 for bad recalculations).
<p align="center">
  <img src="screen_shots/Screenshot 2026-06-03 at 9.22.53 AM.png" alt="Node Reputation Ledger" width="90%" style="border-radius: 8px; border: 1px solid #1E293B;" />
</p>

---

## 17. Roadmap

The future development goals for the LunarCoin simulation network are outlined below:

```mermaid
timeline
    title LunarCoin Technical Milestones
    section Completed
        Local Core Engine : Python Flask API : Ledger verification database
        Electron wrapper : React HUD client : Dashboard analytics
        LunarVM Sandbox : Multi-threaded CPU miner : Transaction compiler
    section Current Beta
        DAO Governance : Staking APY pools : Dynamic reward sweeps
        AI Sandbox Hub : Threat auditors : Tokenomics simulation graphs
        LunarFS : 64KB content chunking : NFT gallery collection
    section Future Releases
        Dynamic P2P : Sockets gossip relay : Multi-host local cluster networks
        Visual debugger : Interactive stack tracer : Executable VM compiler
    section Future Mining Network
        GPU Miner support : OpenCL mining worker threads : ASIC node resistance simulation
    section Future Educational Expansion
        DApp Marketplace : Local package installer : Automated coding challenges for smart contracts
```

---

## 18. Contribution Guide

We welcome contributions to the LunarCoin educational ecosystem. Follow these steps to set up the project locally:

1.  **Fork and Clone**:
    ```bash
    git clone https://github.com/your-username/lunar-coin-blockchain-explorer.git
    cd lunar-coin-blockchain-explorer
    ```
2.  **Initialize the Backend Core**:
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    python backend/main.py   # Runs API server on http://127.0.0.1:5000
    ```
3.  **Initialize the Desktop Frontend client**:
    ```bash
    npm install
    npm run dev             # Launches the Electron sandbox workspace
    ```
4.  **Create a Branch & Submit PR**:
    *   Create a branch for your feature (`git checkout -b feature/amazing-feature`).
    *   Commit changes and submit a PR to the main branch for review.

---

## 19. License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.
