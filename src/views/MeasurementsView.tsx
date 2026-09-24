import React, { useState } from 'react';
import {
  Ruler,
  Scale,
  ShieldAlert,
  AlertTriangle,
  Sliders,
  CheckCircle2,
  RefreshCw,
  Info,
} from 'lucide-react';
import { MissionData, MeasurementRecord, ScaleReference, ViewerMode } from '../types';
import { ThreeDCanvas } from '../components/Viewers/ThreeDCanvas';

interface MeasurementsViewProps {
  mission: MissionData;
  viewerMode: ViewerMode;
  onViewerModeChange: (m: ViewerMode) => void;
}

export const MeasurementsView: React.FC<MeasurementsViewProps> = ({
  mission,
  viewerMode,
  onViewerModeChange,
}) => {
  const [scaleReferences, setScaleReferences] = useState<ScaleReference[]>(mission.scaleReferences);
  const [activeMeasurementId, setActiveMeasurementId] = useState<string>('m-height');
  const [scaleConfidence, setScaleConfidence] = useState(mission.scaleConfidencePct);

  // Allow user to manually edit reference dimensions (Section 18)
  const handleUpdatePrior = (id: string, newDim: number) => {
    setScaleReferences((prev) =>
      prev.map((ref) => (ref.id === id ? { ...ref, userDimensionMeters: newDim } : ref))
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-teal">Metrological Rigor</span>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#94A3B8' }}>
              CALIBRATED PHOTOGRAMMETRIC METROLOGY
            </span>
          </div>
          <h1 style={{ fontSize: '24px', color: '#F1F5F9', marginTop: '4px', margin: 0 }}>
            Uncertainty-Aware Measurements & GPS-Free Scale Recovery
          </h1>
          <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '2px' }}>
            Explicit interval covariance estimates ensuring zero false precision.
          </p>
        </div>
      </div>

      {/* SECTION 18: GPS-FREE SCALE RECOVERY AUDIT CARD */}
      <div className="aero-card" style={{ padding: '20px', borderLeft: '4px solid #5EEAD4' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-warning">GPS / EXIF Unavailable</span>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#F1F5F9' }}>
                Automated Visual Prior Scale Recovery Engaged
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>
              Scene scale was automatically estimated from recognized known geometric references in the video stream.
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10px', color: '#64748B', fontFamily: 'var(--font-mono)' }}>ESTIMATED SCALE CONFIDENCE</div>
            <div style={{ fontSize: '24px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#5EEAD4' }}>
              {scaleConfidence}%
            </div>
          </div>
        </div>

        {/* SCALE REFERENCE EDITORS (Section 18) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '14px' }}>
          {scaleReferences.map((ref) => (
            <div
              key={ref.id}
              style={{
                backgroundColor: '#111821',
                border: '1px solid #263442',
                borderRadius: '6px',
                padding: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#F1F5F9' }}>
                  {ref.name}
                </span>
                <span className="badge badge-cyan" style={{ fontSize: '9px' }}>
                  {ref.detectedCount} Detected
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                <span style={{ fontSize: '11px', color: '#94A3B8' }}>Length Prior:</span>
                <input
                  type="number"
                  step="0.1"
                  value={ref.userDimensionMeters}
                  onChange={(e) => handleUpdatePrior(ref.id, parseFloat(e.target.value) || 0)}
                  style={{
                    width: '70px',
                    height: '28px',
                    backgroundColor: '#141D27',
                    border: '1px solid #38BDF8',
                    borderRadius: '4px',
                    color: '#38BDF8',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    padding: '0 6px',
                    textAlign: 'center',
                  }}
                />
                <span style={{ fontSize: '11px', color: '#94A3B8' }}>meters</span>
              </div>

              <div style={{ fontSize: '10px', color: '#64748B', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
                Baseline Confidence: {ref.confidencePct}%
              </div>
            </div>
          ))}
        </div>

        {/* MANDATORY SCIENTIFIC RIGOR DISCLAIMER (Section 18 & 32) */}
        <div style={{
          backgroundColor: 'rgba(251, 191, 36, 0.08)',
          border: '1px solid rgba(251, 191, 36, 0.3)',
          borderRadius: '6px',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <AlertTriangle size={16} style={{ color: '#FBBF24', flexShrink: 0 }} />
          <div style={{ fontSize: '11px', color: '#FBBF24', lineHeight: '1.4' }}>
            <strong>Scientific Rigor Principle:</strong> Never claim survey-grade accuracy without calibrated ground control points (GCPs). Scale is estimated from visual references and may vary with object detection and scene geometry.
          </div>
        </div>
      </div>

      {/* SECTION 19: UNCERTAINTY-AWARE MEASUREMENTS LIST & 3D VIEWER */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* LEFT: MEASUREMENT CARDS (Section 19) */}
        <div className="aero-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#64748B', fontFamily: 'var(--font-mono)' }}>SPATIAL METROLOGY</div>
              <h3 style={{ fontSize: '15px', color: '#F1F5F9' }}>Calibrated Metric Intervals</h3>
            </div>
            <span className="badge badge-teal">Estimated ± Error</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {mission.measurements.map((m) => {
              const isSelected = activeMeasurementId === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setActiveMeasurementId(m.id)}
                  style={{
                    backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.08)' : '#111821',
                    border: `1px solid ${isSelected ? '#38BDF8' : '#263442'}`,
                    borderRadius: '6px',
                    padding: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#64748B', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                        Estimated {m.type}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#F1F5F9', marginTop: '2px' }}>
                        {m.label}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '18px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#38BDF8' }}>
                        {m.value} {m.unit} <span style={{ color: '#FB7185', fontSize: '13px' }}>± {m.uncertainty} {m.unit}</span>
                      </div>
                      <span className="badge badge-success" style={{ fontSize: '9px', marginTop: '2px' }}>
                        Conf: {m.confidence}%
                      </span>
                    </div>
                  </div>

                  <div style={{
                    marginTop: '8px',
                    paddingTop: '6px',
                    borderTop: '1px solid #1C2733',
                    fontSize: '10px',
                    color: '#94A3B8',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}>
                    <span>Data Source: {m.dataSource}</span>
                    <span style={{ color: '#5EEAD4' }}>{m.calibrationStatus}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: 3D VIEWPORT WITH MEASUREMENT LINES & PINS */}
        <div className="aero-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#F1F5F9' }}>
              3D Measurement Pins & Geodesic Spans
            </span>
            <span className="badge badge-cyan">Visual Geodesics</span>
          </div>

          <ThreeDCanvas
            mode={viewerMode}
            onModeChange={onViewerModeChange}
            mission={mission}
            objects={mission.objects}
            measurements={mission.measurements}
            activeMeasurementId={activeMeasurementId}
            onSelectMeasurement={setActiveMeasurementId}
          />
        </div>
      </div>
    </div>
  );
};
