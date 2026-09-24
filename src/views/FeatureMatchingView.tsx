import React from 'react';
import { FeatureMatchCanvas } from '../components/Viewers/FeatureMatchCanvas';
import { Info, ShieldCheck, Zap } from 'lucide-react';

export const FeatureMatchingView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* HEADER */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-cyan">Computer Vision Pipeline</span>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#94A3B8' }}>
            CORRESPONDENCE SOLVER
          </span>
        </div>
        <h1 style={{ fontSize: '24px', color: '#F1F5F9', marginTop: '4px', margin: 0 }}>
          Feature Detection & Multi-View Matching
        </h1>
        <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '2px' }}>
          Extraction of invariant keypoint descriptors and robust epipolar RANSAC outlier filtering.
        </p>
      </div>

      {/* INTERACTIVE CANVAS COMPONENT */}
      <FeatureMatchCanvas />

      {/* ALGORITHMIC DEEP DIVE CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <div className="aero-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Zap size={16} style={{ color: '#38BDF8' }} />
            <h4 style={{ fontSize: '13px', color: '#F1F5F9' }}>SuperPoint / SIFT Extractor</h4>
          </div>
          <p style={{ fontSize: '12px', color: '#94A3B8', lineHeight: '1.5' }}>
            Computes sub-pixel corner locations across scale octaves. Generates 256-dimensional deep feature representations invariant to illumination and drone yaw angles.
          </p>
        </div>

        <div className="aero-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <ShieldCheck size={16} style={{ color: '#5EEAD4' }} />
            <h4 style={{ fontSize: '13px', color: '#F1F5F9' }}>LightGlue Attentional Matching</h4>
          </div>
          <p style={{ fontSize: '12px', color: '#94A3B8', lineHeight: '1.5' }}>
            Self and cross-attention transformer layers jointly reason over geometry and appearance, pruning spurious pairings before geometric verification.
          </p>
        </div>

        <div className="aero-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Info size={16} style={{ color: '#818CF8' }} />
            <h4 style={{ fontSize: '13px', color: '#F1F5F9' }}>Epipolar RANSAC Filter</h4>
          </div>
          <p style={{ fontSize: '12px', color: '#94A3B8', lineHeight: '1.5' }}>
            Enforces the Fundamental Matrix constraint: <code style={{ color: '#5EEAD4' }}>x'ᵀ · F · x = 0</code>. Discards moving objects and shadows to achieve 91.3% match confidence.
          </p>
        </div>
      </div>
    </div>
  );
};
