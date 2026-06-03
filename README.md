# LunarMiner v1.0

## Educational Local Cryptocurrency Mining

A lightweight, fully offline cryptocurrency miner for educational purposes. Mines blocks completely locally on your own computer using proof-of-work consensus.

### Features

✅ **100% Offline** - No internet required, no cloud mining, no external APIs
✅ **Local Storage** - All blockchain data stored in `~/LunarCoinData/`
✅ **Educational** - Learn how blockchain and proof-of-work mining works
✅ **Proof-of-Work** - SHA256 hashing with configurable difficulty (4 leading zeros)
✅ **Self-Contained** - No external dependencies (uses Python standard library)
✅ **Persistent** - Continues mining sessions, saves progress locally
✅ **Simple Architecture** - Clean, well-commented code

### How It Works

1. **Genesis Block** - Creates the first block when starting
2. **Mining Loop** - Continuously mines blocks by finding valid SHA256 hashes
3. **Difficulty** - Valid hashes must start with "0000" (4 zeros)
4. **Rewards** - 1 LUNAR awarded per mined block
5. **Local Persistence** - Blockchain and wallet data saved in JSON format
6. **Validation** - Blockchain integrity checked regularly

### File Structure

```
lunar-miner/
├── block.py          # Block class with SHA256 hashing
├── blockchain.py     # Blockchain management and validation
├── miner.py          # Main mining engine (run this!)
├── wallet.py         # Wallet for tracking mining rewards
├── storage.py        # Local JSON persistence
├── requirements.txt  # Python dependencies
├── README.md         # This file
└── .gitignore        # Git ignore rules
```

### Quick Start

#### Prerequisites
- Python 3.6+
- No additional packages needed (uses standard library)

#### Installation

```bash
# Clone or navigate to the project
cd ~/Desktop/lunar-miner

# (Optional) Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On macOS/Linux
# or
venv\Scripts\activate     # On Windows
```

#### Run the Miner

```bash
python3 miner.py
```

#### Expected Output

```
╔════════════════════════════════════╗
║       LUNAR MINER v1.0             ║
║  Educational Local Crypto Mining   ║
╚════════════════════════════════════╝

[LUNAR MINER]
Mining started...

[INIT] Creating new blockchain...
[GENESIS] Creating genesis block...
[GENESIS] Genesis block mined: 0000abc123...
[INIT] Creating new wallet...
[INIT] Wallet created: A7F2B9C4D8E1F5A0

[STATUS] Chain length: 1
[STATUS] Wallet address: A7F2B9C4D8E1F5A0
[STATUS] Current balance: 0 LUNAR
[STATUS] Data directory: /Users/username/LunarCoinData

==================================================
Mining will continue until interrupted (Ctrl+C)
==================================================

[MINING] Block #1...
[BLOCK MINED] 0000def456...
Block #1 mined
Hash: 0000def456...
Nonce: 2847
Mining time: 1.23s
Reward: 1 LUNAR
Balance: 1 LUNAR
```

### Local Data Storage

All data is stored in `~/LunarCoinData/`:

```
~/LunarCoinData/
├── chain.json   # Complete blockchain (all blocks)
└── wallet.json  # Wallet address and balance
```

#### chain.json Example
```json
{
  "chain": [
    {
      "index": 0,
      "previous_hash": "0",
      "timestamp": "2026-05-26T10:30:45.123456",
      "data": "Genesis Block - LunarCoin Blockchain Initialized",
      "nonce": 1847,
      "hash": "0000abc123..."
    },
    {
      "index": 1,
      "previous_hash": "0000abc123...",
      "timestamp": "2026-05-26T10:31:02.654321",
      "data": "Mined by A7F2B9C4D8E1F5A0",
      "nonce": 2847,
      "hash": "0000def456..."
    }
  ],
  "difficulty": 4,
  "mining_reward": 1
}
```

#### wallet.json Example
```json
{
  "address": "A7F2B9C4D8E1F5A0",
  "balance": 5.0,
  "created_at": "2026-05-26T10:30:30.123456"
}
```

### Mining Details

#### Proof-of-Work Algorithm
1. Create a new block with incremented nonce
2. Calculate SHA256 hash of block data
3. Check if hash starts with "0000" (difficulty)
4. If yes → block is mined, add to chain
5. If no → increment nonce and repeat

#### Difficulty
- Current: 4 leading zeros ("0000")
- This takes ~1-2 seconds per block on modern computers
- Modifiable in `blockchain.py` constructor

#### Mining Rewards
- 1 LUNAR coin per successfully mined block
- Tracked in `wallet.json`
- Balance = number of blocks × reward

### Stop Mining

