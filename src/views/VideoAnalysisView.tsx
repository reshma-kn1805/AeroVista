import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, Shield, Eye, Activity, Gauge, Compass } from 'lucide-react';
import { DroneVideoMetadata, MissionData } from '../types';
import { getEnvironmentArchetype } from '../components/Viewers/ThreeDCanvas';

interface VideoAnalysisViewProps {
  metadata: DroneVideoMetadata;
  mission?: MissionData;
}

export const VideoAnalysisView: React.FC<VideoAnalysisViewProps> = ({ metadata, mission }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(metadata.videoUrl ? 0 : 1420);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [showOpticalFlow, setShowOpticalFlow] = useState(true);
  const [showSharpnessHeatmap, setShowSharpnessHeatmap] = useState(false);
  const realVideoRef = React.useRef<HTMLVideoElement>(null);

  const archetype = getEnvironmentArchetype(mission);

  useEffect(() => {
    if (metadata.videoUrl && realVideoRef.current) {
      if (isPlaying) {
        realVideoRef.current.playbackRate = playbackSpeed;
        realVideoRef.current.play().catch(() => {});
      } else {
        realVideoRef.current.pause();
      }
      return;
    }

    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentFrame((prev) => {
          if (prev >= metadata.totalFrames) {
            setIsPlaying(false);
            return 0;
          }
          return prev + Math.round(1 * playbackSpeed);
        });
      }, 33 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, metadata.totalFrames, metadata.videoUrl]);

  const handleSeek = (newFrame: number) => {
    setCurrentFrame(newFrame);
    if (metadata.videoUrl && realVideoRef.current) {
      realVideoRef.current.currentTime = newFrame / (metadata.fps || 30);
    }
  };

  const currentSeconds = (currentFrame / (metadata.fps || 30));
  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  // Telemetry derived from current frame
  const yawRate = (Math.sin(currentFrame * 0.05) * 1.8).toFixed(1);
  const pitchRate = (Math.cos(currentFrame * 0.03) * 0.9).toFixed(1);
  const rollRate = (Math.sin(currentFrame * 0.02) * 0.3).toFixed(1);
  const laplacianBlur = Math.round(168 + Math.cos(currentFrame * 0.08) * 24);
  const opticalFlowMagnitude = (3.4 + Math.sin(currentFrame * 0.04) * 1.1).toFixed(2);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-cyan">Single-Pass Telemetry</span>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#94A3B8' }}>
              4K VIDEO ANALYSIS ENGINE • {metadata.filename}
            </span>
          </div>
          <h1 style={{ fontSize: '24px', color: '#F1F5F9', marginTop: '4px', margin: 0 }}>
            Raw Video Stream & Sensor Diagnostics
          </h1>
          <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '2px' }}>
            {mission ? `${mission.name} (${mission.location})` : 'Active Aerial Sensor Feed'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setShowOpticalFlow(!showOpticalFlow)}
            className="btn btn-outline btn-sm"
            style={{ color: showOpticalFlow ? '#38BDF8' : '#64748B', borderColor: showOpticalFlow ? '#38BDF8' : '#263442' }}
          >
            Optical Flow Vectors
          </button>
          <button
            onClick={() => setShowSharpnessHeatmap(!showSharpnessHeatmap)}
            className="btn btn-outline btn-sm"
            style={{ color: showSharpnessHeatmap ? '#5EEAD4' : '#64748B', borderColor: showSharpnessHeatmap ? '#5EEAD4' : '#263442' }}
          >
            Sharpness Heatmap
          </button>
        </div>
      </div>

      {/* MAIN TWO-COLUMN DISPLAY */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: '20px' }}>
        {/* LEFT: VIDEO PLAYER SIMULATOR OR REAL UPLOADED VIDEO */}
        <div className="aero-card" style={{ display: 'flex', flexDirection: 'column', padding: '16px' }}>
          {/* 4K Video Viewport Canvas */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '420px',
            backgroundColor: '#05070A',
            borderRadius: '6px',
            overflow: 'hidden',
            border: '1px solid #263442',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {metadata.videoUrl ? (
              <video
                ref={realVideoRef}
                src={metadata.videoUrl}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                playsInline
                muted
                onEnded={() => setIsPlaying(false)}
                onTimeUpdate={() => {
                  if (realVideoRef.current && isPlaying) {
                    setCurrentFrame(Math.round(realVideoRef.current.currentTime * (metadata.fps || 30)));
                  }
                }}
              />
            ) : (
              <>
                {/* DYNAMIC SCENARIO-SPECIFIC AERIAL SIMULATION VIEWPORT */}
                {archetype === 'URBAN_CONSTRUCTION' ? (
                  // Urban Transit & High-Rise Construction Scene
                  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: '#0D1117' }}>
                    {/* City street blocks */}
                    <rect x="0" y="40" width="800" height="90" fill="#141820" />
                    <rect x="0" y="320" width="800" height="90" fill="#141820" />
                    {/* Street yellow lane stripes */}
                    <line x1="0" y1="85" x2="800" y2="85" stroke="#FBBF24" strokeWidth="2" strokeDasharray="16,12" />
                    <line x1="0" y1="365" x2="800" y2="365" stroke="#FBBF24" strokeWidth="2" strokeDasharray="16,12" />
                    {/* Foundation excavation pit */}
                    <rect x="180" y="145" width="440" height="160" fill="#1a2332" stroke="#FBBF24" strokeWidth="2" />
                    {/* Steel rebar grid inside pit */}
                    {Array.from({ length: 9 }).map((_, i) => (
                      <line key={`g-${i}`} x1={220 + i * 45} y1="150" x2={220 + i * 45} y2="300" stroke="#334155" strokeWidth="1" />
                    ))}
                    {/* Structural concrete core building */}
                    <rect x="360" y="160" width="160" height="120" fill="#243042" stroke="#818CF8" strokeWidth="2" />
                    {/* Tower Crane boom rotating */}
                    <circle cx="280" cy="220" r="8" fill="#FBBF24" />
                    <line
                      x1="280"
                      y1="220"
                      x2={280 + Math.cos(currentFrame * 0.02) * 160}
                      y2={220 + Math.sin(currentFrame * 0.02) * 160}
                      stroke="#FBBF24"
                      strokeWidth="3"
                    />
                    {/* Hook cable */}
                    <circle
                      cx={280 + Math.cos(currentFrame * 0.02) * 120}
                      cy={220 + Math.sin(currentFrame * 0.02) * 120}
                      r="4"
                      fill="#38BDF8"
                    />
                    {/* Transit Mixer Vehicle */}
                    <rect x="110" y="170" width="45" height="22" rx="4" fill="#38BDF8" />
                  </svg>
                ) : archetype === 'QUARRY' ? (
                  // Open-Pit Terraced Quarry & Ocean Coast
                  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: '#1c1712' }}>
                    {/* Ocean water on right */}
                    <rect x="580" y="0" width="220" height="420" fill="#0c4a6e" />
                    <path
                      d="M580,0 Q600,100 580,200 T580,420 L800,420 L800,0 Z"
                      fill="#0284c7"
                      opacity="0.8"
                    />
                    {/* Concentric quarry pit terraces */}
                    <ellipse cx="320" cy="210" rx="240" ry="160" fill="#292017" stroke="#4a3b2b" strokeWidth="3" />
                    <ellipse cx="320" cy="210" rx="180" ry="120" fill="#362b1e" stroke="#5a4835" strokeWidth="3" />
                    <ellipse cx="320" cy="210" rx="120" ry="80" fill="#423525" stroke="#6e5740" strokeWidth="3" />
                    <ellipse cx="320" cy="210" rx="60" ry="40" fill="#1f1811" stroke="#38bdf8" strokeWidth="1.5" />
                    {/* Heavy Excavator */}
                    <rect x="240" y="180" width="35" height="20" rx="3" fill="#EAB308" stroke="#CA8A04" strokeWidth="1.5" />
                    <line x1="260" y1="190" x2="290" y2="175" stroke="#EAB308" strokeWidth="3" />
                    {/* Haul truck */}
                    <rect x="360" y="240" width="40" height="22" rx="3" fill="#F97316" />
                  </svg>
                ) : archetype === 'SUBSTATION' ? (
                  // High-Voltage Electrical Substation Yard
                  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: '#131922' }}>
                    {/* Gravel yard */}
                    <rect x="80" y="60" width="640" height="300" fill="#1b2330" stroke="#334155" strokeWidth="1" />
                    {/* Concrete transformer pads */}
                    <rect x="180" y="140" width="110" height="130" fill="#2d3748" stroke="#818CF8" strokeWidth="1.5" />
                    <rect x="350" y="140" width="110" height="130" fill="#2d3748" stroke="#818CF8" strokeWidth="1.5" />
                    {/* Radiator fins */}
                    {Array.from({ length: 6 }).map((_, i) => (
                      <line key={`f1-${i}`} x1="185" y1={155 + i * 16} x2="285" y2={155 + i * 16} stroke="#64748B" strokeWidth="2" />
                    ))}
                    {Array.from({ length: 6 }).map((_, i) => (
                      <line key={`f2-${i}`} x1="355" y1={155 + i * 16} x2="455" y2={155 + i * 16} stroke="#64748B" strokeWidth="2" />
                    ))}
                    {/* Overhead Transmission lines */}
                    <line x1="0" y1="110" x2="800" y2="110" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="6,4" />
                    <line x1="0" y1="290" x2="800" y2="290" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="6,4" />
                    {/* Gantry tower pylon */}
                    <polygon points="540,110 560,290 520,290" fill="none" stroke="#FBBF24" strokeWidth="2" />
                  </svg>
                ) : archetype === 'AGRICULTURE' ? (
                  // Agriculture Crop Furrows & Silos
                  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: '#0f291e' }}>
                    {/* Parallel crop furrow lines */}
                    {Array.from({ length: 16 }).map((_, i) => (
                      <line key={`crop-${i}`} x1="0" y1={25 * i} x2="800" y2={25 * i} stroke="#14532d" strokeWidth="8" />
                    ))}
                    {/* Central irrigation canal */}
                    <rect x="380" y="0" width="40" height="420" fill="#0284c7" />
                    {/* Grain Silos */}
                    <circle cx="160" cy="140" r="32" fill="#94A3B8" stroke="#CBD5E1" strokeWidth="2" />
                    <circle cx="235" cy="140" r="32" fill="#94A3B8" stroke="#CBD5E1" strokeWidth="2" />
                    {/* Barn */}
                    <rect x="130" y="240" width="120" height="70" fill="#7f1d1d" stroke="#b91c1c" strokeWidth="2" />
                    {/* Harvester Tractor */}
                    <rect x="520" y="180" width="48" height="26" rx="4" fill="#16a34a" />
                  </svg>
                ) : archetype === 'DISASTER' ? (
                  // Earthquake Fault Fissure & Collapsed Bridge
                  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: '#1c1917' }}>
                    {/* Fissure ravine */}
                    <path
                      d="M0,230 Q220,180 400,260 T800,210 L800,290 Q580,340 400,280 T0,260 Z"
                      fill="#0c0a09"
                    />
                    {/* Collapsed highway bridge span */}
                    <rect x="220" y="190" width="160" height="32" fill="#475569" stroke="#ef4444" strokeWidth="2" />
                    {/* Broken fractured segment tilted */}
                    <polygon points="380,190 490,270 470,290 380,222" fill="#334155" stroke="#f87171" strokeWidth="1.5" />
                    {/* Emergency flashing lights */}
                    <circle cx="180" cy="180" r="6" fill="#ef4444" opacity={Math.sin(currentFrame * 0.1) > 0 ? 1 : 0.2} />
                    <circle cx="580" cy="220" r="6" fill="#38bdf8" opacity={Math.cos(currentFrame * 0.1) > 0 ? 1 : 0.2} />
                  </svg>
                ) : (
                  // Mountain flight default
                  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: '#0a1017' }}>
                    <path
                      d="M0,280 Q200,180 400,240 T800,210 L800,420 L0,420 Z"
                      fill="#111821"
                      stroke="#263442"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M120,320 L280,420"
                      stroke="#38BDF8"
                      strokeWidth="4"
                      strokeDasharray="8,6"
                    />
                    <rect x="340" y="240" width="70" height="42" fill="#1A2532" stroke="#818CF8" strokeWidth="1.5" />
                    <rect x="430" y="250" width="45" height="30" fill="#1A2532" stroke="#5EEAD4" strokeWidth="1.5" />
                    <line x1="310" y1="280" x2="310" y2="160" stroke="#FBBF24" strokeWidth="2" />
                    <circle cx="310" cy="160" r="3" fill="#FB7185" />
                  </svg>
                )}
              </>
            )}

            {/* Optical Flow Vectors Overlay */}
            {showOpticalFlow && (
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                {Array.from({ length: 24 }).map((_, i) => {
                  const gx = 80 + (i % 6) * 110;
                  const gy = 80 + Math.floor(i / 6) * 90;
                  const angle = (currentFrame * 0.02) + (i * 0.4);
                  const vx = Math.cos(angle) * 16;
                  const vy = Math.sin(angle) * 16;
                  return (
                    <g key={i}>
                      <line x1={gx} y1={gy} x2={gx + vx} y2={gy + vy} stroke="#38BDF8" strokeWidth="1.2" opacity="0.75" />
                      <circle cx={gx + vx} cy={gy + vy} r="1.5" fill="#5EEAD4" />
                    </g>
                  );
                })}
              </svg>
            )}

            {/* Sharpness Heatmap Overlay */}
            {showSharpnessHeatmap && (
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at 45% 55%, rgba(52, 211, 153, 0.25) 0%, rgba(251, 191, 36, 0.15) 50%, rgba(251, 113, 133, 0.25) 100%)',
                mixBlendMode: 'screen',
                pointerEvents: 'none',
              }} />
            )}

            {/* Flight HUD Overlay */}
            <div style={{
              position: 'absolute',
              top: '12px',
              left: '14px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: '#38BDF8',
              backgroundColor: 'rgba(8, 11, 16, 0.75)',
              padding: '4px 8px',
              borderRadius: '4px',
              border: '1px solid rgba(56, 189, 248, 0.3)',
            }}>
              {metadata.resolution} • {metadata.fps} FPS • {metadata.codec.split(' ')[0]}
            </div>

            <div style={{
              position: 'absolute',
              top: '12px',
              right: '14px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: '#34D399',
              backgroundColor: 'rgba(8, 11, 16, 0.75)',
              padding: '4px 8px',
              borderRadius: '4px',
              border: '1px solid rgba(52, 211, 153, 0.3)',
            }}>
              FRAME: {currentFrame} / {metadata.totalFrames}
            </div>

            {/* Crosshair Center Reticle */}
            <div style={{ position: 'absolute', width: '30px', height: '30px', pointerEvents: 'none' }}>
              <div style={{ position: 'absolute', top: '15px', left: 0, width: '30px', height: '1px', background: 'rgba(255,255,255,0.4)' }} />
              <div style={{ position: 'absolute', top: 0, left: '15px', width: '1px', height: '30px', background: 'rgba(255,255,255,0.4)' }} />
            </div>
          </div>

          {/* TIMELINE SCRUBBER */}
          <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input
              type="range"
              min="0"
              max={metadata.totalFrames}
              value={currentFrame}
              onChange={(e) => handleSeek(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#38BDF8' }}
            />

            {/* PLAYBACK CONTROLS */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="btn btn-primary btn-sm"
                  style={{ width: '34px', height: '32px', padding: 0 }}
                >
                  {isPlaying ? <Pause size={15} /> : <Play size={15} />}
                </button>
                <button
                  onClick={() => setCurrentFrame(0)}
                  className="btn btn-outline btn-sm"
                  style={{ width: '34px', height: '32px', padding: 0 }}
                  title="Rewind to Start"
                >
                  <RotateCcw size={14} />
                </button>

                <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: '#F1F5F9', marginLeft: '6px' }}>
                  {formatTime(currentSeconds)} <span style={{ color: '#64748B' }}>/ {metadata.duration}</span>
                </div>
              </div>

              {/* Speed Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {[0.5, 1, 2].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setPlaybackSpeed(spd)}
                    style={{
                      padding: '3px 8px',
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: 'pointer',
                      color: playbackSpeed === spd ? '#38BDF8' : '#94A3B8',
                      background: playbackSpeed === spd ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                    }}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: INTELLIGENCE PANEL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* CAMERA SENSOR SPECIFICATIONS */}
          <div className="aero-card" style={{ padding: '16px' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '8px' }}>
              Sensor Specifications
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Sensor:</span>
                <span style={{ color: '#F1F5F9', fontWeight: '500' }}>{metadata.sensor}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Focal Length:</span>
                <span style={{ color: '#38BDF8', fontFamily: 'var(--font-mono)' }}>{metadata.focalLength}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Field of View:</span>
                <span style={{ color: '#F1F5F9', fontFamily: 'var(--font-mono)' }}>{metadata.fov}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>GPS State:</span>
                <span style={{ color: metadata.gpsAvailable ? '#34D399' : '#FB7185', fontWeight: '600' }}>
                  {metadata.gpsAvailable ? 'RTK High-Precision' : 'Scale Recovery Active'}
                </span>
              </div>
            </div>
          </div>

          {/* COMPUTER VISION TELEMETRY */}
          <div className="aero-card" style={{ padding: '16px' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '10px' }}>
              Computer Vision Telemetry
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Blur Detection */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                  <span style={{ color: '#94A3B8' }}>Laplacian Blur Index:</span>
                  <span style={{ color: '#34D399', fontFamily: 'var(--font-mono)', fontWeight: '600' }}>
                    {laplacianBlur} (Sharp)
                  </span>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill" style={{ width: `${Math.min(100, (laplacianBlur / 200) * 100)}%`, background: '#34D399' }} />
                </div>
              </div>

              {/* Optical Flow Vector Magnitude */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                  <span style={{ color: '#94A3B8' }}>Mean Optical Flow:</span>
                  <span style={{ color: '#38BDF8', fontFamily: 'var(--font-mono)', fontWeight: '600' }}>
                    {opticalFlowMagnitude} px/frame
                  </span>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill" style={{ width: `${Math.min(100, (Number(opticalFlowMagnitude) / 6) * 100)}%`, background: '#38BDF8' }} />
                </div>
              </div>

              {/* Gimbal Angular Velocity */}
              <div style={{ backgroundColor: '#111821', border: '1px solid #263442', borderRadius: '6px', padding: '10px', marginTop: '4px' }}>
                <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '6px' }}>Gimbal Rates:</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                  <div>
                    <span style={{ color: '#64748B' }}>Yaw:</span> <span style={{ color: '#F1F5F9' }}>{yawRate}°/s</span>
                  </div>
                  <div>
                    <span style={{ color: '#64748B' }}>Pitch:</span> <span style={{ color: '#F1F5F9' }}>{pitchRate}°/s</span>
                  </div>
                  <div>
                    <span style={{ color: '#64748B' }}>Roll:</span> <span style={{ color: '#F1F5F9' }}>{rollRate}°/s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
