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
    title: 'Sessions & Volatility Windows',
    subtitle: 'Focus on overlapping sessions to capture liquidity.',
    bullets: [
      'London session (08:00–17:00 GMT) + New York session (13:00–22:00 GMT) overlap ≈ 13:00–17:00 GMT — highest liquidity for EUR/USD & GBP/USD.',
      'Asian session (Tokyo/Sydney) offers cleaner moves for JPY & AUD crosses. Adjust pair selection to the session.',
      'Use market-hours tools (BabyPips, AvaTrade, CityIndex) to convert overlaps to your local time and set alerts.',
    ],
    references: [
      { label: 'Babypips Sessions', url: 'https://www.babypips.com/tools/forex-market-hours' },
      { label: 'AvaTrade Market Hours', url: 'https://www.avatrade.com/forex/market-hours' },
    ],
    background: '/bg1%20(2).jpeg',
  },
  {
    id: 2,
    title: 'Supply, Demand & Liquidity Fundamentals',
    subtitle: 'Trade the imbalances, not random lines.',
    bullets: [
      'Supply zone = prior area where sellers dominated; Demand zone = prior area where buyers dominated.',
      'Liquidity pools form at obvious swing highs/lows and round numbers — institutions sweep stops then reverse.',
      'Mark wick-to-body rectangles where price impulsively left; higher timeframes (Daily/4H) give stronger zones.',
    ],
    references: [
      { label: 'Pepperstone on Supply & Demand', url: 'https://pepperstone.com/en-au/market-analysis/resistance-support-supply-demand/' },
      { label: 'Investopedia Liquidity', url: 'https://www.investopedia.com/terms/l/liquidity.asp' },
    ],
    background: '/bg%203.jpeg',
  },
  {
    id: 3,
    title: 'Chart Setup & Confirmation Tools',
    bullets: [
      'Work through a top-down workflow: Daily → 4H for bias + zones, 1H/15m for entries.',
      'Core indicators: VWAP/Volume Profile for institutional participation, EMA50/EMA200 for trend filter, ATR(14) for stops.',
      'Keep charts clean. Optional: footprint/order-flow for tick-level confirmation when available.',
    ],
    references: [
      { label: 'Sierra Volume Tools', url: 'https://www.sierrachart.com/index.php?page=doc/StudiesReference.html' },
    ],
    background: '/Market%20Crash_%20The%20Downfall%20of%20a%20Trading%20Chart.jpeg',
  },
  {
    id: 4,
    title: 'Entry Playbook: Zone Retests & Liquidity Sweeps',
    bullets: [
      'Clean Retest: trade in trend direction. Wait for bullish/bearish rejection candle inside zone; entry after close.',
      'Liquidity Sweep: let price spike beyond obvious stops, then enter once it snaps back into the zone and consolidates.',
      'Stops: zone edge ± 0.5–1 × ATR; Targets: partials at structure, trail remainder with EMA50 or structure breaks.',
    ],
    references: [
      { label: 'ACY on Liquidity Traps', url: 'https://www.acy.com/en/market-news/liquidity-traps' },
    ],
    background: '/F80%20BMW%20M4%20Wallpaper.jpeg',
  },
  {
    id: 5,
    title: 'Risk, News & Daily Workflow',
    bullets: [
      'Risk ≤1% per idea; use position sizing against ATR-based stop distance. Halt trading after daily max drawdown (e.g., -3%).',
      'Check economic calendar (ForexFactory, Investing.com) before trading. Avoid holding through NFP, CPI, major rate decisions.',
      'Daily routine: mark zones, set bias, wait for London/NY overlap, log trades, review statistics weekly.',
    ],
    references: [
      { label: 'ForexFactory Calendar', url: 'https://www.forexfactory.com/calendar' },
      { label: 'Investing.com Calendar', url: 'https://www.investing.com/economic-calendar/' },
    ],
    background: '/WALL%20STREET%20WALLPAPER.jpeg',
  },
];

