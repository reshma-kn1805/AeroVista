import React, { useState } from 'react';
import { GitCompare, CheckCircle2, AlertTriangle, Layers, Calendar, Sliders, ArrowRight, ShieldAlert } from 'lucide-react';
import { CHANGE_DETECTION_DATA } from '../data/changeDetectionData';
import { ThreeDCanvas } from '../components/Viewers/ThreeDCanvas';
import { MissionData, ViewerMode } from '../types';

interface ChangeDetectionViewProps {
  mission: MissionData;
  viewerMode: ViewerMode;
  onViewerModeChange: (m: ViewerMode) => void;
}

export const ChangeDetectionView: React.FC<ChangeDetectionViewProps> = ({
  mission,
  viewerMode,
  onViewerModeChange,
}) => {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [selectedUseCase, setSelectedUseCase] = useState<'All' | 'Disaster' | 'Construction' | 'Vegetation'>('All');
  const [splitSliderPos, setSplitSliderPos] = useState<number>(50);

  const statuses = ['ALL', 'NEW', 'MODIFIED', 'REMOVED', 'UNCHANGED', 'UNCERTAIN'];

  const filteredFeatures = CHANGE_DETECTION_DATA.features.filter((f) => {
    if (selectedStatusFilter !== 'ALL' && f.status !== selectedStatusFilter) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-warning">Bi-Temporal SfM Differencing</span>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#94A3B8' }}>
              M3C2 POINT CLOUD CHANGE ALIGNER
            </span>
          </div>
          <h1 style={{ fontSize: '24px', color: '#F1F5F9', marginTop: '4px', margin: 0 }}>
            Before / After Change Detection Analysis
          </h1>
          <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '2px' }}>
            Multi-epoch 3D alignment highlighting structural shifts, earthwork deltas, and uncertainty regions.
          </p>
        </div>

        {/* USE-CASE SELECTOR (Section 24) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '11px', color: '#64748B' }}>Domain Mode:</span>
          {(['All', 'Disaster', 'Construction', 'Vegetation'] as const).map((uc) => (
            <button
              key={uc}
              onClick={() => setSelectedUseCase(uc)}
              className="btn btn-sm"
              style={{
                backgroundColor: selectedUseCase === uc ? '#1C2733' : 'transparent',
                borderColor: selectedUseCase === uc ? '#FBBF24' : '#263442',
                color: selectedUseCase === uc ? '#FBBF24' : '#94A3B8',
              }}
            >
              {uc}
            </button>
          ))}
        </div>
      </div>

      {/* MISSION COMPARISON BAR */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 0.3fr 1fr',
        gap: '12px',
        alignItems: 'center',
        backgroundColor: '#111821',
        border: '1px solid #263442',
        borderRadius: '8px',
        padding: '14px 18px',
      }}>
        {/* Mission A (Before) */}
        <div>
          <div style={{ fontSize: '10px', color: '#64748B', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
            BASELINE EPOCH (MISSION A — BEFORE)
          </div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#F1F5F9', marginTop: '2px' }}>
            {CHANGE_DETECTION_DATA.baselineMission}
          </div>
          <div style={{ fontSize: '11px', color: '#94A3B8' }}>Date: {CHANGE_DETECTION_DATA.baselineDate}</div>
        </div>

        {/* Alignment Metrics Center */}
        <div style={{ textAlign: 'center', borderLeft: '1px solid #263442', borderRight: '1px solid #263442', padding: '0 12px' }}>
          <div style={{ fontSize: '10px', color: '#64748B', fontFamily: 'var(--font-mono)' }}>ICP RESIDUAL RMS</div>
          <div style={{ fontSize: '16px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#34D399' }}>
            ±{CHANGE_DETECTION_DATA.alignmentRmsResidualM} m
          </div>
          <div style={{ fontSize: '10px', color: '#5EEAD4' }}>
            {CHANGE_DETECTION_DATA.overallChangeConfidencePct}% Change Conf.
          </div>
        </div>

        {/* Mission B (After) */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '10px', color: '#64748B', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
            CURRENT EPOCH (MISSION B — AFTER)
          </div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#38BDF8', marginTop: '2px' }}>
            {CHANGE_DETECTION_DATA.currentMission}
          </div>
          <div style={{ fontSize: '11px', color: '#94A3B8' }}>Date: {CHANGE_DETECTION_DATA.currentDate}</div>
        </div>
      </div>

      {/* STATUS COUNT CARDS (Section 24: UNCHANGED, NEW, REMOVED, MODIFIED, UNCERTAIN) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
        <div
          onClick={() => setSelectedStatusFilter('NEW')}
          className="metric-card"
          style={{ cursor: 'pointer', borderColor: selectedStatusFilter === 'NEW' ? '#34D399' : '#263442' }}
        >
          <div style={{ fontSize: '10px', color: '#64748B', fontFamily: 'var(--font-mono)' }}>NEW STRUCTURES</div>
          <div style={{ fontSize: '24px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#34D399', marginTop: '2px' }}>
            02
          </div>
          <div style={{ fontSize: '10px', color: '#34D399' }}>+142 m² Added</div>
        </div>

        <div
          onClick={() => setSelectedStatusFilter('MODIFIED')}
          className="metric-card"
          style={{ cursor: 'pointer', borderColor: selectedStatusFilter === 'MODIFIED' ? '#FBBF24' : '#263442' }}
        >
          <div style={{ fontSize: '10px', color: '#64748B', fontFamily: 'var(--font-mono)' }}>MODIFIED</div>
          <div style={{ fontSize: '24px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#FBBF24', marginTop: '2px' }}>
            03
          </div>
          <div style={{ fontSize: '10px', color: '#FBBF24' }}>Structural Shifts</div>
        </div>

        <div
          onClick={() => setSelectedStatusFilter('REMOVED')}
          className="metric-card"
          style={{ cursor: 'pointer', borderColor: selectedStatusFilter === 'REMOVED' ? '#FB7185' : '#263442' }}
        >
          <div style={{ fontSize: '10px', color: '#64748B', fontFamily: 'var(--font-mono)' }}>REMOVED</div>
          <div style={{ fontSize: '24px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#FB7185', marginTop: '2px' }}>
            01
          </div>
          <div style={{ fontSize: '10px', color: '#FB7185' }}>-210 m² Excavated</div>
        </div>

        <div
          onClick={() => setSelectedStatusFilter('UNCHANGED')}
          className="metric-card"
          style={{ cursor: 'pointer', borderColor: selectedStatusFilter === 'UNCHANGED' ? '#94A3B8' : '#263442' }}
        >
          <div style={{ fontSize: '10px', color: '#64748B', fontFamily: 'var(--font-mono)' }}>UNCHANGED</div>
          <div style={{ fontSize: '24px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#94A3B8', marginTop: '2px' }}>
            14
          </div>
          <div style={{ fontSize: '10px', color: '#94A3B8' }}>Stable Geometries</div>
        </div>

        <div
          onClick={() => setSelectedStatusFilter('UNCERTAIN')}
          className="metric-card"
          style={{ cursor: 'pointer', borderColor: selectedStatusFilter === 'UNCERTAIN' ? '#818CF8' : '#263442' }}
        >
          <div style={{ fontSize: '10px', color: '#64748B', fontFamily: 'var(--font-mono)' }}>UNCERTAIN CHANGE</div>
          <div style={{ fontSize: '24px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#818CF8', marginTop: '2px' }}>
            02
          </div>
          <div style={{ fontSize: '10px', color: '#818CF8' }}>Shadow Occlusion</div>
        </div>
      </div>

      {/* CHANGE LOG & 3D DIFFERENCE VIEWER */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* DETECTED DELTAS LIST */}
        <div className="aero-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#64748B', fontFamily: 'var(--font-mono)' }}>CLASSIFIED DELTAS</div>
              <h3 style={{ fontSize: '15px', color: '#F1F5F9' }}>Detected Temporal Changes ({filteredFeatures.length})</h3>
            </div>

            <button
              onClick={() => setSelectedStatusFilter('ALL')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '11px' }}
            >
              Reset Filter
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '440px', overflowY: 'auto' }}>
            {filteredFeatures.map((feat) => {
              const statusColor =
                feat.status === 'NEW' ? '#34D399' :
                feat.status === 'MODIFIED' ? '#FBBF24' :
                feat.status === 'REMOVED' ? '#FB7185' :
                feat.status === 'UNCERTAIN' ? '#818CF8' : '#94A3B8';

              return (
                <div
                  key={feat.id}
                  style={{
                    backgroundColor: '#111821',
                    border: '1px solid #263442',
                    borderLeft: `4px solid ${statusColor}`,
                    borderRadius: '6px',
                    padding: '12px 14px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#F1F5F9' }}>
                      {feat.name}
                    </div>
                    <span
                      className="badge"
                      style={{
                        backgroundColor: `${statusColor}18`,
                        color: statusColor,
                        border: `1px solid ${statusColor}44`,
                        fontSize: '9px',
                      }}
                    >
                      {feat.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px', lineHeight: '1.4' }}>
                    {feat.description}
                  </div>

                  <div style={{
                    marginTop: '8px',
                    paddingTop: '6px',
                    borderTop: '1px solid #1C2733',
                    fontSize: '10px',
                    color: '#64748B',
                    fontFamily: 'var(--font-mono)',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}>
                    <span>Loc: {feat.location}</span>
                    <span style={{ color: '#5EEAD4' }}>Confidence: {feat.confidence}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3D VIEWER WITH DIFFERENCE HEATMAP */}
        <div className="aero-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#F1F5F9' }}>
              3D Difference Geometry & Alignment Overlay
            </span>
            <span className="badge badge-warning">Epoch Differencing</span>
          </div>

          <ThreeDCanvas
            mode="CONFIDENCE"
            onModeChange={() => {}}
            mission={mission}
            objects={mission.objects}
          />
        </div>
      </div>
    </div>
  );
};
