import { ChangeDetectionFeature } from '../types';

export interface ChangeDetectionDataset {
  baselineMission: string;
  baselineDate: string;
  currentMission: string;
  currentDate: string;
  alignmentRmsResidualM: number;
  overallChangeConfidencePct: number;
  features: ChangeDetectionFeature[];
  summary: {
    unchangedCount: number;
    newCount: number;
    modifiedCount: number;
    removedCount: number;
    uncertainCount: number;
    volumetricNetChangeM3: number;
  };
}

export const CHANGE_DETECTION_DATA: ChangeDetectionDataset = {
  baselineMission: 'Mountain Survey Baseline (Alpha Pass)',
  baselineDate: '2026-08-14',
  currentMission: 'Mountain Survey 024 (Current Pass)',
  currentDate: '2026-09-24',
  alignmentRmsResidualM: 0.14,
  overallChangeConfidencePct: 92.4,
  summary: {
    unchangedCount: 14,
    newCount: 2,
    modifiedCount: 3,
    removedCount: 1,
    uncertainCount: 2,
    volumetricNetChangeM3: 412.5,
  },
  features: [
    {
      id: 'chg-1',
      name: 'North Logistics Modular Annex',
      status: 'NEW',
      category: 'Structure',
      areaDeltaM2: 142.0,
      heightDeltaM: 4.8,
      confidence: 96.5,
      description: 'Newly constructed prefabricated modular laboratory unit on reinforced concrete slab.',
      location: 'North-West Quad (Sector A)',
      coordinates: [-28, 4.8, -10],
    },
    {
      id: 'chg-2',
      name: 'Equipment Maintenance Depot Roof',
      status: 'MODIFIED',
      category: 'Structure',
      areaDeltaM2: 85.0,
      heightDeltaM: 0.9,
      confidence: 93.8,
      description: 'Roof truss retrofitted with secondary composite insulation paneling & HVAC ducting.',
      location: 'Central Depot Area',
      coordinates: [16, 4.5, -8],
    },
    {
      id: 'chg-3',
      name: 'Temporary Earthwork Retaining Berm',
      status: 'REMOVED',
      category: 'Terrain / Earthwork',
      areaDeltaM2: -210.0,
      heightDeltaM: -2.4,
      confidence: 94.1,
      description: 'Temporary gravel embankment graded flat for perimeter road expansion.',
      location: 'South-East Road Curve',
      coordinates: [24, 1.8, 12],
    },
    {
      id: 'chg-4',
      name: 'Primary Operations Facility',
      status: 'UNCHANGED',
      category: 'Structure',
      areaDeltaM2: 0.0,
      heightDeltaM: 0.0,
      confidence: 98.7,
      description: 'Zero structural deformation detected within ±0.03m sensor noise floor.',
      location: 'Central Compound',
      coordinates: [-18, 4.2, -12],
    },
    {
      id: 'chg-5',
      name: 'Microwave Lattice Mast',
      status: 'UNCHANGED',
      category: 'Infrastructure',
      areaDeltaM2: 0.0,
      heightDeltaM: 0.0,
      confidence: 97.2,
      description: 'Verticality check nominal; sway deviation under 0.05° from zenith.',
      location: 'Elevated Western Ridge',
      coordinates: [-12, 16.8, 5],
    },
    {
      id: 'chg-6',
      name: 'South Escarpment Shadow Gully',
      status: 'UNCERTAIN',
      category: 'Terrain',
      areaDeltaM2: 45.0,
      heightDeltaM: -1.2,
      confidence: 58.2,
      description: 'Low local photogrammetric confidence due to steep solar shadow; possible minor rockfall, requires targeted re-flight.',
      location: 'South Face Ravine',
      coordinates: [2, 8.5, -35],
    },
    {
      id: 'chg-7',
      name: 'Runoff Retention Basin Water Level',
      status: 'MODIFIED',
      category: 'Water / Hydrology',
      areaDeltaM2: 38.0,
      heightDeltaM: 0.45,
      confidence: 91.0,
      description: 'Surface water pool expanded by 38m² post seasonal precipitation.',
      location: 'East Catchment Depression',
      coordinates: [35, 1.2, -28],
    },
  ],
};
