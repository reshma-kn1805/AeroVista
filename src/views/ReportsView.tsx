import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Building,
  Ruler,
  Compass,
  Sparkles,
} from 'lucide-react';
import { MissionData, MissionProfile } from '../types';

interface ReportsViewProps {
  mission: MissionData;
  onOpenExport: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  mission,
  onOpenExport,
}) => {
  const [reportProfile, setReportProfile] = useState<MissionProfile>(mission.profile);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* HEADER & ACTIONS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-cyan">Executive SIH Deliverable</span>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#94A3B8' }}>
              SIH26158 SCIENTIFIC AUDIT REPORT
            </span>
          </div>
          <h1 style={{ fontSize: '24px', color: '#F1F5F9', marginTop: '4px', margin: 0 }}>
            Geospatial & 3D Intelligence Report
          </h1>
          <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '2px' }}>
            Formal 15-section photogrammetric evaluation prepared for defense and geospatial evaluators.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Domain Mode Switcher (Section 28) */}
          <select
            value={reportProfile}
            onChange={(e) => setReportProfile(e.target.value as MissionProfile)}
            style={{
              backgroundColor: '#111821',
              border: '1px solid #263442',
              color: '#F1F5F9',
              fontSize: '12px',
              fontFamily: 'var(--font-sans)',
              padding: '6px 10px',
              borderRadius: '6px',
              outline: 'none',
            }}
          >
            <option value="Terrain Survey">Focus: Terrain Survey</option>
            <option value="Disaster Assessment">Focus: Disaster Assessment</option>
            <option value="Infrastructure Inspection">Focus: Infrastructure Inspection</option>
            <option value="Construction Monitoring">Focus: Construction Monitoring</option>
            <option value="Agriculture/Land Analysis">Focus: Agriculture/Land Analysis</option>
          </select>

          <button onClick={handlePrint} className="btn btn-secondary btn-sm">
            <Printer size={14} />
            <span>Print Report</span>
          </button>

          <button onClick={onOpenExport} className="btn btn-teal btn-sm">
            <Download size={14} />
            <span>Export GIS / DEM</span>
          </button>
        </div>
      </div>

      {/* FORMAL 15-SECTION REPORT DOCUMENT (Section 31) */}
      <div
        className="aero-card"
        style={{
          padding: '40px',
          backgroundColor: '#0D1118',
          border: '1px solid #263442',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
        }}
      >
        {/* REPORT HEADER BLOCK */}
        <div style={{ borderBottom: '2px solid #263442', paddingBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#38BDF8', letterSpacing: '0.1em' }}>
                DEFENSE & GEOSPATIAL INTELLIGENCE DOSSIER
              </div>
              <h2 style={{ fontSize: '26px', color: '#F1F5F9', marginTop: '6px' }}>
                AEROVISTA 3D RECONSTRUCTION AUDIT
              </h2>
              <div style={{ fontSize: '14px', color: '#94A3B8', marginTop: '2px' }}>
                Mission: <strong style={{ color: '#F1F5F9' }}>{mission.name}</strong> • Code: <strong style={{ color: '#38BDF8', fontFamily: 'var(--font-mono)' }}>{mission.code}</strong>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div className="badge badge-cyan" style={{ fontSize: '11px', padding: '4px 8px' }}>
                AUDIT RATING: {mission.quality.compositeScore}%
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
                DATE: {mission.date}
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', fontFamily: 'var(--font-mono)' }}>
                PROFILE: {reportProfile}
              </div>
            </div>
          </div>
        </div>

        {/* 1. MISSION OVERVIEW */}
        <div>
          <h3 style={{ fontSize: '15px', color: '#38BDF8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            01. Mission Overview
          </h3>
          <p style={{ fontSize: '13px', color: '#F1F5F9', lineHeight: '1.6' }}>
            Single-pass aerial reconnaissance campaign executed over {mission.location}. Primary analytical purpose: <strong>{reportProfile}</strong>. The flight achieved 91.7% visual scene coverage across a 2.84 km trajectory without deploying physical ground control points (GCPs), leveraging automated visual priors for metric scale recovery.
          </p>
        </div>

        {/* 2. DRONE VIDEO METADATA */}
        <div>
          <h3 style={{ fontSize: '15px', color: '#38BDF8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            02. Drone Video Metadata & Sensor Telemetry
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
            backgroundColor: '#111821',
            border: '1px solid #263442',
            borderRadius: '6px',
            padding: '12px',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
          }}>
            <div>
              <span style={{ color: '#64748B' }}>Source Container:</span>
              <div style={{ color: '#F1F5F9' }}>{mission.video.filename}</div>
            </div>
            <div>
              <span style={{ color: '#64748B' }}>Codec / Format:</span>
              <div style={{ color: '#F1F5F9' }}>{mission.video.codec}</div>
            </div>
            <div>
              <span style={{ color: '#64748B' }}>Sensor Hardware:</span>
              <div style={{ color: '#5EEAD4' }}>{mission.video.sensor}</div>
            </div>
            <div>
              <span style={{ color: '#64748B' }}>Optics / FOV:</span>
              <div style={{ color: '#F1F5F9' }}>{mission.video.focalLength} • {mission.video.fov}</div>
            </div>
          </div>
        </div>

        {/* 3 & 4. FRAME & KEYFRAME PROCESSING */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '14px', color: '#38BDF8', marginBottom: '8px', textTransform: 'uppercase' }}>
              03. Frame Processing
            </h3>
            <p style={{ fontSize: '12px', color: '#94A3B8', lineHeight: '1.5' }}>
              Extracted <strong>5,040 full-resolution 4K frames</strong> at 30 fps without frame drop or spatial shear. Video integrity index: 100% nominal.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '14px', color: '#38BDF8', marginBottom: '8px', textTransform: 'uppercase' }}>
              04. Keyframe Selection
            </h3>
            <p style={{ fontSize: '12px', color: '#94A3B8', lineHeight: '1.5' }}>
              Culled <strong>4,856 redundant frames (96.3%)</strong> via semantic entropy clustering. 184 keyframes preserved full multi-angle parallax coverage (93.4%).
            </p>
          </div>
        </div>

        {/* 5 & 6. FEATURE MATCHING & CAMERA POSE */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '14px', color: '#38BDF8', marginBottom: '8px', textTransform: 'uppercase' }}>
              05. Feature Matching
            </h3>
            <p style={{ fontSize: '12px', color: '#94A3B8', lineHeight: '1.5' }}>
              Identified <strong>3,214 descriptors</strong> per frame. LightGlue transformer pairing yielded <strong>1,214 reliable RANSAC inliers</strong> (91.3% match confidence).
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '14px', color: '#38BDF8', marginBottom: '8px', textTransform: 'uppercase' }}>
              06. Camera Trajectory
            </h3>
            <p style={{ fontSize: '12px', color: '#94A3B8', lineHeight: '1.5' }}>
              Estimated 184 extrinsic poses over 2.84 km. Bundle adjustment converged with a mean sub-pixel reprojection error of <strong>0.62 pixels</strong>.
            </p>
          </div>
        </div>

        {/* 7 & 8. 3D RECONSTRUCTION & CONFIDENCE ANALYSIS */}
        <div>
          <h3 style={{ fontSize: '15px', color: '#38BDF8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            07. 3D Reconstruction & 08. Confidence Analysis
          </h3>
          <p style={{ fontSize: '13px', color: '#F1F5F9', lineHeight: '1.6', marginBottom: '10px' }}>
            Multi-view stereo resolved <strong>1,842,632 dense 3D points</strong> and <strong>842,190 mesh faces</strong> textured with a 4K orthophoto atlas. Per-vertex covariance ray mapping establishes:
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px',
            backgroundColor: '#111821',
            border: '1px solid #263442',
            borderRadius: '6px',
            padding: '12px',
          }}>
            {mission.regions.map((r) => (
              <div key={r.id}>
                <div style={{ fontSize: '11px', color: '#94A3B8' }}>{r.name}</div>
                <div style={{
                  fontSize: '16px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: '700',
                  color: r.status === 'High' ? '#34D399' : '#FB7185',
                  marginTop: '2px',
                }}>
                  {r.confidencePct}% ({r.status})
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 9 & 10. SCALE RECOVERY & UNCERTAINTY MEASUREMENTS */}
        <div>
          <h3 style={{ fontSize: '15px', color: '#38BDF8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            09. GPS-Free Scale Recovery & 10. Measurements (± Uncertainty)
          </h3>
          <p style={{ fontSize: '13px', color: '#F1F5F9', lineHeight: '1.6', marginBottom: '10px' }}>
            Because satellite ephemeris was unavailable, metric scale was locked using 3 recognized vehicle and road priors (Confidence: 78%). All spatial measurements are explicitly bounded:
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px',
            backgroundColor: '#111821',
            border: '1px solid #263442',
            borderRadius: '6px',
            padding: '12px',
          }}>
            {mission.measurements.map((m) => (
              <div key={m.id}>
                <div style={{ fontSize: '10px', color: '#64748B', textTransform: 'uppercase' }}>{m.label}</div>
                <div style={{ fontSize: '15px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#38BDF8', marginTop: '2px' }}>
                  {m.value} {m.unit} <span style={{ color: '#FB7185', fontSize: '12px' }}>± {m.uncertainty} {m.unit}</span>
                </div>
                <div style={{ fontSize: '10px', color: '#34D399' }}>Conf: {m.confidence}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* 11 & 12. OBJECT INTELLIGENCE & CHANGE DETECTION */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '14px', color: '#38BDF8', marginBottom: '8px', textTransform: 'uppercase' }}>
              11. Object Intelligence
            </h3>
            <p style={{ fontSize: '12px', color: '#94A3B8', lineHeight: '1.5' }}>
              Classified 8 primary scene assets including Main Operations Facility (98.4% conf), Equipment Depot (96.1% conf), and Lattice Mast (94.7% conf).
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '14px', color: '#38BDF8', marginBottom: '8px', textTransform: 'uppercase' }}>
              12. Change Detection
            </h3>
            <p style={{ fontSize: '12px', color: '#94A3B8', lineHeight: '1.5' }}>
              Compared against the 30-day baseline. Identified 2 NEW modular structures, 1 REMOVED berm, and flagged South face as UNCERTAIN change.
            </p>
          </div>
        </div>

        {/* 13 & 14. COVERAGE GAPS & RECOMMENDED RE-FLIGHT */}
        <div>
          <h3 style={{ fontSize: '15px', color: '#38BDF8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            13. Coverage Gaps & 14. Recommended Re-Flight
          </h3>
          <div style={{
            backgroundColor: '#111821',
            border: '1px solid #263442',
            borderLeft: '4px solid #FBBF24',
            borderRadius: '6px',
            padding: '12px 16px',
          }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#FBBF24', marginBottom: '2px' }}>
              Synthesized Flight Plan: North-East Corridor Offset
            </div>
            <p style={{ fontSize: '12px', color: '#F1F5F9', lineHeight: '1.5' }}>
              Identified 72% coverage deficiency in North-East quadrant. Prescribed re-flight corridor: 40 m lateral offset, altitude 60 m AGL, heading 35°, camera pitch -45°. Target expected coverage: 95%.
            </p>
          </div>
        </div>

        {/* 15. FINAL QUALITY ASSESSMENT & EXPORT INFO */}
        <div style={{ borderTop: '2px solid #263442', paddingTop: '20px' }}>
          <h3 style={{ fontSize: '15px', color: '#5EEAD4', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            15. Final Quality Assessment & Export Interoperability
          </h3>
          <p style={{ fontSize: '13px', color: '#F1F5F9', lineHeight: '1.6' }}>
            Composite Scene Rating: <strong style={{ color: '#38BDF8' }}>88.4% (SIH High-Grade Reconstruction)</strong>. Datasets are prepared for open GIS exchange in OBJ, PLY, LAS 1.4, GeoTIFF DEM, and GeoJSON formats under standard EPSG:32643 (UTM Zone 43N).
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', fontSize: '11px', color: '#64748B' }}>
            <span>Verified by: AeroVista Autonomous Engine v2.4.1</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>HASH: 0x9f4a82b01c...</span>
          </div>
        </div>
      </div>
    </div>
  );
};
