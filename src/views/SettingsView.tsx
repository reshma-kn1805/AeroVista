import React, { useState } from 'react';
import { Settings, Cpu, HardDrive, Shield, Sliders, CheckCircle2, RefreshCw } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [detector, setDetector] = useState('SuperPoint + LightGlue');
  const [maxBaIter, setMaxBaIter] = useState(100);
  const [pointBudget, setPointBudget] = useState('2,000,000');
  const [crs, setCrs] = useState('WGS84 / UTM Zone 43N');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-cyan">System Configuration</span>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#94A3B8' }}>
              ENGINE PARAMETERS
            </span>
          </div>
          <h1 style={{ fontSize: '24px', color: '#F1F5F9', marginTop: '4px', margin: 0 }}>
            Platform Settings & Hardware Acceleration
          </h1>
          <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '2px' }}>
            Configure computer vision extractors, photogrammetric optimizers, and geospatial datums.
          </p>
        </div>

        <button onClick={handleSave} className="btn btn-primary btn-sm">
          {saved ? <CheckCircle2 size={14} /> : null}
          <span>{saved ? 'Saved Successfully!' : 'Save Changes'}</span>
        </button>
      </div>

      {/* HARDWARE ACCELERATION CARD (Section 38) */}
      <div className="aero-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Cpu size={16} style={{ color: '#38BDF8' }} />
          <h3 style={{ fontSize: '15px', color: '#F1F5F9' }}>
            GPU Acceleration & Hardware State
          </h3>
          <span className="badge badge-success">Online & Healthy</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          backgroundColor: '#111821',
          border: '1px solid #263442',
          borderRadius: '6px',
          padding: '14px',
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
        }}>
          <div>
            <span style={{ color: '#64748B' }}>Primary Device:</span>
            <div style={{ color: '#F1F5F9', fontWeight: '600' }}>NVIDIA RTX 4090</div>
          </div>
          <div>
            <span style={{ color: '#64748B' }}>VRAM Available:</span>
            <div style={{ color: '#38BDF8', fontWeight: '600' }}>24.0 GB GDDR6X</div>
          </div>
          <div>
            <span style={{ color: '#64748B' }}>CUDA Runtime:</span>
            <div style={{ color: '#5EEAD4', fontWeight: '600' }}>CUDA 12.4 • cuDNN 9.1</div>
          </div>
          <div>
            <span style={{ color: '#64748B' }}>Browser WebGL:</span>
            <div style={{ color: '#34D399', fontWeight: '600' }}>WebGL 2.0 Hardware</div>
          </div>
        </div>
      </div>

      {/* COMPUTER VISION & SFM SETTINGS (Section 36) */}
      <div className="aero-card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '15px', color: '#F1F5F9', marginBottom: '16px' }}>
          Photogrammetry & Computer Vision Preferences
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Feature Detector */}
          <div>
            <label style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
              Default Feature Detector & Matcher
            </label>
            <select
              value={detector}
              onChange={(e) => setDetector(e.target.value)}
              style={{
                width: '100%',
                height: '36px',
                backgroundColor: '#111821',
                border: '1px solid #263442',
                borderRadius: '6px',
                color: '#F1F5F9',
                padding: '0 10px',
                fontSize: '13px',
                outline: 'none',
              }}
            >
              <option value="SuperPoint + LightGlue">SuperPoint + LightGlue (Attentional Transformer — Recommended)</option>
              <option value="SIFT + FLANN">SIFT + FLANN (Classical Multiscale Scale-Invariant)</option>
              <option value="ORB + RANSAC">ORB + 8-Point RANSAC (Fast Low-Compute Fallback)</option>
            </select>
          </div>

          {/* Bundle Adjustment Iterations */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '12px', color: '#94A3B8' }}>
                Levenberg-Marquardt Max Bundle Adjustment Iterations
              </label>
              <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: '#38BDF8' }}>
                {maxBaIter} iterations
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="200"
              step="10"
              value={maxBaIter}
              onChange={(e) => setMaxBaIter(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#38BDF8' }}
            />
          </div>

          {/* Maximum Point Cloud Render Budget */}
          <div>
            <label style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
              Interactive 3D Point Budget (LOD Target)
            </label>
            <select
              value={pointBudget}
              onChange={(e) => setPointBudget(e.target.value)}
              style={{
                width: '100%',
                height: '36px',
                backgroundColor: '#111821',
                border: '1px solid #263442',
                borderRadius: '6px',
                color: '#F1F5F9',
                padding: '0 10px',
                fontSize: '13px',
                outline: 'none',
              }}
            >
              <option value="1,000,000">1,000,000 Points (Mobile / Integrated Graphics)</option>
              <option value="2,000,000">2,000,000 Points (Standard High-Performance)</option>
              <option value="5,000,000">5,000,000 Points (Ultra Workstation)</option>
            </select>
          </div>

          {/* Default CRS */}
          <div>
            <label style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
              Geodetic Datum & Coordinate Reference System (CRS)
            </label>
            <input
              type="text"
              value={crs}
              onChange={(e) => setCrs(e.target.value)}
              style={{
                width: '100%',
                height: '36px',
                backgroundColor: '#111821',
                border: '1px solid #263442',
                borderRadius: '6px',
                color: '#F1F5F9',
                padding: '0 10px',
                fontSize: '13px',
                outline: 'none',
                fontFamily: 'var(--font-mono)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
