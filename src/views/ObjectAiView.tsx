import React, { useState } from 'react';
import {
  ScanEye,
  MessageSquare,
  Search,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Box,
  MapPin,
  Ruler,
  CornerDownLeft,
} from 'lucide-react';
import { MissionData, DetectedObject, ViewerMode } from '../types';
import { ThreeDCanvas } from '../components/Viewers/ThreeDCanvas';

interface ObjectAiViewProps {
  mission: MissionData;
  viewerMode: ViewerMode;
  onViewerModeChange: (m: ViewerMode) => void;
}

export const ObjectAiView: React.FC<ObjectAiViewProps> = ({
  mission,
  viewerMode,
  onViewerModeChange,
}) => {
  const [selectedObjectId, setSelectedObjectId] = useState<string>('obj-b1');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');
  const [nlQuery, setNlQuery] = useState('');
  const [queryAnswer, setQueryAnswer] = useState<{
    query: string;
    answer: string;
    highlightedId?: string;
    confidence: number;
    sources: string[];
  } | null>({
    query: 'What is the tallest detected structure?',
    answer: 'The tallest detected structure is the Microwave Communication Mast (obj-t1), with a photogrammetrically estimated height of 32.4 m ± 1.8 m (Confidence: 94.7%). It is located on the elevated western ridgeline at coordinates [-12, 16.8, 5].',
    highlightedId: 'obj-t1',
    confidence: 94.7,
    sources: ['3D Bounding Box Vertices', 'Base-to-Tip Photogrammetric Ray Triangulation'],
  });

  const categories = ['ALL', 'Building', 'Vehicle', 'Tower', 'Road', 'Water', 'Vegetation'];

  const filteredObjects = mission.objects.filter((obj) => {
    if (selectedCategoryFilter === 'ALL') return true;
    return obj.category === selectedCategoryFilter;
  });

  const selectedObject = mission.objects.find((o) => o.id === selectedObjectId);

  // Handle Natural Language Scene Query (Section 23)
  const handleRunQuery = (queryText: string) => {
    const q = (queryText || nlQuery).toLowerCase().trim();
    if (!q) return;

    if (q.includes('tallest') || q.includes('height') || q.includes('tower')) {
      setQueryAnswer({
        query: queryText || nlQuery,
        answer: 'The tallest structure is the Microwave Communication Mast (obj-t1) with an estimated height of 32.4 m ± 1.8 m (Confidence: 94.7%). It stands at coordinates [-12, 16.8, 5].',
        highlightedId: 'obj-t1',
        confidence: 94.7,
        sources: ['SfM Mesh Vertices', 'Height Measurement Record (m-height)'],
      });
      setSelectedObjectId('obj-t1');
    } else if (q.includes('vehicle') || q.includes('car') || q.includes('truck') || q.includes('north entrance')) {
      const vehs = mission.objects.filter((o) => o.category === 'Vehicle');
      setQueryAnswer({
        query: queryText || nlQuery,
        answer: `Detected ${vehs.length} field survey vehicles in the active perimeter. Survey Logistics Vehicle A (obj-v1, length 4.5m ± 0.15m) is currently serving as an active visual scale prior anchor.`,
        highlightedId: 'obj-v1',
        confidence: 97.5,
        sources: ['YOLOv8-3D Semantic Bounding Boxes', 'Vehicle Scale Anchor Prior'],
      });
      setSelectedObjectId('obj-v1');
    } else if (q.includes('confidence') || q.includes('lowest') || q.includes('unreliable')) {
      setQueryAnswer({
        query: queryText || nlQuery,
        answer: 'The South Area has the lowest reconstruction confidence at 62% (Low Confidence). The primary causes are low texture on the steep scree slope and solar shadow occlusion.',
        highlightedId: undefined,
        confidence: 91.0,
        sources: ['Ray Covariance Heatmap', 'Regional Confidence Registry'],
      });
    } else if (q.includes('distance') || q.includes('facility') || q.includes('outpost') || q.includes('span')) {
      setQueryAnswer({
        query: queryText || nlQuery,
        answer: 'The estimated Euclidean geodesic distance between the Main Operations Facility (obj-b1) and the Equipment Depot (obj-b2) is 47.8 m ± 2.3 m (Confidence: 89%).',
        highlightedId: 'obj-b1',
        confidence: 89.0,
        sources: ['Multi-view Geodesic Baseline', 'Measurement Record (m-dist)'],
      });
      setSelectedObjectId('obj-b1');
    } else if (q.includes('change') || q.includes('before') || q.includes('after')) {
      setQueryAnswer({
        query: queryText || nlQuery,
        answer: 'Change detection highlights 7 structural changes against the 30-day baseline: 2 NEW structures (North Logistics Annex), 1 REMOVED earthwork berm, and 3 MODIFIED facilities. South slope is flagged as UNCERTAIN change.',
        highlightedId: undefined,
        confidence: 92.4,
        sources: ['Bi-temporal Point Cloud M3C2 Differencing', 'Change Detection Log'],
      });
    } else {
      setQueryAnswer({
        query: queryText || nlQuery,
        answer: 'Insufficient evidence in the reconstructed scene to answer this specific query with required statistical confidence.',
        highlightedId: undefined,
        confidence: 0,
        sources: ['Reconstruction Database Query Limit'],
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-indigo">Semantic 3D Intelligence</span>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#94A3B8' }}>
              DEEP CV DETECTOR & SCENE LLM
            </span>
          </div>
          <h1 style={{ fontSize: '24px', color: '#F1F5F9', marginTop: '4px', margin: 0 }}>
            Object Intelligence & Natural Language 3D Scene Query
          </h1>
          <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '2px' }}>
            Automatic detection of structures, infrastructure, vehicles, and conversational 3D spatial reasoning.
          </p>
        </div>
      </div>

      {/* SECTION 23: NATURAL LANGUAGE 3D SCENE QUERY BOX */}
      <div className="aero-card" style={{ padding: '18px 20px', borderColor: 'rgba(129, 140, 248, 0.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Sparkles size={16} style={{ color: '#818CF8' }} />
          <h3 style={{ fontSize: '14px', color: '#F1F5F9' }}>
            Scene Intelligence — Natural-Language 3D Spatial Query
          </h3>
          <span className="badge badge-indigo" style={{ fontSize: '10px' }}>Grounded AI</span>
        </div>

        {/* Input Bar */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <MessageSquare size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#818CF8' }} />
            <input
              type="text"
              value={nlQuery}
              onChange={(e) => setNlQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRunQuery(nlQuery)}
              placeholder="Ask about this reconstructed environment (e.g., 'What is the tallest detected structure?')"
              style={{
                width: '100%',
                height: '42px',
                backgroundColor: '#111821',
                border: '1px solid #263442',
                borderRadius: '6px',
                paddingLeft: '38px',
                paddingRight: '14px',
                color: '#F1F5F9',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>

          <button
            onClick={() => handleRunQuery(nlQuery)}
            className="btn btn-primary"
            style={{ minWidth: '120px' }}
          >
            <span>Ask Scene</span>
            <CornerDownLeft size={14} />
          </button>
        </div>

        {/* Preset Query Chips (Section 23) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
          <span style={{ fontSize: '11px', color: '#64748B' }}>Suggested Queries:</span>
          {[
            'What is the tallest detected structure?',
            'How many vehicles are near the north entrance?',
            'Which region has the lowest reconstruction confidence?',
            'What is the estimated distance between these two structures?',
            'Show areas affected by change detection.',
          ].map((prompt) => (
            <button
              key={prompt}
              onClick={() => {
                setNlQuery(prompt);
                handleRunQuery(prompt);
              }}
              style={{
                fontSize: '11px',
                padding: '3px 8px',
                backgroundColor: '#111821',
                border: '1px solid #263442',
                borderRadius: '4px',
                color: '#94A3B8',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#38BDF8';
                e.currentTarget.style.borderColor = '#38BDF8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#94A3B8';
                e.currentTarget.style.borderColor = '#263442';
              }}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* AI GROUNDED RESPONSE CARD */}
        {queryAnswer && (
          <div style={{
            marginTop: '16px',
            backgroundColor: '#111821',
            border: '1px solid #263442',
            borderLeft: `4px solid ${queryAnswer.confidence > 0 ? '#38BDF8' : '#FB7185'}`,
            borderRadius: '6px',
            padding: '14px 16px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <div style={{ fontSize: '11px', color: '#818CF8', fontFamily: 'var(--font-mono)' }}>
                QUERY RESULT: “{queryAnswer.query}”
              </div>
              {queryAnswer.confidence > 0 && (
                <span className="badge badge-cyan" style={{ fontSize: '10px' }}>
                  Confidence: {queryAnswer.confidence}%
                </span>
              )}
            </div>

            <div style={{ fontSize: '13px', color: '#F1F5F9', lineHeight: '1.6' }}>
              {queryAnswer.answer}
            </div>

            {queryAnswer.sources.length > 0 && (
              <div style={{ marginTop: '8px', fontSize: '10px', color: '#64748B', display: 'flex', gap: '12px' }}>
                <span>Grounding Sources:</span>
                {queryAnswer.sources.map((s) => (
                  <span key={s} style={{ color: '#5EEAD4', fontFamily: 'var(--font-mono)' }}>
                    • {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* OBJECT LISTING & 3D VIEWER */}
      <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: '20px' }}>
        {/* LEFT: DETECTED OBJECTS REPOSITORY (Section 22) */}
        <div className="aero-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#64748B', fontFamily: 'var(--font-mono)' }}>CLASSIFIED ENTITIES</div>
              <h3 style={{ fontSize: '15px', color: '#F1F5F9' }}>Detected 3D Objects ({mission.objects.length})</h3>
            </div>

            {/* Filter pills */}
            <div style={{ display: 'flex', gap: '4px', overflowX: 'auto' }}>
              {categories.slice(0, 4).map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCategoryFilter(c)}
                  style={{
                    padding: '3px 6px',
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                    color: selectedCategoryFilter === c ? '#38BDF8' : '#94A3B8',
                    background: selectedCategoryFilter === c ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* OBJECTS LIST */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '440px', overflowY: 'auto' }}>
            {filteredObjects.map((obj) => {
              const isSelected = selectedObjectId === obj.id;
              return (
                <div
                  key={obj.id}
                  onClick={() => setSelectedObjectId(obj.id)}
                  style={{
                    padding: '12px 14px',
                    backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.08)' : '#111821',
                    border: `1px solid ${isSelected ? '#38BDF8' : '#263442'}`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Box size={14} style={{ color: isSelected ? '#38BDF8' : '#818CF8' }} />
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#F1F5F9' }}>
                        {obj.name}
                      </span>
                    </div>
                    <span className="badge badge-cyan" style={{ fontSize: '9px' }}>
                      {obj.category}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                    <span style={{ color: '#94A3B8' }}>
                      Dim: {obj.dimensions.length}m × {obj.dimensions.width}m × {obj.dimensions.height}m
                    </span>
                    <span style={{ color: '#34D399', fontWeight: '600' }}>
                      {obj.confidence}% Conf
                    </span>
                  </div>

                  {isSelected && (
                    <div style={{
                      marginTop: '8px',
                      paddingTop: '6px',
                      borderTop: '1px solid #1C2733',
                      fontSize: '10px',
                      color: '#64748B',
                      fontFamily: 'var(--font-mono)',
                    }}>
                      Position: [{obj.position.join(', ')}] • Uncertainty: ±{obj.dimensions.uncertainty}m
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: 3D VIEWER HIGHLIGHTING SELECTED OBJECT */}
        <div className="aero-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#F1F5F9' }}>
              3D Spatial Context & Bounding Boxes
            </span>
            {selectedObject && (
              <span className="badge badge-teal">
                Focused: {selectedObject.name}
              </span>
            )}
          </div>

          <ThreeDCanvas
            mode={viewerMode}
            onModeChange={onViewerModeChange}
            mission={mission}
            objects={mission.objects}
            selectedObjectId={selectedObjectId}
            onSelectObject={setSelectedObjectId}
          />
        </div>
      </div>
    </div>
  );
};
