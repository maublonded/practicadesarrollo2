import React, { useEffect, useState } from 'react';
import { Activity, MapPin, Handshake, Gauge, ArrowRight } from 'lucide-react';
import { PageHeader, Card, StatCard, Button, Badge, Skeleton } from '../components/ui';
import { getDashboardResumen } from '../api/client';

const ICONS = [Activity, MapPin, Handshake, Gauge];

export default function DashboardView({ onNavigate }) {
  const [resumen, setResumen] = useState(null);

  useEffect(() => {
    getDashboardResumen().then(setResumen);
  }, []);

  return (
    <div className="view-stack">
      <PageHeader
        title="Panel principal"
        subtitle="Resumen del estado de tus análisis de expansión y datos del DENUE."
        action={
          <Button icon={MapPin} onClick={() => onNavigate('ubicacion')}>
            Nuevo análisis de ubicación
          </Button>
        }
      />

      <div className="grid grid--4">
        {resumen
          ? resumen.metricas.map((m, i) => (
              <StatCard key={m.etiqueta} label={m.etiqueta} value={m.valor} delta={m.delta} icon={ICONS[i % ICONS.length]} />
            ))
          : Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="stat-card">
                <Skeleton height={14} width="60%" />
                <Skeleton height={28} width="40%" />
              </Card>
            ))}
      </div>

      <div className="grid grid--2">
        <Card>
          <div className="card__header">
            <h3>Comparativa por ciudad</h3>
            <span className="card__header-hint">Puntuación de oportunidad (0–100)</span>
          </div>
          <div className="bar-list">
            {resumen?.comparativaCiudades.map((c) => (
              <div className="bar-list__row" key={c.ciudad}>
                <div className="bar-list__label">
                  <span>{c.ciudad}</span>
                  <span className="bar-list__value">{c.puntuacion}</span>
                </div>
                <div className="bar-list__track">
                  <div className="bar-list__fill" style={{ width: `${c.puntuacion}%` }} />
                </div>
                <span className="bar-list__meta">{c.establecimientosGiro} establecimientos del giro</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="card__header">
            <h3>Próximos pasos sugeridos</h3>
          </div>
          <ul className="next-steps">
            <li>
              <Badge tone="accent">1</Badge>
              <div>
                <strong>Revisa tu perfil comercial</strong>
                <p>Confirma tu giro y preferencias de expansión para afinar las recomendaciones.</p>
              </div>
            </li>
            <li>
              <Badge tone="accent">2</Badge>
              <div>
                <strong>Corre un nuevo análisis de ubicación</strong>
                <p>Explora zonas de oportunidad con datos actualizados del DENUE.</p>
              </div>
            </li>
            <li>
              <Badge tone="accent">3</Badge>
              <div>
                <strong>Consulta proveedores en tu zona elegida</strong>
                <p>Encadena tu expansión con proveedores locales recomendados.</p>
              </div>
            </li>
          </ul>
          <Button variant="ghost" icon={ArrowRight} onClick={() => onNavigate('ubicacion')}>
            Ver historial completo de análisis
          </Button>
        </Card>
      </div>
    </div>
  );
}
