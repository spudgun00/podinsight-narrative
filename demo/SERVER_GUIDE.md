# Server Guide - Running Both Versions

This demo has TWO versions that can run simultaneously on different ports:

## Quick Start

### 1. VC (Venture Capital) Version - Port 8000
```bash
cd demo
./serve.sh
```
- Opens at: http://localhost:8000/demo.html
- Features: Original VC-focused intelligence platform
- Topics: AI Infrastructure, B2B SaaS, Developer Tools, etc.
- Personalities: Brad Gerstner, Harry Stebbings, etc.

### 2. Crypto Version - Port 9000
```bash
cd demo
./serve-crypto.sh
```
- Opens at: http://localhost:9000/demo.html
- Features: Crypto/blockchain intelligence platform
- Topics: RWAs, ETH Restaking, Bitcoin L2s, Memecoins, etc.
- Personalities: Vitalik Buterin, Raoul Pal, Larry Fink, etc.

## Running Both Simultaneously

Open two terminal windows:

**Terminal 1 (VC Version):**
```bash
./serve.sh
```

**Terminal 2 (Crypto Version):**
```bash
./serve-crypto.sh
```

Now you can access:
- VC Dashboard: http://localhost:8000/demo.html
- Crypto Dashboard: http://localhost:9000/demo.html

## Manual Commands

If you prefer not to use the scripts:

**VC Version:**
```bash
python3 -m http.server 8000
```

**Crypto Version:**
```bash
python3 -m http.server 9000
```

## Stopping the Servers

Press `Ctrl+C` in the terminal window running the server.

## Note

Both versions share the same codebase but display different content based on the data files. The crypto version pulls from `crypto_data.json` while maintaining the exact same UI/UX structure.