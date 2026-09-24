import React from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  Video,
  Layers,
  Cpu,
  CloudLightning,
  Box,
  Route,
  ScanEye,
  Ruler,
  GitCompare,
  FolderKanban,
  FileText,
  BarChart3,
  Settings,
  Sparkles,
} from 'lucide-react';
import { ActiveView } from '../types';

interface SidebarProps {
  currentView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  keyframesCount: number;
  objectsCount: number;
  activeProcessingCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  keyframesCount,
  objectsCount,
  activeProcessingCount,
}) => {
  const navSections: {
    id: ActiveView;
    label: string;
    icon: React.ReactNode;
    badge?: string | number;
    badgeType?: 'cyan' | 'teal' | 'warning' | 'indigo';
  }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={17} /> },
    { id: 'new-mission', label: 'New Mission', icon: <PlusCircle size={17} />, badge: 'Upload', badgeType: 'cyan' },
    { id: 'video-analysis', label: 'Video Analysis', icon: <Video size={17} /> },
    { id: 'keyframes', label: 'Keyframes', icon: <Layers size={17} />, badge: keyframesCount, badgeType: 'teal' },
    { id: 'reconstruction', label: 'Reconstruction', icon: <Cpu size={17} />, badge: activeProcessingCount > 0 ? 'Active' : undefined, badgeType: 'warning' },
    { id: 'point-cloud', label: 'Point Cloud', icon: <CloudLightning size={17} /> },
    { id: 'three-d-viewer', label: '3D Viewer', icon: <Box size={17} /> },
    { id: 'flight-path', label: 'Flight Path', icon: <Route size={17} /> },
    { id: 'object-ai', label: 'Object AI', icon: <ScanEye size={17} />, badge: objectsCount, badgeType: 'indigo' },
    { id: 'measurements', label: 'Measurements', icon: <Ruler size={17} /> },
    { id: 'change-detection', label: 'Change Detection', icon: <GitCompare size={17} />, badge: 'Delta', badgeType: 'warning' },
    { id: 'projects', label: 'Projects', icon: <FolderKanban size={17} /> },
    { id: 'reports', label: 'Reports', icon: <FileText size={17} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={17} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={17} /> },
  ];

  return (
    <aside className="app-sidebar">
      {/* Navigation list */}
      <nav style={{ padding: '12px 0', display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
        <div style={{
          padding: '4px 18px 8px',
          fontSize: '10px',
          fontFamily: 'var(--font-mono)',
          color: '#64748B',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          PIPELINE & WORKFLOW
        </div>

        {navSections.slice(0, 11).map((item) => {
          const isActive = currentView === item.id;
          return (
            <div
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <span style={{ color: isActive ? 'var(--accent-primary)' : 'inherit' }}>
                {item.icon}
              </span>
              <span className="nav-label" style={{ flex: 1 }}>
                {item.label}
              </span>
              {item.badge && (
                <span
                  className={`badge badge-${item.badgeType || 'cyan'}`}
                  style={{ fontSize: '10px', padding: '1px 5px' }}
                >
                  {item.badge}
                </span>
              )}
            </div>
          );
        })}

        <div style={{
          padding: '16px 18px 8px',
          fontSize: '10px',
          fontFamily: 'var(--font-mono)',
          color: '#64748B',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          MANAGEMENT & GIS
        </div>

        {navSections.slice(11).map((item) => {
          const isActive = currentView === item.id;
          return (
            <div
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <span style={{ color: isActive ? 'var(--accent-primary)' : 'inherit' }}>
                {item.icon}
              </span>
              <span className="nav-label" style={{ flex: 1 }}>
                {item.label}
              </span>
            </div>
          );
        })}
      </nav>

      {/* Aerospace Hardware Footer Badge */}
      <div style={{
        padding: '14px 16px',
        borderTop: '1px solid var(--border-default)',
        backgroundColor: '#0D1118',
      }}>
        <div style={{
          background: 'rgba(17, 24, 33, 0.8)',
          border: '1px solid var(--border-default)',
          borderRadius: '6px',
          padding: '10px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#F1F5F9' }}>
              GPU Acceleration
            </span>
            <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: '#34D399' }}>
              CUDA 12.4
            </span>
          </div>
          <div style={{ fontSize: '10px', color: '#94A3B8', marginBottom: '6px' }}>
            RTX 4090 • 24GB VRAM
          </div>
          <div className="progress-bar-container" style={{ height: '4px' }}>
            <div className="progress-bar-fill" style={{ width: '42%', background: '#38BDF8' }} />
          </div>
        </div>
      </div>
    </aside>
  );
};
