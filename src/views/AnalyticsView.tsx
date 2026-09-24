import React from 'react';
import { BarChart3, TrendingUp, PieChart, Activity, ShieldCheck, Layers } from 'lucide-react';
import { MissionData } from '../types';

interface AnalyticsViewProps {
  mission: MissionData;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ mission }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* HEADER */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-cyan">Statistical Diagnostics</span>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#94A3B8' }}>
            CROSS-CAMPAIGN METRICS & COVARIANCE
          </span>
        </div>
        <h1 style={{ fontSize: '24px', color: '#F1F5F9', marginTop: '4px', margin: 0 }}>
          Reconstruction Analytics & Uncertainty Distributions
        </h1>
        <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '2px' }}>
          Quantitative performance analytics spanning keyframe culling ratios, point density histograms, and feature match distributions.
        </p>
      </div>

      {/* TOP ROW: QUALITY DISTRIBUTION & PROCESSING TIME */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Quality Factors Radar / Bar Chart */}
        <div className="aero-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#F1F5F9' }}>
              Reconstruction Quality Factors
            </span>
            <span className="badge badge-teal">Overall: 88.4%</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'Camera Stability', val: 95, color: '#818CF8' },
              { label: 'Frame Overlap Baseline', val: 93, color: '#38BDF8' },
              { label: 'Texture Frequency Richness', val: 91, color: '#5EEAD4' },
              { label: 'Feature Inlier Density', val: 89, color: '#34D399' },
              { label: 'Shadow Occlusion Resilience', val: 83, color: '#FBBF24' },
              { label: 'Motion Sharpness Ratio', val: 88, color: '#38BDF8' },
            ].map((f) => (
              <div key={f.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                  <span style={{ color: '#94A3B8' }}>{f.label}</span>
                  <span style={{ color: f.color, fontFamily: 'var(--font-mono)', fontWeight: '600' }}>{f.val}%</span>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill" style={{ width: `${f.val}%`, background: f.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline Stage Time Consumption */}
        <div className="aero-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#F1F5F9' }}>
              Compute Time by Stage (Total: 4m 48s)
            </span>
            <span className="badge badge-cyan">CUDA Accelerated</span>
          </div>

          {/* SVG Horizontal Bar Chart */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { stage: 'Dense MVS Point Cloud', sec: 64.8, pct: 28, color: '#38BDF8' },
              { stage: 'Poisson Mesh Generation', sec: 42.3, pct: 18, color: '#5EEAD4' },
              { stage: 'Texture Mapping Atlas', sec: 38.7, pct: 16, color: '#818CF8' },
              { stage: 'Bundle Adjustment (BA)', sec: 31.0, pct: 13, color: '#34D399' },
              { stage: 'Sparse Triangulation', sec: 27.4, pct: 11, color: '#FBBF24' },
              { stage: 'Feature Pairing & Match', sec: 22.5, pct: 9, color: '#38BDF8' },
              { stage: 'Feature Detection', sec: 18.1, pct: 5, color: '#94A3B8' },
            ].map((s) => (
              <div key={s.stage}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
                  <span style={{ color: '#F1F5F9' }}>{s.stage}</span>
                  <span style={{ color: s.color, fontFamily: 'var(--font-mono)' }}>{s.sec}s ({s.pct}%)</span>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill" style={{ width: `${s.pct * 3.2}%`, background: s.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: HISTOGRAM & CONFIDENCE BREAKDOWN */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {/* Point Density Histogram */}
        <div className="aero-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#F1F5F9' }}>
            Point Density Histogram
          </span>
          <p style={{ fontSize: '11px', color: '#64748B', marginTop: '2px', marginBottom: '14px' }}>
            Points / m² spatial distribution
          </p>

          <svg width="100%" height="110" style={{ overflow: 'visible' }}>
            {[18, 42, 68, 92, 110, 85, 54, 32, 14, 8].map((h, i) => (
              <g key={i}>
                <rect
                  x={`${i * 10 + 2}%`}
                  y={110 - h}
                  width="7%"
                  height={h}
                  fill={i > 6 ? '#5EEAD4' : '#38BDF8'}
                  rx="2"
                />
              </g>
            ))}
          </svg>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748B', fontFamily: 'var(--font-mono)', marginTop: '8px' }}>
            <span>&lt; 50 pts/m²</span>
            <span>Median: 420 pts/m²</span>
            <span>&gt; 1,200 pts/m²</span>
          </div>
        </div>

        {/* Feature Match Reprojection Errors */}
        <div className="aero-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#F1F5F9' }}>
            Reprojection Error Curve
          </span>
          <p style={{ fontSize: '11px', color: '#64748B', marginTop: '2px', marginBottom: '14px' }}>
            Mean error: 0.62 px (Gaussian fit)
          </p>

          <svg width="100%" height="110" viewBox="0 0 200 110">
            <path
              d="M0,105 Q30,102 60,95 T100,20 T140,95 T200,105"
              fill="none"
              stroke="#5EEAD4"
              strokeWidth="2.5"
            />
            <line x1="100" y1="0" x2="100" y2="110" stroke="#38BDF8" strokeWidth="1" strokeDasharray="3,3" />
          </svg>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748B', fontFamily: 'var(--font-mono)', marginTop: '8px' }}>
            <span>-2.0 px</span>
            <span style={{ color: '#38BDF8' }}>μ = 0.62 px</span>
            <span>+2.0 px</span>
          </div>
        </div>

        {/* Object Category Distribution */}
        <div className="aero-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#F1F5F9' }}>
            Classified 3D Entities
          </span>
          <p style={{ fontSize: '11px', color: '#64748B', marginTop: '2px', marginBottom: '14px' }}>
            Semantic segmentation breakdown
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px' }}>
            {[
              { cat: 'Buildings & Structures', count: 6, color: '#818CF8' },
              { cat: 'Survey Vehicles', count: 4, color: '#38BDF8' },
              { cat: 'Communication Towers', count: 2, color: '#FBBF24' },
              { cat: 'Road & Paved Corridors', count: 1, color: '#5EEAD4' },
              { cat: 'Water Retention Bodies', count: 1, color: '#34D399' },
            ].map((c) => (
              <div key={c.cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: c.color }} />
                  <span style={{ color: '#F1F5F9' }}>{c.cat}</span>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', color: c.color, fontWeight: '600' }}>
                  {c.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
