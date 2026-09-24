import React, { useState } from 'react';
import { Sparkles, Info, X, Video, ChevronDown, CheckCircle2 } from 'lucide-react';
import { MissionData } from '../types';
import { DEMO_MISSIONS } from '../data/missionData';

interface DemoBannerProps {
  isDemoMode: boolean;
  onDismiss: () => void;
  onOpenExplainability: () => void;
  activeMission?: MissionData;
  onSelectMission?: (m: MissionData) => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({
  isDemoMode,
  onDismiss,
  onOpenExplainability,
  activeMission,
  onSelectMission,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  if (!isDemoMode) return null;

  const currentMission = activeMission || DEMO_MISSIONS[0];

  return (
    <div style={{
      backgroundColor: 'rgba(17, 24, 33, 0.95)',
      borderBottom: '1px solid #263442',
      borderLeft: '4px solid #818CF8',
      padding: '8px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: '12px',
      color: '#F1F5F9',
      position: 'relative',
      zIndex: 45,
      flexWrap: 'wrap',
      gap: '10px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '300px' }}>
        <Sparkles size={14} style={{ color: '#818CF8', flexShrink: 0 }} />
        <span>
          <strong style={{ color: '#818CF8' }}>ACTIVE DIGITAL TWIN:</strong>{' '}
          <span style={{ color: '#38BDF8', fontWeight: '600' }}>{currentMission.name}</span> ({currentMission.location}) •{' '}
          <span style={{ color: '#94A3B8' }}>
            {currentMission.video.keyframesCount} keyframes • {currentMission.pointsCount.toLocaleString()} points • 3D mesh adapted to {currentMission.profile}
          </span>
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Quick Switch Flight Button */}
        {onSelectMission && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="btn btn-secondary btn-sm"
              style={{
                fontSize: '11px',
                padding: '3px 8px',
                borderColor: '#38BDF8',
                color: '#38BDF8',
              }}
            >
              <Video size={12} />
              <span>Switch Demo Video</span>
              <ChevronDown size={12} />
            </button>

            {showDropdown && (
              <div style={{
                position: 'absolute',
                top: '32px',
                right: 0,
                width: '280px',
                backgroundColor: '#141D27',
                border: '1px solid #38BDF8',
                borderRadius: '6px',
                padding: '6px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.8)',
                zIndex: 60,
              }}>
                <div style={{ fontSize: '10px', color: '#94A3B8', padding: '4px 8px', fontFamily: 'var(--font-mono)' }}>
                  SELECT DEMO VIDEO & 3D MODEL
                </div>
                {DEMO_MISSIONS.map((m) => {
                  const isCur = m.id === currentMission.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => {
                        onSelectMission(m);
                        setShowDropdown(false);
                      }}
                      style={{
                        padding: '6px 8px',
                        borderRadius: '4px',
                        backgroundColor: isCur ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                        color: isCur ? '#38BDF8' : '#F1F5F9',
                        fontSize: '11px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                      onMouseEnter={(e) => {
                        if (!isCur) e.currentTarget.style.backgroundColor = '#1C2733';
                      }}
                      onMouseLeave={(e) => {
                        if (!isCur) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: isCur ? '600' : '400' }}>{m.name}</div>
                        <div style={{ fontSize: '10px', color: '#94A3B8' }}>{m.profile}</div>
                      </div>
                      {isCur && <CheckCircle2 size={13} style={{ color: '#38BDF8' }} />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <button
          onClick={onOpenExplainability}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#38BDF8',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          View Quality Audit ↗
        </button>

        <button
          onClick={onDismiss}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#64748B',
            cursor: 'pointer',
            padding: '2px',
          }}
          title="Dismiss Banner"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};
