import React, { useEffect, useMemo, useState } from 'react';
import { Search, Calculator } from 'lucide-react';
import { PageHeader, Card, Select, Button, Badge, EmptyState, SidePanel } from '../components/ui';
import { OpportunityMap } from '../components/OpportunityMap';
import {
  getZonasRecomendadas,
  getPuntosCalorDenue,
  getSimulacionFactibilidad,
  getHistorialAnalisis,
} from '../api/client';

const NIVEL_TONE = { alto: 'success', medio: 'accent', bajo: 'danger' };
const NIVEL_LABEL = { alto: 'Alto potencial', medio: 'Potencial medio', bajo: 'Bajo potencial' };
const RIESGO_TONE = { Bajo: 'success', Medio: 'accent', Alto: 'danger' };
const ESTADO_TONE = { Completado: 'success', 'En progreso': 'accent' };

export default function LocationAnalysisView() {
  const [zonas, setZonas] = useState([]);
  const [puntosCalor, setPuntosCalor] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nivelAmbito, setNivelAmbito] = useState('municipal');
  const [zonaHover, setZonaHover] = useState(null);

  // Historial de análisis — integrado al final de esta misma vista.
  const [historial, setHistorial] = useState([]);
  const [historialLoading, setHistorialLoading] = useState(false);

  // Panel lateral derecho — se abre al hacer clic en un punto del mapa y
  // muestra exactamente el mismo resultado que antes generaba la función
  // "Simular factibilidad" para esa zona.
  const [panelZona, setPanelZona] = useState(null);
  const [panelResultado, setPanelResultado] = useState(null);
  const [panelLoading, setPanelLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([getZonasRecomendadas(), getPuntosCalorDenue()]).then(([zonasData, puntosData]) => {
      setZonas(zonasData);
      setPuntosCalor(puntosData);
      setLoading(false);
    });

    setHistorialLoading(true);
    getHistorialAnalisis().then((data) => {
      setHistorial(data);
      setHistorialLoading(false);
    });
  }, []);

  const zonasOrdenadas = useMemo(() => [...zonas].sort((a, b) => b.puntuacion - a.puntuacion), [zonas]);

  async function handleSelectZona(zona) {
    setPanelZona(zona);
    setPanelResultado(null);
    setPanelLoading(true);
    const data = await getSimulacionFactibilidad(zona.id);
    setPanelResultado(data);
    setPanelLoading(false);
  }

  function handleClosePanel() {
    setPanelZona(null);
    setPanelResultado(null);
  }

  return (
    <div className="view-stack">
      <PageHeader
        title="Análisis de ubicación"
        subtitle="Puntuación de oportunidad por zona, calculada con datos del DENUE."
      />

      <Card>
        <div className="filters-row">
          <Select
            label="Nivel geográfico del mapa"
            options={[
              { value: 'nacional', label: 'Nacional' },
              { value: 'estatal', label: 'Estatal' },
              { value: 'municipal', label: 'Municipal' },
            ]}
            value={nivelAmbito}
            onChange={(e) => setNivelAmbito(e.target.value)}
          />
          <Button icon={Search} className="filters-row__submit">
            Actualizar análisis
          </Button>
        </div>
      </Card>

      <div className="grid grid--split">
        <Card padded={false} className="map-card">
          <div className="map-card__toolbar">
            <span>Mapa de calor — ámbito {nivelAmbito}</span>
            <div className="map-card__legend">
              <span className="legend-dot legend-dot--alto" /> Alto
              <span className="legend-dot legend-dot--medio" /> Medio
              <span className="legend-dot legend-dot--bajo" /> Bajo
            </div>
          </div>

          {/* Mapa real con Leaflet: capa de calor (leaflet.heat) alimentada por
              GET /api/analisis/{id}/puntos-calor + marcadores de zona desde
              GET /api/analisis/{id}/zonas. El encuadre se adapta a nivelAmbito.
              Al hacer clic en un marcador de zona se abre el panel lateral
              derecho con el resultado de factibilidad para ese punto. */}
          <div className="map-card__body">
            <OpportunityMap
              zonas={zonasOrdenadas}
              puntosCalor={puntosCalor}
              nivelAmbito={nivelAmbito}
              onHoverZona={setZonaHover}
              onClickZona={handleSelectZona}
            />
            {zonaHover && (
              <div className="heatmap-tooltip">
                <strong>{zonaHover.nombre}</strong>
                <span>Puntuación: {zonaHover.puntuacion} / 100</span>
                <span>{zonaHover.establecimientosGiro} establecimientos del giro</span>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <div className="card__header">
            <h3>Ranking de zonas</h3>
            <span className="card__header-hint">{zonasOrdenadas.length} zonas evaluadas</span>
          </div>

          {loading && <EmptyState title="Calculando puntuaciones…" description="Esto puede tardar unos segundos." />}

          <div className="zone-list">
            {zonasOrdenadas.map((z) => (
              <button key={z.id} className="zone-list__item" onClick={() => handleSelectZona(z)}>
                <div className="zone-list__main">
                  <span className="zone-list__name">{z.nombre}</span>
                  <span className="zone-list__meta">
                    {z.municipio}, {z.estado} · {z.establecimientosGiro} establecimientos
                  </span>
                </div>
                <div className="zone-list__side">
                  <Badge tone={NIVEL_TONE[z.nivel]}>{NIVEL_LABEL[z.nivel]}</Badge>
                  <span className="zone-list__score">{z.puntuacion}</span>
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Historial de análisis — antes era una vista independiente; ahora
          vive integrado al final de "Análisis de ubicación". */}
      <Card padded={false}>
        <div className="card__header" style={{ padding: 'var(--sp-4) var(--sp-4) 0' }}>
          <h3>Historial de análisis</h3>
          <span className="card__header-hint">{historial.length} análisis registrados</span>
        </div>

        {!historialLoading && historial.length === 0 && (
          <div style={{ padding: 'var(--sp-4)' }}>
            <EmptyState title="Aún no tienes análisis" description="Corre tu primer análisis de ubicación para verlo aquí." />
          </div>
        )}

        {historial.length > 0 && (
          <table className="table">
            <thead>
              <tr>
                <th>Nombre del análisis</th>
                <th>Giro</th>
                <th>Fecha</th>
                <th>Zonas evaluadas</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((h) => (
                <tr key={h.id}>
                  <td className="table__strong">{h.nombre}</td>
                  <td>{h.giro}</td>
                  <td>{new Date(h.fechaCreacion).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  <td>{h.zonasEvaluadas}</td>
                  <td>
                    <Badge tone={ESTADO_TONE[h.estado] || 'neutral'}>{h.estado}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {/* Panel lateral derecho — resultado de factibilidad del punto elegido
          en el mapa (mismos datos que antes mostraba "Simular factibilidad"). */}
      <SidePanel
        open={!!panelZona}
        onClose={handleClosePanel}
        title={panelZona ? panelZona.nombre : 'Factibilidad de la zona'}
      >
        {panelZona && (
          <>
            <p className="card__header-hint" style={{ marginBottom: 'var(--sp-4)' }}>
              {panelZona.municipio}, {panelZona.estado}
            </p>

            {panelLoading && (
              <EmptyState icon={Calculator} title="Calculando factibilidad…" description="Esto puede tardar unos segundos." />
            )}

            {!panelLoading && panelResultado && (
              <>
                <div className="sim-result">
                  <div className="sim-result__row">
                    <span>Cuota de presencia estimada</span>
                    <strong>{panelResultado.cuotaPresenciaEstimadaPct}%</strong>
                  </div>
                  <div className="sim-result__row">
                    <span>Establecimientos competidores</span>
                    <strong>{panelResultado.establecimientosCompetidores}</strong>
                  </div>
                  <div className="sim-result__row">
                    <span>Demanda estimada mensual</span>
                    <strong>${panelResultado.demandaEstimadaMensualMXN.toLocaleString('es-MX')} MXN</strong>
                  </div>
                  <div className="sim-result__row">
                    <span>Nivel de riesgo</span>
                    <Badge tone={RIESGO_TONE[panelResultado.nivelRiesgo]}>{panelResultado.nivelRiesgo}</Badge>
                  </div>
                </div>

                <div className="card__header" style={{ marginTop: 'var(--sp-5)' }}>
                  <h3>Recomendación</h3>
                </div>
                <p className="sim-recommendation">{panelResultado.recomendacion}</p>

                <Button variant="secondary" style={{ marginTop: 'var(--sp-4)', width: '100%' }}>
                  Guardar en historial de análisis
                </Button>
              </>
            )}
          </>
        )}
      </SidePanel>
    </div>
  );
}
