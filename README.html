<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>LunarCoin — Decentralized Educational Blockchain</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Outfit:wght@200;300;400;500;600;700;800;900&family=JetBrains+Mono:wght@300;400;500;600&display=swap');

  :root {
    --bg: #020409;
    --bg2: #060d1a;
    --bg3: #0a1628;
    --surface: #0d1f38;
    --surface2: #112244;
    --border: rgba(56, 139, 253, 0.18);
    --border-glow: rgba(56, 189, 248, 0.35);
    --moon: #c8d8f0;
    --accent: #38bdf8;
    --accent2: #818cf8;
    --accent3: #34d399;
    --accent4: #fb923c;
    --accent5: #f472b6;
    --gold: #fbbf24;
    --text: #e2eaf8;
    --text-dim: #6b83a8;
    --text-dimmer: #3a5070;
    --glow: 0 0 40px rgba(56,189,248,0.15);
    --glow2: 0 0 60px rgba(129,140,248,0.12);
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Outfit', sans-serif;
    font-weight: 300;
    overflow-x: hidden;
    line-height: 1.7;
  }

  /* STAR FIELD */
  #stars {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    pointer-events: none; z-index: 0;
    background: radial-gradient(ellipse at 20% 30%, rgba(56,189,248,0.04) 0%, transparent 60%),
                radial-gradient(ellipse at 80% 70%, rgba(129,140,248,0.04) 0%, transparent 60%),
                var(--bg);
  }

  .star {
    position: absolute;
    border-radius: 50%;
    background: white;
    animation: twinkle var(--d, 3s) ease-in-out infinite var(--delay, 0s);
  }

  @keyframes twinkle {
    0%, 100% { opacity: var(--min-op, 0.2); transform: scale(1); }
    50% { opacity: var(--max-op, 0.9); transform: scale(1.3); }
  }

  /* LAYOUT */
  .wrapper {
    position: relative;
    z-index: 1;
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 32px;
  }

  /* ===== HERO ===== */
  .hero {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 80px 32px 60px;
    position: relative;
  }

  .hero-glow {
    position: absolute;
    width: 800px; height: 800px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(56,189,248,0.07) 0%, rgba(129,140,248,0.04) 40%, transparent 70%);
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    animation: pulse-glow 6s ease-in-out infinite;
  }

  @keyframes pulse-glow {
    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    50% { transform: translate(-50%, -50%) scale(1.08); opacity: 0.7; }
  }

  .logo-wrap {
    position: relative;
    margin-bottom: 32px;
    animation: float 5s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-12px); }
  }

  .logo-ring {
    position: absolute;
    top: 50%; left: 50%;
    width: 160px; height: 160px;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    border: 1px solid var(--border-glow);
    animation: spin-ring 15s linear infinite;
  }

  .logo-ring::after {
    content: '';
    position: absolute;
    width: 8px; height: 8px;
    background: var(--accent);
    border-radius: 50%;
    top: -4px; left: 50%;
    transform: translateX(-50%);
    box-shadow: 0 0 12px var(--accent);
  }

  @keyframes spin-ring {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to { transform: translate(-50%, -50%) rotate(360deg); }
  }

  .logo-ring-2 {
    position: absolute;
    top: 50%; left: 50%;
    width: 200px; height: 200px;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    border: 1px dashed rgba(129,140,248,0.2);
    animation: spin-ring-rev 25s linear infinite;
  }

  @keyframes spin-ring-rev {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to { transform: translate(-50%, -50%) rotate(-360deg); }
  }

  .logo-img {
    width: 100px; height: 100px;
    border-radius: 50%;
    object-fit: cover;
    position: relative;
    z-index: 2;
    display: block;
    box-shadow: 0 0 40px rgba(56,189,248,0.3), 0 0 80px rgba(56,189,248,0.1);
  }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 16px;
    border: 1px solid var(--border);
    border-radius: 100px;
    background: rgba(56,189,248,0.06);
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: var(--accent);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 24px;
  }

  .hero-badge::before {
    content: '';
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--accent3);
    animation: blink 2s ease-in-out infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.2; }
  }

  .hero h1 {
    font-family: 'Outfit', sans-serif;
    font-weight: 800;
    font-size: clamp(52px, 8vw, 96px);
    letter-spacing: -0.03em;
    line-height: 1;
    background: linear-gradient(135deg, #e2eaf8 0%, #38bdf8 40%, #818cf8 80%, #c084fc 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 16px;
  }

  .hero-sub {
    font-family: 'Outfit', sans-serif;
    font-weight: 300;
    font-size: 18px;
    color: var(--text-dim);
    max-width: 560px;
    margin: 0 auto 40px;
    line-height: 1.6;
  }

  .hero-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    margin-bottom: 48px;
  }

  .chip {
    padding: 6px 14px;
    border-radius: 6px;
    font-size: 12px;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 500;
    letter-spacing: 0.05em;
    border: 1px solid;
  }

  .chip-blue { background: rgba(56,189,248,0.08); border-color: rgba(56,189,248,0.3); color: var(--accent); }
  .chip-purple { background: rgba(129,140,248,0.08); border-color: rgba(129,140,248,0.3); color: var(--accent2); }
  .chip-green { background: rgba(52,211,153,0.08); border-color: rgba(52,211,153,0.3); color: var(--accent3); }
  .chip-orange { background: rgba(251,146,60,0.08); border-color: rgba(251,146,60,0.3); color: var(--accent4); }
  .chip-pink { background: rgba(244,114,182,0.08); border-color: rgba(244,114,182,0.3); color: var(--accent5); }
  .chip-gold { background: rgba(251,191,36,0.08); border-color: rgba(251,191,36,0.3); color: var(--gold); }

  .cta-row {
    display: flex;
    gap: 14px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 13px 28px;
    background: linear-gradient(135deg, rgba(56,189,248,0.2), rgba(129,140,248,0.2));
    border: 1px solid var(--border-glow);
    border-radius: 8px;
    color: var(--text);
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .btn-primary::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(56,189,248,0.15), rgba(129,140,248,0.15));
    opacity: 0;
    transition: opacity 0.3s;
  }

  .btn-primary:hover::before { opacity: 1; }
  .btn-primary:hover { border-color: var(--accent); box-shadow: 0 0 20px rgba(56,189,248,0.2); }

  /* ===== DIVIDERS ===== */
  .section-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--border), transparent);
    margin: 80px 0;
  }

  /* ===== SECTION HEADERS ===== */
  .section-label {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }

  .section-label span {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: var(--accent);
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  .section-label::before {
    content: '';
    display: block;
    width: 3px; height: 16px;
    background: var(--accent);
    border-radius: 2px;
    box-shadow: 0 0 8px var(--accent);
  }

  .section-title {
    font-family: 'Outfit', sans-serif;
    font-weight: 700;
    font-size: clamp(28px, 4vw, 42px);
    letter-spacing: -0.02em;
    margin-bottom: 16px;
    color: var(--moon);
  }

  .section-desc {
    color: var(--text-dim);
    font-size: 15px;
    max-width: 580px;
    margin-bottom: 48px;
    line-height: 1.7;
  }

  /* ===== FEATURES GRID ===== */
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1px;
    background: var(--border);
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
  }

  .feature-card {
    background: var(--bg2);
    padding: 28px;
    transition: background 0.3s;
    position: relative;
    overflow: hidden;
  }

  .feature-card::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(56,189,248,0.04), transparent);
    opacity: 0;
    transition: opacity 0.3s;
  }

  .feature-card:hover { background: var(--surface); }
  .feature-card:hover::after { opacity: 1; }

  .feature-icon {
    width: 42px; height: 42px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    margin-bottom: 16px;
    position: relative;
    z-index: 1;
  }

  .feature-card h3 {
    font-family: 'Outfit', sans-serif;
    font-weight: 600;
    font-size: 16px;
    margin-bottom: 8px;
    color: var(--moon);
    position: relative;
    z-index: 1;
  }

  .feature-card p {
    font-size: 13px;
    color: var(--text-dim);
    line-height: 1.6;
    position: relative;
    z-index: 1;
  }

  .status-dot {
    display: inline-block;
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--accent3);
    box-shadow: 0 0 6px var(--accent3);
    margin-right: 6px;
    animation: blink 2s ease-in-out infinite;
  }

  /* ===== ARCHITECTURE ===== */
  .arch-container {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 48px 32px;
    position: relative;
    overflow: hidden;
    margin-bottom: 32px;
  }

  .arch-container::before {
    content: '';
    position: absolute;
    top: -1px; left: 20%; right: 20%; height: 2px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
  }

  .arch-title {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: var(--text-dimmer);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    margin-bottom: 40px;
    text-align: center;
  }

  /* ===== ANIMATED ARCHITECTURE SVG ===== */
  .arch-svg-wrap {
    position: relative;
    overflow: visible;
  }

  .arch-svg-wrap svg {
    width: 100%;
    overflow: visible;
  }

  /* Nodes */
  .arch-node {
    cursor: default;
    transition: filter 0.3s;
  }
  .arch-node:hover { filter: brightness(1.3); }

  .node-rect {
    rx: 8;
  }

  /* Flow lines animation */
  .flow-line {
    fill: none;
    stroke-width: 1.5;
    stroke-dasharray: 6 4;
    animation: dash-flow 2s linear infinite;
  }

  @keyframes dash-flow {
    to { stroke-dashoffset: -20; }
  }

  .flow-dot {
    r: 4;
    animation: flow-travel var(--dur, 2s) ease-in-out infinite var(--delay, 0s);
  }

  @keyframes flow-travel {
    0% { offset-distance: 0%; opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { offset-distance: 100%; opacity: 0; }
  }

  /* ===== PIPELINE ===== */
  .pipeline {
    display: flex;
    align-items: stretch;
    gap: 0;
    overflow-x: auto;
    padding: 8px 0;
    scrollbar-width: none;
  }

  .pipeline::-webkit-scrollbar { display: none; }

  .pipeline-step {
    flex: 1;
    min-width: 120px;
    text-align: center;
    position: relative;
  }

  .pipeline-step::after {
    content: '';
    position: absolute;
    top: 50%;
    right: -1px;
    width: 32px; height: 1px;
    background: linear-gradient(90deg, var(--border-glow), transparent);
    z-index: 1;
  }

  .pipeline-step:last-child::after { display: none; }

  .pipeline-node {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 20px 16px;
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: 12px;
    position: relative;
    width: calc(100% - 16px);
    margin: 0 8px;
    transition: all 0.3s;
  }

  .pipeline-node:hover {
    background: var(--surface);
    border-color: var(--border-glow);
    transform: translateY(-2px);
    box-shadow: var(--glow);
  }

  .pipeline-icon {
    font-size: 24px;
    line-height: 1;
  }

  .pipeline-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: var(--text-dim);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    text-align: center;
  }

  .pipeline-arrow {
    position: absolute;
    right: -20px; top: 50%;
    transform: translateY(-50%);
    color: var(--accent);
    font-size: 16px;
    z-index: 2;
    animation: arrow-pulse 1.5s ease-in-out infinite;
  }

  @keyframes arrow-pulse {
    0%, 100% { opacity: 0.4; transform: translateY(-50%) translateX(0); }
    50% { opacity: 1; transform: translateY(-50%) translateX(4px); }
  }

  /* ===== SCREENSHOTS ===== */
  .screenshots-section {}

  .screen-tabs {
    display: flex;
    gap: 4px;
    margin-bottom: 24px;
    flex-wrap: wrap;
    border-bottom: 1px solid var(--border);
    padding-bottom: 0;
  }

  .tab-btn {
    padding: 10px 18px;
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    color: var(--text-dim);
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
    margin-bottom: -1px;
  }

  .tab-btn:hover { color: var(--text); }
  .tab-btn.active { color: var(--accent); border-bottom-color: var(--accent); }

  .tab-content { display: none; }
  .tab-content.active { display: block; }

  .screen-frame {
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid var(--border);
    box-shadow: 0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px var(--border);
    position: relative;
    background: var(--bg3);
  }

  .screen-bar {
    height: 36px;
    background: var(--surface);
    display: flex;
    align-items: center;
    padding: 0 16px;
    gap: 8px;
    border-bottom: 1px solid var(--border);
  }

  .screen-dot {
    width: 10px; height: 10px;
    border-radius: 50%;
  }

  .screen-dot:nth-child(1) { background: #ff5f57; }
  .screen-dot:nth-child(2) { background: #febc2e; }
  .screen-dot:nth-child(3) { background: #28c840; }

  .screen-url {
    flex: 1;
    margin: 0 12px;
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: 6px;
    height: 22px;
    display: flex;
    align-items: center;
    padding: 0 10px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: var(--text-dimmer);
  }

  .screen-img {
    width: 100%;
    display: block;
  }

  /* ===== SCREENSHOTS GRID ===== */
  .screens-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
    gap: 20px;
  }

  .screen-card {
    border-radius: 14px;
    overflow: hidden;
    border: 1px solid var(--border);
    transition: all 0.3s ease;
    background: var(--bg3);
  }

  .screen-card:hover {
    border-color: var(--border-glow);
    box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 30px rgba(56,189,248,0.08);
    transform: translateY(-3px);
  }

  .screen-card .screen-bar {
    background: var(--surface);
  }

  .screen-card-label {
    padding: 12px 16px;
    background: var(--surface);
    border-top: 1px solid var(--border);
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: var(--text-dim);
    letter-spacing: 0.08em;
  }

  .screen-card-label strong {
    color: var(--accent);
    font-weight: 600;
  }

  /* ===== ROADMAP ===== */
  .roadmap {
    position: relative;
    padding-left: 40px;
  }

  .roadmap::before {
    content: '';
    position: absolute;
    left: 10px; top: 0; bottom: 0;
    width: 2px;
    background: linear-gradient(180deg, var(--accent), var(--accent2), var(--accent3), var(--accent4));
    border-radius: 2px;
  }

  .roadmap-item {
    position: relative;
    padding: 24px 28px;
    margin-bottom: 4px;
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 12px;
    transition: all 0.3s;
  }

  .roadmap-item:hover {
    background: var(--surface);
    border-color: var(--border-glow);
    transform: translateX(4px);
  }

  .roadmap-item::before {
    content: '';
    position: absolute;
    left: -35px; top: 50%;
    transform: translateY(-50%);
    width: 12px; height: 12px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 12px var(--accent);
    border: 2px solid var(--bg);
  }

  .roadmap-item.done::before { background: var(--accent3); box-shadow: 0 0 12px var(--accent3); }
  .roadmap-item.active::before { background: var(--gold); box-shadow: 0 0 12px var(--gold); animation: blink 1.5s ease-in-out infinite; }

  .roadmap-phase {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: var(--text-dimmer);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 6px;
  }

  .roadmap-title {
    font-family: 'Outfit', sans-serif;
    font-weight: 600;
    font-size: 17px;
    color: var(--moon);
    margin-bottom: 4px;
  }

  .roadmap-desc {
    font-size: 13px;
    color: var(--text-dim);
  }

  .roadmap-tag {
    display: inline-block;
    padding: 2px 10px;
    border-radius: 100px;
    font-size: 10px;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.08em;
    float: right;
    margin-top: 4px;
  }

  .tag-done { background: rgba(52,211,153,0.1); color: var(--accent3); border: 1px solid rgba(52,211,153,0.3); }
  .tag-active { background: rgba(251,191,36,0.1); color: var(--gold); border: 1px solid rgba(251,191,36,0.3); }
  .tag-soon { background: rgba(129,140,248,0.1); color: var(--accent2); border: 1px solid rgba(129,140,248,0.3); }

  /* ===== API CALLS SECTION ===== */
  .api-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  @media (max-width: 700px) {
    .api-grid { grid-template-columns: 1fr; }
  }

  .api-card {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 24px;
    transition: all 0.3s;
    position: relative;
    overflow: hidden;
  }

  .api-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    opacity: 0;
    transition: opacity 0.3s;
  }

  .api-card:hover { background: var(--surface); border-color: var(--border-glow); }
  .api-card:hover::before { opacity: 1; }

  .api-method {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.05em;
    margin-right: 8px;
    margin-bottom: 10px;
  }

  .method-get { background: rgba(52,211,153,0.15); color: var(--accent3); }
  .method-post { background: rgba(56,189,248,0.15); color: var(--accent); }
  .method-ws { background: rgba(251,191,36,0.15); color: var(--gold); }

  .api-path {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    color: var(--moon);
    margin-bottom: 8px;
  }

  .api-desc {
    font-size: 12px;
    color: var(--text-dim);
    line-height: 1.5;
  }

  /* ===== INSTALL ===== */
  .install-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  @media (max-width: 600px) { .install-grid { grid-template-columns: 1fr; } }

  .install-card {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 28px;
    text-align: center;
    transition: all 0.3s;
  }

  .install-card:hover {
    background: var(--surface);
    border-color: var(--border-glow);
    box-shadow: var(--glow);
  }

  .install-os {
    font-size: 42px;
    margin-bottom: 16px;
    display: block;
  }

  .install-name {
    font-family: 'Outfit', sans-serif;
    font-weight: 600;
    font-size: 18px;
    color: var(--moon);
    margin-bottom: 8px;
  }

  .install-file {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: var(--accent);
    background: rgba(56,189,248,0.08);
    border: 1px solid rgba(56,189,248,0.2);
    border-radius: 6px;
    padding: 8px 16px;
    display: inline-block;
    margin-top: 12px;
  }

  /* ===== SECURITY SECTION ===== */
  .security-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  @media (max-width: 700px) { .security-grid { grid-template-columns: 1fr; } }

  .security-card {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 24px 20px;
    text-align: center;
    transition: all 0.3s;
  }

  .security-card:hover {
    background: var(--surface);
    border-color: var(--border-glow);
    transform: translateY(-2px);
  }

  .security-icon {
    font-size: 32px;
    margin-bottom: 12px;
    display: block;
  }

  .security-card h4 {
    font-family: 'Outfit', sans-serif;
    font-weight: 600;
    font-size: 14px;
    color: var(--moon);
    margin-bottom: 8px;
  }

  .security-card p {
    font-size: 12px;
    color: var(--text-dim);
    line-height: 1.5;
  }

  /* ===== STATS BAR ===== */
  .stats-bar {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: var(--border);
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
  }

  @media (max-width: 600px) { .stats-bar { grid-template-columns: repeat(2, 1fr); } }

  .stat-item {
    background: var(--bg2);
    padding: 28px 20px;
    text-align: center;
    transition: background 0.3s;
  }

  .stat-item:hover { background: var(--surface); }

  .stat-value {
    font-family: 'Outfit', sans-serif;
    font-weight: 800;
    font-size: 32px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1;
    margin-bottom: 6px;
  }

  .stat-label {
    font-size: 11px;
    color: var(--text-dim);
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  /* ===== FOOTER ===== */
  .footer {
    padding: 60px 32px;
    text-align: center;
    border-top: 1px solid var(--border);
    margin-top: 80px;
    position: relative;
  }

  .footer-tagline {
    font-family: 'Outfit', sans-serif;
    font-weight: 200;
    font-size: 22px;
    color: var(--text-dim);
    letter-spacing: 0.02em;
    margin-bottom: 8px;
  }

  .footer-tagline span {
    color: var(--moon);
    font-weight: 400;
  }

  .footer-sub {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: var(--text-dimmer);
    letter-spacing: 0.15em;
  }

  /* ===== CODE BLOCK ===== */
  .code-block {
    background: rgba(0,0,0,0.4);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 20px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: var(--accent);
    margin: 16px 0;
    position: relative;
    overflow-x: auto;
  }

  .code-block .comment { color: var(--text-dimmer); }
  .code-block .string { color: var(--accent3); }
  .code-block .keyword { color: var(--accent5); }
  .code-block .number { color: var(--gold); }

  /* ===== ANIMATED CONNECTION LINES ===== */
  @keyframes data-flow {
    0% { stroke-dashoffset: 1000; }
    100% { stroke-dashoffset: 0; }
  }

  .data-line {
    stroke-dasharray: 8 4;
    stroke-dashoffset: 1000;
    animation: data-flow 3s linear infinite;
  }

  /* ===== RESPONSIVE ===== */
  @media (max-width: 768px) {
    .screens-grid { grid-template-columns: 1fr; }
    .features-grid { grid-template-columns: 1fr; }
  }

  /* ===== SCROLL FADE-IN ===== */
  .fade-in {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .fade-in.visible {
    opacity: 1;
    transform: none;
  }

  section { padding: 80px 0; }

  /* ===== MODULE TABLE ===== */
  .module-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 24px;
  }

  .module-table th {
    text-align: left;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: var(--text-dimmer);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border);
  }

  .module-table td {
    padding: 14px 16px;
    font-size: 13px;
    border-bottom: 1px solid rgba(56,139,253,0.08);
    vertical-align: middle;
  }

  .module-table tr:hover td { background: rgba(56,189,248,0.04); }

  .module-table td:first-child {
    font-family: 'JetBrains Mono', monospace;
    color: var(--accent);
    font-size: 12px;
  }

  .module-table td:last-child { text-align: center; }

</style>
</head>
<body>

<!-- Stars background -->
<div id="stars"></div>

<!-- ===== HERO ===== -->
<div class="hero">
  <div class="hero-glow"></div>
  
  <div style="position:relative; z-index:2; width:100%; max-width:1100px; margin:0 auto;">
    <div class="logo-wrap" style="display:flex; justify-content:center; align-items:center;">
      <div class="logo-ring-2"></div>
      <div class="logo-ring"></div>
      <img src="https://res.cloudinary.com/dhxmwk5of/image/upload/q_auto/f_auto/v1779609291/20260524_132338_wkrjvx.png" alt="LunarCoin" class="logo-img">
    </div>

    <div class="hero-badge">v0.1.0-beta &nbsp;&bull;&nbsp; Educational Blockchain Platform</div>

    <h1>LunarCoin</h1>

    <p class="hero-sub">
      A local-first educational blockchain ecosystem. Mine blocks. Sign transactions. Deploy smart contracts. Run AI agents. All on your own machine.
    </p>

    <div class="hero-chips">
      <span class="chip chip-blue">Proof-of-Work</span>
      <span class="chip chip-purple">ECDSA Wallets</span>
      <span class="chip chip-green">P2P Network</span>
      <span class="chip chip-orange">Smart Contracts</span>
      <span class="chip chip-pink">AI Agents</span>
      <span class="chip chip-gold">DAO Governance</span>
      <span class="chip chip-blue">LunarFS</span>
      <span class="chip chip-purple">NFTs</span>
      <span class="chip chip-green">DApps</span>
    </div>

    <div class="cta-row">
      <a href="https://github.com/Zayannnnn/LunarCoin/releases/tag/v0.1.0-beta" class="btn-primary">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
        Download Release
      </a>
      <a href="#architecture" class="btn-primary">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="8 12 12 16 16 12"/><line x1="12" y1="8" x2="12" y2="16"/></svg>
        Explore Architecture
      </a>
    </div>
  </div>
</div>

<div class="wrapper">

  <!-- STATS -->
  <div class="fade-in">
    <div class="stats-bar">
      <div class="stat-item">
        <div class="stat-value">13+</div>
        <div class="stat-label">Core Modules</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">SHA-256</div>
        <div class="stat-label">Proof of Work</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">secp256k1</div>
        <div class="stat-label">Cryptography</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">100%</div>
        <div class="stat-label">Local-First</div>
      </div>
    </div>
  </div>

  <div class="section-divider"></div>

  <!-- ===== SYSTEM ARCHITECTURE ===== -->
  <section id="architecture">
    <div class="fade-in">
      <div class="section-label"><span>System Architecture</span></div>
      <h2 class="section-title">How LunarCoin Works</h2>
      <p class="section-desc">Every component is orchestrated through a local API node. The Electron client talks to the blockchain engine, wallet, mempool, miner, P2P layer, smart contracts, governance, AI agents, and distributed storage — all running on your machine.</p>
    </div>

    <div class="arch-container fade-in">
      <div class="arch-title">// LIVE SYSTEM ARCHITECTURE — COMPONENT INTERACTION MAP</div>
      
      <!-- Main Architecture SVG -->
      <div class="arch-svg-wrap">
        <svg viewBox="0 0 960 560" xmlns="http://www.w3.org/2000/svg" style="max-height:560px;">
          <defs>
            <filter id="glow-blue">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="glow-purple">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <marker id="arrow-blue" markerWidth="8" markerHeight="8" refX="4" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="rgba(56,189,248,0.7)"/>
            </marker>
            <marker id="arrow-purple" markerWidth="8" markerHeight="8" refX="4" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="rgba(129,140,248,0.7)"/>
            </marker>
            <marker id="arrow-green" markerWidth="8" markerHeight="8" refX="4" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="rgba(52,211,153,0.7)"/>
            </marker>
            <marker id="arrow-gold" markerWidth="8" markerHeight="8" refX="4" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="rgba(251,191,36,0.7)"/>
            </marker>
            <!-- Animated dot along path -->
            <circle id="dot-template" r="4"/>
          </defs>

          <!-- Background grid lines -->
          <g opacity="0.04">
            <line x1="0" y1="80" x2="960" y2="80" stroke="#38bdf8" stroke-width="0.5"/>
            <line x1="0" y1="160" x2="960" y2="160" stroke="#38bdf8" stroke-width="0.5"/>
            <line x1="0" y1="240" x2="960" y2="240" stroke="#38bdf8" stroke-width="0.5"/>
            <line x1="0" y1="320" x2="960" y2="320" stroke="#38bdf8" stroke-width="0.5"/>
            <line x1="0" y1="400" x2="960" y2="400" stroke="#38bdf8" stroke-width="0.5"/>
            <line x1="0" y1="480" x2="960" y2="480" stroke="#38bdf8" stroke-width="0.5"/>
            <line x1="96" y1="0" x2="96" y2="560" stroke="#38bdf8" stroke-width="0.5"/>
            <line x1="192" y1="0" x2="192" y2="560" stroke="#38bdf8" stroke-width="0.5"/>
            <line x1="288" y1="0" x2="288" y2="560" stroke="#38bdf8" stroke-width="0.5"/>
            <line x1="384" y1="0" x2="384" y2="560" stroke="#38bdf8" stroke-width="0.5"/>
            <line x1="480" y1="0" x2="480" y2="560" stroke="#38bdf8" stroke-width="0.5"/>
            <line x1="576" y1="0" x2="576" y2="560" stroke="#38bdf8" stroke-width="0.5"/>
            <line x1="672" y1="0" x2="672" y2="560" stroke="#38bdf8" stroke-width="0.5"/>
            <line x1="768" y1="0" x2="768" y2="560" stroke="#38bdf8" stroke-width="0.5"/>
            <line x1="864" y1="0" x2="864" y2="560" stroke="#38bdf8" stroke-width="0.5"/>
          </g>

          <!-- ===== NODES ===== -->

          <!-- USER -->
          <g class="arch-node" filter="url(#glow-blue)">
            <rect x="30" y="240" width="100" height="52" rx="8" fill="rgba(56,189,248,0.12)" stroke="rgba(56,189,248,0.6)" stroke-width="1.5"/>
            <text x="80" y="261" text-anchor="middle" fill="#38bdf8" font-family="JetBrains Mono" font-size="10" letter-spacing="1">USER</text>
            <text x="80" y="279" text-anchor="middle" fill="rgba(56,189,248,0.5)" font-family="JetBrains Mono" font-size="8">Electron Client</text>
            <circle cx="80" cy="295" r="3" fill="#38bdf8" opacity="0.6"/>
          </g>

          <!-- EXPLORER -->
          <g class="arch-node">
            <rect x="30" y="380" width="100" height="52" rx="8" fill="rgba(129,140,248,0.1)" stroke="rgba(129,140,248,0.5)" stroke-width="1.5"/>
            <text x="80" y="401" text-anchor="middle" fill="#818cf8" font-family="JetBrains Mono" font-size="10" letter-spacing="1">LUNAR</text>
            <text x="80" y="416" text-anchor="middle" fill="#818cf8" font-family="JetBrains Mono" font-size="10" letter-spacing="1">SCAN</text>
            <text x="80" y="431" text-anchor="middle" fill="rgba(129,140,248,0.5)" font-family="JetBrains Mono" font-size="8">Explorer UI</text>
          </g>

          <!-- LOCAL API NODE — CENTER -->
          <g class="arch-node" filter="url(#glow-blue)">
            <rect x="200" y="226" width="130" height="80" rx="10" fill="rgba(56,189,248,0.15)" stroke="rgba(56,189,248,0.8)" stroke-width="2"/>
            <text x="265" y="251" text-anchor="middle" fill="#38bdf8" font-family="JetBrains Mono" font-size="11" letter-spacing="1" font-weight="bold">LOCAL</text>
            <text x="265" y="266" text-anchor="middle" fill="#38bdf8" font-family="JetBrains Mono" font-size="11" letter-spacing="1" font-weight="bold">API NODE</text>
            <text x="265" y="285" text-anchor="middle" fill="rgba(56,189,248,0.5)" font-family="JetBrains Mono" font-size="8">Flask / WebSocket</text>
            <circle cx="265" cy="298" r="3" fill="#38bdf8" opacity="0.8">
              <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite"/>
            </circle>
          </g>

          <!-- WALLET ENGINE -->
          <g class="arch-node">
            <rect x="420" y="80" width="110" height="52" rx="8" fill="rgba(244,114,182,0.1)" stroke="rgba(244,114,182,0.5)" stroke-width="1.5"/>
            <text x="475" y="101" text-anchor="middle" fill="#f472b6" font-family="JetBrains Mono" font-size="9" letter-spacing="1">WALLET</text>
            <text x="475" y="116" text-anchor="middle" fill="#f472b6" font-family="JetBrains Mono" font-size="9" letter-spacing="1">ENGINE</text>
            <text x="475" y="129" text-anchor="middle" fill="rgba(244,114,182,0.5)" font-family="JetBrains Mono" font-size="8">ECDSA secp256k1</text>
          </g>

          <!-- MINING ENGINE -->
          <g class="arch-node">
            <rect x="420" y="170" width="110" height="52" rx="8" fill="rgba(251,191,36,0.1)" stroke="rgba(251,191,36,0.5)" stroke-width="1.5"/>
            <text x="475" y="191" text-anchor="middle" fill="#fbbf24" font-family="JetBrains Mono" font-size="9" letter-spacing="1">MINING</text>
            <text x="475" y="206" text-anchor="middle" fill="#fbbf24" font-family="JetBrains Mono" font-size="9" letter-spacing="1">ENGINE</text>
            <text x="475" y="219" text-anchor="middle" fill="rgba(251,191,36,0.5)" font-family="JetBrains Mono" font-size="8">SHA-256 PoW</text>
          </g>

          <!-- BLOCKCHAIN ENGINE -->
          <g class="arch-node" filter="url(#glow-blue)">
            <rect x="420" y="260" width="110" height="52" rx="8" fill="rgba(56,189,248,0.12)" stroke="rgba(56,189,248,0.6)" stroke-width="1.5"/>
            <text x="475" y="281" text-anchor="middle" fill="#38bdf8" font-family="JetBrains Mono" font-size="9" letter-spacing="1">CHAIN</text>
            <text x="475" y="296" text-anchor="middle" fill="#38bdf8" font-family="JetBrains Mono" font-size="9" letter-spacing="1">ENGINE</text>
            <text x="475" y="309" text-anchor="middle" fill="rgba(56,189,248,0.5)" font-family="JetBrains Mono" font-size="8">Validation + Storage</text>
          </g>

          <!-- MEMPOOL -->
          <g class="arch-node">
            <rect x="420" y="350" width="110" height="52" rx="8" fill="rgba(52,211,153,0.1)" stroke="rgba(52,211,153,0.5)" stroke-width="1.5"/>
            <text x="475" y="371" text-anchor="middle" fill="#34d399" font-family="JetBrains Mono" font-size="9" letter-spacing="1">MEMPOOL</text>
            <text x="475" y="386" text-anchor="middle" fill="rgba(52,211,153,0.5)" font-family="JetBrains Mono" font-size="8">Pending TXs</text>
            <circle cx="475" cy="398" r="3" fill="#34d399" opacity="0.8">
              <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite"/>
            </circle>
          </g>

          <!-- P2P NETWORK -->
          <g class="arch-node">
            <rect x="420" y="440" width="110" height="52" rx="8" fill="rgba(129,140,248,0.1)" stroke="rgba(129,140,248,0.5)" stroke-width="1.5"/>
            <text x="475" y="461" text-anchor="middle" fill="#818cf8" font-family="JetBrains Mono" font-size="9" letter-spacing="1">P2P</text>
            <text x="475" y="476" text-anchor="middle" fill="#818cf8" font-family="JetBrains Mono" font-size="9" letter-spacing="1">NETWORK</text>
            <text x="475" y="489" text-anchor="middle" fill="rgba(129,140,248,0.5)" font-family="JetBrains Mono" font-size="8">WebSocket</text>
          </g>

          <!-- CONSENSUS -->
          <g class="arch-node">
            <rect x="640" y="200" width="110" height="52" rx="8" fill="rgba(56,189,248,0.08)" stroke="rgba(56,189,248,0.4)" stroke-width="1.5"/>
            <text x="695" y="221" text-anchor="middle" fill="#38bdf8" font-family="JetBrains Mono" font-size="9" letter-spacing="1">CONSENSUS</text>
            <text x="695" y="236" text-anchor="middle" fill="#38bdf8" font-family="JetBrains Mono" font-size="9" letter-spacing="1">LAYER</text>
            <text x="695" y="249" text-anchor="middle" fill="rgba(56,189,248,0.5)" font-family="JetBrains Mono" font-size="8">Longest Chain</text>
          </g>

          <!-- SMART CONTRACTS -->
          <g class="arch-node">
            <rect x="640" y="80" width="110" height="52" rx="8" fill="rgba(251,146,60,0.1)" stroke="rgba(251,146,60,0.5)" stroke-width="1.5"/>
            <text x="695" y="101" text-anchor="middle" fill="#fb923c" font-family="JetBrains Mono" font-size="9" letter-spacing="1">LUNAR</text>
            <text x="695" y="116" text-anchor="middle" fill="#fb923c" font-family="JetBrains Mono" font-size="9" letter-spacing="1">VM</text>
            <text x="695" y="129" text-anchor="middle" fill="rgba(251,146,60,0.5)" font-family="JetBrains Mono" font-size="8">Smart Contracts</text>
          </g>

          <!-- DAO GOVERNANCE -->
          <g class="arch-node">
            <rect x="640" y="300" width="110" height="52" rx="8" fill="rgba(244,114,182,0.08)" stroke="rgba(244,114,182,0.4)" stroke-width="1.5"/>
            <text x="695" y="321" text-anchor="middle" fill="#f472b6" font-family="JetBrains Mono" font-size="9" letter-spacing="1">DAO</text>
            <text x="695" y="336" text-anchor="middle" fill="#f472b6" font-family="JetBrains Mono" font-size="9" letter-spacing="1">GOVERNANCE</text>
            <text x="695" y="349" text-anchor="middle" fill="rgba(244,114,182,0.5)" font-family="JetBrains Mono" font-size="8">Proposals + Voting</text>
          </g>

          <!-- AI AGENTS -->
          <g class="arch-node">
            <rect x="640" y="390" width="110" height="52" rx="8" fill="rgba(129,140,248,0.12)" stroke="rgba(129,140,248,0.6)" stroke-width="1.5"/>
            <text x="695" y="411" text-anchor="middle" fill="#818cf8" font-family="JetBrains Mono" font-size="9" letter-spacing="1">AI AGENTS</text>
            <text x="695" y="426" text-anchor="middle" fill="rgba(129,140,248,0.5)" font-family="JetBrains Mono" font-size="8">Autonomous Layer</text>
            <circle cx="695" cy="438" r="3" fill="#818cf8" opacity="0.8">
              <animate attributeName="r" values="2;5;2" dur="3s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.4;0.9;0.4" dur="3s" repeatCount="indefinite"/>
            </circle>
          </g>

          <!-- LUNAR FS -->
          <g class="arch-node">
            <rect x="640" y="480" width="110" height="52" rx="8" fill="rgba(52,211,153,0.08)" stroke="rgba(52,211,153,0.4)" stroke-width="1.5"/>
            <text x="695" y="501" text-anchor="middle" fill="#34d399" font-family="JetBrains Mono" font-size="9" letter-spacing="1">LUNAR FS</text>
            <text x="695" y="516" text-anchor="middle" fill="rgba(52,211,153,0.5)" font-family="JetBrains Mono" font-size="8">Distributed Storage</text>
            <text x="695" y="529" text-anchor="middle" fill="rgba(52,211,153,0.5)" font-family="JetBrains Mono" font-size="8">+ NFTs + DApps</text>
          </g>

          <!-- LOCAL STORAGE -->
          <g class="arch-node">
            <rect x="830" y="226" width="100" height="52" rx="8" fill="rgba(52,211,153,0.08)" stroke="rgba(52,211,153,0.4)" stroke-width="1.5"/>
            <text x="880" y="247" text-anchor="middle" fill="#34d399" font-family="JetBrains Mono" font-size="9" letter-spacing="1">LOCAL</text>
            <text x="880" y="262" text-anchor="middle" fill="#34d399" font-family="JetBrains Mono" font-size="9" letter-spacing="1">STORAGE</text>
            <text x="880" y="275" text-anchor="middle" fill="rgba(52,211,153,0.5)" font-family="JetBrains Mono" font-size="8">LevelDB</text>
          </g>

          <!-- PEERS -->
          <g class="arch-node">
            <rect x="830" y="440" width="100" height="52" rx="8" fill="rgba(129,140,248,0.08)" stroke="rgba(129,140,248,0.4)" stroke-width="1.5"/>
            <text x="880" y="461" text-anchor="middle" fill="#818cf8" font-family="JetBrains Mono" font-size="9" letter-spacing="1">PEERS</text>
            <text x="880" y="476" text-anchor="middle" fill="rgba(129,140,248,0.5)" font-family="JetBrains Mono" font-size="8">Remote Nodes</text>
          </g>

          <!-- ===== FLOW LINES ===== -->
          
          <!-- User → API -->
          <path d="M130 266 L200 266" class="flow-line" stroke="rgba(56,189,248,0.5)" marker-end="url(#arrow-blue)"/>
          <!-- Explorer → API -->
          <path d="M130 406 L200 310 " class="flow-line" stroke="rgba(129,140,248,0.4)" marker-end="url(#arrow-purple)" stroke-dasharray="5 4"/>

          <!-- API → Wallet -->
          <path d="M330 246 L420 106" class="flow-line" stroke="rgba(244,114,182,0.4)" marker-end="url(#arrow-blue)" stroke-dasharray="5 4"/>
          <!-- API → Mining -->
          <path d="M330 252 L420 196" class="flow-line" stroke="rgba(251,191,36,0.4)" marker-end="url(#arrow-gold)" stroke-dasharray="5 4"/>
          <!-- API → Chain -->
          <path d="M330 266 L420 286" class="flow-line" stroke="rgba(56,189,248,0.5)" marker-end="url(#arrow-blue)"/>
          <!-- API → Mempool -->
          <path d="M330 280 L420 376" class="flow-line" stroke="rgba(52,211,153,0.4)" marker-end="url(#arrow-green)" stroke-dasharray="5 4"/>
          <!-- API → P2P -->
          <path d="M330 295 L420 466" class="flow-line" stroke="rgba(129,140,248,0.4)" marker-end="url(#arrow-purple)" stroke-dasharray="5 4"/>
          <!-- API → SmartContracts -->
          <path d="M330 240 L640 106" class="flow-line" stroke="rgba(251,146,60,0.35)" marker-end="url(#arrow-blue)" stroke-dasharray="4 6"/>
          <!-- API → DAO -->
          <path d="M330 285 L640 326" class="flow-line" stroke="rgba(244,114,182,0.3)" marker-end="url(#arrow-blue)" stroke-dasharray="4 6"/>
          <!-- API → AI -->
          <path d="M330 295 L640 416" class="flow-line" stroke="rgba(129,140,248,0.3)" marker-end="url(#arrow-purple)" stroke-dasharray="4 6"/>
          <!-- API → LunarFS -->
          <path d="M330 300 L640 506" class="flow-line" stroke="rgba(52,211,153,0.25)" marker-end="url(#arrow-green)" stroke-dasharray="4 6"/>

          <!-- Mining → Consensus -->
          <path d="M530 196 L640 226" class="flow-line" stroke="rgba(251,191,36,0.5)" marker-end="url(#arrow-gold)"/>
          <!-- Chain → Consensus -->
          <path d="M530 286 L640 250" class="flow-line" stroke="rgba(56,189,248,0.4)" marker-end="url(#arrow-blue)"/>
          <!-- Chain → Storage -->
          <path d="M530 286 L830 252" class="flow-line" stroke="rgba(52,211,153,0.4)" marker-end="url(#arrow-green)" stroke-dasharray="5 5"/>
          <!-- P2P → Peers -->
          <path d="M530 466 L830 466" class="flow-line" stroke="rgba(129,140,248,0.4)" marker-end="url(#arrow-purple)"/>

          <!-- ===== ANIMATED DOTS ===== -->
          <!-- dot on User→API path -->
          <circle r="4" fill="#38bdf8" opacity="0.9" filter="url(#glow-blue)">
            <animateMotion dur="1.8s" repeatCount="indefinite" path="M130 266 L200 266"/>
            <animate attributeName="opacity" values="0;1;1;0" dur="1.8s" repeatCount="indefinite"/>
          </circle>
          <!-- dot on API→Chain -->
          <circle r="4" fill="#38bdf8" opacity="0.8" filter="url(#glow-blue)">
            <animateMotion dur="2.2s" repeatCount="indefinite" begin="0.5s" path="M330 266 L420 286"/>
            <animate attributeName="opacity" values="0;1;1;0" dur="2.2s" repeatCount="indefinite" begin="0.5s"/>
          </circle>
          <!-- dot on API→Mining -->
          <circle r="4" fill="#fbbf24" opacity="0.8">
            <animateMotion dur="2s" repeatCount="indefinite" begin="0.8s" path="M330 252 L420 196"/>
            <animate attributeName="opacity" values="0;1;1;0" dur="2s" repeatCount="indefinite" begin="0.8s"/>
          </circle>
          <!-- dot on Mining→Consensus -->
          <circle r="4" fill="#fbbf24" opacity="0.8">
            <animateMotion dur="1.6s" repeatCount="indefinite" begin="1.2s" path="M530 196 L640 226"/>
            <animate attributeName="opacity" values="0;1;1;0" dur="1.6s" repeatCount="indefinite" begin="1.2s"/>
          </circle>
          <!-- dot on Chain→Storage -->
          <circle r="3" fill="#34d399" opacity="0.8">
            <animateMotion dur="2.5s" repeatCount="indefinite" begin="0.3s" path="M530 286 L830 252"/>
            <animate attributeName="opacity" values="0;1;1;0" dur="2.5s" repeatCount="indefinite" begin="0.3s"/>
          </circle>
          <!-- dot on API→AI -->
          <circle r="3" fill="#818cf8" opacity="0.8">
            <animateMotion dur="2.8s" repeatCount="indefinite" begin="1s" path="M330 295 L640 416"/>
            <animate attributeName="opacity" values="0;1;1;0" dur="2.8s" repeatCount="indefinite" begin="1s"/>
          </circle>
          <!-- dot on P2P→Peers -->
          <circle r="3" fill="#818cf8" opacity="0.8">
            <animateMotion dur="2s" repeatCount="indefinite" begin="1.5s" path="M530 466 L830 466"/>
            <animate attributeName="opacity" values="0;1;1;0" dur="2s" repeatCount="indefinite" begin="1.5s"/>
          </circle>
          <!-- dot on API→Mempool -->
          <circle r="3" fill="#34d399" opacity="0.8">
            <animateMotion dur="2.2s" repeatCount="indefinite" begin="0.6s" path="M330 280 L420 376"/>
            <animate attributeName="opacity" values="0;1;1;0" dur="2.2s" repeatCount="indefinite" begin="0.6s"/>
          </circle>

          <!-- LABELS for connections -->
          <text x="160" y="256" fill="rgba(56,189,248,0.5)" font-family="JetBrains Mono" font-size="8" letter-spacing="0.5">HTTP / WS</text>
          <text x="547" y="217" fill="rgba(251,191,36,0.5)" font-family="JetBrains Mono" font-size="7" letter-spacing="0.5">block→</text>
          <text x="660" y="276" fill="rgba(56,189,248,0.4)" font-family="JetBrains Mono" font-size="7" letter-spacing="0.5">validate</text>

        </svg>
      </div>
    </div>

    <!-- REQUEST FLOW -->
    <div class="arch-container fade-in">
      <div class="arch-title">// TRANSACTION LIFECYCLE — END TO END FLOW</div>
      <div class="pipeline">
        <div class="pipeline-step">
          <div class="pipeline-node">
            <span class="pipeline-icon">🖥️</span>
            <span class="pipeline-label">Client UI</span>
          </div>
        </div>
        <div class="pipeline-step">
          <div class="pipeline-node">
            <span class="pipeline-icon">🔌</span>
            <span class="pipeline-label">REST API</span>
          </div>
        </div>
        <div class="pipeline-step">
          <div class="pipeline-node">
            <span class="pipeline-icon">🔑</span>
            <span class="pipeline-label">Wallet Sign</span>
          </div>
        </div>
        <div class="pipeline-step">
          <div class="pipeline-node">
            <span class="pipeline-icon">✅</span>
            <span class="pipeline-label">ECDSA Verify</span>
          </div>
        </div>
        <div class="pipeline-step">
          <div class="pipeline-node">
            <span class="pipeline-icon">📥</span>
            <span class="pipeline-label">Mempool Queue</span>
          </div>
        </div>
        <div class="pipeline-step">
          <div class="pipeline-node">
            <span class="pipeline-icon">⛏️</span>
            <span class="pipeline-label">SHA-256 Mine</span>
          </div>
        </div>
        <div class="pipeline-step">
          <div class="pipeline-node">
            <span class="pipeline-icon">🔗</span>
            <span class="pipeline-label">Chain Append</span>
          </div>
        </div>
        <div class="pipeline-step">
          <div class="pipeline-node">
            <span class="pipeline-icon">📡</span>
            <span class="pipeline-label">P2P Broadcast</span>
          </div>
        </div>
        <div class="pipeline-step">
          <div class="pipeline-node">
            <span class="pipeline-icon">🌐</span>
            <span class="pipeline-label">Peers Sync</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="section-divider"></div>

  <!-- ===== API CALLS ===== -->
  <section>
    <div class="fade-in">
      <div class="section-label"><span>API Reference</span></div>
      <h2 class="section-title">Core API Endpoints</h2>
      <p class="section-desc">The local API node exposes REST and WebSocket interfaces for all blockchain operations. Every module communicates through these endpoints.</p>
    </div>

    <div class="api-grid fade-in">
      <div class="api-card">
        <span class="api-method method-get">GET</span>
        <div class="api-path">/api/chain</div>
        <p class="api-desc">Returns the full blockchain. Used by the explorer and dashboard to render live chain data, block heights, and hash verification.</p>
      </div>
      <div class="api-card">
        <span class="api-method method-post">POST</span>
        <div class="api-path">/api/mine</div>
        <p class="api-desc">Triggers the SHA-256 Proof-of-Work mining engine. Collects pending transactions from mempool, builds a candidate block, discovers nonce, and broadcasts to peers.</p>
      </div>
      <div class="api-card">
        <span class="api-method method-post">POST</span>
        <div class="api-path">/api/transactions/new</div>
        <p class="api-desc">Creates a new signed transaction. Verifies ECDSA signature, validates sender balance, and adds to the mempool queue for next block.</p>
      </div>
      <div class="api-card">
        <span class="api-method method-get">GET</span>
        <div class="api-path">/api/mempool</div>
        <p class="api-desc">Lists all pending unconfirmed transactions sorted by fee priority. The mining engine reads from this before building each block candidate.</p>
      </div>
      <div class="api-card">
        <span class="api-method method-post">POST</span>
        <div class="api-path">/api/wallet/create</div>
        <p class="api-desc">Generates a new ECDSA secp256k1 key pair. Derives wallet address from public key. Private key never leaves the local machine.</p>
      </div>
      <div class="api-card">
        <span class="api-method method-get">GET</span>
        <div class="api-path">/api/nodes/register</div>
        <p class="api-desc">Registers a new peer node in the P2P network. Initiates WebSocket handshake, exchanges chain metadata, and begins synchronization.</p>
      </div>
      <div class="api-card">
        <span class="api-method method-post">POST</span>
        <div class="api-path">/api/contracts/deploy</div>
        <p class="api-desc">Deploys a smart contract to LunarVM. Validates contract bytecode, stores to chain, and initializes execution environment with deterministic state.</p>
      </div>
      <div class="api-card">
        <span class="api-method method-ws">WS</span>
        <div class="api-path">/ws/chain-events</div>
        <p class="api-desc">Live WebSocket stream for real-time blockchain events. Dashboard, AI agents, and explorer all subscribe to this for block confirmations, new transactions, and peer state changes.</p>
      </div>
      <div class="api-card">
        <span class="api-method method-post">POST</span>
        <div class="api-path">/api/governance/propose</div>
        <p class="api-desc">Creates a new DAO governance proposal. Records on-chain with treasury allocation details, voting period, and quorum threshold.</p>
      </div>
      <div class="api-card">
        <span class="api-method method-post">POST</span>
        <div class="api-path">/api/lunarfs/store</div>
        <p class="api-desc">Stores a file in the LunarFS distributed storage layer using content-addressing. Returns a hash for decentralized retrieval by any node in the network.</p>
      </div>
      <div class="api-card">
        <span class="api-method method-post">POST</span>
        <div class="api-path">/api/nft/mint</div>
        <p class="api-desc">Mints a new NFT on the LunarCoin chain. Records ownership, stores metadata via LunarFS, and emits a mint transaction to the mempool.</p>
      </div>
      <div class="api-card">
        <span class="api-method method-get">GET</span>
        <div class="api-path">/api/nodes/resolve</div>
        <p class="api-desc">Runs the Nakamoto consensus algorithm across all known peers. Compares chain heights and hash roots, resolves forks, and adopts the longest valid chain.</p>
      </div>
    </div>
  </section>

  <div class="section-divider"></div>

  <!-- ===== MODULES / FEATURES ===== -->
  <section>
    <div class="fade-in">
      <div class="section-label"><span>Platform Modules</span></div>
      <h2 class="section-title">Every System, Explained</h2>
      <p class="section-desc">LunarCoin is not a simulation. Every module runs live code on your machine — real cryptography, real consensus, real networking.</p>
    </div>

    <div class="features-grid fade-in">
      <div class="feature-card">
        <div class="feature-icon" style="background:rgba(251,191,36,0.12);border:1px solid rgba(251,191,36,0.3);">⛏️</div>
        <h3><span class="status-dot"></span>Mining Engine</h3>
        <p>Real SHA-256 Proof-of-Work. Your CPU iterates nonces until the block hash meets the difficulty target. Dynamic difficulty adjusts every N blocks. Block rewards are distributed to the miner with a treasury allocation.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon" style="background:rgba(244,114,182,0.12);border:1px solid rgba(244,114,182,0.3);">🔑</div>
        <h3><span class="status-dot"></span>Wallet Engine</h3>
        <p>ECDSA secp256k1 cryptography — the same curve used by Bitcoin and Ethereum. Generates public/private key pairs locally. Wallet addresses are derived from the public key. All keys stay on your machine.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon" style="background:rgba(56,189,248,0.12);border:1px solid rgba(56,189,248,0.3);">🔗</div>
        <h3><span class="status-dot"></span>Blockchain Core</h3>
        <p>Genesis block, full chain validation, hash linking, tamper detection, and the longest chain rule. Every block contains previous hash, timestamp, nonce, transaction data, Merkle information, and block hash.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon" style="background:rgba(52,211,153,0.12);border:1px solid rgba(52,211,153,0.3);">📡</div>
        <h3><span class="status-dot"></span>P2P Network</h3>
        <p>WebSocket-based peer-to-peer synchronization. Peer discovery, handshake validation, range-based block sync, and fork resolution using Nakamoto consensus. Nodes converge on the heaviest valid chain automatically.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon" style="background:rgba(52,211,153,0.12);border:1px solid rgba(52,211,153,0.3);">📥</div>
        <h3><span class="status-dot"></span>Mempool</h3>
        <p>Fee-prioritized transaction queue. Pending transactions are sorted by fee, validated for signature and balance, and held until the miner selects them for block inclusion. Real-time observable via WebSocket.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon" style="background:rgba(251,146,60,0.12);border:1px solid rgba(251,146,60,0.3);">📜</div>
        <h3><span class="status-dot"></span>Smart Contracts</h3>
        <p>LunarVM — a deterministic execution environment for educational contract deployment. Write, deploy, validate, and execute contracts. State is persisted on-chain after each execution.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon" style="background:rgba(244,114,182,0.12);border:1px solid rgba(244,114,182,0.3);">🏛️</div>
        <h3><span class="status-dot"></span>DAO Governance</h3>
        <p>Community-driven governance built into the chain. Submit proposals, vote with token weight, allocate treasury funds, and record decisions permanently on the blockchain. Fully decentralized.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon" style="background:rgba(129,140,248,0.12);border:1px solid rgba(129,140,248,0.3);">🤖</div>
        <h3><span class="status-dot"></span>AI Agents</h3>
        <p>Autonomous blockchain agents that monitor on-chain events and take programmable actions. Can interact with smart contracts, trigger transactions, assist governance decisions, and automate blockchain workflows.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon" style="background:rgba(52,211,153,0.12);border:1px solid rgba(52,211,153,0.3);">🌕</div>
        <h3><span class="status-dot"></span>LunarFS</h3>
        <p>Distributed file storage layer using content addressing. Files are distributed across nodes and retrieved via their hash. Storage metadata is recorded on-chain, enabling fully decentralized file access.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon" style="background:rgba(251,191,36,0.12);border:1px solid rgba(251,191,36,0.3);">🖼️</div>
        <h3><span class="status-dot"></span>NFTs</h3>
        <p>Mint and transfer unique digital assets. Ownership is recorded on the LunarCoin chain. Metadata stored via LunarFS. Transfer history and provenance fully transparent and verifiable.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon" style="background:rgba(129,140,248,0.12);border:1px solid rgba(129,140,248,0.3);">🧩</div>
        <h3><span class="status-dot"></span>DApps</h3>
        <p>Build decentralized applications on LunarCoin. Access wallet integration, LunarVM contracts, LunarFS storage, DAO governance, and NFT systems through a unified developer API.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon" style="background:rgba(56,189,248,0.12);border:1px solid rgba(56,189,248,0.3);">🔍</div>
        <h3><span class="status-dot"></span>LunarScan Explorer</h3>
        <p>Live blockchain explorer embedded in the Electron client. Detects local miner status automatically. Falls back to a render node for remote/public chain viewing when the miner is offline.</p>
      </div>
    </div>
  </section>

  <div class="section-divider"></div>

  <!-- ===== SCREENSHOTS ===== -->
  <section>
    <div class="fade-in">
      <div class="section-label"><span>Screenshots</span></div>
      <h2 class="section-title">LunarCoin In Action</h2>
      <p class="section-desc">Live captures from the running application. Every screen shown is a real module operating on real blockchain data, not mock UI.</p>
    </div>

    <!-- Main hero screenshot -->
    <div class="screen-frame fade-in" style="margin-bottom:24px;">
      <div class="screen-bar">
        <div class="screen-dot"></div><div class="screen-dot"></div><div class="screen-dot"></div>
        <div class="screen-url">localhost:3000 — LunarCoin Dashboard</div>
      </div>
      <img src="https://github.com/user-attachments/assets/8b2cae21-a1b5-4562-848f-74495ef29cfe" alt="Dashboard" class="screen-img">
    </div>

    <div class="screens-grid fade-in">

      <div class="screen-card">
        <div class="screen-bar">
          <div class="screen-dot"></div><div class="screen-dot"></div><div class="screen-dot"></div>
          <div class="screen-url" style="font-size:9px;">Mining Engine — SHA-256 PoW</div>
        </div>
        <img src="https://github.com/user-attachments/assets/0a8c9be6-409d-46e8-9818-b7b04fbb2528" alt="Mining" class="screen-img">
        <div class="screen-card-label"><strong>Mining Engine</strong> — SHA-256 Proof of Work, nonce discovery, difficulty targeting</div>
      </div>

      <div class="screen-card">
        <div class="screen-bar">
          <div class="screen-dot"></div><div class="screen-dot"></div><div class="screen-dot"></div>
          <div class="screen-url" style="font-size:9px;">Transactions — Mempool + Ledger</div>
        </div>
        <img src="https://github.com/user-attachments/assets/d4fe238d-3b64-465f-8388-317e5986e249" alt="Transactions" class="screen-img">
        <div class="screen-card-label"><strong>Transactions</strong> — ECDSA signed, fee-prioritized mempool queue</div>
      </div>

      <div class="screen-card">
        <div class="screen-bar">
          <div class="screen-dot"></div><div class="screen-dot"></div><div class="screen-dot"></div>
          <div class="screen-url" style="font-size:9px;">Wallet System — ECDSA secp256k1</div>
        </div>
        <img src="https://github.com/user-attachments/assets/a9c22dcb-b950-4133-a982-c577447b552b" alt="Wallet" class="screen-img">
        <div class="screen-card-label"><strong>Wallet</strong> — Local key ownership, address derivation, balance tracking</div>
      </div>

      <div class="screen-card">
        <div class="screen-bar">
          <div class="screen-dot"></div><div class="screen-dot"></div><div class="screen-dot"></div>
          <div class="screen-url" style="font-size:9px;">Smart Contracts — LunarVM</div>
        </div>
        <img src="https://github.com/user-attachments/assets/389a790f-200f-4713-8be9-32d605707058" alt="Smart Contracts" class="screen-img">
        <div class="screen-card-label"><strong>Smart Contracts</strong> — LunarVM deterministic execution environment</div>
      </div>

      <div class="screen-card">
        <div class="screen-bar">
          <div class="screen-dot"></div><div class="screen-dot"></div><div class="screen-dot"></div>
          <div class="screen-url" style="font-size:9px;">AI Agents — Autonomous Blockchain Layer</div>
        </div>
        <img src="https://github.com/user-attachments/assets/beeec49e-cb29-4ce5-8ea5-ca0084a26df9" alt="AI Agents" class="screen-img">
        <div class="screen-card-label"><strong>AI Agents</strong> — Autonomous on-chain monitoring and interaction</div>
      </div>

      <div class="screen-card">
        <div class="screen-bar">
          <div class="screen-dot"></div><div class="screen-dot"></div><div class="screen-dot"></div>
          <div class="screen-url" style="font-size:9px;">DAO Governance — Proposals + Voting</div>
        </div>
        <img src="https://github.com/user-attachments/assets/1caa797f-547c-42f5-9dd7-939a63ac7f1c" alt="Governance" class="screen-img">
        <div class="screen-card-label"><strong>Governance</strong> — DAO proposal creation, community voting, treasury</div>
      </div>

      <div class="screen-card">
        <div class="screen-bar">
          <div class="screen-dot"></div><div class="screen-dot"></div><div class="screen-dot"></div>
          <div class="screen-url" style="font-size:9px;">P2P Network — Node Synchronization</div>
        </div>
        <img src="https://github.com/user-attachments/assets/03b2b95c-0bc9-4834-9788-8ab33bf7f00c" alt="Network" class="screen-img">
        <div class="screen-card-label"><strong>P2P Network</strong> — Peer discovery, handshake, chain synchronization</div>
      </div>

      <div class="screen-card">
        <div class="screen-bar">
          <div class="screen-dot"></div><div class="screen-dot"></div><div class="screen-dot"></div>
          <div class="screen-url" style="font-size:9px;">Blockchain Explorer — LunarScan</div>
        </div>
        <img src="https://github.com/user-attachments/assets/8be7354c-5a4c-427d-ae18-0f9ff45822b5" alt="Explorer" class="screen-img">
        <div class="screen-card-label"><strong>LunarScan</strong> — Live blockchain explorer with block and transaction detail</div>
      </div>

      <div class="screen-card">
        <div class="screen-bar">
          <div class="screen-dot"></div><div class="screen-dot"></div><div class="screen-dot"></div>
          <div class="screen-url" style="font-size:9px;">Analytics — Chain Telemetry</div>
        </div>
        <img src="https://github.com/user-attachments/assets/7bbc9fde-32dc-44c5-9b9a-f41aea1bd2d2" alt="Analytics" class="screen-img">
        <div class="screen-card-label"><strong>Analytics</strong> — Real-time chain health, mining stats, reward distribution</div>
      </div>

      <div class="screen-card">
        <div class="screen-bar">
          <div class="screen-dot"></div><div class="screen-dot"></div><div class="screen-dot"></div>
          <div class="screen-url" style="font-size:9px;">Block Detail View</div>
        </div>
        <img src="https://github.com/user-attachments/assets/7ce58e0d-3296-4d1c-b12a-50ab4fb946fd" alt="Block Detail" class="screen-img">
        <div class="screen-card-label"><strong>Block Inspector</strong> — Hash, nonce, timestamp, Merkle root, transaction list</div>
      </div>

      <div class="screen-card">
        <div class="screen-bar">
          <div class="screen-dot"></div><div class="screen-dot"></div><div class="screen-dot"></div>
          <div class="screen-url" style="font-size:9px;">LunarFS — Distributed Storage</div>
        </div>
        <img src="https://github.com/user-attachments/assets/8a5f9935-417f-47b5-a201-d2d41a56d44d" alt="LunarFS" class="screen-img">
        <div class="screen-card-label"><strong>LunarFS</strong> — Content-addressed distributed file storage</div>
      </div>

      <div class="screen-card">
        <div class="screen-bar">
          <div class="screen-dot"></div><div class="screen-dot"></div><div class="screen-dot"></div>
          <div class="screen-url" style="font-size:9px;">NFT Module — Digital Ownership</div>
        </div>
        <img src="https://github.com/user-attachments/assets/60c071cd-7be4-401b-adff-da19e25164a1" alt="NFTs" class="screen-img">
        <div class="screen-card-label"><strong>NFTs</strong> — Mint, transfer, and verify digital asset ownership on-chain</div>
      </div>

      <div class="screen-card">
        <div class="screen-bar">
          <div class="screen-dot"></div><div class="screen-dot"></div><div class="screen-dot"></div>
          <div class="screen-url" style="font-size:9px;">DApps Platform</div>
        </div>
        <img src="https://github.com/user-attachments/assets/6afe0f05-36a5-4404-a88f-222b5fcf2b51" alt="DApps" class="screen-img">
        <div class="screen-card-label"><strong>DApps</strong> — Decentralized application layer on top of LunarCoin</div>
      </div>

      <div class="screen-card">
        <div class="screen-bar">
          <div class="screen-dot"></div><div class="screen-dot"></div><div class="screen-dot"></div>
          <div class="screen-url" style="font-size:9px;">Chain Validation</div>
        </div>
        <img src="https://github.com/user-attachments/assets/49b63ea3-559b-419c-9348-f77b4a26b21f" alt="Chain Validation" class="screen-img">
        <div class="screen-card-label"><strong>Chain Validation</strong> — Block integrity, hash linking, tamper detection</div>
      </div>

      <div class="screen-card">
        <div class="screen-bar">
          <div class="screen-dot"></div><div class="screen-dot"></div><div class="screen-dot"></div>
          <div class="screen-url" style="font-size:9px;">Mempool Monitor</div>
        </div>
        <img src="https://github.com/user-attachments/assets/a9c22dcb-b950-4133-a982-c577447b552b" alt="Mempool" class="screen-img">
        <div class="screen-card-label"><strong>Mempool Monitor</strong> — Pending transaction queue with fee prioritization</div>
      </div>

      <div class="screen-card">
        <div class="screen-bar">
          <div class="screen-dot"></div><div class="screen-dot"></div><div class="screen-dot"></div>
          <div class="screen-url" style="font-size:9px;">Consensus View</div>
        </div>
        <img src="https://github.com/user-attachments/assets/b9afd45b-91f2-4185-9288-140f82c9453e" alt="Consensus" class="screen-img">
        <div class="screen-card-label"><strong>Consensus Layer</strong> — Fork resolution, longest chain adoption</div>
      </div>

      <div class="screen-card">
        <div class="screen-bar">
          <div class="screen-dot"></div><div class="screen-dot"></div><div class="screen-dot"></div>
          <div class="screen-url" style="font-size:9px;">Node Settings</div>
        </div>
        <img src="https://github.com/user-attachments/assets/c28f7307-48a3-45d8-95a5-09ebb3b166dd" alt="Settings" class="screen-img">
        <div class="screen-card-label"><strong>Node Configuration</strong> — Mining parameters, network settings, wallet management</div>
      </div>

      <div class="screen-card">
        <div class="screen-bar">
          <div class="screen-dot"></div><div class="screen-dot"></div><div class="screen-dot"></div>
          <div class="screen-url" style="font-size:9px;">Network Peers Panel</div>
        </div>
        <img src="https://github.com/user-attachments/assets/a1c42783-e879-4c52-98c3-3e50d2b82b1b" onerror="this.src='https://github.com/user-attachments/assets/5097e8cd-16fb-4stdout-b9b0-4b5d8b7c5534'" alt="Peers" class="screen-img" style="min-height:200px;background:#0a1628;">
        <div class="screen-card-label"><strong>Peer Registry</strong> — Connected nodes, sync status, chain heights</div>
      </div>

      <!-- Additional screenshots from gallery -->
      <div class="screen-card">
        <div class="screen-bar">
          <div class="screen-dot"></div><div class="screen-dot"></div><div class="screen-dot"></div>
          <div class="screen-url" style="font-size:9px;">Block Explorer Details</div>
        </div>
        <img src="https://github.com/user-attachments/assets/5097e8cd-16fb-4stdout-b9b0-4b5d8b7c5534" onerror="this.src='https://github.com/user-attachments/assets/5097e8cd-16fb-4800-b9b0-4b5d8b7c5534'" alt="Block Explorer" class="screen-img" style="min-height:180px;background:#0a1628;">
        <div class="screen-card-label"><strong>Transaction Detail</strong> — Input/output breakdown, signature verification, confirmation depth</div>
      </div>

    </div>
  </section>

  <div class="section-divider"></div>

  <!-- ===== SECURITY ===== -->
  <section>
    <div class="fade-in">
      <div class="section-label"><span>Security Model</span></div>
      <h2 class="section-title">Cryptographic Security</h2>
      <p class="section-desc">LunarCoin protects chain integrity at every layer — from transaction signing to consensus resolution to persistent storage.</p>
    </div>

    <div class="security-grid fade-in">
      <div class="security-card">
        <span class="security-icon">🔐</span>
        <h4>ECDSA Signatures</h4>
        <p>Every transaction is signed with secp256k1. Invalid signatures are rejected at the API boundary before entering the mempool.</p>
      </div>
      <div class="security-card">
        <span class="security-icon">🔒</span>
        <h4>Local Key Storage</h4>
        <p>Private keys are generated and stored locally. They are never transmitted to any server, cloud service, or peer node.</p>
      </div>
      <div class="security-card">
        <span class="security-icon">⛓️</span>
        <h4>Hash Linking</h4>
        <p>Each block contains the hash of the previous block. Modifying any historical block invalidates the entire chain from that point forward.</p>
      </div>
      <div class="security-card">
        <span class="security-icon">📏</span>
        <h4>Longest Chain Rule</h4>
        <p>Nakamoto consensus ensures the network always converges on the heaviest valid chain. Fork attacks require re-mining the entire competing chain.</p>
      </div>
      <div class="security-card">
        <span class="security-icon">🛡️</span>
        <h4>Tamper Detection</h4>
        <p>Chain validation runs on every block append and sync event. Any modified block or broken hash link triggers immediate rejection.</p>
      </div>
      <div class="security-card">
        <span class="security-icon">💾</span>
        <h4>LevelDB Persistence</h4>
        <p>Chain data is persisted to LevelDB with integrity verification. Corrupted entries are detected on startup before the node enters active state.</p>
      </div>
    </div>
  </section>

  <div class="section-divider"></div>

  <!-- ===== MODULE TABLE ===== -->
  <section>
    <div class="fade-in">
      <div class="section-label"><span>Module Status</span></div>
      <h2 class="section-title">Platform Feature Matrix</h2>
    </div>
    <div class="arch-container fade-in" style="padding:0; overflow:auto;">
      <table class="module-table">
        <thead>
          <tr>
            <th>Module</th>
            <th>Technology</th>
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Mining Engine</td>
            <td style="color:#fbbf24;font-size:12px;font-family:'JetBrains Mono',monospace;">SHA-256</td>
            <td style="color:rgba(226,234,248,0.6);font-size:12px;">Proof-of-Work with dynamic difficulty and block rewards</td>
            <td><span class="tag-done">Live</span></td>
          </tr>
          <tr>
            <td>Wallet System</td>
            <td style="color:#fbbf24;font-size:12px;font-family:'JetBrains Mono',monospace;">secp256k1</td>
            <td style="color:rgba(226,234,248,0.6);font-size:12px;">ECDSA key pairs, address derivation, local storage</td>
            <td><span class="tag-done">Live</span></td>
          </tr>
          <tr>
            <td>Blockchain Core</td>
            <td style="color:#fbbf24;font-size:12px;font-family:'JetBrains Mono',monospace;">LevelDB</td>
            <td style="color:rgba(226,234,248,0.6);font-size:12px;">Block validation, hash linking, persistent chain storage</td>
            <td><span class="tag-done">Live</span></td>
          </tr>
          <tr>
            <td>P2P Network</td>
            <td style="color:#fbbf24;font-size:12px;font-family:'JetBrains Mono',monospace;">WebSocket</td>
            <td style="color:rgba(226,234,248,0.6);font-size:12px;">Peer discovery, block sync, Nakamoto consensus</td>
            <td><span class="tag-done">Live</span></td>
          </tr>
          <tr>
            <td>Mempool</td>
            <td style="color:#fbbf24;font-size:12px;font-family:'JetBrains Mono',monospace;">Python</td>
            <td style="color:rgba(226,234,248,0.6);font-size:12px;">Fee-prioritized pending transaction queue</td>
            <td><span class="tag-done">Live</span></td>
          </tr>
          <tr>
            <td>Smart Contracts</td>
            <td style="color:#fbbf24;font-size:12px;font-family:'JetBrains Mono',monospace;">LunarVM</td>
            <td style="color:rgba(226,234,248,0.6);font-size:12px;">Deploy, execute, and persist contract state</td>
            <td><span class="tag-done">Live</span></td>
          </tr>
          <tr>
            <td>DAO Governance</td>
            <td style="color:#fbbf24;font-size:12px;font-family:'JetBrains Mono',monospace;">On-Chain</td>
            <td style="color:rgba(226,234,248,0.6);font-size:12px;">Proposals, voting, treasury management</td>
            <td><span class="tag-done">Live</span></td>
          </tr>
          <tr>
            <td>AI Agents</td>
            <td style="color:#fbbf24;font-size:12px;font-family:'JetBrains Mono',monospace;">Python / API</td>
            <td style="color:rgba(226,234,248,0.6);font-size:12px;">Autonomous on-chain monitoring and automation</td>
            <td><span class="tag-done">Live</span></td>
          </tr>
          <tr>
            <td>LunarFS</td>
            <td style="color:#fbbf24;font-size:12px;font-family:'JetBrains Mono',monospace;">Content Hash</td>
            <td style="color:rgba(226,234,248,0.6);font-size:12px;">Distributed content-addressed file storage</td>
            <td><span class="tag-done">Live</span></td>
          </tr>
          <tr>
            <td>NFTs</td>
            <td style="color:#fbbf24;font-size:12px;font-family:'JetBrains Mono',monospace;">On-Chain</td>
            <td style="color:rgba(226,234,248,0.6);font-size:12px;">Mint, transfer, ownership verification</td>
            <td><span class="tag-done">Live</span></td>
          </tr>
          <tr>
            <td>DApps</td>
            <td style="color:#fbbf24;font-size:12px;font-family:'JetBrains Mono',monospace;">API Layer</td>
            <td style="color:rgba(226,234,248,0.6);font-size:12px;">Decentralized application infrastructure</td>
            <td><span class="tag-done">Live</span></td>
          </tr>
          <tr>
            <td>LunarScan Explorer</td>
            <td style="color:#fbbf24;font-size:12px;font-family:'JetBrains Mono',monospace;">Electron</td>
            <td style="color:rgba(226,234,248,0.6);font-size:12px;">Block explorer with local detection and fallback node</td>
            <td><span class="tag-done">Live</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <div class="section-divider"></div>

  <!-- ===== ROADMAP ===== -->
  <section>
    <div class="fade-in">
      <div class="section-label"><span>Development Roadmap</span></div>
      <h2 class="section-title">The Path to Mainnet</h2>
      <p class="section-desc">LunarCoin is progressing through a structured phased development. Each phase builds on the previous, expanding from core consensus to full decentralized infrastructure.</p>
    </div>

    <div class="roadmap fade-in">
      <div class="roadmap-item done">
        <span class="roadmap-tag tag-done">Shipped</span>
        <div class="roadmap-phase">Phase 1</div>
        <div class="roadmap-title">Blockchain Core</div>
        <div class="roadmap-desc">SHA-256 Proof-of-Work, genesis block, chain validation, hash linking, LevelDB persistence, full unit test suite and CLI migration tool.</div>
      </div>
      <div class="roadmap-item done">
        <span class="roadmap-tag tag-done">Shipped</span>
        <div class="roadmap-phase">Phase 2</div>
        <div class="roadmap-title">Desktop Miner</div>
        <div class="roadmap-desc">Electron desktop client, local API node, mining UI, wallet system, ECDSA transaction signing, real-time dashboard.</div>
      </div>
      <div class="roadmap-item done">
        <span class="roadmap-tag tag-done">Shipped</span>
        <div class="roadmap-phase">Phase 3</div>
        <div class="roadmap-title">P2P Networking</div>
        <div class="roadmap-desc">WebSocket peer-to-peer synchronization, Nakamoto consensus, fork resolution, peer discovery, range-based block sync.</div>
      </div>
      <div class="roadmap-item done">
        <span class="roadmap-tag tag-done">Shipped</span>
        <div class="roadmap-phase">Phase 4</div>
        <div class="roadmap-title">DAO Governance</div>
        <div class="roadmap-desc">On-chain proposal system, community voting, treasury allocation, decentralized decision recording.</div>
      </div>
      <div class="roadmap-item done">
        <span class="roadmap-tag tag-done">Shipped</span>
        <div class="roadmap-phase">Phase 5</div>
        <div class="roadmap-title">AI Agents</div>
        <div class="roadmap-desc">Autonomous blockchain agents, event monitoring, smart contract interaction, governance assistance, on-chain automation.</div>
      </div>
      <div class="roadmap-item done">
        <span class="roadmap-tag tag-done">Shipped</span>
        <div class="roadmap-phase">Phase 6</div>
        <div class="roadmap-title">LunarFS + NFTs + DApps</div>
        <div class="roadmap-desc">Distributed content-addressed storage, NFT minting and ownership tracking, DApp developer infrastructure layer.</div>
      </div>
      <div class="roadmap-item active">
        <span class="roadmap-tag tag-active">In Progress</span>
        <div class="roadmap-phase">Phase 7</div>
        <div class="roadmap-title">Public Beta</div>
        <div class="roadmap-desc">Open beta release for students and developers. Community testing, documentation, educational content, feedback collection, and performance tuning.</div>
      </div>
      <div class="roadmap-item">
        <span class="roadmap-tag tag-soon">Research</span>
        <div class="roadmap-phase">Phase 8</div>
        <div class="roadmap-title">Mainnet Research</div>
        <div class="roadmap-desc">Formal analysis of mainnet feasibility. Consensus mechanism research, tokenomics design, network security auditing, and scalability exploration.</div>
      </div>
    </div>
  </section>

  <div class="section-divider"></div>

  <!-- ===== INSTALL ===== -->
  <section>
    <div class="fade-in">
      <div class="section-label"><span>Installation</span></div>
      <h2 class="section-title">Get LunarCoin Running</h2>
      <p class="section-desc">Download the desktop application for your platform. No dependencies to install — the node, wallet, miner, and explorer all run out of the box.</p>
    </div>

    <div class="install-grid fade-in">
      <div class="install-card">
        <span class="install-os">🪟</span>
        <div class="install-name">Windows</div>
        <p style="font-size:13px;color:var(--text-dim);margin-bottom:12px;">Windows 10 / 11 x64. Download and run the installer. LunarCoin launches as a full desktop application.</p>
        <div class="install-file">LunarCoinMiner-Setup.exe</div>
      </div>
      <div class="install-card">
        <span class="install-os"></span>
        <div class="install-name">macOS</div>
        <p style="font-size:13px;color:var(--text-dim);margin-bottom:12px;">macOS 11+ (Apple Silicon and Intel). Extract the zip archive and open the app bundle directly.</p>
        <div class="install-file">LunarCoinMiner-mac.zip</div>
      </div>
    </div>

    <div class="arch-container fade-in" style="margin-top:24px; text-align:center;">
      <div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--text-dim);margin-bottom:16px;">LATEST RELEASE</div>
      <a href="https://github.com/Zayannnnn/LunarCoin/releases/tag/v0.1.0-beta" style="color:var(--accent);font-family:'JetBrains Mono',monospace;font-size:14px;text-decoration:none;border:1px solid rgba(56,189,248,0.3);padding:12px 28px;border-radius:8px;display:inline-block;background:rgba(56,189,248,0.06);transition:all 0.3s;">
        github.com/Zayannnnn/LunarCoin/releases/v0.1.0-beta
      </a>
    </div>
  </section>

  <div class="section-divider"></div>

  <!-- ===== LOCAL FIRST ===== -->
  <section>
    <div class="fade-in">
      <div class="section-label"><span>Local-First Design</span></div>
      <h2 class="section-title">Your Keys. Your Chain. Your Machine.</h2>
      <p class="section-desc">LunarCoin is built on a fundamental principle: the user owns everything. Private keys, chain data, mining, and validation all happen locally. Cloud infrastructure is used only for public fallback access.</p>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;" class="fade-in">
      <div class="arch-container" style="margin:0;">
        <div class="arch-title" style="margin-bottom:20px;">// STORED LOCALLY</div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          <div style="display:flex;align-items:center;gap:10px;padding:12px 16px;background:rgba(52,211,153,0.06);border:1px solid rgba(52,211,153,0.2);border-radius:8px;">
            <span style="color:var(--accent3);font-size:16px;">✓</span>
            <span style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--text);">Wallet Private Keys</span>
          </div>
          <div style="display:flex;align-items:center;gap:10px;padding:12px 16px;background:rgba(52,211,153,0.06);border:1px solid rgba(52,211,153,0.2);border-radius:8px;">
            <span style="color:var(--accent3);font-size:16px;">✓</span>
            <span style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--text);">Blockchain Database (LevelDB)</span>
          </div>
          <div style="display:flex;align-items:center;gap:10px;padding:12px 16px;background:rgba(52,211,153,0.06);border:1px solid rgba(52,211,153,0.2);border-radius:8px;">
            <span style="color:var(--accent3);font-size:16px;">✓</span>
            <span style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--text);">Mining Engine</span>
          </div>
          <div style="display:flex;align-items:center;gap:10px;padding:12px 16px;background:rgba(52,211,153,0.06);border:1px solid rgba(52,211,153,0.2);border-radius:8px;">
            <span style="color:var(--accent3);font-size:16px;">✓</span>
            <span style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--text);">Transaction Signatures</span>
          </div>
          <div style="display:flex;align-items:center;gap:10px;padding:12px 16px;background:rgba(52,211,153,0.06);border:1px solid rgba(52,211,153,0.2);border-radius:8px;">
            <span style="color:var(--accent3);font-size:16px;">✓</span>
            <span style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--text);">Chain Validation Logic</span>
          </div>
        </div>
      </div>
      <div class="arch-container" style="margin:0;">
        <div class="arch-title" style="margin-bottom:20px;">// CLOUD ONLY FOR</div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          <div style="display:flex;align-items:center;gap:10px;padding:12px 16px;background:rgba(129,140,248,0.06);border:1px solid rgba(129,140,248,0.2);border-radius:8px;">
            <span style="color:var(--accent2);font-size:16px;">→</span>
            <span style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--text);">Explorer Fallback Node</span>
          </div>
          <div style="display:flex;align-items:center;gap:10px;padding:12px 16px;background:rgba(129,140,248,0.06);border:1px solid rgba(129,140,248,0.2);border-radius:8px;">
            <span style="color:var(--accent2);font-size:16px;">→</span>
            <span style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--text);">Public Chain Viewing</span>
          </div>
          <div style="display:flex;align-items:center;gap:10px;padding:12px 16px;background:rgba(129,140,248,0.06);border:1px solid rgba(129,140,248,0.2);border-radius:8px;">
            <span style="color:var(--accent2);font-size:16px;">→</span>
            <span style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--text);">Remote Demonstrations</span>
          </div>
          <div style="display:flex;align-items:center;gap:10px;padding:12px 16px;background:rgba(244,114,182,0.06);border:1px solid rgba(244,114,182,0.2);border-radius:8px;margin-top:8px;">
            <span style="color:var(--accent5);font-size:16px;">✗</span>
            <span style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--text);">Private keys never leave device</span>
          </div>
        </div>
      </div>
    </div>
  </section>

