import React, { useState } from 'react';
import {
  FolderKanban,
  PlusCircle,
  Sparkles,
  GitMerge,
  Route,
  ArrowRight,
  CheckCircle2,
  Trash2,
  Download,
  AlertTriangle,
  Compass,
} from 'lucide-react';
import { MissionData, ActiveView } from '../types';
import { DEMO_MISSIONS } from '../data/missionData';

interface ProjectsViewProps {
  currentMission: MissionData;
  onNavigate: (view: ActiveView) => void;
  onSelectMission: (mission: MissionData) => void;
  onOpenExport: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  currentMission,
  onNavigate,
  onSelectMission,
  onOpenExport,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'merge' | 'optimizer'>('all');
  const [mergeStatus, setMergeStatus] = useState<'idle' | 'merging' | 'completed'>('idle');

  const otherMissions = DEMO_MISSIONS.filter((m) => m.id !== currentMission.id);

  // Simulated multi-drone merge action
  const handleTriggerMerge = () => {
    setMergeStatus('merging');
    setTimeout(() => {
      setMergeStatus('completed');
    }, 1800);
  };

  const getEmoji = (m: MissionData) => {
    const n = m.name.toLowerCase();
    if (n.includes('quarry')) return '⛏️';
    if (n.includes('urban') || n.includes('transit')) return '🏗️';
    if (n.includes('substation') || n.includes('power')) return '⚡';
    if (n.includes('agro') || n.includes('canopy')) return '🌾';
    if (n.includes('disaster') || n.includes('earthquake')) return '⚠️';
    return '🏔️';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-cyan">Mission Repository</span>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#94A3B8' }}>
              SPATIAL CAMPAIGN ARCHIVE • {DEMO_MISSIONS.length} FLIGHTS
            </span>
          </div>
          <h1 style={{ fontSize: '24px', color: '#F1F5F9', marginTop: '4px', margin: 0 }}>
            Projects, Mission Merge & Re-Flight Intelligence
          </h1>
          <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '2px' }}>
            Manage photogrammetric campaigns, switch between 3D digital twins, merge multi-drone sessions, and inspect auto-generated re-flight flight plans.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('all')}
            className="btn btn-sm"
            style={{
              backgroundColor: activeTab === 'all' ? '#1C2733' : 'transparent',
              borderColor: activeTab === 'all' ? '#38BDF8' : '#263442',
              color: activeTab === 'all' ? '#38BDF8' : '#94A3B8',
            }}
          >
            All Projects
          </button>
          <button
            onClick={() => setActiveTab('merge')}
            className="btn btn-sm"
            style={{
              backgroundColor: activeTab === 'merge' ? '#1C2733' : 'transparent',
              borderColor: activeTab === 'merge' ? '#5EEAD4' : '#263442',
              color: activeTab === 'merge' ? '#5EEAD4' : '#94A3B8',
            }}
          >
            Mission Merge (Multi-Drone)
          </button>
          <button
            onClick={() => setActiveTab('optimizer')}
            className="btn btn-sm"
            style={{
              backgroundColor: activeTab === 'optimizer' ? '#1C2733' : 'transparent',
              borderColor: activeTab === 'optimizer' ? '#FBBF24' : '#263442',
              color: activeTab === 'optimizer' ? '#FBBF24' : '#94A3B8',
            }}
          >
            Coverage Gap & Re-Flight
          </button>
        </div>
      </div>

      {/* COVERAGE GAP INTELLIGENCE & RE-FLIGHT PLANNER */}
      {activeTab === 'optimizer' && (
        <div className="aero-card" style={{ padding: '24px', borderLeft: '4px solid #FBBF24' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-warning">Coverage Gap Intelligence</span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#F1F5F9' }}>
                Automated Re-Flight Mission Planner
              </span>
            </div>
            <span className="badge badge-cyan">Waypoint Export Ready</span>
          </div>

          <div style={{
            backgroundColor: '#111821',
            border: '1px solid #263442',
            borderRadius: '6px',
            padding: '16px',
            marginBottom: '16px',
          }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#F1F5F9', marginBottom: '4px' }}>
              Target Region: North-East Corridor
            </div>
            <p style={{ fontSize: '12px', color: '#94A3B8', lineHeight: '1.5' }}>
              AeroVista detected that the <strong>North-East Corridor</strong> currently possesses only <strong>72% coverage</strong> due to steep oblique relief and solar occlusions. The system has automatically synthesized an optimal re-flight trajectory targeting missing geometries.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '12px',
              marginTop: '14px',
              paddingTop: '12px',
              borderTop: '1px solid #263442',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
            }}>
              <div>
                <span style={{ color: '#64748B' }}>Corridor Type:</span>
                <div style={{ color: '#F1F5F9', fontWeight: '600' }}>40 m corridor</div>
              </div>
              <div>
                <span style={{ color: '#64748B' }}>Suggested Altitude:</span>
                <div style={{ color: '#38BDF8', fontWeight: '600' }}>60 m AGL</div>
              </div>
              <div>
                <span style={{ color: '#64748B' }}>Recommended Heading:</span>
                <div style={{ color: '#5EEAD4', fontWeight: '600' }}>35° Azimuth</div>
              </div>
              <div>
                <span style={{ color: '#64748B' }}>Gimbal Pitch:</span>
                <div style={{ color: '#FBBF24', fontWeight: '600' }}>-45° Oblique</div>
              </div>
              <div>
                <span style={{ color: '#64748B' }}>Expected Coverage:</span>
                <div style={{ color: '#34D399', fontWeight: '600' }}>95% (+23%)</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              onClick={() => onNavigate('three-d-viewer')}
              className="btn btn-outline btn-sm"
            >
              <span>Inspect Gap in 3D</span>
            </button>
            <button
              onClick={() => alert('Waypoints successfully exported to DJI Pilot / MAVLink format')}
              className="btn btn-primary btn-sm"
            >
              <Download size={13} />
              <span>Export MAVLink / DJI Waypoints</span>
            </button>
          </div>
        </div>
      )}

      {/* MULTI-DRONE / MULTI-SESSION MERGE */}
      {activeTab === 'merge' && (
        <div className="aero-card" style={{ padding: '24px', borderLeft: '4px solid #5EEAD4' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-teal">Multi-Session Fusion</span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#F1F5F9' }}>
                Multi-Drone Co-Registration & Point Cloud Merge
              </span>
            </div>
          </div>

          <p style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '16px', lineHeight: '1.5' }}>
            Combine disparate drone flights, different sensors, or multi-day passes into one unified geospatial coordinate system via generalized Iterative Closest Point (G-ICP) alignment.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '20px' }}>
            <div style={{ backgroundColor: '#111821', border: '1px solid #263442', borderRadius: '6px', padding: '12px' }}>
              <div style={{ fontSize: '11px', color: '#38BDF8', fontWeight: '600' }}>Mission A • Drone Alpha</div>
              <div style={{ fontSize: '13px', color: '#F1F5F9', marginTop: '2px' }}>Mountain Survey 024 (Nadir Pass)</div>
              <div style={{ fontSize: '10px', color: '#64748B', marginTop: '4px' }}>1.84M points • Sony IMX586</div>
            </div>

            <div style={{ backgroundColor: '#111821', border: '1px solid #263442', borderRadius: '6px', padding: '12px' }}>
              <div style={{ fontSize: '11px', color: '#5EEAD4', fontWeight: '600' }}>Mission B • Drone Beta</div>
              <div style={{ fontSize: '13px', color: '#F1F5F9', marginTop: '2px' }}>East Ridge Oblique Pass</div>
              <div style={{ fontSize: '10px', color: '#64748B', marginTop: '4px' }}>1.58M points • Hasselblad L1D</div>
            </div>

            <div style={{ backgroundColor: '#111821', border: '1px solid #263442', borderRadius: '6px', padding: '12px' }}>
              <div style={{ fontSize: '11px', color: '#818CF8', fontWeight: '600' }}>Fused Result</div>
              <div style={{ fontSize: '13px', color: '#F1F5F9', marginTop: '2px' }}>Unified 3D Site Model</div>
              <div style={{ fontSize: '10px', color: '#34D399', marginTop: '4px' }}>3.42M combined points • 98.2% Cov</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontFamily: 'var(--font-mono)' }}>
              Co-registration residual: <strong style={{ color: '#34D399' }}>0.08 m</strong> • Overlap Volume: <strong style={{ color: '#5EEAD4' }}>68.4%</strong>
            </div>

            <button
              onClick={handleTriggerMerge}
              disabled={mergeStatus === 'merging'}
              className="btn btn-teal btn-sm"
            >
              <GitMerge size={14} />
              <span>{mergeStatus === 'merging' ? 'Running ICP Fusion...' : mergeStatus === 'completed' ? 'Merge Complete ✓' : 'Run Multi-Drone Fusion'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ALL PROJECTS REPOSITORY LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ fontSize: '12px', fontWeight: '600', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Active & Archived Recon Projects
        </div>

        {/* Current Active Mission Card */}
        <div className="aero-card" style={{ padding: '18px', borderColor: 'rgba(56, 189, 248, 0.5)', background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.04) 0%, rgba(17, 24, 33, 1) 100%)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-cyan">Active 3D Digital Twin</span>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#38BDF8' }}>
                  {currentMission.code}
                </span>
                <span style={{ fontSize: '16px' }}>{getEmoji(currentMission)}</span>
              </div>
              <h3 style={{ fontSize: '18px', color: '#F1F5F9', marginTop: '4px' }}>
                {currentMission.name}
              </h3>
              <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
                Location: {currentMission.location} • Profile: <strong style={{ color: '#5EEAD4' }}>{currentMission.profile}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => onNavigate('three-d-viewer')}
                className="btn btn-primary btn-sm"
              >
                <span>View in 3D</span>
                <ArrowRight size={13} />
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className="btn btn-secondary btn-sm"
              >
                Dashboard
              </button>
              <button
                onClick={onOpenExport}
                className="btn btn-outline btn-sm"
              >
                <Download size={13} />
                <span>Export</span>
              </button>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '12px',
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: '1px solid #263442',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
          }}>
            <div>
              <span style={{ color: '#64748B' }}>Duration:</span>
              <div style={{ color: '#F1F5F9' }}>{currentMission.video.duration}</div>
            </div>
            <div>
              <span style={{ color: '#64748B' }}>Keyframes:</span>
              <div style={{ color: '#5EEAD4' }}>{currentMission.video.keyframesCount} frames</div>
            </div>
            <div>
              <span style={{ color: '#64748B' }}>Points:</span>
              <div style={{ color: '#38BDF8' }}>{currentMission.pointsCount.toLocaleString()}</div>
            </div>
            <div>
              <span style={{ color: '#64748B' }}>Quality:</span>
              <div style={{ color: '#38BDF8' }}>{currentMission.quality.compositeScore}%</div>
            </div>
            <div>
              <span style={{ color: '#64748B' }}>3D Objects:</span>
              <div style={{ color: '#34D399' }}>{currentMission.objects.length} detected</div>
            </div>
          </div>
        </div>

        {/* Other Available Drone Flights */}
        {otherMissions.map((proj) => (
          <div key={proj.id} className="aero-card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px' }}>{getEmoji(proj)}</span>
                  <span className="badge badge-teal">{proj.profile}</span>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#94A3B8' }}>
                    {proj.code}
                  </span>
                </div>
                <h3 style={{ fontSize: '16px', color: '#F1F5F9', marginTop: '4px' }}>
                  {proj.name}
                </h3>
                <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
                  Location: {proj.location} • Video: {proj.video.filename}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => {
                    onSelectMission(proj);
                    onNavigate('three-d-viewer');
                  }}
                  className="btn btn-primary btn-sm"
                  style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' }}
                >
                  <span>Load & View 3D</span>
                  <ArrowRight size={13} />
                </button>
                <button
                  onClick={() => {
                    onSelectMission(proj);
                    onNavigate('video-analysis');
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  Analyze Video
                </button>
                <button
                  onClick={() => onNavigate('change-detection')}
                  className="btn btn-outline btn-sm"
                >
                  Compare
                </button>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '12px',
              marginTop: '14px',
              paddingTop: '10px',
              borderTop: '1px solid #1C2733',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
            }}>
              <div>
                <span style={{ color: '#64748B' }}>Duration:</span>
                <div style={{ color: '#F1F5F9' }}>{proj.flightDuration}</div>
              </div>
              <div>
                <span style={{ color: '#64748B' }}>Poses:</span>
                <div style={{ color: '#5EEAD4' }}>{proj.cameraPosesCount}</div>
              </div>
              <div>
                <span style={{ color: '#64748B' }}>Points:</span>
                <div style={{ color: '#38BDF8' }}>{proj.pointsCount?.toLocaleString()}</div>
              </div>
              <div>
                <span style={{ color: '#64748B' }}>Quality:</span>
                <div style={{ color: '#38BDF8' }}>{proj.quality?.compositeScore}%</div>
              </div>
              <div>
                <span style={{ color: '#64748B' }}>Coverage:</span>
                <div style={{ color: '#34D399' }}>{proj.coveragePct}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
