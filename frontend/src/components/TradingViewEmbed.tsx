import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    TradingView?: any;
  }
}

const TradingViewEmbed = ({ symbol = 'FX:EURUSD' }: { symbol?: string }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scriptId = 'tradingview-widget-script';

    const createWidget = () => {
      if (!window.TradingView || !containerRef.current) return;
      if (containerRef.current.childNodes.length > 0) {
        containerRef.current.innerHTML = '';
      }

      new window.TradingView.widget({
        width: '100%',
        height: 480,
        symbol,
        interval: '60',
        timezone: 'Etc/UTC',
        theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
        style: '1',
        locale: 'en',
        toolbar_bg: '#f1f3f6',
        enable_publishing: false,
        allow_symbol_change: true,
        container_id: 'tradingview_widget',
      });
    };

    if (document.getElementById(scriptId)) {
      createWidget();
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = createWidget;
    document.body.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, [symbol]);

  return <div id="tradingview_widget" ref={containerRef} style={{ width: '100%', minHeight: 480 }} />;
};

export default TradingViewEmbed;

