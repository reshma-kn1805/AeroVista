export type ActiveView =
  | 'dashboard'
  | 'new-mission'
  | 'video-analysis'
  | 'keyframes'
  | 'reconstruction'
  | 'point-cloud'
  | 'three-d-viewer'
  | 'flight-path'
  | 'object-ai'
  | 'measurements'
  | 'change-detection'
  | 'projects'
  | 'reports'
  | 'analytics'
  | 'settings';

export type MissionProfile =
  | 'General Reconstruction'
  | 'Disaster Assessment'
  | 'Infrastructure Inspection'
  | 'Construction Monitoring'
  | 'Terrain Survey'
  | 'Agriculture/Land Analysis';

export type ViewerMode = 'TEXTURED' | 'MESH' | 'WIREFRAME' | 'POINT CLOUD' | 'CONFIDENCE';

export interface DroneVideoMetadata {
  filename: string;
  resolution: string;
  width: number;
  height: number;
  duration: string;
  durationSeconds: number;
  fps: number;
  totalFrames: number;
  keyframesCount: number;
  fileSize: string;
  codec: string;
  bitrate: string;
  sensor: string;
  focalLength: string;
  fov: string;
  gpsAvailable: boolean;
  gpsCoordinates?: {
    lat: number;
    lon: number;
    altitudeMeters: number;
  };
  videoUrl?: string;
}

export interface PipelineStage {
  id: number;
  name: string;
  status: 'completed' | 'processing' | 'pending' | 'failed';
  progress: number; // 0 - 100
  timeTaken?: string;
  details?: string;
}

export interface KeyframeItem {
  id: number;
  frameIndex: number;
  timestamp: string;
  overlapPct: number;
  baselineAngleDeg: number;
  sharpnessScore: number;
  informationGain: number;
  isRedundant: boolean;
  thumbnailUrl: string;
}

export interface FeatureMatchData {
  totalPoints: number;
  totalMatches: number;
  reliableMatches: number;
  confidencePct: number;
  algorithm: 'SIFT + LightGlue' | 'SuperPoint + SuperGlue' | 'ORB + RANSAC';
  reprojectionErrorPx: number;
}

export interface RegionConfidence {
  id: string;
  name: string;
  confidencePct: number;
  status: 'High' | 'Medium' | 'Low';
  primaryIssue?: string;
  meshFacesCount: number;
  pointCount: number;
}

export interface QualityFactors {
  frameOverlap: number;
  featureDensity: number;
  motionBlur: number; // penalty
  occlusion: number; // penalty
  textureQuality: number;
  cameraStability: number;
  compositeScore: number;
}

export interface DetectedObject {
  id: string;
  name: string;
  category: 'Building' | 'Road' | 'Vehicle' | 'Vegetation' | 'Tower' | 'Water' | 'Infrastructure';
  confidence: number;
  position: [number, number, number];
  dimensions: {
    length: number;
    width: number;
    height: number;
    uncertainty: number;
  };
  attributes: Record<string, string>;
  riskLevel?: 'Nominal' | 'Watch' | 'Critical';
}

export interface MeasurementRecord {
  id: string;
  label: string;
  type: 'Height' | 'Distance' | 'Area' | 'Slope' | 'Volume';
  value: number;
  unit: string;
  uncertainty: number;
  confidence: number;
  dataSource: string;
  calibrationStatus: 'Visual Reference Prior' | 'Estimated Scale' | 'RTK GPS Calibrated';
  points: [number, number, number][];
}

export interface ScaleReference {
  id: string;
  name: string;
  category: string;
  defaultDimensionMeters: number;
  userDimensionMeters: number;
  confidencePct: number;
  detectedCount: number;
  isCalibrated: boolean;
}

export interface ChangeDetectionFeature {
  id: string;
  name: string;
  status: 'UNCHANGED' | 'NEW' | 'REMOVED' | 'MODIFIED' | 'UNCERTAIN';
  category: string;
  areaDeltaM2?: number;
  heightDeltaM?: number;
  confidence: number;
  description: string;
  location: string;
  coordinates: [number, number, number];
}

export interface CoverageGap {
  id: string;
  region: string;
  currentCoveragePct: number;
  recommendedFlightCorridor: string;
  suggestedAltitudeM: number;
  recommendedHeadingDeg: number;
  cameraPitchDeg: number;
  expectedCoveragePct: number;
  targetGSDCmPx: number;
  waypoints: [number, number, number][];
}

export interface MissionData {
  id: string;
  name: string;
  code: string;
  date: string;
  location: string;
  profile: MissionProfile;
  status: 'Completed' | 'Processing' | 'Draft';
  video: DroneVideoMetadata;
  stages: PipelineStage[];
  quality: QualityFactors;
  regions: RegionConfidence[];
  pointsCount: number;
  verticesCount: number;
  meshFacesCount: number;
  textureResolution: string;
  coveragePct: number;
  flightDistanceKm: number;
  flightDuration: string;
  cameraPosesCount: number;
  avgFlightSpeedMs: number;
  objects: DetectedObject[];
  measurements: MeasurementRecord[];
  scaleReferences: ScaleReference[];
  scaleConfidencePct: number;
  scaleMethod: string;
  coverageGaps: CoverageGap[];
}
