import React from 'react';
import { Route, Compass, CheckCircle2, Sliders, ArrowRight } from 'lucide-react';
import { MissionData, ViewerMode } from '../types';
import { ThreeDCanvas } from '../components/Viewers/ThreeDCanvas';

interface CameraPoseViewProps {
  mission: MissionData;
  viewerMode: ViewerMode;
  onViewerModeChange: (m: ViewerMode) => void;
}

export const CameraPoseView: React.FC<CameraPoseViewProps> = ({
  mission,
  viewerMode,
  onViewerModeChange,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* HEADER */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-cyan">Structure from Motion</span>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#94A3B8' }}>
            6-DOF BUNDLE ADJUSTMENT
          </span>
        </div>
        <h1 style={{ fontSize: '24px', color: '#F1F5F9', marginTop: '4px', margin: 0 }}>
          Camera Pose Estimation & Trajectory
        </h1>
        <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '2px' }}>
          Simultaneous localization and mapping (SfM) solving metric camera positions and orientations.
        </p>
      </div>

      {/* METRIC STRIP (Section 14) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
        <div className="metric-card">
          <div style={{ fontSize: '10px', color: '#64748B', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
            Camera Poses
          </div>
          <div style={{ fontSize: '24px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#F1F5F9', marginTop: '2px' }}>
            184
          </div>
          <div style={{ fontSize: '10px', color: '#38BDF8' }}>6-DoF Extrinsics Solved</div>
        </div>

        <div className="metric-card">
          <div style={{ fontSize: '10px', color: '#64748B', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
            Trajectory Length
          </div>
          <div style={{ fontSize: '24px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#5EEAD4', marginTop: '2px' }}>
            2.84 km
          </div>
          <div style={{ fontSize: '10px', color: '#94A3B8' }}>Continuous Spline Baseline</div>
        </div>

        <div className="metric-card">
          <div style={{ fontSize: '10px', color: '#64748B', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
            Motion Confidence
          </div>
          <div style={{ fontSize: '24px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#34D399', marginTop: '2px' }}>
            94.2%
          </div>
          <div style={{ fontSize: '10px', color: '#34D399' }}>Low IMU Covariance Drift</div>
        </div>

        <div className="metric-card">
          <div style={{ fontSize: '10px', color: '#64748B', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
            Reprojection Residual
          </div>
          <div style={{ fontSize: '24px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#818CF8', marginTop: '2px' }}>
            0.62 px
          </div>
          <div style={{ fontSize: '10px', color: '#818CF8' }}>Sub-Pixel BA Residual</div>
        </div>
      </div>

      {/* 3D TRAJECTORY VIEWER */}
      <div className="aero-card" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#64748B', fontFamily: 'var(--font-mono)' }}>3D SPATIAL VISUALIZATION</div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#F1F5F9' }}>Camera Frustums & Baseline Spline</div>
          </div>
          <span className="badge badge-teal">Interactive Trajectory</span>
        </div>

        <ThreeDCanvas
          mode={viewerMode}
          onModeChange={onViewerModeChange}
          mission={mission}
          objects={mission.objects}
          showFlightPath={true}
        />
      </div>
    </div>
  );
};
