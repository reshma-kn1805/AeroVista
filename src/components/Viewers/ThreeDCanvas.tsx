import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  ViewerMode,
  DetectedObject,
  MeasurementRecord,
  CoverageGap,
  MissionData,
} from '../../types';
import {
  Layers,
  Eye,
  Maximize2,
  Minimize2,
  Sun,
  Grid,
  Crosshair,
  RotateCcw,
  Sliders,
  Sparkles,
  Info,
  MapPin,
} from 'lucide-react';

interface ThreeDCanvasProps {
  mode: ViewerMode;
  onModeChange: (mode: ViewerMode) => void;
  mission?: MissionData;
  objects?: DetectedObject[];
  selectedObjectId?: string;
  onSelectObject?: (id: string) => void;
  measurements?: MeasurementRecord[];
  activeMeasurementId?: string;
  onSelectMeasurement?: (id: string) => void;
  coverageGaps?: CoverageGap[];
  showFlightPath?: boolean;
  droneProgress?: number; // 0 to 1 along flight spline
  showGapsOverlay?: boolean;
  onOpenExplainability?: () => void;
  isMiniView?: boolean;
}

export type EnvironmentArchetype =
  | 'MOUNTAIN'
  | 'URBAN_CONSTRUCTION'
  | 'QUARRY'
  | 'SUBSTATION'
  | 'AGRICULTURE'
  | 'DISASTER';

export function getEnvironmentArchetype(mission?: MissionData): EnvironmentArchetype {
  if (!mission) return 'MOUNTAIN';

  const name = (mission.name || '').toLowerCase();
  const profile = mission.profile;
  const filename = (mission.video?.filename || '').toLowerCase();

  if (profile === 'Construction Monitoring' || name.includes('urban') || name.includes('transit') || filename.includes('urban')) {
    return 'URBAN_CONSTRUCTION';
  }
  if (name.includes('quarry') || filename.includes('quarry') || (profile === 'Infrastructure Inspection' && name.includes('coastal'))) {
    return 'QUARRY';
  }
  if (name.includes('substation') || name.includes('power') || filename.includes('substation') || name.includes('grid')) {
    return 'SUBSTATION';
  }
  if (profile === 'Agriculture/Land Analysis' || name.includes('agro') || name.includes('canopy') || filename.includes('agro')) {
    return 'AGRICULTURE';
  }
  if (profile === 'Disaster Assessment' || name.includes('earthquake') || name.includes('disaster') || name.includes('collapse') || filename.includes('disaster')) {
    return 'DISASTER';
  }
  if (profile === 'Terrain Survey' || name.includes('mountain') || filename.includes('aeropass')) {
    return 'MOUNTAIN';
  }

  // Fallback based on profile
  if (profile === 'Infrastructure Inspection') return 'SUBSTATION';
  return 'MOUNTAIN';
}

