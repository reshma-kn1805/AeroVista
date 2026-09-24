import React, { useState, useEffect } from 'react';
import {
  Cpu,
  CheckCircle2,
  Clock,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  FileCode,
} from 'lucide-react';
import { PipelineStage, ActiveView } from '../types';

interface ReconstructionViewProps {
  stages: PipelineStage[];
  onNavigate: (view: ActiveView) => void;
  onOpenExplainability: () => void;
}

export const ReconstructionView: React.FC<ReconstructionViewProps> = ({
  stages: initialStages,
  onNavigate,
  onOpenExplainability,
}) => {
  const [stages, setStages] = useState<PipelineStage[]>(initialStages);
  const [isRunning, setIsRunning] = useState(false);
  const [activeStageId, setActiveStageId] = useState<number>(8); // Dense Reconstruction
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '[INIT] AeroVista 3D Core Pipeline initialized with CUDA device 0 (RTX 4090)',
    '[STAGE 01] Video validation passed. Container: DJI_AEROPASS_0024_4K.MP4 (H.265, 3840x2160, 30fps)',
    '[STAGE 02] Extracted 5,040 full-resolution YUV frames to fast NVMe ramdisk cache',
    '[STAGE 03] Entropy clustering culled 4,856 redundant frames. 184 keyframes selected',
    '[STAGE 04] SuperPoint deep feature detector generated 3,214 descriptors per keyframe',
    '[STAGE 05] LightGlue cross-attention matched 1,214 reliable inliers (epipolar residual: 0.62px)',
    '[STAGE 06] 6-DoF Levenberg-Marquardt bundle adjustment solved 184 camera extrinsic poses',
    '[STAGE 07] Sparse triangulation generated 48,200 metric Euclidean tie points',
    '[STAGE 08] Dense Multi-View Stereo (PatchMatch) depth map estimation in progress... [78%]',
  ]);

  // Simulate pipeline execution
  const handleRerun = () => {
    setIsRunning(true);
    setStages((prev) =>
      prev.map((s, idx) => ({
        ...s,
        status: idx === 0 ? 'processing' : 'pending',
        progress: idx === 0 ? 10 : 0,
      }))
    );
    setActiveStageId(1);
    setTerminalLogs(['[RESTART] Re-launching full 13-stage single-pass 3D reconstruction engine...']);

    let stageIdx = 0;
    const interval = setInterval(() => {
      stageIdx++;
      if (stageIdx > 13) {
        clearInterval(interval);
        setIsRunning(false);
        setTerminalLogs((prev) => [...prev, '[COMPLETED] 13/13 stages executed. 3D textured mesh and confidence map ready.']);
        return;
      }

      setActiveStageId(stageIdx);
      setStages((prev) =>
        prev.map((s) => {
          if (s.id < stageIdx) return { ...s, status: 'completed', progress: 100 };
          if (s.id === stageIdx) return { ...s, status: 'processing', progress: 65 };
          return { ...s, status: 'pending', progress: 0 };
        })
      );

      setTerminalLogs((prev) => [
        ...prev,
        `[STAGE ${stageIdx.toString().padStart(2, '0')}] Processing completed with zero fatal exceptions. Reprojection error nominal.`,
      ]);
    }, 900);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-warning">Processing Engine</span>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#94A3B8' }}>
              13-STAGE SINGLE-PASS PIPELINE
            </span>
          </div>
          <h1 style={{ fontSize: '24px', color: '#F1F5F9', marginTop: '4px', margin: 0 }}>
            Reconstruction Processing Center
          </h1>
          <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '2px' }}>
            Real-time execution telemetry tracking structure-from-motion, depth mapping, and mesh Poisson reconstruction.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleRerun}
            disabled={isRunning}
            className="btn btn-secondary btn-sm"
          >
            <RotateCcw size={14} className={isRunning ? 'animate-spin' : ''} />
            <span>{isRunning ? 'Pipeline Running...' : 'Re-run Reconstruction'}</span>
          </button>

          <button
            onClick={() => onNavigate('three-d-viewer')}
            className="btn btn-primary btn-sm"
          >
            <span>View 3D Model</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* 13 STAGES GRID & TERMINAL LOGS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }}>
        {/* STAGES LIST (Section 34) */}
        <div className="aero-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#F1F5F9' }}>
              Sequential Processing Pipeline (13 Stages)
            </span>
            <span className="badge badge-cyan">Deterministic SfM</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '560px', overflowY: 'auto' }}>
            {stages.map((stage) => {
              const isCurrent = activeStageId === stage.id;
              return (
                <div
                  key={stage.id}
                  style={{
                    backgroundColor: isCurrent ? 'rgba(56, 189, 248, 0.08)' : '#111821',
                    border: `1px solid ${isCurrent ? '#38BDF8' : '#263442'}`,
                    borderRadius: '6px',
                    padding: '10px 14px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#64748B' }}>
                        {stage.id.toString().padStart(2, '0')}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: '500', color: isCurrent ? '#38BDF8' : '#F1F5F9' }}>
                        {stage.name}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {stage.timeTaken && (
                        <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#64748B' }}>
                          {stage.timeTaken}
                        </span>
                      )}

                      {stage.status === 'completed' && (
                        <span style={{ color: '#34D399', fontWeight: 'bold' }}>✓</span>
                      )}
                      {stage.status === 'processing' && (
                        <span style={{ color: '#FBBF24', fontSize: '14px', animation: 'pulse 1.5s infinite' }}>●</span>
                      )}
                      {stage.status === 'pending' && (
                        <span style={{ color: '#475569' }}>○</span>
                      )}
                    </div>
                  </div>

                  {stage.details && (
                    <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px', paddingLeft: '24px' }}>
                      {stage.details}
                    </div>
                  )}

                  {isCurrent && stage.status === 'processing' && (
                    <div className="progress-bar-container" style={{ marginTop: '8px', height: '4px' }}>
                      <div className="progress-bar-fill" style={{ width: `${stage.progress}%` }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* TERMINAL & EXPLANABILITY PROMPT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* TERMINAL LOG OUTPUT */}
          <div className="aero-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileCode size={14} style={{ color: '#38BDF8' }} />
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#F1F5F9' }}>Engine Execution Stream</span>
              </div>
              <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: '#34D399' }}>STDOUT</span>
            </div>

            <div style={{
              flex: 1,
              backgroundColor: '#080B10',
              border: '1px solid #1C2733',
              borderRadius: '4px',
              padding: '12px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: '#94A3B8',
              lineHeight: '1.6',
              maxHeight: '380px',
              overflowY: 'auto',
            }}>
              {terminalLogs.map((log, i) => (
                <div key={i} style={{ color: log.includes('COMPLETED') ? '#34D399' : log.includes('RESTART') ? '#FBBF24' : '#94A3B8' }}>
                  {log}
                </div>
              ))}
            </div>
          </div>

          {/* AUDIT QUALITY CALLOUT */}
          <div className="aero-card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <ShieldCheck size={16} style={{ color: '#5EEAD4' }} />
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#F1F5F9' }}>
                Reconstruction Confidence Engine
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#94A3B8', lineHeight: '1.5', marginBottom: '12px' }}>
              AeroVista evaluates geometric covariance at every stage. Once processing concludes, click the quality audit to decompose error penalties.
            </p>
            <button onClick={onOpenExplainability} className="btn btn-outline btn-sm" style={{ width: '100%' }}>
              Explain 88.4% Quality Score ↗
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
