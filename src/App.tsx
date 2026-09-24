import React, { useState } from 'react';
import { ActiveView, ViewerMode, MissionData } from './types';
import { PRIMARY_DEMO_MISSION, DEMO_MISSIONS, createMissionFromUpload } from './data/missionData';

// Global Components
import { BackgroundGrid } from './components/BackgroundGrid';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DemoBanner } from './components/DemoBanner';
import { ExplainabilityModal } from './components/ExplainabilityModal';
import { ExportModal } from './components/ExportModal';

// Views
import { DashboardView } from './views/DashboardView';
import { NewMissionView } from './views/NewMissionView';
import { VideoAnalysisView } from './views/VideoAnalysisView';
import { KeyframesView } from './views/KeyframesView';
import { ReconstructionView } from './views/ReconstructionView';
import { PointCloudView } from './views/PointCloudView';
import { ThreeDViewerView } from './views/ThreeDViewerView';
import { FlightPathView } from './views/FlightPathView';
import { ObjectAiView } from './views/ObjectAiView';
import { MeasurementsView } from './views/MeasurementsView';
import { ChangeDetectionView } from './views/ChangeDetectionView';
import { ProjectsView } from './views/ProjectsView';
import { ReportsView } from './views/ReportsView';
import { AnalyticsView } from './views/AnalyticsView';
import { SettingsView } from './views/SettingsView';
import { FeatureMatchingView } from './views/FeatureMatchingView';
import { CameraPoseView } from './views/CameraPoseView';

export function App() {
  const [currentView, setCurrentView] = useState<ActiveView>('dashboard');
  const [activeMission, setActiveMission] = useState<MissionData>(PRIMARY_DEMO_MISSION);
  const [viewerMode, setViewerMode] = useState<ViewerMode>('TEXTURED');
  const [isExplainabilityOpen, setIsExplainabilityOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [showDemoBanner, setShowDemoBanner] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle starting a new reconstruction from upload view or flight preset
  const handleStartNewMission = (config: {
    name: string;
    description: string;
    profile: any;
    videoMetadata?: any;
    videoUrl?: string;
  }) => {
    const matchedDemo = DEMO_MISSIONS.find((m) => m.name.toLowerCase() === config.name.toLowerCase());
    if (matchedDemo && !config.videoUrl) {
      setActiveMission(matchedDemo);
    } else {
      const newMission = createMissionFromUpload(config);
      setActiveMission(newMission);
    }
    setIsDemoMode(false);
    setShowDemoBanner(false);
  };

  const handleOpenDemo = () => {
    setActiveMission(PRIMARY_DEMO_MISSION);
    setIsDemoMode(true);
    setShowDemoBanner(true);
    setCurrentView('dashboard');
  };

  return (
    <div className="app-container">
      {/* 1. DISTINCTIVE ATMOSPHERIC BACKGROUND */}
      <BackgroundGrid />

      {/* 2. HEADER WITH FLIGHT SELECTOR */}
      <Header
        currentView={currentView}
        onNavigate={setCurrentView}
        onOpenExplainability={() => setIsExplainabilityOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenDemo={handleOpenDemo}
        isDemoMode={isDemoMode}
        onToggleDemoMode={() => setIsDemoMode(!isDemoMode)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeMission={activeMission}
        onSelectMission={setActiveMission}
      />

      {/* 3. PRECOMPUTED DEMO NOTICE BANNER */}
      {showDemoBanner && (
        <DemoBanner
          isDemoMode={isDemoMode}
          onDismiss={() => setShowDemoBanner(false)}
          onOpenExplainability={() => setIsExplainabilityOpen(true)}
          activeMission={activeMission}
          onSelectMission={setActiveMission}
        />
      )}

      {/* 4. MAIN WORKSPACE BODY */}
      <div className="app-body">
        {/* SIDEBAR NAVIGATION (15 SECTIONS) */}
        <Sidebar
          currentView={currentView}
          onNavigate={setCurrentView}
          keyframesCount={activeMission.video.keyframesCount}
          objectsCount={activeMission.objects.length}
          activeProcessingCount={activeMission.status === 'Processing' ? 1 : 2}
        />

        {/* ACTIVE VIEW CONTENT */}
        <main className="app-main">
          {currentView === 'dashboard' && (
            <DashboardView
              mission={activeMission}
              onNavigate={setCurrentView}
              onOpenExplainability={() => setIsExplainabilityOpen(true)}
              onOpenDemo={handleOpenDemo}
              viewerMode={viewerMode}
              onViewerModeChange={setViewerMode}
            />
          )}

          {currentView === 'new-mission' && (
            <NewMissionView
              onNavigate={setCurrentView}
              onStartReconstruction={handleStartNewMission}
            />
          )}

          {currentView === 'video-analysis' && (
            <VideoAnalysisView metadata={activeMission.video} mission={activeMission} />
          )}

          {currentView === 'keyframes' && (
            <KeyframesView mission={activeMission} />
          )}

          {currentView === 'reconstruction' && (
            <ReconstructionView
              stages={activeMission.stages}
              onNavigate={setCurrentView}
              onOpenExplainability={() => setIsExplainabilityOpen(true)}
            />
          )}

          {currentView === 'point-cloud' && (
            <PointCloudView mission={activeMission} />
          )}

          {currentView === 'three-d-viewer' && (
            <ThreeDViewerView
              mission={activeMission}
              viewerMode={viewerMode}
              onViewerModeChange={setViewerMode}
              onOpenExplainability={() => setIsExplainabilityOpen(true)}
            />
          )}

          {currentView === 'flight-path' && (
            <FlightPathView mission={activeMission} />
          )}

          {currentView === 'object-ai' && (
            <ObjectAiView
              mission={activeMission}
              viewerMode={viewerMode}
              onViewerModeChange={setViewerMode}
            />
          )}

          {currentView === 'measurements' && (
            <MeasurementsView
              mission={activeMission}
              viewerMode={viewerMode}
              onViewerModeChange={setViewerMode}
            />
          )}

          {currentView === 'change-detection' && (
            <ChangeDetectionView
              mission={activeMission}
              viewerMode={viewerMode}
              onViewerModeChange={setViewerMode}
            />
          )}

          {currentView === 'projects' && (
            <ProjectsView
              currentMission={activeMission}
              onNavigate={setCurrentView}
              onSelectMission={setActiveMission}
              onOpenExport={() => setIsExportOpen(true)}
            />
          )}

          {currentView === 'reports' && (
            <ReportsView
              mission={activeMission}
              onOpenExport={() => setIsExportOpen(true)}
            />
          )}

          {currentView === 'analytics' && (
            <AnalyticsView mission={activeMission} />
          )}

          {currentView === 'settings' && (
            <SettingsView />
          )}
        </main>
      </div>

      {/* 5. EXPLAINABILITY MODAL ("Why is this reconstruction quality 88.4%?") */}
      <ExplainabilityModal
        isOpen={isExplainabilityOpen}
        onClose={() => setIsExplainabilityOpen(false)}
        quality={activeMission.quality}
        regions={activeMission.regions}
        onNavigateToReFlight={() => {
          setCurrentView('projects');
        }}
      />

      {/* 6. GIS / DEM / 3D EXPORT MODAL */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        mission={activeMission}
      />
    </div>
  );
}

export default App;
