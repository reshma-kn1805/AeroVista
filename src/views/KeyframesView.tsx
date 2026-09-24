import React, { useState } from 'react';
import { Layers, CheckCircle2, XCircle, Info, Sparkles, Filter } from 'lucide-react';
import { SAMPLE_KEYFRAMES } from '../data/missionData';

import { MissionData } from '../types';

interface KeyframesViewProps {
  mission?: MissionData;
}

export const KeyframesView: React.FC<KeyframesViewProps> = ({ mission }) => {
  const [filterRedundant, setFilterRedundant] = useState<'all' | 'selected' | 'culled'>('all');
  const [selectedKeyframeId, setSelectedKeyframeId] = useState<number>(2);

  const totalFrames = mission?.video.totalFrames || 5040;
  const keyframesCount = mission?.video.keyframesCount || 184;
  const redundantFrames = Math.max(0, totalFrames - keyframesCount);
  const computeSavedPct = ((redundantFrames / totalFrames) * 100).toFixed(1);

  const displayedFrames = SAMPLE_KEYFRAMES.filter((f) => {
    if (filterRedundant === 'selected') return !f.isRedundant;
    if (filterRedundant === 'culled') return f.isRedundant;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* HEADER */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-teal">Intelligent Keyframing</span>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#94A3B8' }}>
            GEOMETRIC REDUNDANCY REDUCTION • {mission?.name || 'Mountain Survey 024'}
          </span>
        </div>
        <h1 style={{ fontSize: '24px', color: '#F1F5F9', marginTop: '4px', margin: 0 }}>
          Intelligent Keyframe Selection
        </h1>
        <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '2px' }}>
          Adaptive entropy and baseline angle clustering extract optimal views while eliminating stationary and duplicate frames.
        </p>
      </div>

      {/* METRIC CARDS STRIP (Section 12) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '12px',
      }}>
        <div className="metric-card">
          <div style={{ fontSize: '10px', color: '#64748B', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
            Total Frames
          </div>
          <div style={{ fontSize: '22px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#F1F5F9', marginTop: '2px' }}>
            {totalFrames.toLocaleString()}
          </div>
          <div style={{ fontSize: '10px', color: '#94A3B8' }}>Raw Video Extraction</div>
        </div>

        <div className="metric-card">
          <div style={{ fontSize: '10px', color: '#64748B', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
            Frames Analyzed
          </div>
          <div style={{ fontSize: '22px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#38BDF8', marginTop: '2px' }}>
            {totalFrames.toLocaleString()}
          </div>
          <div style={{ fontSize: '10px', color: '#34D399' }}>100% Ingested</div>
        </div>

        <div className="metric-card">
          <div style={{ fontSize: '10px', color: '#64748B', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
            Keyframes Selected
          </div>
          <div style={{ fontSize: '22px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#5EEAD4', marginTop: '2px' }}>
            {keyframesCount.toLocaleString()}
          </div>
          <div style={{ fontSize: '10px', color: '#5EEAD4' }}>Optimal Multi-Angle</div>
        </div>

        <div className="metric-card">
          <div style={{ fontSize: '10px', color: '#64748B', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
            Redundant Frames
          </div>
          <div style={{ fontSize: '22px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#FB7185', marginTop: '2px' }}>
            {redundantFrames.toLocaleString()}
          </div>
          <div style={{ fontSize: '10px', color: '#FB7185' }}>{computeSavedPct}% Compute Saved</div>
        </div>

        <div className="metric-card">
          <div style={{ fontSize: '10px', color: '#64748B', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
            Coverage
          </div>
          <div style={{ fontSize: '22px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#34D399', marginTop: '2px' }}>
            {mission?.coveragePct || 93.4}%
          </div>
          <div style={{ fontSize: '10px', color: '#34D399' }}>High Spatial Integrity</div>
        </div>
      </div>

      {/* SCIENTIFIC EXPLANATION QUOTE BOX (Section 12) */}
      <div style={{
        backgroundColor: '#111821',
        border: '1px solid #263442',
        borderLeft: '4px solid #5EEAD4',
        borderRadius: '6px',
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <Info size={20} style={{ color: '#5EEAD4', flexShrink: 0 }} />
        <div style={{ fontSize: '13px', color: '#F1F5F9', lineHeight: '1.5' }}>
          <strong>AeroVista Core Principle:</strong> AeroVista automatically selects visually informative frames while removing redundant frames to improve reconstruction efficiency, eliminating collinear drift in bundle adjustment.
        </div>
      </div>

      {/* FILTER TABS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { id: 'all', label: 'All Sample Frames' },
            { id: 'selected', label: 'Selected Keyframes Only (184)' },
            { id: 'culled', label: 'Culled Redundant Frames (4,856)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterRedundant(tab.id as any)}
              className="btn btn-sm"
              style={{
                backgroundColor: filterRedundant === tab.id ? '#1C2733' : 'transparent',
                borderColor: filterRedundant === tab.id ? '#38BDF8' : '#263442',
                color: filterRedundant === tab.id ? '#38BDF8' : '#94A3B8',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* KEYFRAME CARD TIMELINE GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '14px',
      }}>
        {displayedFrames.map((kf) => {
          const isSelected = selectedKeyframeId === kf.id;
          return (
            <div
              key={kf.id}
              onClick={() => setSelectedKeyframeId(kf.id)}
              className="aero-card"
              style={{
                padding: '12px',
                cursor: 'pointer',
                borderColor: isSelected ? '#38BDF8' : kf.isRedundant ? 'rgba(251, 113, 133, 0.3)' : '#263442',
                backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.05)' : '#141D27',
              }}
            >
              {/* Synthetic Visual Thumbnail */}
              <div style={{
                position: 'relative',
                height: '110px',
                backgroundColor: '#0A0E14',
                borderRadius: '4px',
                overflow: 'hidden',
                border: '1px solid #1C2733',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
                  <path
                    d={`M0,70 Q60,${40 + (kf.frameIndex % 30)} 120,60 T240,65 L240,110 L0,110 Z`}
                    fill="#192432"
                  />
                  <circle cx="120" cy="50" r="14" fill="rgba(56, 189, 248, 0.15)" stroke="#38BDF8" strokeWidth="1" />
                </svg>

                <div style={{
                  position: 'absolute',
                  top: '6px',
                  left: '6px',
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)',
                  backgroundColor: 'rgba(8, 11, 16, 0.8)',
                  padding: '2px 5px',
                  borderRadius: '3px',
                  color: '#F1F5F9',
                }}>
                  #{kf.frameIndex.toString().padStart(4, '0')}
                </div>

                <div style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                }}>
                  {kf.isRedundant ? (
                    <span className="badge badge-danger" style={{ fontSize: '9px', padding: '1px 5px' }}>
                      Culled
                    </span>
                  ) : (
                    <span className="badge badge-success" style={{ fontSize: '9px', padding: '1px 5px' }}>
                      Selected
                    </span>
                  )}
                </div>
              </div>

              {/* CARD METRICS */}
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Timestamp:</span>
                  <span style={{ color: '#F1F5F9' }}>{kf.timestamp}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Overlap:</span>
                  <span style={{ color: kf.overlapPct > 90 ? '#FB7185' : '#34D399' }}>
                    {kf.overlapPct}%
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Baseline Angle:</span>
                  <span style={{ color: '#38BDF8' }}>{kf.baselineAngleDeg}°</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Info Gain:</span>
                  <span style={{ color: '#5EEAD4' }}>{kf.informationGain}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
