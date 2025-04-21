'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { defaultLocale } from '@/middleware';

export default function Home() {
  const router = useRouter();
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // Po dokončení animace přesměruj na lokalizovanou stránku
    if (animationComplete) {
      const timer = setTimeout(() => {
        router.push(`/${defaultLocale}`);
      }, 200); // Zkrácené zpoždění po dokončení animace

      return () => clearTimeout(timer);
    }
  }, [animationComplete, router]);

  // Počkej dokončení animace a pak nastav příznak
  const handleAnimationComplete = () => {
    setAnimationComplete(true);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-slate-900 overflow-hidden">
      <IntroAnimation onAnimationComplete={handleAnimationComplete} />
    </div>
  );
}

function IntroAnimation({ onAnimationComplete }: { onAnimationComplete: () => void }) {
  useEffect(() => {
    // Po 3 sekundách označíme animaci za dokončenou
    const timer = setTimeout(() => {
      onAnimationComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <div className="intro-animation w-screen h-screen absolute inset-0 flex flex-col justify-center items-center">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        .intro-animation {
          background-color: #0f172a;
          color: #b18b27;
          font-family: 'Inter', sans-serif;
          overflow: hidden;
        }

        .logo-container {
          position: relative;
        }

        .logo-content {
          display: flex;
          align-items: center;
          gap: 40px;
          position: relative;
        }

        .chart-content {
          position: absolute;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          opacity: 0.15;
          z-index: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          transform: scale(2.5);
        }

        /* Graf */
        .chart-container {
          position: relative;
          width: 220px;
          height: 160px;
          border-left: 2px solid rgba(177, 139, 39, 0.3);
          border-bottom: 2px solid rgba(177, 139, 39, 0.3);
        }

        .grid-lines {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .grid-line {
          position: absolute;
          background-color: rgba(177, 139, 39, 0.1);
        }

        .horizontal-line {
          width: 100%;
          height: 1px;
        }

        .vertical-line {
          width: 1px;
          height: 100%;
        }

        .candles-container {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          display: flex;
          justify-content: space-between;
          padding: 0 10px;
          height: 100%;
          pointer-events: none;
        }

        .candle {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          width: 14px;
        }

        .candle-body {
          width: 100%;
          background: linear-gradient(180deg, #ffc940 0%, #b18b27 100%);
          border-radius: 2px;
          transform-origin: bottom;
          transform: scaleY(0);
        }

        .candle-body.animate {
          animation: growCandle 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .candle-wick {
          width: 2px;
          height: 6px;
          background-color: #b18b27;
          margin-bottom: -3px;
          opacity: 0;
        }

        .candle-wick.animate {
          animation: fadeIn 0.4s ease-out forwards;
          animation-delay: 0.6s;
        }

        .candle-upper-wick {
          width: 2px;
          background-color: #b18b27;
          margin-bottom: 0;
          opacity: 0;
        }

        .candle-upper-wick.animate {
          animation: fadeIn 0.4s ease-out forwards;
          animation-delay: 0.6s;
        }

        .trend-line {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .trend-path {
          fill: none;
          stroke: #b18b27;
          stroke-width: 2.5;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 350;
          stroke-dashoffset: 350;
        }

        .trend-path.animate {
          animation: drawLine 1.5s ease-out forwards;
          animation-delay: 1.2s;
        }

        /* Text Loga */
        .logo-text {
          display: flex;
          flex-direction: column;
          z-index: 10;
          position: relative;
        }

        .brand-container {
          display: flex;
          width: 100vw;
          justify-content: center;
          position: relative;
        }

        .brand-name {
          display: flex;
          align-items: center;
          font-size: 7rem;
          font-weight: 800;
          letter-spacing: -1px;
          line-height: 1;
        }

        .bond {
          color: #b18b27;
          position: relative;
          animation: slideFromLeft 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          opacity: 0;
        }

        .folio {
          color: #ffc940;
          position: relative;
          animation: slideFromRight 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          animation-delay: 0.2s;
          opacity: 0;
        }

        .tagline {
          font-size: 1.2rem;
          color: #b18b27cc;
          font-weight: 400;
          letter-spacing: 1px;
          margin-top: 1rem;
          text-align: center;
          opacity: 0;
          animation: fadeIn 1s ease-out forwards;
          animation-delay: 1.8s;
        }

        .separator {
          width: 0;
          height: 4px;
          background: linear-gradient(90deg, #ffc940, #b18b27);
          border-radius: 2px;
          margin: 1.5rem auto 0;
          animation: expandLine 0.8s ease-out forwards;
          animation-delay: 2.5s;
        }

        /* Animations */
        @keyframes growCandle {
          0% {
            transform: scaleY(0);
          }
          100% {
            transform: scaleY(1);
          }
        }

        @keyframes drawLine {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideFromLeft {
          from {
            opacity: 0;
            transform: translateX(-80px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideFromRight {
          from {
            opacity: 0;
            transform: translateX(80px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes expandLine {
          from {
            width: 0;
          }
          to {
            width: 180px;
          }
        }
      `}</style>

      <div className="chart-content">
        <div className="chart-container">
          {/* Grid Lines */}
          <div className="grid-lines">
            <div className="grid-line horizontal-line" style={{ top: '33%' }}></div>
            <div className="grid-line horizontal-line" style={{ top: '66%' }}></div>
            <div className="grid-line vertical-line" style={{ left: '25%' }}></div>
            <div className="grid-line vertical-line" style={{ left: '50%' }}></div>
            <div className="grid-line vertical-line" style={{ left: '75%' }}></div>
          </div>

          {/* Candles */}
          <div className="candles-container">
            <div className="candle" style={{ height: '100%' }}>
              <div className="candle-upper-wick animate" style={{ height: '10px' }}></div>
              <div className="candle-body animate" style={{ height: '25%', animationDelay: '0.1s' }}></div>
              <div className="candle-wick animate"></div>
            </div>

            <div className="candle" style={{ height: '100%' }}>
              <div className="candle-upper-wick animate" style={{ height: '8px' }}></div>
              <div className="candle-body animate" style={{ height: '35%', animationDelay: '0.2s' }}></div>
              <div className="candle-wick animate"></div>
            </div>

            <div className="candle" style={{ height: '100%' }}>
              <div className="candle-upper-wick animate" style={{ height: '12px' }}></div>
              <div className="candle-body animate" style={{ height: '32%', animationDelay: '0.3s' }}></div>
              <div className="candle-wick animate"></div>
            </div>

            <div className="candle" style={{ height: '100%' }}>
              <div className="candle-upper-wick animate" style={{ height: '15px' }}></div>
              <div className="candle-body animate" style={{ height: '45%', animationDelay: '0.4s' }}></div>
              <div className="candle-wick animate"></div>
            </div>

            <div className="candle" style={{ height: '100%' }}>
              <div className="candle-upper-wick animate" style={{ height: '10px' }}></div>
              <div className="candle-body animate" style={{ height: '60%', animationDelay: '0.5s' }}></div>
              <div className="candle-wick animate"></div>
            </div>

            <div className="candle" style={{ height: '100%' }}>
              <div className="candle-upper-wick animate" style={{ height: '18px' }}></div>
              <div className="candle-body animate" style={{ height: '75%', animationDelay: '0.6s' }}></div>
              <div className="candle-wick animate"></div>
            </div>
          </div>

          {/* Trend Line */}
          <svg className="trend-line" viewBox="0 0 220 160" preserveAspectRatio="none">
            <path className="trend-path animate" d="M15,120 C30,110 50,108 65,100 S100,80 125,65 S160,50 205,25"></path>
          </svg>
        </div>
      </div>

      <div className="logo-container z-10">
        <div className="brand-container">
          <div className="brand-name">
            <span className="bond">Bond</span><span className="folio">Folio</span>
          </div>
        </div>
        <div className="tagline">INVESTIČNÍ PLATFORMA</div>
        <div className="separator"></div>
      </div>
    </div>
  );
}
