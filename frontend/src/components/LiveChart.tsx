import { createChart, ISeriesApi, UTCTimestamp } from 'lightweight-charts';
import { useEffect, useRef } from 'react';

type Tick = {
  symbol: string;
  bid: number;
  ask: number;
  ts: number;
};

const LiveChart = ({ symbol = 'EURUSD' }: { symbol?: string }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!containerRef.current || typeof window === 'undefined') return;

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 420,
      layout: {
        background: { color: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff' },
        textColor: document.documentElement.classList.contains('dark') ? '#e2e8f0' : '#0f172a',
      },
      grid: {
        vertLines: { color: 'rgba(148, 163, 184, 0.2)' },
        horzLines: { color: 'rgba(148, 163, 184, 0.2)' },
      },
      crosshair: { mode: 0 },
      rightPriceScale: { borderVisible: false },
      timeScale: { borderVisible: false },
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderUpColor: '#22c55e',
      borderDownColor: '#ef4444',
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    seriesRef.current = candleSeries;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry?.contentRect?.width) {
        chart.applyOptions({ width: entry.contentRect.width });
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      seriesRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const host = window.location.hostname;
    const port = process.env.NEXT_PUBLIC_WS_PORT || '8000';
    const url = `${protocol}://${host}:${port}/ws/market/`;

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ action: 'subscribe', symbol }));
    };

    let currentCandle: {
      time: UTCTimestamp;
      open: number;
      high: number;
      low: number;
      close: number;
    } | null = null;

    const commit = () => {
      if (seriesRef.current && currentCandle) {
        seriesRef.current.update(currentCandle);
      }
    };

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'tick' && payload.tick) {
          const tick: Tick = payload.tick;
          const minuteBucket = Math.floor(tick.ts / 1000 / 60) * 60 as UTCTimestamp;

          if (!currentCandle || currentCandle.time !== minuteBucket) {
            commit();
            currentCandle = {
              time: minuteBucket,
              open: tick.bid,
              high: tick.bid,
              low: tick.bid,
              close: tick.bid,
            };
          } else {
            currentCandle.high = Math.max(currentCandle.high, tick.bid);
            currentCandle.low = Math.min(currentCandle.low, tick.bid);
            currentCandle.close = tick.bid;
          }

          commit();
        }
      } catch (error) {
        console.error('LiveChart: failed to parse message', error);
      }
    };

    ws.onclose = () => {
      console.warn('LiveChart websocket closed');
    };

    return () => {
      ws.close();
    };
  }, [symbol]);

  return <div ref={containerRef} style={{ width: '100%', minHeight: 420 }} />;
};

export default LiveChart;

