export type ForexSlide = {
  id: number;
  title: string;
  subtitle?: string;
  bullets: string[];
  references?: { label: string; url: string }[];
  background: string;
};

export const todayForexSlides: ForexSlide[] = [
  {
    id: 1,
    title: '1) Sessions & Volatility Windows',
    subtitle: 'Focus on overlapping sessions to capture liquidity.',
    bullets: [
      'London session (08:00–17:00 GMT) + New York session (13:00–22:00 GMT) overlap ≈ 13:00–17:00 GMT — highest liquidity for EUR/USD & GBP/USD.',
      'Asian session (Tokyo/Sydney) offers cleaner moves for JPY & AUD crosses. Adjust pair selection to the session.',
      'Use market-hours calculators (BabyPips, AvaTrade, CityIndex) to convert overlaps to your time zone and set reminders.',
    ],
    references: [
      { label: 'BabyPips Sessions', url: 'https://www.babypips.com/tools/forex-market-hours' },
      { label: 'AvaTrade Market Hours', url: 'https://www.avatrade.com/forex/market-hours' },
    ],
    background: '/bg1%20(2).jpeg',
  },
  {
    id: 2,
    title: '2) Concept Basics — Supply, Demand & Liquidity',
    subtitle: 'Trade the imbalances, not random lines.',
    bullets: [
      'Supply zone = prior area where sellers dominated; Demand zone = prior area where buyers dominated.',
      'Liquidity pools form at obvious swing highs/lows and round numbers — institutions sweep stops, then reverse.',
      'Draw full rectangles (wick + body) where price impulsively departed; higher timeframes (Daily/4H) anchor your bias.',
    ],
    references: [
      { label: 'Pepperstone — Supply/Demand', url: 'https://pepperstone.com/en-au/market-analysis/resistance-support-supply-demand/' },
      { label: 'Investopedia — Liquidity', url: 'https://www.investopedia.com/terms/l/liquidity.asp' },
    ],
    background: '/bg%203.jpeg',
  },
  {
    id: 3,
    title: '3) Chart Setup & Confirmation Tools',
    bullets: [
      'Top-down workflow: Daily & 4H for directional bias and zones; 1H/15m for execution detail.',
      'Core indicators: VWAP/Volume Profile for institutional participation; EMA50/EMA200 for bias; ATR(14) for stops.',
      'Keep charts clean. Optional order-flow (footprint, delta, DOM) adds precision if your platform supports it.',
    ],
    references: [
      { label: 'Sierra Chart Studies', url: 'https://www.sierrachart.com/index.php?page=doc/StudiesReference.html' },
    ],
    background: '/Market%20Crash_%20The%20Downfall%20of%20a%20Trading%20Chart.jpeg',
  },
  {
    id: 4,
    title: '4) Identify Valid Supply & Demand Zones',
    bullets: [
      'Scan Daily/4H for explosive moves — long bodies + big wicks leaving a level identify the origin zone.',
      'Encompass the entire impulse (wicks + consolidation). Wider zones formed on higher TFs carry more weight.',
      'Confirm with volume: VWAP/Volume Profile should show price leaving value; heavy volume validates the zone.',
    ],
    references: [
      { label: 'Pepperstone Examples', url: 'https://pepperstone.com/en-au/market-analysis/resistance-support-supply-demand/' },
      { label: 'Sierra Volume Profile', url: 'https://www.sierrachart.com/index.php?page=doc/StudiesReference.html#VolumeProfile' },
    ],
    background: '/bg2%20(2).jpeg',
  },
  {
    id: 5,
    title: '5) Entry Rules — Retests & Liquidity Hunts',
    bullets: [
      'Clean Retest: trade with higher-TF bias. Wait for rejection candle inside zone, enter post-close.',
      'Liquidity Sweep: allow price to pierce obvious stops, then enter once it snaps back and consolidates within bias.',
      'Stops: zone edge ± 0.5–1× ATR; Targets: scale at structure, trail with EMA50 or swing structure for extended moves.',
    ],
    references: [
      { label: 'ACY on Liquidity Traps', url: 'https://www.acy.com/en/market-news/liquidity-traps' },
    ],
    background: '/F80%20BMW%20M4%20Wallpaper.jpeg',
  },
  {
    id: 6,
    title: '6) Candle Patterns & Timing',
    bullets: [
      'High-probability trigger candles: pin bars, engulfing bars, inside-bar breakouts with confluence.',
      'Liqudity sweeps: look for fast wick reversal + 15–30 min micro consolidation; trade breakout back in bias direction.',
      'Align entries with session volatility (London & NY) for momentum; avoid thin liquidity hours unless swing trading.',
    ],
    references: [
      { label: 'ACY Candle Confirmations', url: 'https://www.acy.com/en/market-news/smart-money-concepts-liquidity' },
    ],
    background: '/download%20(13).jpeg',
  },
  {
    id: 7,
    title: '7) Indicator Rules (Support, Not Signals)',
    bullets: [
      'Volume/VWAP/Volume Profile confirm whether institutions respect a zone (high volume rejection = conviction).',
      'EMA 50/200 provide trend filter. Only fade trend with strong higher-TF zone + clear confirmation.',
      'ATR(14) defines stop distance and helps avoid too-tight stops. RSI/divergence is optional confirmation only.',
    ],
    references: [
      { label: 'Sierra Chart VWAP', url: 'https://www.sierrachart.com/index.php?page=doc/StudiesReference.html#VolumeWeightedAveragePrice' },
    ],
    background: '/Wie%20solltest%20du%20dich%20als%20Anleger%20in%20einer%20Baisse%20verhalten_.jpeg',
  },
  {
    id: 8,
    title: '8) Risk Management Principles',
    bullets: [
      'Risk ≤1% per trade; position size = (Account × Risk%) ÷ (Stop distance × pip value).',
      'Define daily/weekly max drawdown (e.g., stop trading after -3% day). Losing streaks are normal — plan for them.',
      'Document trades: R multiple, reason, emotional state. Consistency in execution beats chasing big wins.',
    ],
    background: '/bg%203.jpeg',
  },
  {
    id: 9,
    title: '9) Trading the News Safely',
    bullets: [
      'Monitor economic calendars (ForexFactory, Investing.com, BabyPips) for high-impact events; set push alerts.',
      'Avoid holding full-size positions through NFP, CPI, rate decisions. Either flatten or reduce size & widen stops.',
      'To trade news: wait for initial spike + consolidation, then trade retest in direction of confirmed move with reduced size.',
    ],
    references: [
      { label: 'ForexFactory Calendar', url: 'https://www.forexfactory.com/calendar' },
      { label: 'Investing.com Calendar', url: 'https://www.investing.com/economic-calendar/' },
    ],
    background: '/WALL%20STREET%20WALLPAPER.jpeg',
  },
  {
    id: 10,
    title: '10) Stay Connected — News & Alerts',
    bullets: [
      'Use Investing.com or ForexFactory apps for instant notifications. Configure time zone, impact filters, and reminders.',
      'Check Reuters, Bloomberg (premium), Investing.com or FXStreet for real-time headlines & sentiment.',
      'Broker platforms often integrate news feeds/economic calendars — use them for faster execution context.',
    ],
    references: [
      { label: 'Investing.com App', url: 'https://www.investing.com/webmaster-tools/economic-calendar' },
      { label: 'FXStreet News', url: 'https://www.fxstreet.com/news' },
    ],
    background: '/BMW%20M5%20WALLPAPER%20%F0%9F%92%99%F0%9F%96%BC.jpeg',
  },
  {
    id: 11,
    title: '11) Intraday Playbook (Example)',
    bullets: [
      'Pre-London: mark 2–3 high-quality zones on EURUSD/GBPUSD/USDJPY using Daily/4H + 1H structure.',
      'During London/NY overlap, wait for price to retest zone; confirm on 15m with rejection + volume spike.',
      'Stops: below zone − ATR; Targets: 1.5–2R. Move stop to breakeven at 0.5R; log trade rationale + outcome daily.',
    ],
    background: '/bg%203.jpeg',
  },
  {
    id: 12,
    title: '12) Liquidity Strategy in Short',
    bullets: [
      'Mark liquidity pools: previous highs/lows, round numbers, breakout retests, obvious retail stop zones.',
      'Let price sweep the pool, watch for quick rejection & micro consolidation. Enter when price breaks back in bias direction.',
      'Combine sweeps with supply/demand zones for high reward trades, but keep risk tight and size modest.',
    ],
    references: [
      { label: 'ACY Liquidity Play', url: 'https://www.acy.com/en/market-news/liquidity-traps' },
    ],
    background: '/Market%20Crash_%20The%20Downfall%20of%20a%20Trading%20Chart.jpeg',
  },
  {
    id: 13,
    title: '13) Practical Tools & Resources',
    bullets: [
      'Free: BabyPips (education & sessions), ForexFactory (calendar/forums), Investing.com (news/alerts), TradingView scripts.',
      'Paid/Advanced: order-flow platforms (NinjaTrader, Sierra Chart), dedicated volume profile packages.',
      'Use tools as assistants — price action + journals remain the core edge.',
    ],
    references: [
      { label: 'BabyPips School', url: 'https://www.babypips.com/learn/forex' },
      { label: 'TradingView Scripts', url: 'https://www.tradingview.com/scripts/' },
    ],
    background: '/bg%203.jpeg',
  },
  {
    id: 14,
    title: '14) Mistakes to Avoid',
    bullets: [
      'Placing stops inside obvious wicks (too tight) or outside plan (too wide) — both destroy R:R.',
      'Trading against higher-TF bias or during major news without plan.',
      'Copying indicators blindly. Learn the price story first; indicators are context.',
    ],
    background: '/Wie%20solltest%20du%20dich%20als%20Anleger%20in%20einer%20Baisse%20verhalten_.jpeg',
  },
  {
    id: 15,
    title: '15) Reading & Reference List',
    bullets: [
      'Supply/Demand: Pepperstone, BabyPips articles + community threads.',
      'Liquidity & stop hunting: Investopedia primers, ACY/SGT smart money concept write-ups.',
      'Order-flow/volume profile: Sierra Chart/NinjaTrader documentation and training videos.',
    ],
    references: [
      { label: 'Pepperstone Library', url: 'https://pepperstone.com/en-au/market-analysis/' },
      { label: 'Investopedia Liquidity', url: 'https://www.investopedia.com/terms/l/liquidity.asp' },
    ],
    background: '/MngFx%20Academy%20logo.png',
  },
  {
    id: 16,
    title: '16) One-Week Practice Plan',
    bullets: [
      'Day 1: mark Daily/4H supply & demand zones on 3 pairs and journal screenshots.',
      'Day 2: observe London open only. Note behavior at zones & volume reaction without trading.',
      'Day 3–5: paper trade one setup (15m rejection). Day 5 add news filter. Day 6-7: review stats, adjust stops & journal lessons.',
    ],
    background: '/bg%203.jpeg',
  },
];

