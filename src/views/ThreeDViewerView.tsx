import React from 'react';
import { Box, Layers, ShieldCheck, Sparkles, Sliders, Maximize2, Compass, AlertTriangle } from 'lucide-react';
import { MissionData, ViewerMode } from '../types';
import { ThreeDCanvas } from '../components/Viewers/ThreeDCanvas';

interface ThreeDViewerViewProps {
  mission: MissionData;
  viewerMode: ViewerMode;
  onViewerModeChange: (m: ViewerMode) => void;
  onOpenExplainability: () => void;
}

export const ThreeDViewerView: React.FC<ThreeDViewerViewProps> = ({
  mission,
  viewerMode,
  onViewerModeChange,
  onOpenExplainability,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-cyan">Geospatial Digital Twin</span>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#94A3B8' }}>
              THREE.JS HIGH-PERFORMANCE ENGINE
            </span>
          </div>
          <h1 style={{ fontSize: '24px', color: '#F1F5F9', marginTop: '4px', margin: 0 }}>
            Interactive 3D Environment & Confidence Map
          </h1>
          <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '2px' }}>
            Multimodal 3D rendering with photogrammetric mesh, dense points, and vertex covariance heatmap.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={onOpenExplainability}
            className="btn btn-outline"
            style={{ color: '#5EEAD4', borderColor: 'rgba(94, 234, 212, 0.4)' }}
          >
            <ShieldCheck size={15} />
            <span>Audit Quality ({mission.quality.compositeScore}%)</span>
          </button>
        </div>
      </div>

      {/* METRIC INFORMATION STRIP (Section 15) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: '12px',
        backgroundColor: '#111821',
        border: '1px solid #263442',
        borderRadius: '8px',
        padding: '14px 18px',
      }}>
        <div>
          <div style={{ fontSize: '10px', color: '#64748B', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Points</div>
          <div style={{ fontSize: '18px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#F1F5F9', marginTop: '2px' }}>
            {mission.pointsCount.toLocaleString()}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '10px', color: '#64748B', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Vertices</div>
          <div style={{ fontSize: '18px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#38BDF8', marginTop: '2px' }}>
            {mission.verticesCount.toLocaleString()}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '10px', color: '#64748B', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Mesh Faces</div>
          <div style={{ fontSize: '18px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#5EEAD4', marginTop: '2px' }}>
            {mission.meshFacesCount.toLocaleString()}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '10px', color: '#64748B', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Texture Atlas</div>
          <div style={{ fontSize: '18px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#818CF8', marginTop: '2px' }}>
            {mission.textureResolution}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '10px', color: '#64748B', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Coverage</div>
          <div style={{ fontSize: '18px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#34D399', marginTop: '2px' }}>
            {mission.coveragePct}%
          </div>
        </div>

        <div
          onClick={onOpenExplainability}
          style={{ cursor: 'pointer' }}
          title={`Click to view why quality is ${mission.quality.compositeScore}%`}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '10px', color: '#64748B', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Quality</span>
            <span className="badge badge-cyan" style={{ fontSize: '8px', padding: '1px 3px' }}>Why?</span>
          </div>
          <div style={{ fontSize: '18px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#38BDF8', marginTop: '2px' }}>
            {mission.quality.compositeScore}% ↗
          </div>
        </div>
      </div>

      {/* FULL-SIZE INTERACTIVE 3D CANVAS */}
      <ThreeDCanvas
        mode={viewerMode}
        onModeChange={onViewerModeChange}
        mission={mission}
        objects={mission.objects}
        measurements={mission.measurements}
        coverageGaps={mission.coverageGaps}
        onOpenExplainability={onOpenExplainability}
      />

      {/* CONFIDENCE & REGIONAL ANALYSIS SECTION (Section 16) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }}>
        {/* REGIONAL CONFIDENCE TABLE */}
        <div className="aero-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#64748B', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                Per-Region Uncertainty Map
              </div>
              <h3 style={{ fontSize: '15px', color: '#F1F5F9', marginTop: '2px' }}>
                Spatial Reconstruction Confidence
              </h3>
            </div>
            <button
              onClick={() => onViewerModeChange('CONFIDENCE')}
              className="btn btn-teal btn-sm"
            >
              Toggle 3D Heatmap
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {mission.regions.map((reg) => (
              <div
                key={reg.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  backgroundColor: '#111821',
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
                      backgroundColor: reg.status === 'High' ? '#34D399' : '#FB7185',
                    }}
                  />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#F1F5F9' }}>{reg.name}</div>
                    <div style={{ fontSize: '11px', color: '#94A3B8' }}>{reg.primaryIssue}</div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    fontSize: '15px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: '700',
                    color: reg.status === 'High' ? '#34D399' : '#FB7185',
                  }}>
                    {reg.confidencePct}%
                  </span>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>
                    {reg.status} Confidence
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ROOT CAUSE UNCERTAINTY EXPLANATION */}
        <div className="aero-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '11px', color: '#64748B', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '8px' }}>
            Scientific Audit
          </div>
          <h3 style={{ fontSize: '15px', color: '#F1F5F9', marginBottom: '12px' }}>
            Uncertainty Diagnostics
          </h3>
          <p style={{ fontSize: '12px', color: '#94A3B8', lineHeight: '1.6', marginBottom: '14px' }}>
            AeroVista tracks ray triangulation covariance per point. The South Area exhibits lower confidence (<strong>62%</strong>) due to steep terrain self-shadowing and homogeneous scree texture, whereas North and West areas achieved <strong>91–94%</strong> confidence.
          </p>

          <div style={{
            backgroundColor: '#111821',
            border: '1px solid #263442',
            borderRadius: '6px',
            padding: '12px',
            fontSize: '11px',
            color: '#FBBF24',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <AlertTriangle size={15} style={{ flexShrink: 0 }} />
            <span>Recommended action: Execute targeted re-flight over South Area ravine.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
