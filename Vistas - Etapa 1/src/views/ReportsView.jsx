import React, { useState } from 'react';
import { FileDown, FileBarChart2 } from 'lucide-react';
import { PageHeader, Card, Select, Button, EmptyState, Badge } from '../components/ui';
import { mockHistorialAnalisis } from '../data/mockData';
import { generarReporteEjecutivo } from '../api/client';

export default function ReportsView() {
  const [analisisId, setAnalisisId] = useState('');
  const [incluirMapas, setIncluirMapas] = useState(true);
  const [incluirProveedores, setIncluirProveedores] = useState(true);
  const [generando, setGenerando] = useState(false);
  const [ultimoReporte, setUltimoReporte] = useState(null);

  async function handleGenerar(e) {
    e.preventDefault();
    if (!analisisId) return;
    setGenerando(true);
    const res = await generarReporteEjecutivo({ analisisId, incluirMapas, incluirProveedores });
    setUltimoReporte(res);
    setGenerando(false);
  }

  return (
    <div className="view-stack">
      <PageHeader
        title="Reportes ejecutivos"
        subtitle="Exporta estadísticas del DENUE, mapas explicativos y proveedores sugeridos en PDF."
      />

      <div className="grid grid--split">
        <Card>
          <div className="card__header">
            <h3>Generar nuevo reporte</h3>
          </div>
          <form className="view-stack" onSubmit={handleGenerar}>
            <Select
              label="Análisis a exportar"
              options={mockHistorialAnalisis.map((h) => ({ value: h.id, label: h.nombre }))}
              value={analisisId}
              onChange={(e) => setAnalisisId(e.target.value)}
            />

            <div className="checkbox-row">
              <label className="checkbox">
                <input type="checkbox" checked={incluirMapas} onChange={(e) => setIncluirMapas(e.target.checked)} />
                Incluir mapas explicativos
              </label>
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={incluirProveedores}
                  onChange={(e) => setIncluirProveedores(e.target.checked)}
                />
                Incluir listado de proveedores sugeridos
              </label>
            </div>

            <Button type="submit" icon={FileDown} disabled={generando}>
              {generando ? 'Generando…' : 'Generar reporte PDF'}
            </Button>

            {ultimoReporte && (
              <p className="form-actions__msg">
                Reporte generado el {new Date(ultimoReporte.generadoEn).toLocaleString('es-MX')}.
              </p>
            )}
          </form>
        </Card>

        <Card>
          <div className="card__header">
            <h3>Reportes recientes</h3>
          </div>
          {mockHistorialAnalisis.filter((h) => h.estado === 'Completado').length === 0 ? (
            <EmptyState icon={FileBarChart2} title="Sin reportes todavía" description="Genera tu primer reporte ejecutivo." />
          ) : (
            <ul className="report-list">
              {mockHistorialAnalisis
                .filter((h) => h.estado === 'Completado')
                .map((h) => (
                  <li key={h.id} className="report-list__item">
                    <div>
                      <strong>{h.nombre}</strong>
                      <span>{new Date(h.fechaCreacion).toLocaleDateString('es-MX')}</span>
                    </div>
                    <Badge tone="success">Completado</Badge>
                  </li>
                ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
