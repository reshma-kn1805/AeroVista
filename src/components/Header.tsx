import React, { useState } from 'react';
import { Search, Bell, Shield, ChevronDown, Sparkles, CheckCircle2, AlertTriangle, Info, X, Video, Film } from 'lucide-react';
import { ActiveView, MissionData } from '../types';
import { DEMO_MISSIONS } from '../data/missionData';

interface HeaderProps {
  currentView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  onOpenExplainability: () => void;
  onOpenExport: () => void;
  onOpenDemo: () => void;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeMission?: MissionData;
  onSelectMission?: (m: MissionData) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigate,
  onOpenExplainability,
  onOpenExport,
  isDemoMode,
  onToggleDemoMode,
  searchQuery,
  onSearchChange,
  activeMission,
  onSelectMission,
}) => {
  const [showAlerts, setShowAlerts] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showFlightMenu, setShowFlightMenu] = useState(false);

  const getFlightEmoji = (m?: MissionData) => {
    if (!m) return '🏔️';
    const n = m.name.toLowerCase();
    if (n.includes('quarry')) return '⛏️';
    if (n.includes('urban') || n.includes('transit')) return '🏗️';
    if (n.includes('substation') || n.includes('power')) return '⚡';
    if (n.includes('agro') || n.includes('canopy')) return '🌾';
    if (n.includes('disaster') || n.includes('earthquake')) return '⚠️';
    return '🏔️';
  };

  return (
    <header className="app-header">
      {/* BRAND & LOGO */}
      <div 
        className="flex items-center gap-3 cursor-pointer select-none"
        onClick={() => onNavigate('dashboard')}
        style={{ display: 'flex', alignItems: 'center', gap: '14px' }}
      >
        {/* Custom Aerospace Geometric Logo */}
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #111821 0%, #141D27 100%)',
          border: '1px solid #38BDF8',
          boxShadow: '0 0 16px rgba(56, 189, 248, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}>
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
            <polygon points="16,3 29,26 3,26" fill="rgba(56, 189, 248, 0.08)" stroke="#38BDF8" strokeWidth="2" />
            <line x1="16" y1="3" x2="16" y2="17" stroke="#818CF8" strokeWidth="1.5" />
            <line x1="3" y1="26" x2="16" y2="17" stroke="#818CF8" strokeWidth="1.5" />
            <line x1="29" y1="26" x2="16" y2="17" stroke="#818CF8" strokeWidth="1.5" />
            <path d="M7 23 Q 16 18 25 23" stroke="#5EEAD4" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="16" cy="17" r="2.5" fill="#5EEAD4" />
          </svg>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '17px',
              fontWeight: '700',
              letterSpacing: '0.04em',
              color: '#F1F5F9',
              textTransform: 'uppercase',
            }}>
              AEROVISTA <span style={{ color: '#38BDF8' }}>3D</span>
            </span>
            <span className="badge badge-cyan" style={{ fontSize: '10px', padding: '1px 6px' }}>
              SIH26158
            </span>
          </div>
          <div style={{
            fontSize: '11px',
            color: '#94A3B8',
            letterSpacing: '0.02em',
            fontWeight: '400',
          }}>
            Single-Pass Drone Intelligence & 3D Reconstruction
          </div>
        </div>
      </div>

      {/* QUICK FLIGHT SELECTOR: Allows switching between demo videos/3D models instantly */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowFlightMenu(!showFlightMenu)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 12px',
            backgroundColor: '#111821',
            border: '1px solid #38BDF8',
            borderRadius: '6px',
            color: '#F1F5F9',
            fontSize: '12px',
            cursor: 'pointer',
            boxShadow: '0 0 10px rgba(56, 189, 248, 0.15)',
          }}
          title="Switch Active Video Flight & 3D Digital Twin"
        >
          <span>{getFlightEmoji(activeMission)}</span>
          <span style={{ fontWeight: '600', color: '#38BDF8' }}>Flight:</span>
          <span style={{ maxWidth: '170px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {activeMission?.name || 'Mountain Survey 024'}
          </span>
          <ChevronDown size={14} style={{ color: '#94A3B8' }} />
        </button>

        {showFlightMenu && (
          <div style={{
            position: 'absolute',
            top: '42px',
            left: 0,
            width: '320px',
            backgroundColor: '#141D27',
            border: '1px solid #38BDF8',
            borderRadius: '8px',
            padding: '8px',
            boxShadow: '0 12px 30px rgba(0,0,0,0.7)',
            zIndex: 70,
          }}>
            <div style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              color: '#94A3B8',
              padding: '4px 8px 8px',
              borderBottom: '1px solid #263442',
              display: 'flex',
              justifyContent: 'space-between',
            }}>
              <span>SELECT DEMO VIDEO FLIGHT</span>
              <span style={{ color: '#38BDF8' }}>6 TWINS READY</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
              {DEMO_MISSIONS.map((m) => {
                const isSelected = activeMission?.id === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => {
                      if (onSelectMission) onSelectMission(m);
                      setShowFlightMenu(false);
                    }}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '6px',
                      backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.14)' : 'transparent',
                      border: `1px solid ${isSelected ? '#38BDF8' : 'transparent'}`,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = '#1C2733';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>{getFlightEmoji(m)}</span>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: isSelected ? '600' : '500', color: isSelected ? '#38BDF8' : '#F1F5F9' }}>
                          {m.name}
                        </div>
                        <div style={{ fontSize: '10px', color: '#94A3B8' }}>
                          {m.profile} • {m.video.duration}
                        </div>
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 size={14} style={{ color: '#38BDF8' }} />}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* SEARCH BAR */}
      <div style={{
        position: 'relative',
        width: '260px',
        maxWidth: '28vw',
        display: 'flex',
        alignItems: 'center',
      }}>
        <Search size={15} style={{
          position: 'absolute',
          left: '12px',
          color: '#64748B',
          pointerEvents: 'none',
        }} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search mission, object..."
          style={{
            width: '100%',
            height: '34px',
            backgroundColor: '#111821',
            border: '1px solid #263442',
            borderRadius: '6px',
            paddingLeft: '34px',
            paddingRight: '12px',
            color: '#F1F5F9',
            fontSize: '12px',
            fontFamily: 'var(--font-sans)',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => e.target.style.borderColor = '#38BDF8'}
          onBlur={(e) => e.target.style.borderColor = '#263442'}
        />
        {searchQuery && (
          <X
            size={14}
            style={{ position: 'absolute', right: '10px', color: '#94A3B8', cursor: 'pointer' }}
            onClick={() => onSearchChange('')}
          />
        )}
      </div>

      {/* SYSTEM TELEMETRY & CONTROLS */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Demo Mode Pill */}
        <button
          onClick={onToggleDemoMode}
          className="btn btn-secondary btn-sm"
          style={{
            borderColor: isDemoMode ? '#818CF8' : '#263442',
            background: isDemoMode ? 'rgba(129, 140, 248, 0.12)' : 'transparent',
            color: isDemoMode ? '#818CF8' : '#94A3B8',
          }}
          title="Toggle Precomputed Demo Dataset / Live Mode"
        >
          <Sparkles size={13} style={{ color: isDemoMode ? '#818CF8' : '#94A3B8' }} />
          <span>{isDemoMode ? 'Demo Mode' : 'Live Pipeline'}</span>
        </button>

        {/* System Health Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '4px',
          background: 'rgba(52, 211, 153, 0.08)',
          border: '1px solid rgba(52, 211, 153, 0.25)',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: '#34D399',
        }}>
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: '#34D399',
            boxShadow: '0 0 8px #34D399',
            display: 'inline-block',
            animation: 'pulse 2s infinite',
          }} />
          <span>Nominal</span>
        </div>

        {/* Explainability Quick Trigger */}
        <button
          onClick={onOpenExplainability}
          className="btn btn-outline btn-sm font-mono"
          style={{ color: '#5EEAD4', borderColor: 'rgba(94, 234, 212, 0.3)' }}
          title="Explain Quality & Confidence Metrics"
        >
          <span>Q: {activeMission?.quality?.compositeScore || 88.4}%</span>
        </button>

        {/* Export Button */}
        <button
          onClick={onOpenExport}
          className="btn btn-teal btn-sm"
        >
          Export
        </button>

        {/* Alerts Icon Button */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowAlerts(!showAlerts)}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '6px',
              background: '#111821',
              border: '1px solid #263442',
              color: '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            <Bell size={16} />
            <span style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#38BDF8',
            }} />
          </button>

          {showAlerts && (
            <div style={{
              position: 'absolute',
              top: '42px',
              right: 0,
              width: '320px',
              backgroundColor: '#141D27',
              border: '1px solid #263442',
              borderRadius: '8px',
              padding: '14px',
              boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
              zIndex: 60,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#F1F5F9' }}>Mission Alerts</span>
                <span className="badge badge-cyan">3 New</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ padding: '8px', background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.3)', borderRadius: '6px', fontSize: '11px', color: '#FBBF24' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}>
                    <AlertTriangle size={13} /> Coverage Gap Identified
                  </div>
                  <div style={{ color: '#94A3B8', marginTop: '2px' }}>High oblique slope shadow detected. Re-flight suggested.</div>
                </div>
                <div style={{ padding: '8px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '6px', fontSize: '11px', color: '#38BDF8' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}>
                    <Info size={13} /> 3D Digital Twin Synchronized
                  </div>
                  <div style={{ color: '#94A3B8', marginTop: '2px' }}>Mesh vertices and textures mapped to active drone flight.</div>
                </div>
                <div style={{ padding: '8px', background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.3)', borderRadius: '6px', fontSize: '11px', color: '#34D399' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}>
                    <CheckCircle2 size={13} /> Scale Calibrated
                  </div>
                  <div style={{ color: '#94A3B8', marginTop: '2px' }}>Metric spatial scale verified through visual priors.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile / Operator Badge */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid #263442',
              background: '#111821',
            }}
          >
            <div style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0284c7 0%, #818CF8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: '700',
              color: '#FFFFFF',
            }}>
              AV
            </div>
            <div style={{ fontSize: '12px', fontWeight: '500', color: '#F1F5F9' }}>
              Cmdr. Reshm
            </div>
            <ChevronDown size={14} style={{ color: '#64748B' }} />
          </div>

          {showProfileMenu && (
            <div style={{
              position: 'absolute',
              top: '42px',
              right: 0,
              width: '200px',
              backgroundColor: '#141D27',
              border: '1px solid #263442',
              borderRadius: '8px',
              padding: '10px',
              boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
              zIndex: 60,
            }}>
              <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '8px', borderBottom: '1px solid #263442', paddingBottom: '6px' }}>
                <div>AeroVista Station Lead</div>
                <div style={{ color: '#38BDF8', fontFamily: 'var(--font-mono)' }}>SIH-TEAM-AERO26</div>
              </div>
              <button 
                onClick={() => { onNavigate('settings'); setShowProfileMenu(false); }}
                className="btn btn-outline btn-sm" 
                style={{ width: '100%', justifyContent: 'flex-start', marginBottom: '4px' }}
              >
                Engine Settings
              </button>
              <button 
                onClick={() => { onNavigate('reports'); setShowProfileMenu(false); }}
                className="btn btn-outline btn-sm" 
                style={{ width: '100%', justifyContent: 'flex-start' }}
              >
                Executive Reports
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