</div>

<!-- ===== FOOTER ===== -->
<div class="footer">
  <img src="https://res.cloudinary.com/dhxmwk5of/image/upload/q_auto/f_auto/v1779609291/20260524_132338_wkrjvx.png" alt="LunarCoin" style="width:56px;height:56px;border-radius:50%;margin-bottom:20px;opacity:0.8;box-shadow:0 0 30px rgba(56,189,248,0.2);">
  <div class="footer-tagline">Built for <span>learning.</span> Designed for <span>exploration.</span> Powered by <span>decentralization.</span></div>
  <div class="footer-sub" style="margin-top:8px;margin-bottom:24px;">LUNARCOIN — v0.1.0-beta — github.com/Zayannnnn/LunarCoin</div>
  <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--text-dimmer);letter-spacing:0.15em;">
    SHA-256 &nbsp;·&nbsp; ECDSA secp256k1 &nbsp;·&nbsp; WebSocket P2P &nbsp;·&nbsp; LevelDB &nbsp;·&nbsp; LunarVM &nbsp;·&nbsp; LunarFS
  </div>
</div>

<script>
// Generate stars
const starsEl = document.getElementById('stars');
const starCount = 180;
for (let i = 0; i < starCount; i++) {
  const star = document.createElement('div');
  star.className = 'star';
  const size = Math.random() * 2.2 + 0.4;
  star.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    left: ${Math.random() * 100}%;
    top: ${Math.random() * 100}%;
    --d: ${Math.random() * 4 + 2}s;
    --delay: ${Math.random() * 5}s;
    --min-op: ${Math.random() * 0.2 + 0.1};
    --max-op: ${Math.random() * 0.5 + 0.4};
  `;
  starsEl.appendChild(star);
}

// Intersection Observer for fade-in
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
</script>
</body>
</html>
