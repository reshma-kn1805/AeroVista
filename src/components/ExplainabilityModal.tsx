import React from 'react';
import { X, CheckCircle2, AlertTriangle, HelpCircle, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { QualityFactors, RegionConfidence } from '../types';

interface ExplainabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  quality: QualityFactors;
  regions: RegionConfidence[];
  onNavigateToReFlight?: () => void;
}

export const ExplainabilityModal: React.FC<ExplainabilityModalProps> = ({
  isOpen,
  onClose,
  quality,
  regions,
  onNavigateToReFlight,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '28px' }}>
        {/* MODAL HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-teal">Explainable AI / CV</span>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#94A3B8' }}>
                Algorithmic Audit Log
              </span>
            </div>
            <h2 style={{ fontSize: '20px', marginTop: '6px', color: '#F1F5F9' }}>
              Why is this reconstruction quality <span style={{ color: '#38BDF8' }}>{quality.compositeScore}%</span>?
            </h2>
            <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
              Scientific factor decomposition derived from multi-view stereo covariance and reprojection residuals.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* CORE VERDICT BOX */}
        <div style={{
          backgroundColor: '#111821',
          border: '1px solid #263442',
          borderLeft: '4px solid #38BDF8',
          borderRadius: '6px',
          padding: '14px 16px',
          marginBottom: '22px',
        }}>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#38BDF8', marginBottom: '4px' }}>
            Mathematical Audit Summary
          </div>
          <div style={{ fontSize: '13px', color: '#F1F5F9', lineHeight: '1.6' }}>
            “Strong frame overlap (<strong>{quality.frameOverlap}%</strong>) and camera gimbal stability (<strong>{quality.cameraStability}%</strong>) contributed positively to bundle adjustment convergence. However, low-texture scree and steep shadow occlusion in the <strong>South Area</strong> incurred a localized penalty, bringing the scene composite quality to <strong>{quality.compositeScore}%</strong>.”
          </div>
        </div>

        {/* FACTOR METRICS GRID */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#94A3B8', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Factor Weight Contributions
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {/* Frame Overlap */}
            <div style={{ background: '#111821', border: '1px solid #263442', borderRadius: '6px', padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', color: '#F1F5F9' }}>Frame Overlap</span>
                <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: '#34D399', fontWeight: '600' }}>
                  {quality.frameOverlap}%
                </span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${quality.frameOverlap}%`, background: '#34D399' }} />
              </div>
              <div style={{ fontSize: '10px', color: '#64748B', marginTop: '4px' }}>
                Baseline parallax satisfies epipolar baseline requirements.
              </div>
            </div>

            {/* Feature Density */}
            <div style={{ background: '#111821', border: '1px solid #263442', borderRadius: '6px', padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', color: '#F1F5F9' }}>Feature Density</span>
                <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: '#38BDF8', fontWeight: '600' }}>
                  {quality.featureDensity}%
                </span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${quality.featureDensity}%`, background: '#38BDF8' }} />
              </div>
              <div style={{ fontSize: '10px', color: '#64748B', marginTop: '4px' }}>
                Average 3,214 SIFT/SuperPoint descriptors per keyframe.
              </div>
            </div>

            {/* Motion Blur (Penalty) */}
            <div style={{ background: '#111821', border: '1px solid #263442', borderRadius: '6px', padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', color: '#F1F5F9' }}>Motion Blur Penalty</span>
                <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: '#FBBF24', fontWeight: '600' }}>
                  -{quality.motionBlur}%
                </span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${quality.motionBlur * 2.5}%`, background: '#FBBF24' }} />
              </div>
              <div style={{ fontSize: '10px', color: '#64748B', marginTop: '4px' }}>
                Minor rotational smear detected during high-g yaw turns.
              </div>
            </div>

            {/* Occlusion (Penalty) */}
            <div style={{ background: '#111821', border: '1px solid #263442', borderRadius: '6px', padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', color: '#F1F5F9' }}>Occlusion Penalty</span>
                <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: '#FB7185', fontWeight: '600' }}>
                  -{quality.occlusion}%
                </span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${quality.occlusion * 2.5}%`, background: '#FB7185' }} />
              </div>
              <div style={{ fontSize: '10px', color: '#64748B', marginTop: '4px' }}>
                South cliff geometry cast shadows blocking feature triangulation.
              </div>
            </div>

            {/* Texture Quality */}
            <div style={{ background: '#111821', border: '1px solid #263442', borderRadius: '6px', padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', color: '#F1F5F9' }}>Texture Richness</span>
                <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: '#5EEAD4', fontWeight: '600' }}>
                  {quality.textureQuality}%
                </span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${quality.textureQuality}%`, background: '#5EEAD4' }} />
              </div>
              <div style={{ fontSize: '10px', color: '#64748B', marginTop: '4px' }}>
                High-frequency contrast on buildings, roads, and rocks.
              </div>
            </div>

            {/* Camera Stability */}
            <div style={{ background: '#111821', border: '1px solid #263442', borderRadius: '6px', padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', color: '#F1F5F9' }}>Gimbal Stability</span>
                <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: '#818CF8', fontWeight: '600' }}>
                  {quality.cameraStability}%
                </span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${quality.cameraStability}%`, background: '#818CF8' }} />
              </div>
              <div style={{ fontSize: '10px', color: '#64748B', marginTop: '4px' }}>
                Angular jitter below 0.08°/s across 98% of flight trajectory.
              </div>
            </div>
          </div>
        </div>

        {/* REGIONAL CONFIDENCE AUDIT */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#94A3B8', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Spatial Region Breakdown
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {regions.map((reg) => (
              <div
                key={reg.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: '#111821',
                  border: '1px solid #263442',
                  borderRadius: '6px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: reg.status === 'High' ? '#34D399' : reg.status === 'Medium' ? '#FBBF24' : '#FB7185',
                    }}
                  />
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#F1F5F9' }}>{reg.name}</div>
                    <div style={{ fontSize: '10px', color: '#94A3B8' }}>{reg.primaryIssue}</div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: '13px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: '600',
                    color: reg.status === 'High' ? '#34D399' : reg.status === 'Medium' ? '#FBBF24' : '#FB7185',
                  }}>
                    {reg.confidencePct}%
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>
                    {(reg.pointCount / 1000).toFixed(0)}k points
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SCIENTIFIC ACTION FOOTER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #263442' }}>
          <div style={{ fontSize: '11px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={14} style={{ color: '#38BDF8' }} />
            <span>SIH26158 Trust Metric: Zero False Precision</span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => {
                onClose();
                if (onNavigateToReFlight) onNavigateToReFlight();
              }}
              className="btn btn-primary btn-sm"
            >
              <span>View Recommended Re-Flight</span>
              <ArrowRight size={13} />
            </button>
            <button onClick={onClose} className="btn btn-outline btn-sm">
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
