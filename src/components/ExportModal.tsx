import React, { useState } from 'react';
import { X, Download, FileSpreadsheet, Box, Globe, FileText, CheckCircle2, Info } from 'lucide-react';
import { MissionData } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  mission: MissionData;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  mission,
}) => {
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);
  const [downloadedFormats, setDownloadedFormats] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleDownload = (format: string, filename: string, content: string, mime: string) => {
    setDownloadingFormat(format);
    setTimeout(() => {
      const blob = new Blob([content], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadingFormat(null);
      setDownloadedFormats((prev) => [...prev, format]);
    }, 600);
  };

  const sampleGeoJson = JSON.stringify({
    type: "FeatureCollection",
    mission: mission.name,
    crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    features: mission.objects.map((obj) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [77.5841 + (obj.position[0] * 0.0001), 34.1824 + (obj.position[2] * 0.0001), obj.position[1]],
      },
      properties: {
        id: obj.id,
        name: obj.name,
        category: obj.category,
        confidence: obj.confidence,
        dimensions: obj.dimensions,
      },
    })),
  }, null, 2);

  const sampleCsv = [
    'Object_ID,Category,Name,Position_X,Position_Y,Position_Z,Length_m,Width_m,Height_m,Uncertainty_m,Confidence_Pct',
    ...mission.objects.map((o) => 
      `${o.id},${o.category},"${o.name}",${o.position[0]},${o.position[1]},${o.position[2]},${o.dimensions.length},${o.dimensions.width},${o.dimensions.height},${o.dimensions.uncertainty},${o.confidence}`
    ),
  ].join('\n');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '28px', maxWidth: '780px' }}>
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-teal">Geospatial Interoperability</span>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#94A3B8' }}>
                Open Standards Export Engine
              </span>
            </div>
            <h2 style={{ fontSize: '20px', marginTop: '6px', color: '#F1F5F9' }}>
              Export 3D Models, Point Clouds & GIS Datasets
            </h2>
            <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
              Mission: <span style={{ color: '#38BDF8' }}>{mission.name}</span> ({mission.code})
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* EDUCATIONAL GEOSPATIAL BANNER */}
        <div style={{
          backgroundColor: '#111821',
          border: '1px solid #263442',
          borderRadius: '6px',
          padding: '12px 16px',
          marginBottom: '20px',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
        }}>
          <Info size={18} style={{ color: '#5EEAD4', flexShrink: 0 }} />
          <div style={{ fontSize: '12px', color: '#94A3B8', lineHeight: '1.5' }}>
            <strong style={{ color: '#F1F5F9' }}>Geospatial Notes:</strong> <strong style={{ color: '#38BDF8' }}>DEM (Digital Elevation Model)</strong> is a georeferenced raster grid where every pixel stores elevation AMSL. <strong style={{ color: '#5EEAD4' }}>Contour Vectors</strong> provide 1.0m / 5.0m elevation isolines for direct ingestion into QGIS, ArcGIS, and AutoCAD.
          </div>
        </div>

        {/* EXPORT CATEGORIES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          {/* 1. 3D MODELS */}
          <div style={{ background: '#111821', border: '1px solid #263442', borderRadius: '8px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Box size={16} style={{ color: '#38BDF8' }} />
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#F1F5F9' }}>3D Surface Meshes & Models</span>
              <span className="badge badge-cyan" style={{ fontSize: '10px' }}>842,190 Faces</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              {[
                { format: 'GLB / GLTF', desc: 'Embedded textures & materials', ext: 'glb' },
                { format: 'OBJ + MTL', desc: 'Standard CAD mesh format', ext: 'obj' },
                { format: 'PLY (Mesh)', desc: 'Polygon file format with normals', ext: 'ply' },
                { format: 'FBX', desc: 'Autodesk interchangeable asset', ext: 'fbx' },
              ].map((item) => (
                <button
                  key={item.format}
                  onClick={() => handleDownload(
                    item.format,
                    `${mission.code}_Mesh.${item.ext}`,
                    `# AeroVista 3D Export - ${mission.name}\n# Faces: 842190, Vertices: 421095\n# Formatted: ${item.format}`,
                    'text/plain'
                  )}
                  disabled={downloadingFormat === item.format}
                  className="btn btn-secondary btn-sm"
                  style={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '8px 10px',
                    borderColor: downloadedFormats.includes(item.format) ? '#34D399' : '#263442',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <span style={{ fontWeight: '600', color: '#F1F5F9' }}>{item.format}</span>
                    {downloadedFormats.includes(item.format) && <CheckCircle2 size={12} style={{ color: '#34D399' }} />}
                  </div>
                  <span style={{ fontSize: '10px', color: '#64748B' }}>{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. POINT CLOUD */}
          <div style={{ background: '#111821', border: '1px solid #263442', borderRadius: '8px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Globe size={16} style={{ color: '#5EEAD4' }} />
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#F1F5F9' }}>Dense Point Clouds</span>
              <span className="badge badge-teal" style={{ fontSize: '10px' }}>1.84M Points</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {[
                { format: 'LAS / LAZ 1.4', desc: 'Standard LiDAR & photogrammetry', ext: 'las' },
                { format: 'PLY (Dense Points)', desc: 'With RGB & Confidence scalars', ext: 'ply' },
                { format: 'XYZ / PTS', desc: 'ASCII georeferenced coordinate list', ext: 'xyz' },
              ].map((item) => (
                <button
                  key={item.format}
                  onClick={() => handleDownload(
                    item.format,
                    `${mission.code}_PointCloud.${item.ext}`,
                    `# AeroVista 3D Dense Cloud\n# Points: 1842632\n# CRS: UTM Zone 43N\n# Format: ${item.format}`,
                    'text/plain'
                  )}
                  disabled={downloadingFormat === item.format}
                  className="btn btn-secondary btn-sm"
                  style={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '8px 10px',
                    borderColor: downloadedFormats.includes(item.format) ? '#34D399' : '#263442',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <span style={{ fontWeight: '600', color: '#F1F5F9' }}>{item.format}</span>
                    {downloadedFormats.includes(item.format) && <CheckCircle2 size={12} style={{ color: '#34D399' }} />}
                  </div>
                  <span style={{ fontSize: '10px', color: '#64748B' }}>{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. GEOSPATIAL & GIS */}
          <div style={{ background: '#111821', border: '1px solid #263442', borderRadius: '8px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <FileSpreadsheet size={16} style={{ color: '#818CF8' }} />
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#F1F5F9' }}>GIS, Elevation & Semantic Vectors</span>
              <span className="badge badge-indigo" style={{ fontSize: '10px' }}>QGIS Ready</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              <button
                onClick={() => handleDownload('GeoJSON', `${mission.code}_Objects.geojson`, sampleGeoJson, 'application/json')}
                className="btn btn-secondary btn-sm"
                style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '8px 10px' }}
              >
                <div style={{ fontWeight: '600', color: '#F1F5F9' }}>GeoJSON Vectors</div>
                <span style={{ fontSize: '10px', color: '#64748B' }}>3D object bounds & classes</span>
              </button>

              <button
                onClick={() => handleDownload('DEM GeoTIFF', `${mission.code}_DEM.tif`, '# AeroVista GeoTIFF DEM Header\n# 0.05m GSD raster elevation matrix', 'image/tiff')}
                className="btn btn-secondary btn-sm"
                style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '8px 10px' }}
              >
                <div style={{ fontWeight: '600', color: '#F1F5F9' }}>DEM (GeoTIFF)</div>
                <span style={{ fontSize: '10px', color: '#64748B' }}>Digital elevation model raster</span>
              </button>

              <button
                onClick={() => handleDownload('DXF Contours', `${mission.code}_Contours.dxf`, '# DXF 1.0m Elevation Contour Polylines', 'application/dxf')}
                className="btn btn-secondary btn-sm"
                style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '8px 10px' }}
              >
                <div style={{ fontWeight: '600', color: '#F1F5F9' }}>Contours (DXF)</div>
                <span style={{ fontSize: '10px', color: '#64748B' }}>1.0m interval topographic isolines</span>
              </button>

              <button
                onClick={() => handleDownload('CSV Objects', `${mission.code}_Telemetry.csv`, sampleCsv, 'text/csv')}
                className="btn btn-secondary btn-sm"
                style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '8px 10px' }}
              >
                <div style={{ fontWeight: '600', color: '#F1F5F9' }}>CSV Telemetry</div>
                <span style={{ fontSize: '10px', color: '#64748B' }}>Raw coordinates & uncertainties</span>
              </button>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #263442' }}>
          <div style={{ fontSize: '11px', color: '#64748B' }}>
            All geospatial exports projected in <span style={{ color: '#38BDF8', fontFamily: 'var(--font-mono)' }}>WGS84 / UTM Zone 43N</span>
          </div>
          <button onClick={onClose} className="btn btn-outline btn-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