export const ThreeDCanvas: React.FC<ThreeDCanvasProps> = ({
  mode,
  onModeChange,
  mission,
  objects: passedObjects,
  selectedObjectId,
  onSelectObject,
  measurements: passedMeasurements,
  activeMeasurementId,
  onSelectMeasurement,
  coverageGaps: passedGaps,
  showFlightPath = true,
  droneProgress = 0.35,
  showGapsOverlay = false,
  onOpenExplainability,
  isMiniView = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const objects = passedObjects || mission?.objects || [];
  const measurements = passedMeasurements || mission?.measurements || [];
  const coverageGaps = passedGaps || mission?.coverageGaps || [];

  const archetype = getEnvironmentArchetype(mission);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [showBBoxes, setShowBBoxes] = useState(true);
  const [showMeasurePins, setShowMeasurePins] = useState(true);
  const [sunlightAngle, setSunlightAngle] = useState(45);
  const [activeCameraPreset, setActiveCameraPreset] = useState<'Perspective' | 'Top' | 'Front' | 'Side' | 'Drone'>('Perspective');

  // Scene references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const droneMeshRef = useRef<THREE.Group | null>(null);
  const flightCurveRef = useRef<THREE.CatmullRomCurve3 | null>(null);

  // Group references for dynamic rebuild
  const environmentGroupRef = useRef<THREE.Group | null>(null);
  const terrainMeshRef = useRef<THREE.Mesh | null>(null);
  const pointCloudRef = useRef<THREE.Points | null>(null);
  const wireframeMeshRef = useRef<THREE.Mesh | null>(null);
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);
  const axesHelperRef = useRef<THREE.AxesHelper | null>(null);
  const bboxesGroupRef = useRef<THREE.Group | null>(null);
  const measurementsGroupRef = useRef<THREE.Group | null>(null);
  const flightPathGroupRef = useRef<THREE.Group | null>(null);
  const gapOverlayGroupRef = useRef<THREE.Group | null>(null);

  // 1. SETUP BASE THREE.JS ENGINE ONCE
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || (isMiniView ? 340 : 540);

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080b10);
    scene.fog = new THREE.FogExp2(0x080b10, 0.0032);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 1200);
    camera.position.set(70, 55, 80);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, canvasRef.current);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2 - 0.04;
    controls.minDistance = 5;
    controls.maxDistance = 400;
    controls.target.set(0, 5, 0);
    controlsRef.current = controls;

    // Lighting
    const hemiLight = new THREE.HemisphereLight(0x93c5fd, 0x080b10, 0.7);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight.position.set(60, 80, 40);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 300;
    dirLight.shadow.camera.left = -90;
    dirLight.shadow.camera.right = 90;
    dirLight.shadow.camera.top = 90;
    dirLight.shadow.camera.bottom = -90;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.4);
    rimLight.position.set(-60, 40, -40);
    scene.add(rimLight);

    // Grid & Axes
    const gridHelper = new THREE.GridHelper(200, 40, 0x38bdf8, 0x1c2733);
    gridHelper.position.y = -0.1;
    scene.add(gridHelper);
    gridHelperRef.current = gridHelper;

    const axesHelper = new THREE.AxesHelper(15);
    scene.add(axesHelper);
    axesHelperRef.current = axesHelper;

    // Root dynamic environment container
    const envGroup = new THREE.Group();
    scene.add(envGroup);
    environmentGroupRef.current = envGroup;

    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (flightCurveRef.current && droneMeshRef.current) {
        const dronePos = flightCurveRef.current.getPointAt(droneProgress % 1);
        droneMeshRef.current.position.copy(dronePos);
        const tangent = flightCurveRef.current.getTangentAt(droneProgress % 1);
        droneMeshRef.current.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  }, []);

  // 2. DYNAMICALLY REBUILD 3D DIGITAL TWIN WHEN MISSION / ARCHETYPE CHANGES!
  useEffect(() => {
    const scene = sceneRef.current;
    const envGroup = environmentGroupRef.current;
    if (!scene || !envGroup) return;

    // Clean up previous environment meshes & geometries
    while (envGroup.children.length > 0) {
      const child = envGroup.children[0] as any;
      envGroup.remove(child);
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m: any) => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    }

    const terrainSize = 180;
    const segments = 120;
    const geometry = new THREE.PlaneGeometry(terrainSize, terrainSize, segments, segments);
    geometry.rotateX(-Math.PI / 2);

    const pos = geometry.attributes.position;
    const vertexColors: number[] = [];

    // --- ARCHETYPE ELEVATION FUNCTION ---
    const getElevation = (x: number, z: number): number => {
      const dist = Math.sqrt(x * x + z * z);

      if (archetype === 'URBAN_CONSTRUCTION') {
        // Deep foundation pit in center, level city streets around
        const inPit = x > -28 && x < 20 && z > -22 && z < 18;
        if (inPit) {
          // Pit floor with sloped entrance ramp on south
          if (z > 10) {
            return THREE.MathUtils.lerp(-8.5, 1.2, (z - 10) / 8);
          }
          return -8.5;
        }
        // Slightly elevated sidewalk & road grade
        return 1.2;
      }

      if (archetype === 'QUARRY') {
        // Concentric stepped terraces descending into oval quarry pit
        const pitDist = Math.sqrt(Math.pow(x - 8, 2) * 0.9 + Math.pow(z - 4, 2) * 1.1);
        if (pitDist < 52) {
          const stepIndex = Math.min(4, Math.floor(pitDist / 10));
          const stepFloor = -14 + stepIndex * 5.2;
          return stepFloor;
        }
        // Western high rock escarpment cliff
        if (x < -32) {
          return 14 + Math.sin(z * 0.05) * 6;
        }
        // Eastern ocean coast plane
        if (x > 45) {
          return -1.5;
        }
        return 4.5 + Math.sin(x * 0.04) * 2;
      }

      if (archetype === 'SUBSTATION') {
        // Level gravel site with raised concrete equipment pads and boundary berms
        const isBerm = Math.abs(x) > 65 || Math.abs(z) > 65;
        if (isBerm) {
          return 4.2 + Math.sin(x * 0.1) * 1.2;
        }
        // Central transformer pads
        if ((Math.abs(x + 14) < 10 || Math.abs(x - 14) < 10) && Math.abs(z + 6) < 8) {
          return 1.4;
        }
        return 0.5;
      }

      if (archetype === 'AGRICULTURE') {
        // Rolling agricultural swells with crop furrows
        const hill1 = Math.sin(x * 0.03) * 4.2 + Math.cos(z * 0.025) * 3.5 + 4;
        const furrow = Math.sin(z * 0.45) * 0.5;
        // Central irrigation canal trench
        if (Math.abs(x) < 4.5 && Math.abs(z) < 65) {
          return -1.8;
        }
        return hill1 + furrow;
      }

      if (archetype === 'DISASTER') {
        // Tectonic fault fissure with vertical shear drop across diagonal line
        const faultLine = z - 0.7 * x;
        const isNorthWestSide = faultLine > 0;
        let y = isNorthWestSide ? 5.5 : -1.8;

        // Canyon river gorge along center
        if (Math.abs(z) < 12 && x > -25 && x < 25) {
          y = -9.2;
        }
        // Jagged rubble scree
        y += Math.sin(x * 0.1) * Math.cos(z * 0.1) * 2.2;
        return y;
      }

      // Default: MOUNTAIN
      const ridge1 = Math.sin(x * 0.04) * Math.cos(z * 0.04) * 14;
      const ridge2 = Math.cos(x * 0.08 + z * 0.03) * 6;
      const northMountain = Math.max(0, -z * 0.28) * 1.4;
      const southRavine = Math.max(0, z * 0.2) * (x > -10 && x < 25 ? -1.2 : 0.8);
      const valley = Math.exp(-Math.pow(dist * 0.03, 2)) * -4;

      let y = ridge1 + ridge2 + northMountain + southRavine + valley + 8;
      if (Math.abs(x) < 32 && Math.abs(z) < 22) {
        y = THREE.MathUtils.lerp(y, 3.2, 0.75);
      }
      return y;
    };

    // Populate vertex heights and confidence colors
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const y = getElevation(x, z);
      pos.setY(i, y);

      // Archetype-specific confidence heatmap colors
      if (archetype === 'URBAN_CONSTRUCTION') {
        if (x > -28 && x < 20 && z > -22 && z < 18) {
          vertexColors.push(0.20, 0.83, 0.60); // High confidence in foundation
        } else if (z > 45 || z < -45) {
          vertexColors.push(0.98, 0.75, 0.14); // Medium on street edges
        } else {
          vertexColors.push(0.37, 0.92, 0.83); // Teal
        }
      } else if (archetype === 'QUARRY') {
        if (x > 45) {
          vertexColors.push(0.98, 0.44, 0.52); // Low on ocean spray
        } else {
          vertexColors.push(0.20, 0.83, 0.60); // High on terraced limestone
        }
      } else if (archetype === 'AGRICULTURE') {
        if (Math.abs(x) < 5) {
          vertexColors.push(0.98, 0.75, 0.14); // Canal specular
        } else {
          vertexColors.push(0.20, 0.83, 0.60); // High vegetation
        }
      } else if (archetype === 'DISASTER') {
        if (Math.abs(z) < 14) {
          vertexColors.push(0.98, 0.44, 0.52); // Gorge breach low confidence
        } else {
          vertexColors.push(0.37, 0.92, 0.83);
        }
      } else {
        // Mountain default
        if (z > 25 && y < 6) {
          vertexColors.push(0.98, 0.44, 0.52);
        } else if (Math.abs(x) < 20 && Math.abs(z) < 15) {
          vertexColors.push(0.98, 0.75, 0.14);
        } else {
          vertexColors.push(0.20, 0.83, 0.60);
        }
      }
    }
    geometry.computeVertexNormals();
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(vertexColors, 3));

    // --- ARCHETYPE PROCEDURAL PHOTOGRAMMETRY TEXTURE ---
    const texCanvas = document.createElement('canvas');
    texCanvas.width = 1024;
    texCanvas.height = 1024;
    const ctx = texCanvas.getContext('2d');
    if (ctx) {
      if (archetype === 'URBAN_CONSTRUCTION') {
        // Dark asphalt city grid
        ctx.fillStyle = '#141820';
        ctx.fillRect(0, 0, 1024, 1024);
        // Concrete foundation excavation zone in center
        ctx.fillStyle = '#26303d';
        ctx.fillRect(280, 260, 480, 480);
        // Steel rebar grid texture
        ctx.strokeStyle = '#384859';
        ctx.lineWidth = 1;
        for (let g = 290; g <= 750; g += 20) {
          ctx.beginPath(); ctx.moveTo(g, 260); ctx.lineTo(g, 740); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(280, g); ctx.lineTo(760, g); ctx.stroke();
        }
        // City streets & crosswalks
        ctx.fillStyle = '#0f131a';
        ctx.fillRect(0, 80, 1024, 140);
        ctx.fillRect(0, 800, 1024, 140);
        // Yellow lane dividers & white crosswalk stripes
        ctx.strokeStyle = '#FBBF24';
        ctx.lineWidth = 3;
        ctx.setLineDash([20, 15]);
        ctx.beginPath(); ctx.moveTo(0, 150); ctx.lineTo(1024, 150); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, 870); ctx.lineTo(1024, 870); ctx.stroke();
        ctx.setLineDash([]);
        // Yellow hazard border around pit
        ctx.strokeStyle = '#FBBF24';
        ctx.lineWidth = 4;
        ctx.strokeRect(280, 260, 480, 480);
      } else if (archetype === 'QUARRY') {
        // Warm sandstone limestone rock
        ctx.fillStyle = '#2d251c';
        ctx.fillRect(0, 0, 1024, 1024);
        // Concentric quarry bench cuts
        ctx.strokeStyle = '#42372a';
        ctx.lineWidth = 8;
        for (let r = 60; r < 460; r += 50) {
          ctx.beginPath();
          ctx.arc(540, 520, r, 0, Math.PI * 2);
          ctx.stroke();
        }
        // Ocean coast on east side (right 25% of texture)
        ctx.fillStyle = '#0c4a6e';
        ctx.fillRect(800, 0, 224, 1024);
        // Wave foam line
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 4;
        ctx.beginPath();
        for (let y = 0; y < 1024; y += 30) {
          ctx.lineTo(800 + Math.sin(y * 0.05) * 12, y);
        }
        ctx.stroke();
      } else if (archetype === 'SUBSTATION') {
        // Crushed gray gravel yard
        ctx.fillStyle = '#1e2633';
        ctx.fillRect(0, 0, 1024, 1024);
        // Fine gravel noise
        ctx.fillStyle = '#283446';
        for (let p = 0; p < 2000; p++) {
          ctx.fillRect(Math.random() * 1024, Math.random() * 1024, 2, 2);
        }
        // Concrete equipment pads
        ctx.fillStyle = '#3a4a5f';
        ctx.fillRect(320, 380, 140, 180);
        ctx.fillRect(560, 380, 140, 180);
        // Yellow caution hatched perimeter
        ctx.strokeStyle = '#FBBF24';
        ctx.lineWidth = 2;
        ctx.strokeRect(280, 340, 460, 260);
      } else if (archetype === 'AGRICULTURE') {
        // Lush agricultural green
        ctx.fillStyle = '#14532d';
        ctx.fillRect(0, 0, 1024, 1024);
        // Parallel crop furrows
        ctx.strokeStyle = '#166534';
        ctx.lineWidth = 6;
        for (let f = 0; f < 1024; f += 14) {
          ctx.beginPath();
          ctx.moveTo(0, f);
          ctx.lineTo(1024, f);
          ctx.stroke();
        }
        // Golden grain plot quadrant
        ctx.fillStyle = '#854d0e';
        ctx.fillRect(600, 0, 424, 450);
        // Blue irrigation canal in center
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(485, 0, 54, 1024);
      } else if (archetype === 'DISASTER') {
        // Fissured, fractured earth
        ctx.fillStyle = '#1c1917';
        ctx.fillRect(0, 0, 1024, 1024);
        // Fault fracture lines
        ctx.strokeStyle = '#0c0a09';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(100, 0); ctx.lineTo(340, 320); ctx.lineTo(600, 680); ctx.lineTo(900, 1024);
        ctx.stroke();
        // Muddy river gorge in center
        ctx.fillStyle = '#292524';
        ctx.fillRect(0, 460, 1024, 100);
        // Severed road
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(380, 0, 80, 460);
        ctx.fillRect(380, 560, 80, 464);
        // Emergency hazard tape
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.strokeRect(340, 440, 160, 140);
      } else {
        // MOUNTAIN default
        ctx.fillStyle = '#1c2430';
        ctx.fillRect(0, 0, 1024, 1024);
        ctx.strokeStyle = '#2d3d4f';
        ctx.lineWidth = 1.5;
        for (let c = 50; c < 1000; c += 40) {
          ctx.beginPath();
          ctx.arc(512, 512, c, 0, Math.PI * 2);
          ctx.stroke();
        }
        // Paved road
        ctx.fillStyle = '#263442';
        ctx.fillRect(470, 0, 84, 1024);
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 2;
        ctx.setLineDash([12, 12]);
        ctx.beginPath();
        ctx.moveTo(512, 0);
        ctx.lineTo(512, 1024);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    const groundTexture = new THREE.CanvasTexture(texCanvas);
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;

    const texturedMat = new THREE.MeshStandardMaterial({
      map: groundTexture,
      roughness: 0.78,
      metalness: 0.12,
    });

    const terrainMesh = new THREE.Mesh(geometry, texturedMat);
    terrainMesh.receiveShadow = true;
    terrainMesh.castShadow = true;
    envGroup.add(terrainMesh);
    terrainMeshRef.current = terrainMesh;

    // Additional Coastal Water Plane for QUARRY
    if (archetype === 'QUARRY') {
      const waterGeo = new THREE.PlaneGeometry(80, terrainSize);
      waterGeo.rotateX(-Math.PI / 2);
      const waterMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        roughness: 0.15,
        metalness: 0.85,
        transparent: true,
        opacity: 0.82,
      });
      const waterMesh = new THREE.Mesh(waterGeo, waterMat);
      waterMesh.position.set(65, -1.2, 0);
      envGroup.add(waterMesh);
    }

    // --- ARCHETYPE POINT CLOUD GENERATION ---
    const pointGeo = new THREE.BufferGeometry();
    const pointCount = 120000;
    const pointPositions = new Float32Array(pointCount * 3);
    const pointColors = new Float32Array(pointCount * 3);

    for (let p = 0; p < pointCount; p++) {
      const rx = (Math.random() - 0.5) * terrainSize;
      const rz = (Math.random() - 0.5) * terrainSize;
      const baseElevation = getElevation(rx, rz);
      const ry = baseElevation + (Math.random() - 0.5) * 0.8;

      pointPositions[p * 3] = rx;
      pointPositions[p * 3 + 1] = ry;
      pointPositions[p * 3 + 2] = rz;

      // Color mapping according to archetype
      if (archetype === 'AGRICULTURE') {
        // Emerald vegetation green to golden canopy
        pointColors[p * 3] = 0.1 + Math.random() * 0.15;
        pointColors[p * 3 + 1] = 0.65 + Math.random() * 0.25;
        pointColors[p * 3 + 2] = 0.2 + Math.random() * 0.15;
      } else if (archetype === 'QUARRY') {
        // Sandstone amber to coastal aqua
        if (rx > 45) {
          pointColors[p * 3] = 0.05; pointColors[p * 3 + 1] = 0.6; pointColors[p * 3 + 2] = 0.85;
        } else {
          pointColors[p * 3] = 0.85; pointColors[p * 3 + 1] = 0.65; pointColors[p * 3 + 2] = 0.35;
        }
      } else if (archetype === 'URBAN_CONSTRUCTION') {
        // Concrete slate to crane yellow
        if (ry > 10) {
          pointColors[p * 3] = 0.98; pointColors[p * 3 + 1] = 0.75; pointColors[p * 3 + 2] = 0.14;
        } else {
          pointColors[p * 3] = 0.22; pointColors[p * 3 + 1] = 0.74; pointColors[p * 3 + 2] = 0.97;
        }
      } else if (archetype === 'SUBSTATION') {
        // Electric violet to cyan
        pointColors[p * 3] = 0.45; pointColors[p * 3 + 1] = 0.65; pointColors[p * 3 + 2] = 0.95;
      } else if (archetype === 'DISASTER') {
        // Rubble amber and fissure red
        if (Math.abs(rz) < 14) {
          pointColors[p * 3] = 0.95; pointColors[p * 3 + 1] = 0.25; pointColors[p * 3 + 2] = 0.3;
        } else {
          pointColors[p * 3] = 0.35; pointColors[p * 3 + 1] = 0.75; pointColors[p * 3 + 2] = 0.8;
        }
      } else {
        // Mountain default
        const normY = THREE.MathUtils.clamp((ry - 2) / 30, 0, 1);
        pointColors[p * 3] = 0.22 + normY * 0.3;
        pointColors[p * 3 + 1] = 0.74 + normY * 0.2;
        pointColors[p * 3 + 2] = 0.97 - normY * 0.2;
      }
    }

    pointGeo.setAttribute('position', new THREE.BufferAttribute(pointPositions, 3));
    pointGeo.setAttribute('color', new THREE.BufferAttribute(pointColors, 3));

    const pointMat = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const pointCloud = new THREE.Points(pointGeo, pointMat);
    pointCloud.visible = mode === 'POINT CLOUD';
    envGroup.add(pointCloud);
    pointCloudRef.current = pointCloud;

    // Wireframe overlay
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const wireframeMesh = new THREE.Mesh(geometry, wireMat);
    wireframeMesh.position.y = 0.05;
    wireframeMesh.visible = mode === 'MESH' || mode === 'WIREFRAME';
    envGroup.add(wireframeMesh);
    wireframeMeshRef.current = wireframeMesh;

    // --- 3D DETECTED OBJECTS & BOUNDING BOXES ---
    const bboxesGroup = new THREE.Group();
    envGroup.add(bboxesGroup);
    bboxesGroupRef.current = bboxesGroup;

    // Specific Archetype 3D Models
    if (archetype === 'URBAN_CONSTRUCTION') {
      // Potain Tower Crane 3D model
      const craneGroup = new THREE.Group();
      craneGroup.position.set(-4, 1.2, 2);

      // Vertical lattice mast (48m)
      const mastGeo = new THREE.BoxGeometry(2.4, 48, 2.4);
      const mastMat = new THREE.MeshStandardMaterial({ color: 0xFBBF24, metalness: 0.7, roughness: 0.3 });
      const mast = new THREE.Mesh(mastGeo, mastMat);
      mast.position.y = 24;
      craneGroup.add(mast);

      // Horizontal Jib boom (46m extending forward)
      const jibGeo = new THREE.BoxGeometry(46, 1.4, 1.4);
      const jib = new THREE.Mesh(jibGeo, mastMat);
      jib.position.set(16, 48, 0);
      craneGroup.add(jib);

      // Counter-jib with counterweights
      const counterJibGeo = new THREE.BoxGeometry(16, 1.4, 1.4);
      const counterJib = new THREE.Mesh(counterJibGeo, mastMat);
      counterJib.position.set(-10, 48, 0);
      craneGroup.add(counterJib);

      const weightGeo = new THREE.BoxGeometry(5, 3, 2.2);
      const weightMat = new THREE.MeshStandardMaterial({ color: 0x64748B });
      const weights = new THREE.Mesh(weightGeo, weightMat);
      weights.position.set(-15, 47, 0);
      craneGroup.add(weights);

      // Hook cable
      const cableGeo = new THREE.CylinderGeometry(0.08, 0.08, 24);
      const cableMat = new THREE.MeshBasicMaterial({ color: 0x38BDF8 });
      const cable = new THREE.Mesh(cableGeo, cableMat);
      cable.position.set(22, 36, 0);
      craneGroup.add(cable);

      bboxesGroup.add(craneGroup);
    } else if (archetype === 'AGRICULTURE') {
      // Twin grain silos
      const silo1 = new THREE.Mesh(
        new THREE.CylinderGeometry(4, 4, 18, 24),
        new THREE.MeshStandardMaterial({ color: 0x94A3B8, metalness: 0.85, roughness: 0.2 })
      );
      silo1.position.set(-20, 10.5, -14);
      const siloRoof1 = new THREE.Mesh(
        new THREE.ConeGeometry(4.2, 3.5, 24),
        new THREE.MeshStandardMaterial({ color: 0x64748B, metalness: 0.9 })
      );
      siloRoof1.position.set(-20, 21.2, -14);
      bboxesGroup.add(silo1, siloRoof1);
    } else if (archetype === 'SUBSTATION') {
      // Transformer Radiator Banks & Bushings
      [-14, 14].forEach((tx) => {
        const transGroup = new THREE.Group();
        transGroup.position.set(tx, 5.0, -6);
        const tank = new THREE.Mesh(
          new THREE.BoxGeometry(8, 6, 6),
          new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.6, roughness: 0.4 })
        );
        transGroup.add(tank);
        // Bushing cones
        [-2, 0, 2].forEach((bx) => {
          const bushing = new THREE.Mesh(
            new THREE.ConeGeometry(0.4, 2.8, 12),
            new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.3 })
          );
          bushing.position.set(bx, 4.4, 0);
          transGroup.add(bushing);
        });
        bboxesGroup.add(transGroup);
      });
    }

    // Render detected 3D bounding boxes from mission objects
    objects.forEach((obj) => {
      const { length, width, height } = obj.dimensions;
      const [ox, oy, oz] = obj.position;

      const boxGeo = new THREE.BoxGeometry(length, height, width);
      const color =
        obj.category === 'Building' ? 0x818cf8 :
        obj.category === 'Tower' ? 0xfbbf24 :
        obj.category === 'Vehicle' ? 0x38bdf8 :
        obj.category === 'Water' ? 0x5eead4 :
        obj.category === 'Infrastructure' ? 0x34d399 : 0xa78bfa;

      const objMat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.4,
        metalness: 0.3,
        transparent: true,
        opacity: 0.85,
      });
      const objMesh = new THREE.Mesh(boxGeo, objMat);
      objMesh.position.set(ox, oy, oz);
      objMesh.castShadow = true;
      objMesh.receiveShadow = true;
      bboxesGroup.add(objMesh);

      // Edge wireframe
      const edgeGeo = new THREE.EdgesGeometry(boxGeo);
      const edgeMat = new THREE.LineBasicMaterial({
        color: obj.id === selectedObjectId ? 0x5eead4 : color,
        linewidth: obj.id === selectedObjectId ? 3 : 1,
      });
      const edgeLine = new THREE.LineSegments(edgeGeo, edgeMat);
      edgeLine.position.copy(objMesh.position);
      bboxesGroup.add(edgeLine);
    });

    // --- 3D MEASUREMENTS ANNOTATIONS ---
    const measurementsGroup = new THREE.Group();
    envGroup.add(measurementsGroup);
    measurementsGroupRef.current = measurementsGroup;

    measurements.forEach((m) => {
      if (m.points && m.points.length >= 2) {
        const p1 = new THREE.Vector3(...m.points[0]);
        const p2 = new THREE.Vector3(...m.points[1]);

        const lineGeo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
        const lineMat = new THREE.LineDashedMaterial({
          color: 0x5eead4,
          dashSize: 1.5,
          gapSize: 0.8,
          linewidth: 2,
        });
        const line = new THREE.Line(lineGeo, lineMat);
        line.computeLineDistances();
        measurementsGroup.add(line);

        [p1, p2].forEach((p) => {
          const pin = new THREE.Mesh(
            new THREE.SphereGeometry(0.7, 16, 16),
            new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
          );
          pin.position.copy(p);
          measurementsGroup.add(pin);
        });
      }
    });

    // --- ARCHETYPE FLIGHT PATH TRAJECTORY SPLINE ---
    const flightGroup = new THREE.Group();
    envGroup.add(flightGroup);
    flightPathGroupRef.current = flightGroup;

    let flightPoints: THREE.Vector3[] = [];
    if (archetype === 'QUARRY') {
      // Orbital circular sweep around the pit
      flightPoints = [
        new THREE.Vector3(50, 36, 0),
        new THREE.Vector3(35, 36, 40),
        new THREE.Vector3(-15, 36, 45),
        new THREE.Vector3(-45, 36, 10),
        new THREE.Vector3(-35, 36, -35),
        new THREE.Vector3(15, 36, -45),
        new THREE.Vector3(50, 36, 0),
      ];
    } else if (archetype === 'URBAN_CONSTRUCTION') {
      // Rectangular building perimeter scan
      flightPoints = [
        new THREE.Vector3(-35, 55, -35),
        new THREE.Vector3(35, 55, -35),
        new THREE.Vector3(35, 55, 35),
        new THREE.Vector3(-35, 55, 35),
        new THREE.Vector3(-35, 35, 35),
        new THREE.Vector3(35, 35, 35),
      ];
    } else if (archetype === 'AGRICULTURE') {
      // Lawnmower parallel survey lines
      flightPoints = [
        new THREE.Vector3(-55, 38, -45),
        new THREE.Vector3(55, 38, -45),
        new THREE.Vector3(55, 38, -15),
        new THREE.Vector3(-55, 38, -15),
        new THREE.Vector3(-55, 38, 15),
        new THREE.Vector3(55, 38, 15),
        new THREE.Vector3(55, 38, 45),
        new THREE.Vector3(-55, 38, 45),
      ];
    } else if (archetype === 'SUBSTATION') {
      // Pylon corridor inspection loop
      flightPoints = [
        new THREE.Vector3(-45, 32, -30),
        new THREE.Vector3(-15, 28, -6),
        new THREE.Vector3(0, 34, 18),
        new THREE.Vector3(15, 28, -6),
        new THREE.Vector3(45, 32, 25),
      ];
    } else if (archetype === 'DISASTER') {
      // Canyon gorge reconnaissance
      flightPoints = [
        new THREE.Vector3(-50, 32, -15),
        new THREE.Vector3(-20, 24, 0),
        new THREE.Vector3(0, 18, 0),
        new THREE.Vector3(20, 24, 0),
        new THREE.Vector3(50, 32, 15),
      ];
    } else {
      // Mountain ridge traverse
      flightPoints = [
        new THREE.Vector3(-60, 42, -50),
        new THREE.Vector3(-35, 38, -30),
        new THREE.Vector3(-10, 35, -5),
        new THREE.Vector3(15, 36, 15),
        new THREE.Vector3(45, 40, 40),
        new THREE.Vector3(65, 45, 60),
      ];
    }

    const flightCurve = new THREE.CatmullRomCurve3(flightPoints);
    flightCurveRef.current = flightCurve;

    const curvePoints = flightCurve.getPoints(120);
    const curveGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const curveMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 });
    const trajectoryLine = new THREE.Line(curveGeo, curveMat);
    flightGroup.add(trajectoryLine);

    // Camera pose pyramids along spline
    curvePoints.filter((_, idx) => idx % 8 === 0).forEach((pt) => {
      const coneGeo = new THREE.ConeGeometry(1.2, 2.5, 4);
      coneGeo.rotateX(Math.PI);
      const coneMat = new THREE.MeshBasicMaterial({ color: 0x818cf8, wireframe: true });
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.position.copy(pt);
      flightGroup.add(cone);
    });

    // Drone 3D model
    const droneGroup = new THREE.Group();
    const droneBody = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.6, 2.4),
      new THREE.MeshStandardMaterial({ color: 0x111821, metalness: 0.8, roughness: 0.2 })
    );
    droneGroup.add(droneBody);

    const arm1 = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 0.2, 0.3),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    const arm2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.2, 4.2),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    droneGroup.add(arm1, arm2);

    const spotCone = new THREE.Mesh(
      new THREE.ConeGeometry(14, 28, 16, 1, true),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.12, side: THREE.DoubleSide })
    );
    spotCone.geometry.rotateX(Math.PI);
    spotCone.position.y = -14;
    droneGroup.add(spotCone);

    flightGroup.add(droneGroup);
    droneMeshRef.current = droneGroup;

    // Reset controls target to center
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 5, 0);
      controlsRef.current.update();
    }
  }, [archetype, mission?.id, objects.length]);

  // 3. UPDATE RENDERING MODES (TEXTURED, MESH, WIREFRAME, POINT CLOUD, CONFIDENCE)
  useEffect(() => {
    if (!terrainMeshRef.current || !pointCloudRef.current || !wireframeMeshRef.current) return;

    const terrain = terrainMeshRef.current;
    const points = pointCloudRef.current;
    const wireframe = wireframeMeshRef.current;

    if (mode === 'TEXTURED') {
      terrain.visible = true;
      points.visible = false;
      wireframe.visible = false;
      const mat = terrain.material as THREE.MeshStandardMaterial;
      mat.vertexColors = false;
      mat.roughness = 0.75;
      mat.wireframe = false;
      mat.needsUpdate = true;
    } else if (mode === 'MESH') {
      terrain.visible = true;
      points.visible = false;
      wireframe.visible = true;
      const mat = terrain.material as THREE.MeshStandardMaterial;
      mat.vertexColors = false;
      mat.color.setHex(0x192532);
      mat.wireframe = false;
      mat.needsUpdate = true;
    } else if (mode === 'WIREFRAME') {
      terrain.visible = false;
      points.visible = false;
      wireframe.visible = true;
      const mat = wireframe.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.65;
    } else if (mode === 'POINT CLOUD') {
      terrain.visible = false;
      points.visible = true;
      wireframe.visible = false;
    } else if (mode === 'CONFIDENCE') {
      terrain.visible = true;
      points.visible = false;
      wireframe.visible = false;
      const mat = terrain.material as THREE.MeshStandardMaterial;
      mat.vertexColors = true;
      mat.roughness = 0.5;
      mat.wireframe = false;
      mat.needsUpdate = true;
    }
  }, [mode]);

  // 4. VISIBILITY TOGGLES
  useEffect(() => {
    if (gridHelperRef.current) gridHelperRef.current.visible = showGrid;
    if (axesHelperRef.current) axesHelperRef.current.visible = showAxes;
    if (bboxesGroupRef.current) bboxesGroupRef.current.visible = showBBoxes;
    if (measurementsGroupRef.current) measurementsGroupRef.current.visible = showMeasurePins;
    if (flightPathGroupRef.current) flightPathGroupRef.current.visible = showFlightPath;
  }, [showGrid, showAxes, showBBoxes, showMeasurePins, showFlightPath]);

  // 5. SUNLIGHT AZIMUTH
  useEffect(() => {
    if (!dirLightRef.current) return;
    const rad = (sunlightAngle * Math.PI) / 180;
    dirLightRef.current.position.set(Math.cos(rad) * 90, 80, Math.sin(rad) * 90);
  }, [sunlightAngle]);

  // Camera Presets
  const setCameraView = (preset: 'Perspective' | 'Top' | 'Front' | 'Side' | 'Drone') => {
    if (!cameraRef.current || !controlsRef.current) return;
    setActiveCameraPreset(preset);

    if (preset === 'Perspective') {
      cameraRef.current.position.set(70, 55, 80);
      controlsRef.current.target.set(0, 5, 0);
    } else if (preset === 'Top') {
      cameraRef.current.position.set(0, 140, 0.1);
      controlsRef.current.target.set(0, 0, 0);
    } else if (preset === 'Front') {
      cameraRef.current.position.set(0, 20, 110);
      controlsRef.current.target.set(0, 10, 0);
    } else if (preset === 'Side') {
      cameraRef.current.position.set(110, 20, 0);
      controlsRef.current.target.set(0, 10, 0);
    } else if (preset === 'Drone') {
      if (droneMeshRef.current) {
        const p = droneMeshRef.current.position;
        cameraRef.current.position.set(p.x, p.y + 2, p.z);
        controlsRef.current.target.set(p.x + 10, p.y - 20, p.z + 10);
      }
    }
    controlsRef.current.update();
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const archetypeBadge = {
    MOUNTAIN: { label: '🏔️ ALPINE RIDGE & OUTPOST', color: '#38BDF8' },
    URBAN_CONSTRUCTION: { label: '🏗️ URBAN TRANSIT & CRANE SITE', color: '#FBBF24' },
    QUARRY: { label: '⛏️ TERRACED COASTAL QUARRY', color: '#5EEAD4' },
    SUBSTATION: { label: '⚡ 400KV INDUSTRIAL SUBSTATION', color: '#818CF8' },
    AGRICULTURE: { label: '🌾 AGRO CANOPY & CROP FURROWS', color: '#34D399' },
    DISASTER: { label: '⚠️ SEISMIC FAULT & BRIDGE COLLAPSE', color: '#FB7185' },
  }[archetype];

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: isMiniView ? '340px' : '540px',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid var(--border-default)',
        backgroundColor: '#080B10',
      }}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

      {/* TOP LEFT: ENVIRONMENT DIGITAL TWIN BADGE & VIEWER MODES */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        zIndex: 10,
      }}>
        {/* ACTIVE 3D ENVIRONMENT ARCHETYPE BADGE */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(13, 17, 24, 0.9)',
          backdropFilter: 'blur(8px)',
          border: `1px solid ${archetypeBadge.color}`,
          borderRadius: '4px',
          padding: '4px 10px',
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          fontWeight: '600',
          color: archetypeBadge.color,
          boxShadow: `0 0 12px ${archetypeBadge.color}33`,
        }}>
          <span>{archetypeBadge.label}</span>
          {mission && (
            <span style={{ color: '#94A3B8', fontWeight: '400' }}>
              • {mission.video?.resolution?.split(' ')[0] || '4K'}
            </span>
          )}
        </div>

        {/* VIEWER MODE TABS */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: 'rgba(13, 17, 24, 0.85)',
          backdropFilter: 'blur(8px)',
          padding: '4px',
          borderRadius: '6px',
          border: '1px solid #263442',
        }}>
          {(['TEXTURED', 'MESH', 'WIREFRAME', 'POINT CLOUD', 'CONFIDENCE'] as ViewerMode[]).map((m) => (
            <button
              key={m}
              onClick={() => onModeChange(m)}
              style={{
                padding: '4px 8px',
                fontSize: '10px',
                fontFamily: 'var(--font-mono)',
                fontWeight: mode === m ? '600' : '400',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                color: mode === m ? '#FFFFFF' : '#94A3B8',
                background: mode === m
                  ? (m === 'CONFIDENCE' ? 'linear-gradient(135deg, #0d9488 0%, #0369a1 100%)' : '#1C2733')
                  : 'transparent',
                transition: 'all 0.15s ease',
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* TOP RIGHT: CAMERA PRESETS & FULLSCREEN */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: 'rgba(13, 17, 24, 0.85)',
        backdropFilter: 'blur(8px)',
        padding: '4px 6px',
        borderRadius: '6px',
        border: '1px solid #263442',
        zIndex: 10,
      }}>
        {(['Perspective', 'Top', 'Front', 'Side', 'Drone'] as const).map((view) => (
          <button
            key={view}
            onClick={() => setCameraView(view)}
            style={{
              padding: '4px 8px',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              color: activeCameraPreset === view ? '#38BDF8' : '#94A3B8',
              background: activeCameraPreset === view ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
            }}
          >
            {view}
          </button>
        ))}

        <div style={{ width: '1px', height: '18px', backgroundColor: '#263442', margin: '0 2px' }} />

        <button
          onClick={() => setCameraView('Perspective')}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94A3B8',
            cursor: 'pointer',
            padding: '3px',
          }}
          title="Reset Camera Orientation"
        >
          <RotateCcw size={14} />
        </button>

        <button
          onClick={toggleFullscreen}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94A3B8',
            cursor: 'pointer',
            padding: '3px',
          }}
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </button>
      </div>

      {/* BOTTOM LEFT: SCENE CONTROLS & TOGGLES */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        left: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: 'rgba(13, 17, 24, 0.85)',
        backdropFilter: 'blur(8px)',
        padding: '6px 10px',
        borderRadius: '6px',
        border: '1px solid #263442',
        zIndex: 10,
      }}>
        <button
          onClick={() => setShowGrid(!showGrid)}
          className="btn btn-outline btn-sm"
          style={{
            padding: '3px 8px',
            color: showGrid ? '#38BDF8' : '#64748B',
            borderColor: showGrid ? 'rgba(56, 189, 248, 0.4)' : '#263442',
          }}
        >
          <Grid size={13} />
          <span>Grid</span>
        </button>

        <button
          onClick={() => setShowAxes(!showAxes)}
          className="btn btn-outline btn-sm"
          style={{
            padding: '3px 8px',
            color: showAxes ? '#38BDF8' : '#64748B',
            borderColor: showAxes ? 'rgba(56, 189, 248, 0.4)' : '#263442',
          }}
        >
          <Crosshair size={13} />
          <span>Axes</span>
        </button>

        <button
          onClick={() => setShowBBoxes(!showBBoxes)}
          className="btn btn-outline btn-sm"
          style={{
            padding: '3px 8px',
            color: showBBoxes ? '#5EEAD4' : '#64748B',
            borderColor: showBBoxes ? 'rgba(94, 234, 212, 0.4)' : '#263442',
          }}
        >
          <Eye size={13} />
          <span>Objects</span>
        </button>

        <button
          onClick={() => setShowMeasurePins(!showMeasurePins)}
          className="btn btn-outline btn-sm"
          style={{
            padding: '3px 8px',
            color: showMeasurePins ? '#818CF8' : '#64748B',
            borderColor: showMeasurePins ? 'rgba(129, 140, 248, 0.4)' : '#263442',
          }}
        >
          <Sliders size={13} />
          <span>Measurements</span>
        </button>

        {/* Sunlight Angle Slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '6px' }}>
          <Sun size={13} style={{ color: '#FBBF24' }} />
          <input
            type="range"
            min="0"
            max="360"
            value={sunlightAngle}
            onChange={(e) => setSunlightAngle(Number(e.target.value))}
            style={{ width: '60px', accentColor: '#38BDF8' }}
            title="Adjust Sun Azimuth"
          />
        </div>
      </div>

      {/* BOTTOM RIGHT: CONFIDENCE LEGEND (Active in CONFIDENCE Mode) */}
      {mode === 'CONFIDENCE' && (
        <div style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          background: 'rgba(13, 17, 24, 0.9)',
          backdropFilter: 'blur(8px)',
          border: '1px solid #263442',
          borderRadius: '6px',
          padding: '8px 12px',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}>
          <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: '#94A3B8', textTransform: 'uppercase' }}>
            Vertex Confidence Heatmap
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#34D399' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#34D399' }} />
              High (&gt;85%)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#FBBF24' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FBBF24' }} />
              Med (70-85%)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#FB7185' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FB7185' }} />
              Low (&lt;70%)
            </span>
          </div>
        </div>
      )}

      {/* MINI OVERLAY: Selected Object Badge */}
      {selectedObjectId && (
        <div style={{
          position: 'absolute',
          top: '78px',
          left: '12px',
          background: 'rgba(17, 24, 33, 0.94)',
          border: '1px solid #38BDF8',
          borderRadius: '6px',
          padding: '8px 12px',
          zIndex: 10,
          boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
        }}>
          {(() => {
            const obj = objects.find((o) => o.id === selectedObjectId);
            if (!obj) return null;
            return (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#F1F5F9' }}>{obj.name}</span>
                  <span className="badge badge-cyan">{obj.category}</span>
                </div>
                <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#5EEAD4', marginTop: '2px' }}>
                  Confidence: {obj.confidence}% • Pos: [{obj.position.join(', ')}]
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
