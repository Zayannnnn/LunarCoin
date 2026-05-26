# Lunar Python Backend API Contract

LunarScan expects a local REST API at `NEXT_PUBLIC_API_URL` (default `http://127.0.0.1:5000`). WebSocket support is optional.

The local LunarMiner integration uses these top-level routes. Responses may use **snake_case** (Python) — the frontend maps them automatically.

## REST Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/status` | Miner status |
| GET | `/wallet` | Local wallet |
| GET | `/blocks` | Locally mined blocks |
| GET | `/mining-stats` | Mining statistics |
| POST | `/start-mining` | Start local mining |
| POST | `/stop-mining` | Stop local mining |

### Example: Network Stats

```json
{
  "chain_height": 42,
  "difficulty": 85000000000000,
  "hash_rate": "125.4 EH/s",
  "hash_rate_number": 125400000000000000000,
  "total_supply": 21000000,
  "circulating_supply": 19500000,
  "mempool_size": 120000000,
  "mempool_transactions": 1500,
  "connected_peers": 12,
  "last_block_time": 1716200000,
  "avg_block_time": 15.2,
  "avg_fee": 0.00025,
  "tps": 28.5
}
```

### Example: Block

```json
{
  "index": 42,
  "hash": "abc123...",
  "previous_hash": "def456...",
  "timestamp": 1716200000,
  "transaction_count": 120,
  "miner": "0xMinerAddress",
  "size": 85000,
  "reward": 6.25,
  "difficulty": 85000000000000,
  "nonce": 12345,
  "gas_used": 12000000,
  "gas_limit": 15000000
}
```

### Example: Transaction

```json
{
  "hash": "abc...",
  "sender": "0xFrom",
  "recipient": "0xTo",
  "amount": 1.5,
  "fee": 0.001,
  "status": "confirmed",
  "block_height": 42,
  "block_hash": "blockhash...",
  "confirmations": 3,
  "timestamp": 1716200000,
  "gas_price": 50,
  "gas_used": 21000,
  "nonce": 1
}
```

### Paginated Lists

Return either an array or:

```json
{
  "data": [...],
  "total": 1000,
  "page": 1,
  "limit": 10
}
```

## WebSocket

If `NEXT_PUBLIC_WS_URL` is configured, LunarScan can connect to that optional WebSocket. If it is unavailable, the app logs `WebSocket unavailable` and continues polling REST data.

### Message Format

```json
{
  "event": "network_stats",
  "payload": { ... }
}
```

Also supports `"type"` instead of `"event"` and `"data"` instead of `"payload"`.

### Events

| Event | Payload |
|-------|---------|
| `network_stats` | Network stats object (or `{ "stats": {...} }`) |
| `new_block` | Block object (or `{ "block": {...} }`) |
| `new_transaction` | Transaction object |
| `mempool_update` | Mempool object |

## CORS

Enable CORS for the Next.js origin (e.g. `https://lunar-coin-blockchain-explorer.vercel.app`) on the Python server.
