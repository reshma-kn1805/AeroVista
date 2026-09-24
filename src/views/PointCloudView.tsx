import React, { useState } from 'react';
import { CloudLightning, Sliders, Eye, Download, Info } from 'lucide-react';
import { MissionData } from '../types';
import { ThreeDCanvas } from '../components/Viewers/ThreeDCanvas';

interface PointCloudViewProps {
  mission: MissionData;
}

export const PointCloudView: React.FC<PointCloudViewProps> = ({ mission }) => {
  const [pointCloudColorMode, setPointCloudColorMode] = useState<'altitude' | 'rgb' | 'confidence'>('altitude');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-cyan">Dense Photogrammetry</span>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#94A3B8' }}>
              MULTI-VIEW STEREO POINT ENGINE
            </span>
          </div>
          <h1 style={{ fontSize: '24px', color: '#F1F5F9', marginTop: '4px', margin: 0 }}>
            Dense Point Cloud ({(mission.pointsCount / 1000000).toFixed(2)}M Points)
          </h1>
          <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '2px' }}>
            Multi-view stereo triangulated spatial point cloud with intensity and height coloration for {mission.name}.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setPointCloudColorMode('altitude')}
            className="btn btn-sm"
            style={{
              backgroundColor: pointCloudColorMode === 'altitude' ? '#1C2733' : 'transparent',
              borderColor: pointCloudColorMode === 'altitude' ? '#38BDF8' : '#263442',
              color: pointCloudColorMode === 'altitude' ? '#38BDF8' : '#94A3B8',
            }}
          >
            Elevation (Z)
          </button>
          <button
            onClick={() => setPointCloudColorMode('rgb')}
            className="btn btn-sm"
            style={{
              backgroundColor: pointCloudColorMode === 'rgb' ? '#1C2733' : 'transparent',
              borderColor: pointCloudColorMode === 'rgb' ? '#5EEAD4' : '#263442',
              color: pointCloudColorMode === 'rgb' ? '#5EEAD4' : '#94A3B8',
            }}
          >
            Photogrammetric RGB
          </button>
        </div>
      </div>

      {/* METRICS ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
        <div className="metric-card">
          <div style={{ fontSize: '10px', color: '#64748B', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Total Points</div>
          <div style={{ fontSize: '24px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#5EEAD4', marginTop: '2px' }}>
            {mission.pointsCount.toLocaleString()}
          </div>
          <div style={{ fontSize: '10px', color: '#94A3B8' }}>
            Sparse: {Math.round(mission.pointsCount * 0.026).toLocaleString()} | Dense: {(mission.pointsCount * 0.974 / 1000000).toFixed(2)}M
          </div>
        </div>

        <div className="metric-card">
          <div style={{ fontSize: '10px', color: '#64748B', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Mean Point Spacing</div>
          <div style={{ fontSize: '24px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#38BDF8', marginTop: '2px' }}>
            2.4 cm
          </div>
          <div style={{ fontSize: '10px', color: '#34D399' }}>Sub-decimeter resolution</div>
        </div>

        <div className="metric-card">
          <div style={{ fontSize: '10px', color: '#64748B', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Octree Hierarchy</div>
          <div style={{ fontSize: '24px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#F1F5F9', marginTop: '2px' }}>
            8 Levels
          </div>
          <div style={{ fontSize: '10px', color: '#94A3B8' }}>Real-time LOD streaming</div>
        </div>

        <div className="metric-card">
          <div style={{ fontSize: '10px', color: '#64748B', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Normals Computed</div>
          <div style={{ fontSize: '24px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#34D399', marginTop: '2px' }}>
            100%
          </div>
          <div style={{ fontSize: '10px', color: '#34D399' }}>PCA K-Nearest Neighbors</div>
        </div>
      </div>

      {/* 3D POINT CLOUD CANVAS */}
      <ThreeDCanvas
        mode="POINT CLOUD"
        onModeChange={() => {}}
        mission={mission}
        objects={mission.objects}
      />
    </div>
  );
};
