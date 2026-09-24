import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Sliders, CheckCircle2, RefreshCw } from 'lucide-react';
import { FEATURE_MATCH_STATS } from '../../data/missionData';

export const FeatureMatchCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showInliersOnly, setShowInliersOnly] = useState(false);
  const [showEpipolarLines, setShowEpipolarLines] = useState(true);
  const [matchConfidenceThreshold, setMatchConfidenceThreshold] = useState(70);
  const [selectedDescriptor, setSelectedDescriptor] = useState<'SIFT + LightGlue' | 'SuperPoint + SuperGlue' | 'ORB + RANSAC'>('SIFT + LightGlue');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    // Generate deterministic feature match pairs
    const pairs: {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      isInlier: boolean;
      score: number;
    }[] = [];

    const frameWidth = (canvas.width - 40) / 2;
    const frameHeight = canvas.height - 60;
    const frameY = 30;
    const f1X = 15;
    const f2X = f1X + frameWidth + 10;

    for (let i = 0; i < 48; i++) {
      const rx = 40 + (Math.sin(i * 1.7) * 0.5 + 0.5) * (frameWidth - 80);
      const ry = 40 + (Math.cos(i * 2.3) * 0.5 + 0.5) * (frameHeight - 80);
      // Small parallax displacement for Frame 2
      const dx = (Math.sin(i * 3.1) * 14) + 12;
      const dy = (Math.cos(i * 1.9) * 8) - 2;

      const isInlier = i % 7 !== 0; // ~86% inlier ratio
      const score = Math.floor(65 + (Math.sin(i * 0.9) * 0.5 + 0.5) * 35);

      pairs.push({
        x1: f1X + rx,
        y1: frameY + ry,
        x2: f2X + rx + dx,
        y2: frameY + ry + dy,
        isInlier,
        score,
      });
    }

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Frame 1 & Frame 2 Viewport Backgrounds
      // Frame 1
      ctx.fillStyle = '#0D1118';
      ctx.fillRect(f1X, frameY, frameWidth, frameHeight);
      ctx.strokeStyle = '#263442';
      ctx.lineWidth = 1;
      ctx.strokeRect(f1X, frameY, frameWidth, frameHeight);

      // Frame 2
      ctx.fillStyle = '#0D1118';
      ctx.fillRect(f2X, frameY, frameWidth, frameHeight);
      ctx.strokeStyle = '#263442';
      ctx.strokeRect(f2X, frameY, frameWidth, frameHeight);

      // Frame Headers
      ctx.font = '11px JetBrains Mono';
      ctx.fillStyle = '#94A3B8';
      ctx.fillText('FRAME #0184 • 00:06.12 • NADIR 84°', f1X + 12, frameY - 10);
      ctx.fillText('FRAME #0185 • 00:06.15 • BASELINE 3.8m', f2X + 12, frameY - 10);

      // Simulated mountain ridge shapes inside Frame 1 & Frame 2
      [f1X, f2X].forEach((fx, idx) => {
        const offset = idx === 1 ? 12 : 0;
        ctx.fillStyle = '#141D27';
        ctx.beginPath();
        ctx.moveTo(fx, frameY + frameHeight);
        ctx.lineTo(fx, frameY + frameHeight * 0.6 + offset);
        ctx.lineTo(fx + frameWidth * 0.4, frameY + frameHeight * 0.35 + offset);
        ctx.lineTo(fx + frameWidth * 0.7, frameY + frameHeight * 0.48 + offset);
        ctx.lineTo(fx + frameWidth, frameY + frameHeight * 0.3 + offset);
        ctx.lineTo(fx + frameWidth, frameY + frameHeight);
        ctx.closePath();
        ctx.fill();

        // Building silhouette
        ctx.fillStyle = '#1C2733';
        ctx.fillRect(fx + frameWidth * 0.38 + offset, frameY + frameHeight * 0.62, 54, 38);
        ctx.strokeStyle = '#38BDF8';
        ctx.strokeRect(fx + frameWidth * 0.38 + offset, frameY + frameHeight * 0.62, 54, 38);
      });

      // 2. Draw Epipolar Lines if enabled
      if (showEpipolarLines) {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
        ctx.lineWidth = 0.8;
        ctx.setLineDash([4, 6]);
        for (let y = frameY + 30; y < frameY + frameHeight; y += 35) {
          ctx.beginPath();
          ctx.moveTo(f1X, y);
          ctx.lineTo(f2X + frameWidth, y + (y * 0.02));
          ctx.stroke();
        }
        ctx.setLineDash([]);
      }

      // 3. Draw Feature Points & Matching Vectors
      pairs.forEach((p, idx) => {
        if (showInliersOnly && !p.isInlier) return;
        if (p.score < matchConfidenceThreshold) return;

        // Subtle animation pulse
        const pulse = Math.sin(time + idx * 0.5) * 0.5 + 0.5;

        // Match Line
        ctx.beginPath();
        ctx.moveTo(p.x1, p.y1);
        ctx.lineTo(p.x2, p.y2);
        ctx.lineWidth = p.isInlier ? 1.2 : 0.8;

        if (p.isInlier) {
          ctx.strokeStyle = `rgba(52, 211, 153, ${0.45 + pulse * 0.35})`; // #34D399 inliers
        } else {
          ctx.strokeStyle = 'rgba(251, 113, 133, 0.4)'; // #FB7185 outliers
        }
        ctx.stroke();

        // Keypoint circles Frame 1
        ctx.beginPath();
        ctx.arc(p.x1, p.y1, p.isInlier ? 3 : 2, 0, Math.PI * 2);
        ctx.fillStyle = p.isInlier ? '#5EEAD4' : '#FB7185';
        ctx.fill();

        // Keypoint circles Frame 2
        ctx.beginPath();
        ctx.arc(p.x2, p.y2, p.isInlier ? 3 : 2, 0, Math.PI * 2);
        ctx.fillStyle = p.isInlier ? '#38BDF8' : '#FB7185';
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [showInliersOnly, showEpipolarLines, matchConfidenceThreshold, selectedDescriptor]);

  return (
    <div className="aero-card" style={{ padding: '20px' }}>
      {/* HEADER WITH CONTROLS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-cyan">Computer Vision Engine</span>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#94A3B8' }}>
              Dual-Frame Epipolar Geometry
            </span>
          </div>
          <h3 style={{ fontSize: '16px', marginTop: '4px', color: '#F1F5F9' }}>
            Feature Detection & Optical Correspondence
          </h3>
        </div>

        {/* Algorithm Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <select
            value={selectedDescriptor}
            onChange={(e) => setSelectedDescriptor(e.target.value as any)}
            style={{
              backgroundColor: '#111821',
              border: '1px solid #263442',
              color: '#F1F5F9',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              padding: '5px 8px',
              borderRadius: '6px',
              outline: 'none',
            }}
          >
            <option value="SIFT + LightGlue">SIFT + LightGlue (Deep Transformer)</option>
            <option value="SuperPoint + SuperGlue">SuperPoint + SuperGlue (Attentional GNN)</option>
            <option value="ORB + RANSAC">ORB + 8-Point RANSAC</option>
          </select>
        </div>
      </div>

      {/* METRIC STRIP */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        marginBottom: '16px',
        backgroundColor: '#111821',
        border: '1px solid #263442',
        borderRadius: '6px',
        padding: '12px 16px',
      }}>
        <div>
          <div style={{ fontSize: '10px', color: '#64748B', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Feature Points</div>
          <div style={{ fontSize: '17px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#F1F5F9' }}>
            {FEATURE_MATCH_STATS.totalPoints.toLocaleString()}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '10px', color: '#64748B', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Matches</div>
          <div style={{ fontSize: '17px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#38BDF8' }}>
            {FEATURE_MATCH_STATS.totalMatches.toLocaleString()}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '10px', color: '#64748B', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Reliable Inliers</div>
          <div style={{ fontSize: '17px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#34D399' }}>
            {FEATURE_MATCH_STATS.reliableMatches.toLocaleString()}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '10px', color: '#64748B', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Match Confidence</div>
          <div style={{ fontSize: '17px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#5EEAD4' }}>
            {FEATURE_MATCH_STATS.confidencePct}%
          </div>
        </div>
      </div>

      {/* INTERACTIVE CANVAS */}
      <div style={{
        position: 'relative',
        width: '100%',
        borderRadius: '6px',
        overflow: 'hidden',
        border: '1px solid #263442',
        backgroundColor: '#080B10',
      }}>
        <canvas
          ref={canvasRef}
          width={760}
          height={320}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </div>

      {/* BOTTOM CONTROLS */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '14px',
        flexWrap: 'wrap',
        gap: '10px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#94A3B8', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showInliersOnly}
              onChange={(e) => setShowInliersOnly(e.target.checked)}
              style={{ accentColor: '#34D399' }}
            />
            <span>RANSAC Inliers Only</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#94A3B8', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showEpipolarLines}
              onChange={(e) => setShowEpipolarLines(e.target.checked)}
              style={{ accentColor: '#38BDF8' }}
            />
            <span>Epipolar Lines</span>
          </label>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '11px', color: '#64748B' }}>Confidence Threshold:</span>
          <input
            type="range"
            min="50"
            max="95"
            value={matchConfidenceThreshold}
            onChange={(e) => setMatchConfidenceThreshold(Number(e.target.value))}
            style={{ width: '80px', accentColor: '#38BDF8' }}
          />
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#38BDF8', width: '32px' }}>
            {matchConfidenceThreshold}%
          </span>
        </div>
      </div>
    </div>
  );
};
