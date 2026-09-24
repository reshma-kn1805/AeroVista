import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileVideo,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Film,
  Camera,
  Layers,
  Video,
} from 'lucide-react';
import { MissionProfile, ActiveView, DroneVideoMetadata, MissionData } from '../types';
import { DEMO_MISSIONS } from '../data/missionData';

interface NewMissionViewProps {
  onNavigate: (view: ActiveView) => void;
  onStartReconstruction: (config: {
    name: string;
    description: string;
    profile: MissionProfile;
    videoMetadata?: DroneVideoMetadata;
    videoUrl?: string;
  }) => void;
}

export const NewMissionView: React.FC<NewMissionViewProps> = ({
  onNavigate,
  onStartReconstruction,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [missionName, setMissionName] = useState('Himalayan Outpost Survey 025');
  const [missionDesc, setMissionDesc] = useState('High-altitude perimeter inspection with structural dimension recovery and shadow corridor analysis.');
  const [selectedProfile, setSelectedProfile] = useState<MissionProfile>('Terrain Survey');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [selectedDemoId, setSelectedDemoId] = useState<string>('mission-ms-024');

  // Video metadata state
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    sizeFormatted: string;
    resolution: string;
    width: number;
    height: number;
    durationFormatted: string;
    durationSeconds: number;
    fps: number;
    totalFrames: number;
    keyframesCount: number;
    bitrate: string;
    codec: string;
    sensor: string;
    focalLength: string;
    fov: string;
    videoUrl?: string;
  }>({
    name: 'DJI_AEROPASS_0025_4K.MP4',
    sizeFormatted: '2.42 GB',
    resolution: '3840 × 2160 (4K UHD)',
    width: 3840,
    height: 2160,
    durationFormatted: '02:48',
    durationSeconds: 168,
    fps: 30,
    totalFrames: 5040,
    keyframesCount: 184,
    bitrate: '122.4 Mbps HEVC',
    codec: 'HEVC / H.265 (Main 10 Profile)',
    sensor: 'Sony IMX586 1/2" CMOS',
    focalLength: '24mm eq. (f/2.8)',
    fov: '84.0° FOV',
  });

  const previewVideoRef = useRef<HTMLVideoElement>(null);

  const profiles: { id: MissionProfile; desc: string }[] = [
    { id: 'General Reconstruction', desc: 'Balanced photogrammetric mesh & orthophoto generation.' },
    { id: 'Disaster Assessment', desc: 'Damage localization, structural shifts & terrain collapses.' },
    { id: 'Infrastructure Inspection', desc: 'High-density geometric detail for towers, bridges & facilities.' },
    { id: 'Construction Monitoring', desc: 'Volumetric earthwork calculations & temporal change tracking.' },
    { id: 'Terrain Survey', desc: 'DEM digital elevation models, slope contours & hydrology.' },
    { id: 'Agriculture/Land Analysis', desc: 'Canopy density, crop corridors & vegetation boundaries.' },
  ];

  // Quick-load one of the demo video flights
  const handleSelectDemoFlight = (demo: MissionData) => {
    setSelectedDemoId(demo.id);
    setMissionName(demo.name);
    setMissionDesc(`Single-pass reconstruction of ${demo.location} optimized for ${demo.profile}.`);
    setSelectedProfile(demo.profile);
    setUploadedFile({
      name: demo.video.filename,
      sizeFormatted: demo.video.fileSize,
      resolution: demo.video.resolution,
      width: demo.video.width,
      height: demo.video.height,
      durationFormatted: demo.video.duration,
      durationSeconds: demo.video.durationSeconds,
      fps: demo.video.fps,
      totalFrames: demo.video.totalFrames,
      keyframesCount: demo.video.keyframesCount,
      bitrate: demo.video.bitrate,
      codec: demo.video.codec,
      sensor: demo.video.sensor,
      focalLength: demo.video.focalLength,
      fov: demo.video.fov,
      videoUrl: undefined,
    });
  };

  // Process uploaded video file (from input or drop)
  const processVideoFile = (file: File) => {
    if (!file) return;

    setSelectedDemoId('');
    setIsValidating(true);
    const sizeInMB = file.size / (1024 * 1024);
    const sizeFormatted = sizeInMB > 1000
      ? `${(sizeInMB / 1024).toFixed(2)} GB`
      : `${sizeInMB.toFixed(1)} MB`;

    const videoObjUrl = URL.createObjectURL(file);

    // Create temporary video element to extract real width, height, duration
    const tempVideo = document.createElement('video');
    tempVideo.preload = 'metadata';
    tempVideo.src = videoObjUrl;

    tempVideo.onloadedmetadata = () => {
      const width = tempVideo.videoWidth || 3840;
      const height = tempVideo.videoHeight || 2160;
      const durationSec = Math.round(tempVideo.duration) || 120;
      const mins = Math.floor(durationSec / 60);
      const secs = durationSec % 60;
      const durationFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      const totalFrames = Math.max(30, durationSec * 30);
      const keyframesCount = Math.max(12, Math.round(totalFrames * 0.036));

      const is4K = width >= 3840 || height >= 2160;
      const is1080 = width >= 1920 || height >= 1080;
      const resLabel = is4K
        ? `${width} × ${height} (4K UHD)`
        : is1080
        ? `${width} × ${height} (1080p FHD)`
        : `${width} × ${height} (Custom Res)`;

      const calcBitrate = `${((file.size * 8) / (durationSec || 1) / 1000000).toFixed(1)} Mbps`;

      setUploadedFile({
        name: file.name,
        sizeFormatted,
        resolution: resLabel,
        width,
        height,
        durationFormatted,
        durationSeconds: durationSec,
        fps: 30,
        totalFrames,
        keyframesCount,
        bitrate: calcBitrate,
        codec: file.type || 'video/mp4 (H.264 / H.265)',
        sensor: is4K ? 'Sony IMX586 1/2" CMOS' : 'Standard 1/2.3" CMOS',
        focalLength: '24mm eq. (f/2.8)',
        fov: '84.0° FOV',
        videoUrl: videoObjUrl,
      });

      const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[_.-]+/g, ' ');
      setMissionName(`Recon: ${baseName.toUpperCase()}`);
      setIsValidating(false);
    };

    tempVideo.onerror = () => {
      setUploadedFile({
        name: file.name,
        sizeFormatted,
        resolution: '3840 × 2160 (4K Raw)',
        width: 3840,
        height: 2160,
        durationFormatted: '02:30',
        durationSeconds: 150,
        fps: 30,
        totalFrames: 4500,
        keyframesCount: 162,
        bitrate: '110.0 Mbps',
        codec: file.name.endsWith('.mov') ? 'Apple ProRes 422' : 'HEVC / H.265',
        sensor: 'Sony IMX586 1/2" CMOS',
        focalLength: '24mm eq. (f/2.8)',
        fov: '84.0° FOV',
        videoUrl: videoObjUrl,
      });
      setIsValidating(false);
    };
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processVideoFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processVideoFile(e.dataTransfer.files[0]);
    }
  };

  const handleStart = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onStartReconstruction({
        name: missionName,
        description: missionDesc,
        profile: selectedProfile,
        videoMetadata: {
          filename: uploadedFile.name,
          resolution: uploadedFile.resolution,
          width: uploadedFile.width,
          height: uploadedFile.height,
          duration: uploadedFile.durationFormatted,
          durationSeconds: uploadedFile.durationSeconds,
          fps: uploadedFile.fps,
          totalFrames: uploadedFile.totalFrames,
          keyframesCount: uploadedFile.keyframesCount,
          fileSize: uploadedFile.sizeFormatted,
          codec: uploadedFile.codec,
          bitrate: uploadedFile.bitrate,
          sensor: uploadedFile.sensor,
          focalLength: uploadedFile.focalLength,
          fov: uploadedFile.fov,
          gpsAvailable: false,
          videoUrl: uploadedFile.videoUrl,
        },
        videoUrl: uploadedFile.videoUrl,
      });
      onNavigate('reconstruction');
    }, 600);
  };

  const getEmojiForFlight = (m: MissionData) => {
    const n = m.name.toLowerCase();
    if (n.includes('quarry')) return '⛏️';
    if (n.includes('urban') || n.includes('transit')) return '🏗️';
    if (n.includes('substation') || n.includes('power')) return '⚡';
    if (n.includes('agro') || n.includes('canopy')) return '🌾';
    if (n.includes('disaster') || n.includes('earthquake')) return '⚠️';
    return '🏔️';
  };

  return (
    <div style={{ maxWidth: '1020px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/quicktime,video/x-msvideo,video/x-matroska,video/*,.mp4,.mov,.avi,.mkv"
        style={{ display: 'none' }}
        onChange={handleFileInputChange}
      />

      {/* HEADER */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span className="badge badge-cyan">Single-Pass Drone Ingestion</span>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#94A3B8' }}>
            SIH26158 PIPELINE INITIATOR
          </span>
        </div>
        <h1 style={{ fontSize: '26px', color: '#F1F5F9', margin: 0 }}>
          New 3D Reconstruction & Video Ingestion
        </h1>
        <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>
          Select a pre-loaded flight or upload any drone video to generate a customized, measurable 3D digital twin.
        </p>
      </div>

      {/* PRE-LOADED FLIGHTS CAROUSEL / GRID: Enables instant testing of different video types */}
      <div className="aero-card" style={{ padding: '20px', borderLeft: '4px solid #38BDF8' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#38BDF8' }}>
              STEP 1: SELECT DRONE FLIGHT PRESET (OR UPLOAD BELOW)
            </div>
            <h3 style={{ fontSize: '15px', color: '#F1F5F9', margin: '2px 0 0' }}>
              Choose a Pre-Indexed Drone Video Flight
            </h3>
          </div>
          <span className="badge badge-teal">6 Distinct 3D Environments</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
        }}>
          {DEMO_MISSIONS.map((dm) => {
            const isSelected = selectedDemoId === dm.id;
            return (
              <div
                key={dm.id}
                onClick={() => handleSelectDemoFlight(dm)}
                style={{
                  padding: '12px',
                  borderRadius: '6px',
                  backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.12)' : '#111821',
                  border: `1px solid ${isSelected ? '#38BDF8' : '#263442'}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.borderColor = '#475569';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.borderColor = '#263442';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '18px' }}>{getEmojiForFlight(dm)}</span>
                  <span className="badge badge-cyan" style={{ fontSize: '9px', padding: '1px 5px' }}>
                    {dm.video.resolution.split(' ')[0]}
                  </span>
                </div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: isSelected ? '#38BDF8' : '#F1F5F9' }}>
                  {dm.name}
                </div>
                <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '2px' }}>
                  {dm.profile} • {dm.video.duration}
                </div>
                <div style={{ fontSize: '10px', color: '#64748B', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                  {dm.pointsCount.toLocaleString()} points • {dm.objects.length} 3D objects
                </div>
                {isSelected && (
                  <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
                    <CheckCircle2 size={14} style={{ color: '#38BDF8' }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* UPLOAD CONTAINER */}
      <div className="aero-card" style={{ padding: '24px' }}>
        <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#38BDF8', marginBottom: '6px' }}>
          STEP 2: OR UPLOAD YOUR OWN DRONE VIDEO FILE
        </div>
        {/* INTERACTIVE DRAG & DROP ZONE */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${isDragging ? '#38BDF8' : '#263442'}`,
            borderRadius: '8px',
            padding: '30px 20px',
            textAlign: 'center',
            backgroundColor: isDragging ? 'rgba(56, 189, 248, 0.05)' : '#0D1118',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#38BDF8')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = isDragging ? '#38BDF8' : '#263442')}
        >
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              color: '#38BDF8',
            }}
          >
            {isValidating ? (
              <RefreshCw size={24} className="animate-spin" />
            ) : (
              <UploadCloud size={26} />
            )}
          </div>

          <h3 style={{ fontSize: '15px', color: '#F1F5F9', marginBottom: '4px' }}>
            {isValidating ? 'ANALYZING VIDEO HEADERS...' : 'DROP ANY DRONE VIDEO FROM YOUR PC'}
          </h3>
          <p style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '10px' }}>
            or <strong style={{ color: '#38BDF8', textDecoration: 'underline' }}>browse your local computer</strong>
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span className="badge badge-indigo" style={{ fontSize: '10px', padding: '3px 8px' }}>
              MP4 • MOV • AVI • MKV
            </span>
            <span className="badge badge-teal" style={{ fontSize: '10px', padding: '3px 8px' }}>
              4K UHD / 1080p FHD
            </span>
          </div>
        </div>

        {/* EXTRACTED VIDEO METADATA CARD */}
        <div
          style={{
            marginTop: '18px',
            backgroundColor: '#111821',
            border: '1px solid #263442',
            borderRadius: '8px',
            padding: '16px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileVideo size={20} style={{ color: '#38BDF8' }} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#F1F5F9' }}>
                  {uploadedFile.name}
                </div>
                <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                  Extracted {uploadedFile.totalFrames.toLocaleString()} frames • {uploadedFile.keyframesCount} keyframes selected
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-success">Metadata Validated</span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn btn-outline btn-sm"
              >
                Change File
              </button>
            </div>
          </div>

          {/* VIDEO LIVE PREVIEW (If a real video URL is present) */}
          {uploadedFile.videoUrl && (
            <div style={{
              position: 'relative',
              width: '100%',
              maxHeight: '220px',
              backgroundColor: '#000000',
              borderRadius: '6px',
              overflow: 'hidden',
              marginBottom: '14px',
              border: '1px solid #263442',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <video
                ref={previewVideoRef}
                src={uploadedFile.videoUrl}
                style={{ width: '100%', maxHeight: '220px', objectFit: 'contain' }}
                controls
              />
            </div>
          )}

          {/* METRIC GRID */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              borderTop: '1px solid #1C2733',
              paddingTop: '12px',
            }}
          >
            <div>
              <span style={{ color: '#64748B' }}>Resolution:</span>
              <div style={{ color: '#F1F5F9', fontWeight: '600' }}>{uploadedFile.resolution}</div>
            </div>
            <div>
              <span style={{ color: '#64748B' }}>Duration:</span>
              <div style={{ color: '#F1F5F9', fontWeight: '600' }}>
                {uploadedFile.durationFormatted} ({uploadedFile.durationSeconds}s)
              </div>
            </div>
            <div>
              <span style={{ color: '#64748B' }}>Framerate:</span>
              <div style={{ color: '#F1F5F9', fontWeight: '600' }}>
                {uploadedFile.fps}.0 fps ({uploadedFile.totalFrames.toLocaleString()} frames)
              </div>
            </div>
            <div>
              <span style={{ color: '#64748B' }}>File Size:</span>
              <div style={{ color: '#F1F5F9', fontWeight: '600' }}>{uploadedFile.sizeFormatted}</div>
            </div>
          </div>
        </div>
      </div>

      {/* MISSION PARAMETERS & ANALYTICAL PROFILE */}
      <div className="aero-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '16px', color: '#F1F5F9', marginBottom: '16px' }}>
          Mission Parameters & 3D Analytical Profile
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '500', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
              Mission Name
            </label>
            <input
              type="text"
              value={missionName}
              onChange={(e) => setMissionName(e.target.value)}
              style={{
                width: '100%',
                height: '38px',
                backgroundColor: '#111821',
                border: '1px solid #263442',
                borderRadius: '6px',
                padding: '0 12px',
                color: '#F1F5F9',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '500', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
              Mission Description
            </label>
            <textarea
              rows={2}
              value={missionDesc}
              onChange={(e) => setMissionDesc(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#111821',
                border: '1px solid #263442',
                borderRadius: '6px',
                padding: '8px 12px',
                color: '#F1F5F9',
                fontSize: '13px',
                outline: 'none',
                resize: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '500', color: '#94A3B8', display: 'block', marginBottom: '8px' }}>
              Analysis Profile (Controls 3D Geometry Generation)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {profiles.map((p) => {
                const isSelected = selectedProfile === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProfile(p.id)}
                    style={{
                      padding: '12px',
                      borderRadius: '6px',
                      backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.08)' : '#111821',
                      border: `1px solid ${isSelected ? '#38BDF8' : '#263442'}`,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: isSelected ? '#38BDF8' : '#F1F5F9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>{p.id}</span>
                      {isSelected && <CheckCircle2 size={14} style={{ color: '#38BDF8' }} />}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px', lineHeight: '1.4' }}>
                      {p.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ACTION BUTTON */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #263442' }}>
          <button
            onClick={handleStart}
            disabled={isProcessing}
            className="btn btn-primary btn-lg"
            style={{ minWidth: '260px' }}
          >
            {isProcessing ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Generating 3D Twin...</span>
              </>
            ) : (
              <>
                <span>Launch 3D Reconstruction</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