Press `Ctrl+C` to gracefully shutdown:
- Mining stops immediately
- Progress is saved to local storage
- Session info displayed

```
[SHUTDOWN] Mining interrupted by user
[SHUTDOWN] Total blocks mined: 42
[SHUTDOWN] Final balance: 42 LUNAR
[SHUTDOWN] Progress saved. Exiting.
```

### Resume Mining

Simply run the miner again:
```bash
python3 miner.py
```

- Loads existing blockchain from `~/LunarCoinData/chain.json`
- Loads existing wallet from `~/LunarCoinData/wallet.json`
- Continues mining new blocks
- Maintains complete mining history

### Educational Benefits

1. **Understand Blockchain** - See how blocks link together
2. **Learn Proof-of-Work** - Experience difficulty and mining time
3. **Hash Functions** - Observe SHA256 behavior
4. **Persistence** - Learn local file storage in JSON
5. **System Design** - Study blockchain architecture

### Validation

Blockchain is validated:
- After loading from storage
- Every 5 blocks during mining
- On shutdown

Checks:
- All block hashes are correctly calculated
- All blocks link to previous block
- All hashes meet difficulty requirement
- Chain integrity is maintained

### Architecture Overview

```
┌─────────────────────────────────────────┐
│         miner.py (Main)                 │
│     Mining Loop & User Interface        │
└─────────────────┬───────────────────────┘
                  │
    ┌─────────────┼─────────────┬─────────────┐
    │             │             │             │
    v             v             v             v
┌────────┐  ┌──────────┐  ┌────────┐  ┌─────────┐
│Block   │  │Blockchain│  │Wallet  │  │Storage  │
│        │  │          │  │        │  │         │
│ ·hash  │  │ ·chain   │  │·balance│  │·save    │
│ ·nonce │  │ ·validate│  │·address│  │·load    │
│ ·mine  │  │ ·reward  │  │·reward │  │·JSON    │
└────────┘  └──────────┘  └────────┘  └─────────┘
     │             │             │             │
     └─────────────┴─────────────┴─────────────┘
              SHA256 + JSON Local Storage
```

### Configuration

To modify mining parameters, edit `blockchain.py`:

```python
# In Blockchain.__init__()
self.difficulty = 4           # Change to 3 for easier, 5 for harder
self.mining_reward = 1        # Change to 10 for 10 LUNAR per block
```

### System Requirements

- Python 3.6+ (uses `pathlib`, which requires 3.4+)
- macOS, Linux, or Windows
- ~1MB disk space per 100 blocks
- 1 CPU core (will use available cores automatically)

### Troubleshooting

#### Slow Mining
- Mining is intentionally slow to demonstrate difficulty
- Change difficulty in `blockchain.py` to 3 (easier)
- Or wait - it's working correctly!

#### Data Not Persisting
- Check `~/LunarCoinData/` directory exists
- Ensure write permissions: `chmod 755 ~/LunarCoinData/`
- Check disk space available

#### Import Errors
- Ensure all `.py` files are in same directory
- Run: `python3 miner.py` (not just `miner.py`)

#### Blockchain Corruption
- Delete `~/LunarCoinData/chain.json` to start fresh
- Or delete both files to reset entirely
- Miner will create new genesis block

### Performance Notes

- Mining time: ~1-2 seconds per block (difficulty 4)
- Block size: ~400 bytes average
- Memory usage: <10MB for 1000 blocks
- Fully deterministic - same data always produces same hash

### Future Enhancements

- [ ] Transaction pools
- [ ] Multi-block simultaneous mining
- [ ] Difficulty adjustment
- [ ] Block explorer UI
- [ ] Network mode (peer-to-peer)
- [ ] Configurable currencies
- [ ] Mining difficulty display

### License

Educational project - free to use, modify, and learn from.

### Contributing

This is a learning project. Feel free to:
- Modify code to experiment
- Add features
- Improve efficiency
- Create forks

### Questions?

Read the well-commented source code in each file:
- `block.py` - Block creation and hashing
- `blockchain.py` - Chain management
- `wallet.py` - Balance tracking
- `storage.py` - Local persistence
- `miner.py` - Mining loop

### References

- [Blockchain Fundamentals](https://en.wikipedia.org/wiki/Blockchain)
- [Proof of Work](https://en.wikipedia.org/wiki/Proof_of_work)
- [SHA-256](https://en.wikipedia.org/wiki/SHA-2)
- [Bitcoin Mining](https://en.wikipedia.org/wiki/Bitcoin_mining)

---

**Happy Mining! 🚀**

Start your local LunarCoin blockchain today:
```bash
python3 miner.py
```
