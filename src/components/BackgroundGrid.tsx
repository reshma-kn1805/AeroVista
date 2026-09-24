import React from 'react';

export const BackgroundGrid: React.FC = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      {/* Base deep obsidian/graphite atmosphere */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#080B10' }} />

      {/* Extremely soft radial indigo/teal illumination */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '20%',
          width: '60vw',
          height: '50vh',
          borderRadius: '9999px',
          filter: 'blur(140px)',
          opacity: 0.07,
          background: 'radial-gradient(circle, #818CF8 0%, transparent 70%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '10%',
          width: '50vw',
          height: '50vh',
          borderRadius: '9999px',
          filter: 'blur(150px)',
          opacity: 0.05,
          background: 'radial-gradient(circle, #5EEAD4 0%, transparent 70%)',
        }}
      />

      {/* Topographic Contour Lines SVG Pattern */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.045,
          mixBlendMode: 'screen',
        }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1600 1000"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="contourGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#818CF8" />
            <stop offset="100%" stopColor="#5EEAD4" />
          </linearGradient>
        </defs>

        {/* Elevation contour ribbons */}
        <path d="M-100,200 C300,120 600,280 900,190 C1200,100 1450,220 1700,160" fill="none" stroke="url(#contourGrad)" strokeWidth="1.2" />
        <path d="M-100,280 C320,200 620,360 920,270 C1220,180 1470,300 1700,240" fill="none" stroke="url(#contourGrad)" strokeWidth="1.0" />
        <path d="M-100,360 C340,280 640,440 940,350 C1240,260 1490,380 1700,320" fill="none" stroke="url(#contourGrad)" strokeWidth="0.9" />
        <path d="M-100,440 C360,360 660,520 960,430 C1260,340 1510,460 1700,400" fill="none" stroke="url(#contourGrad)" strokeWidth="0.8" />
        <path d="M-100,520 C380,440 680,600 980,510 C1280,420 1530,540 1700,480" fill="none" stroke="url(#contourGrad)" strokeWidth="1.1" />
        <path d="M-100,600 C400,520 700,680 1000,590 C1300,500 1550,620 1700,560" fill="none" stroke="url(#contourGrad)" strokeWidth="0.8" />
        <path d="M-100,680 C420,600 720,760 1020,670 C1320,580 1570,700 1700,640" fill="none" stroke="url(#contourGrad)" strokeWidth="1.0" />
        <path d="M-100,760 C440,680 740,840 1040,750 C1340,660 1590,780 1700,720" fill="none" stroke="url(#contourGrad)" strokeWidth="0.7" />
        <path d="M-100,840 C460,760 760,920 1060,830 C1360,740 1610,860 1700,800" fill="none" stroke="url(#contourGrad)" strokeWidth="0.9" />

        {/* Mountain peak closed contour loops */}
        <ellipse cx="680" cy="480" rx="180" ry="110" fill="none" stroke="#5EEAD4" strokeWidth="0.8" strokeDasharray="6,4" />
        <ellipse cx="680" cy="480" rx="120" ry="70" fill="none" stroke="#38BDF8" strokeWidth="0.8" />
        <ellipse cx="680" cy="480" rx="60" ry="35" fill="none" stroke="#818CF8" strokeWidth="1" />

        <ellipse cx="1280" cy="320" rx="140" ry="85" fill="none" stroke="#38BDF8" strokeWidth="0.7" />
        <ellipse cx="1280" cy="320" rx="80" ry="45" fill="none" stroke="#5EEAD4" strokeWidth="0.9" />

        {/* Faint coordinate grid lines */}
        <line x1="200" y1="0" x2="200" y2="1000" stroke="#263442" strokeWidth="0.6" strokeDasharray="3,6" />
        <line x1="500" y1="0" x2="500" y2="1000" stroke="#263442" strokeWidth="0.6" strokeDasharray="3,6" />
        <line x1="800" y1="0" x2="800" y2="1000" stroke="#263442" strokeWidth="0.6" strokeDasharray="3,6" />
        <line x1="1100" y1="0" x2="1100" y2="1000" stroke="#263442" strokeWidth="0.6" strokeDasharray="3,6" />
        <line x1="1400" y1="0" x2="1400" y2="1000" stroke="#263442" strokeWidth="0.6" strokeDasharray="3,6" />

        <line x1="0" y1="200" x2="1600" y2="200" stroke="#263442" strokeWidth="0.6" strokeDasharray="3,6" />
        <line x1="0" y1="500" x2="1600" y2="500" stroke="#263442" strokeWidth="0.6" strokeDasharray="3,6" />
        <line x1="0" y1="800" x2="1600" y2="800" stroke="#263442" strokeWidth="0.6" strokeDasharray="3,6" />

        {/* Faint crosshair datum points */}
        <circle cx="200" cy="200" r="2" fill="#38BDF8" opacity="0.6" />
        <circle cx="800" cy="500" r="2.5" fill="#5EEAD4" opacity="0.7" />
        <circle cx="1400" cy="800" r="2" fill="#818CF8" opacity="0.6" />
      </svg>

      {/* Coordinate stamp text in corners */}
      <div style={{
        position: 'absolute',
        top: '8px',
        left: '24px',
        fontSize: '9px',
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.15em',
        color: 'rgba(148, 163, 184, 0.2)',
        userSelect: 'none',
        textTransform: 'uppercase',
      }}>
        GEODETIC DATUM: WGS84 • ELLIPSOID GRS80 • PROJECTION: UTM ZONE 43N
      </div>
      <div style={{
        position: 'absolute',
        bottom: '8px',
        right: '24px',
        fontSize: '9px',
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.15em',
        color: 'rgba(148, 163, 184, 0.2)',
        userSelect: 'none',
        textTransform: 'uppercase',
      }}>
        LAT: 34°10'56.6" N • LON: 77°35'02.8" E • ELEV: 3,428M AMSL
      </div>
    </div>
  );
};
