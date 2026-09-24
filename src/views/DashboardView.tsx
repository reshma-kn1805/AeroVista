import React from 'react';
import {
  PlusCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  Box,
  Compass,
  CheckCircle2,
  Clock,
  Activity,
  AlertCircle,
} from 'lucide-react';
import { MissionData, ActiveView, ViewerMode } from '../types';
import { ThreeDCanvas } from '../components/Viewers/ThreeDCanvas';

interface DashboardViewProps {
  mission: MissionData;
  onNavigate: (view: ActiveView) => void;
  onOpenExplainability: () => void;
  onOpenDemo: () => void;
  viewerMode: ViewerMode;
  onViewerModeChange: (m: ViewerMode) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  mission,
  onNavigate,
  onOpenExplainability,
  onOpenDemo,
  viewerMode,
  onViewerModeChange,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. TOP HEADER BANNER */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-cyan">Mission Control</span>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#94A3B8' }}>
              STATION ID: AERO-ALPHA-LEH
            </span>
          </div>
          <h1 style={{ fontSize: '26px', color: '#F1F5F9', margin: 0 }}>
            AeroVista Mission Control
          </h1>
          <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>
            Transform aerial video into measurable 3D intelligence.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => onNavigate('new-mission')}
            className="btn btn-primary"
          >
            <PlusCircle size={15} />
            <span>+ New Reconstruction</span>
          </button>

          <button
            onClick={onOpenDemo}
            className="btn btn-secondary"
          >
            <Sparkles size={14} style={{ color: '#818CF8' }} />
            <span>Open Demo Mission</span>
          </button>
        </div>
      </div>

      {/* 2. DASHBOARD METRICS STRIP (6 Metrics from Section 8) */}
      <div className="grid-cols-6">
        {/* Drone Missions */}
        <div className="metric-card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('projects')}>
          <div style={{ fontSize: '11px', color: '#64748B', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
            Drone Missions
          </div>
          <div style={{ fontSize: '26px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#F1F5F9', marginTop: '4px' }}>
            24
          </div>
          <div style={{ fontSize: '10px', color: '#34D399', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
            <TrendingUp size={11} /> +3 this week
          </div>
        </div>

        {/* 3D Models */}
        <div className="metric-card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('three-d-viewer')}>
          <div style={{ fontSize: '11px', color: '#64748B', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
            3D Models
          </div>
          <div style={{ fontSize: '26px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#38BDF8', marginTop: '4px' }}>
            18
          </div>
          <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '2px' }}>
            Photogrammetric Meshes
          </div>
        </div>

        {/* Reconstructed Points */}
        <div className="metric-card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('point-cloud')}>
          <div style={{ fontSize: '11px', color: '#64748B', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
            Reconstructed Points
          </div>
          <div style={{ fontSize: '26px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#5EEAD4', marginTop: '4px' }}>
            12.8M
          </div>
          <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '2px' }}>
            Sparse & Dense MVS
          </div>
        </div>

        {/* Average Quality (Clickable to open Explainability!) */}
        <div
          className="metric-card"
          style={{ cursor: 'pointer', borderColor: 'rgba(56, 189, 248, 0.4)' }}
          onClick={onOpenExplainability}
          title="Click to view algorithmic quality breakdown"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
              Average Quality
            </div>
            <span className="badge badge-cyan" style={{ fontSize: '9px', padding: '1px 4px' }}>Audit</span>
          </div>
          <div style={{ fontSize: '26px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#38BDF8', marginTop: '4px' }}>
            91.7%
          </div>
          <div style={{ fontSize: '10px', color: '#38BDF8', marginTop: '2px' }}>
            Explainable Score ↗
          </div>
        </div>

        {/* Coverage */}
        <div className="metric-card">
          <div style={{ fontSize: '11px', color: '#64748B', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
            Coverage
          </div>
          <div style={{ fontSize: '26px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#F1F5F9', marginTop: '4px' }}>
            94.3%
          </div>
          <div style={{ fontSize: '10px', color: '#34D399', marginTop: '2px' }}>
            Spatial Completeness
          </div>
        </div>

        {/* Active Processing */}
        <div className="metric-card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('reconstruction')}>
          <div style={{ fontSize: '11px', color: '#64748B', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
            Active Processing
          </div>
          <div style={{ fontSize: '26px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#FBBF24', marginTop: '4px' }}>
            02
          </div>
          <div style={{ fontSize: '10px', color: '#FBBF24', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
            <Activity size={11} className="animate-spin" /> Live Pipeline
          </div>
        </div>
      </div>

      {/* 3. CENTRAL ACTIVE RECONSTRUCTION & 3D OVERVIEW (Section 9) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }}>
        {/* LEFT: ACTIVE MISSION CARD */}
        <div className="aero-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-warning">Active Reconstruction</span>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#94A3B8' }}>
                JOB ID: #AERO-9218
              </span>
            </div>
            <button
              onClick={() => onNavigate('reconstruction')}
              className="btn btn-outline btn-sm"
            >
              <span>Full Pipeline View</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '12px',
            backgroundColor: '#111821',
            border: '1px solid #263442',
            borderRadius: '6px',
            padding: '12px',
            marginBottom: '18px',
          }}>
            <div>
              <div style={{ fontSize: '10px', color: '#64748B', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Mission</div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#F1F5F9', marginTop: '2px' }}>Mountain Survey 024</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: '#64748B', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Video</div>
              <div style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: '#38BDF8', marginTop: '2px' }}>3840 × 2160</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: '#64748B', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Duration</div>
              <div style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: '#F1F5F9', marginTop: '2px' }}>02:48</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: '#64748B', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Frames</div>
              <div style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: '#F1F5F9', marginTop: '2px' }}>5,040</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: '#64748B', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Keyframes</div>
              <div style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: '#5EEAD4', marginTop: '2px' }}>184</div>
            </div>
          </div>

          {/* Processing Stages Grid (Section 9) */}
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
            Pipeline Progression Stages
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px',
            marginBottom: '16px',
            flex: 1,
          }}>
            {[
              { name: 'Video Validation', status: 'done' },
              { name: 'Frame Extraction', status: 'done' },
              { name: 'Keyframe Selection', status: 'done' },
              { name: 'Feature Matching', status: 'done' },
              { name: 'Camera Pose', status: 'done' },
              { name: 'Sparse Reconstruction', status: 'done' },
              { name: 'Dense Reconstruction', status: 'active' },
              { name: 'Mesh Generation', status: 'pending' },
              { name: 'Texture Mapping', status: 'pending' },
              { name: 'Optimization', status: 'pending' },
            ].map((stage, idx) => (
              <div
                key={stage.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  backgroundColor: '#111821',
                  border: '1px solid #263442',
                  borderRadius: '5px',
                  fontSize: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: '#64748B' }}>
                    0{idx + 1}
                  </span>
                  <span style={{ color: stage.status === 'pending' ? '#64748B' : '#F1F5F9' }}>
                    {stage.name}
                  </span>
                </div>

                {stage.status === 'done' && (
                  <span style={{ color: '#34D399', fontWeight: 'bold' }}>✓</span>
                )}
                {stage.status === 'active' && (
                  <span style={{ color: '#FBBF24', fontSize: '14px', animation: 'pulse 1.5s infinite' }}>●</span>
                )}
                {stage.status === 'pending' && (
                  <span style={{ color: '#475569' }}>○</span>
                )}
              </div>
            ))}
          </div>

          {/* Active Stage Progress Bar */}
          <div style={{
            backgroundColor: '#111821',
            border: '1px solid #263442',
            borderRadius: '6px',
            padding: '10px 14px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', color: '#F1F5F9' }}>
                Dense Multi-View Stereo Reconstruction (MVS Depth Maps)
              </span>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#FBBF24' }}>
                78%
              </span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: '78%', background: 'linear-gradient(90deg, #FBBF24, #38BDF8)' }} />
            </div>
          </div>
        </div>

        {/* RIGHT: INTERACTIVE 3D MINI-VIEWER */}
        <div className="aero-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>LIVE 3D RECONSTRUCTION</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#F1F5F9' }}>Interactive Viewport</div>
            </div>
            <button
              onClick={() => onNavigate('three-d-viewer')}
              className="btn btn-secondary btn-sm"
            >
              <span>Expand 3D</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div style={{ flex: 1, minHeight: '340px' }}>
            <ThreeDCanvas
              mode={viewerMode}
              onModeChange={onViewerModeChange}
              mission={mission}
              objects={mission.objects}
              measurements={mission.measurements}
              coverageGaps={mission.coverageGaps}
              onOpenExplainability={onOpenExplainability}
              isMiniView={true}
            />
          </div>
        </div>
      </div>

      {/* 4. WORKFLOW PIPELINE BREADCRUMB STRIP (Section 1) */}
      <div className="aero-card" style={{ padding: '16px 20px' }}>
        <div style={{ fontSize: '11px', color: '#64748B', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '8px' }}>
          Core Single-Pass Product Workflow
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          overflowX: 'auto',
          paddingBottom: '4px',
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
        }}>
          {[
            { name: 'Drone Video', view: 'new-mission' },
            { name: 'Validation', view: 'video-analysis' },
            { name: 'Keyframes', view: 'keyframes' },
            { name: 'Features', view: 'reconstruction' },
            { name: 'Camera Pose', view: 'flight-path' },
            { name: 'Point Cloud', view: 'point-cloud' },
            { name: 'Mesh & Texture', view: 'three-d-viewer' },
            { name: 'Object AI', view: 'object-ai' },
            { name: 'Measurements', view: 'measurements' },
            { name: 'Confidence Audit', view: 'three-d-viewer' },
            { name: 'GIS / 3D Export', view: 'reports' },
          ].map((item, idx, arr) => (
            <React.Fragment key={item.name}>
              <span
                onClick={() => onNavigate(item.view as ActiveView)}
                style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  background: '#111821',
                  border: '1px solid #263442',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#38BDF8';
                  e.currentTarget.style.borderColor = '#38BDF8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#94A3B8';
                  e.currentTarget.style.borderColor = '#263442';
                }}
              >
                {item.name}
              </span>
              {idx < arr.length - 1 && <span style={{ color: '#475569' }}>→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
