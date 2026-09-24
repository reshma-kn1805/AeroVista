import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Route, Compass, Gauge, Clock, Eye } from 'lucide-react';
import { MissionData, ViewerMode } from '../types';
import { ThreeDCanvas } from '../components/Viewers/ThreeDCanvas';

interface FlightPathViewProps {
  mission: MissionData;
}

export const FlightPathView: React.FC<FlightPathViewProps> = ({ mission }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [droneProgress, setDroneProgress] = useState(0.25);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [cameraMode, setCameraMode] = useState<'Drone View' | 'Follow Path' | 'Free Camera' | 'Orbit'>('Free Camera');

  useEffect(() => {
    let anim: any;
    if (isPlaying) {
      anim = setInterval(() => {
        setDroneProgress((prev) => {
          if (prev >= 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.003 * speedMultiplier;
        });
      }, 30);
    }
    return () => clearInterval(anim);
  }, [isPlaying, speedMultiplier]);

  const currentDistanceKm = (droneProgress * mission.flightDistanceKm).toFixed(2);
  const currentAltM = (48 + Math.sin(droneProgress * Math.PI * 3) * 16).toFixed(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-cyan">UAV Navigation Telemetry</span>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#94A3B8' }}>
              3D TRAJECTORY RECONSTRUCTION
            </span>
          </div>
          <h1 style={{ fontSize: '24px', color: '#F1F5F9', marginTop: '4px', margin: 0 }}>
            Flight Path & Animated Mission Replay
          </h1>
          <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '2px' }}>
            Interactive 3D flight trajectory with dynamic camera viewpoints and drone position playback.
          </p>
        </div>
      </div>

      {/* METRIC STRIP (Section 21) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
        <div className="metric-card">
          <div style={{ fontSize: '10px', color: '#64748B', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Distance</div>
          <div style={{ fontSize: '24px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#F1F5F9', marginTop: '2px' }}>
            {mission.flightDistanceKm} km
          </div>
          <div style={{ fontSize: '10px', color: '#38BDF8' }}>Traversed: {currentDistanceKm} km</div>
        </div>

        <div className="metric-card">
          <div style={{ fontSize: '10px', color: '#64748B', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Duration</div>
          <div style={{ fontSize: '24px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#5EEAD4', marginTop: '2px' }}>
            {mission.flightDuration}
          </div>
          <div style={{ fontSize: '10px', color: '#94A3B8' }}>Single Continuous Pass</div>
        </div>

        <div className="metric-card">
          <div style={{ fontSize: '10px', color: '#64748B', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Keyframes</div>
          <div style={{ fontSize: '24px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#34D399', marginTop: '2px' }}>
            {mission.cameraPosesCount}
          </div>
          <div style={{ fontSize: '10px', color: '#34D399' }}>Spatial Baselines</div>
        </div>

        <div className="metric-card">
          <div style={{ fontSize: '10px', color: '#64748B', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Avg Speed</div>
          <div style={{ fontSize: '24px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#818CF8', marginTop: '2px' }}>
            {mission.avgFlightSpeedMs} m/s
          </div>
          <div style={{ fontSize: '10px', color: '#818CF8' }}>Current Altitude: {currentAltM} m AGL</div>
        </div>
      </div>

      {/* 3D CANVAS WITH DRONE POSITION */}
      <div className="aero-card" style={{ padding: '16px' }}>
        <ThreeDCanvas
          mode="TEXTURED"
          onModeChange={() => {}}
          mission={mission}
          objects={mission.objects}
          showFlightPath={true}
          droneProgress={droneProgress}
        />

        {/* PLAYBACK CONTROLS STRIP (Section 21) */}
        <div style={{
          marginTop: '16px',
          backgroundColor: '#111821',
          border: '1px solid #263442',
          borderRadius: '8px',
          padding: '14px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}>
          {/* SCRUBBER */}
          <input
            type="range"
            min="0"
            max="1"
            step="0.001"
            value={droneProgress}
            onChange={(e) => setDroneProgress(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#38BDF8' }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            {/* Play/Pause/Restart */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="btn btn-primary btn-sm"
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                <span>{isPlaying ? 'Pause' : 'Play Trajectory'}</span>
              </button>

              <button
                onClick={() => setDroneProgress(0)}
                className="btn btn-outline btn-sm"
              >
                <RotateCcw size={14} />
                <span>Restart</span>
              </button>

              <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: '#94A3B8', marginLeft: '6px' }}>
                Progression: <strong style={{ color: '#38BDF8' }}>{Math.round(droneProgress * 100)}%</strong>
              </span>
            </div>

            {/* Speeds */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', color: '#64748B' }}>Speed:</span>
              {[0.25, 0.5, 1, 2].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setSpeedMultiplier(spd)}
                  className="btn btn-sm"
                  style={{
                    backgroundColor: speedMultiplier === spd ? '#1C2733' : 'transparent',
                    borderColor: speedMultiplier === spd ? '#38BDF8' : '#263442',
                    color: speedMultiplier === spd ? '#38BDF8' : '#94A3B8',
                    padding: '3px 8px',
                  }}
                >
                  {spd}×
                </button>
              ))}
            </div>

            {/* Camera Modes */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', color: '#64748B' }}>Camera:</span>
              {(['Drone View', 'Follow Path', 'Free Camera', 'Orbit'] as const).map((cam) => (
                <button
                  key={cam}
                  onClick={() => setCameraMode(cam)}
                  className="btn btn-sm"
                  style={{
                    backgroundColor: cameraMode === cam ? '#1C2733' : 'transparent',
                    borderColor: cameraMode === cam ? '#5EEAD4' : '#263442',
                    color: cameraMode === cam ? '#5EEAD4' : '#94A3B8',
                    padding: '3px 8px',
                  }}
                >
                  {cam}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
