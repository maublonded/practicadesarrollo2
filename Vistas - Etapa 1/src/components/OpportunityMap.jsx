import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

/**
 * Mapa de oportunidad — capa de calor (densidad de establecimientos DENUE
 * del giro analizado) + marcadores de zona coloreados por nivel de
 * potencial. El encuadre (centro/zoom) se ajusta según `nivelAmbito`:
 *  - nacional: vista fija de todo México.
 *  - estatal:  ajustada para ver todas las zonas evaluadas.
 *  - municipal: acercamiento a la zona con mejor puntuación.
 *
 * NOTA: los colores de nivel se duplican aquí como hex porque Leaflet
 * pinta en <canvas>/SVG y no puede resolver var(--heat-*) del CSS.
 * Deben mantenerse alineados con src/styles/tokens.css.
 */
const NIVEL_COLOR = {
  alto: '#E5484D', // var(--heat-alta)
  medio: '#F2A93B', // var(--heat-media)
  bajo: '#4A90D9', // var(--heat-baja)
};

const CENTRO_MEXICO = [23.6345, -102.5528];

export function OpportunityMap({ zonas = [], puntosCalor = [], nivelAmbito = 'municipal', onHoverZona, onClickZona }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const heatLayerRef = useRef(null);
  const markersRef = useRef([]);

  // Inicialización del mapa (una sola vez)
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      scrollWheelZoom: false,
      zoomControl: true,
    }).setView(CENTRO_MEXICO, 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Capa de calor — se reconstruye cuando cambian los puntos
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
      heatLayerRef.current = null;
    }
    if (puntosCalor.length > 0) {
      const puntos = puntosCalor.map((p) => [p.lat, p.lng, p.intensidad ?? 0.5]);
      heatLayerRef.current = L.heatLayer(puntos, {
        radius: 28,
        blur: 22,
        maxZoom: 14,
        gradient: { 0.2: '#4A90D9', 0.5: '#F2A93B', 0.85: '#E5484D' },
      }).addTo(map);
    }
  }, [puntosCalor]);

  // Marcadores de zona — se reconstruyen cuando cambian las zonas
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    zonas.forEach((z) => {
      if (typeof z.lat !== 'number' || typeof z.lng !== 'number') return;
      const marker = L.circleMarker([z.lat, z.lng], {
        radius: 9 + z.puntuacion / 12,
        color: '#fff',
        weight: 2,
        fillColor: NIVEL_COLOR[z.nivel] || NIVEL_COLOR.medio,
        fillOpacity: 0.85,
        className: 'opportunity-map__marker',
      }).addTo(map);

      marker.bindTooltip(`<strong>${z.nombre}</strong><br/>Puntuación: ${z.puntuacion} / 100`, {
        direction: 'top',
        offset: [0, -6],
      });
      marker.on('mouseover', () => onHoverZona?.(z));
      marker.on('mouseout', () => onHoverZona?.(null));
      // Al hacer clic en el punto de la zona se despliega el panel lateral
      // con el mismo resultado que antes generaba "Simular factibilidad".
      marker.on('click', () => onClickZona?.(z));

      markersRef.current.push(marker);
    });
  }, [zonas, onHoverZona, onClickZona]);

  // Encuadre — reacciona al nivel geográfico elegido
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const conCoords = zonas.filter((z) => typeof z.lat === 'number' && typeof z.lng === 'number');

    if (nivelAmbito === 'nacional' || conCoords.length === 0) {
      map.setView(CENTRO_MEXICO, 5);
      return;
    }

    if (nivelAmbito === 'municipal') {
      const top = [...conCoords].sort((a, b) => b.puntuacion - a.puntuacion)[0];
      map.setView([top.lat, top.lng], 12);
      return;
    }

    // estatal: ajusta para ver todas las zonas evaluadas
    const bounds = L.latLngBounds(conCoords.map((z) => [z.lat, z.lng]));
    map.fitBounds(bounds.pad(0.35));
  }, [nivelAmbito, zonas]);

  return <div ref={containerRef} className="opportunity-map" role="img" aria-label="Mapa de calor de oportunidad por zona" />;
}
