import React, { useEffect, useState } from 'react';
import { Phone, Mail, Star, MapPin } from 'lucide-react';
import { PageHeader, Card, Select, Badge, SidePanel, Button, EmptyState } from '../components/ui';
import { getProveedores } from '../api/client';

const CATEGORIAS = [
  'Logística y transporte',
  'Insumos y suministros',
  'Mantenimiento y servicios',
  'Seguridad',
];

export default function SupplierDirectoryView() {
  const [proveedores, setProveedores] = useState([]);
  const [categoria, setCategoria] = useState('');
  const [seleccionado, setSeleccionado] = useState(null);

  useEffect(() => {
    getProveedores({ categoria: categoria || undefined }).then(setProveedores);
  }, [categoria]);

  return (
    <div className="view-stack">
      <PageHeader
        title="Directorio de proveedores"
        subtitle="Proveedores locales recomendados para tu zona de expansión, categorizados por giro."
      />

      <Card>
        <div className="filters-row">
          <Select
            label="Categoría"
            placeholder="Todas las categorías"
            options={CATEGORIAS.map((c) => ({ value: c, label: c }))}
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          />
        </div>
      </Card>

      {proveedores.length === 0 && (
        <Card>
          <EmptyState title="Sin proveedores para este filtro" description="Prueba con otra categoría o quita el filtro." />
        </Card>
      )}

      <div className="grid grid--3">
        {proveedores.map((p) => (
          <Card key={p.id} className="supplier-card">
            <div className="supplier-card__top">
              <h3>{p.nombreComercial}</h3>
              <Badge tone="neutral">{p.categoria}</Badge>
            </div>
            <p className="supplier-card__desc">{p.descripcion}</p>
            <div className="supplier-card__meta">
              <span>
                <MapPin size={14} /> {p.zona}
              </span>
              <span className="supplier-card__rating">
                <Star size={14} /> {p.calificacion.toFixed(1)}
              </span>
            </div>
            <Button variant="ghost" style={{ width: '100%' }} onClick={() => setSeleccionado(p)}>
              Ver ficha técnica
            </Button>
          </Card>
        ))}
      </div>

      <SidePanel open={!!seleccionado} onClose={() => setSeleccionado(null)} title="Ficha técnica del proveedor">
        {seleccionado && (
          <div className="supplier-detail">
            <h2>{seleccionado.nombreComercial}</h2>
            <Badge tone="neutral">{seleccionado.categoria}</Badge>
            <p className="supplier-detail__desc">{seleccionado.descripcion}</p>

            <dl className="supplier-detail__list">
              <div>
                <dt>Zona</dt>
                <dd>{seleccionado.zona}</dd>
              </div>
              <div>
                <dt>Calificación</dt>
                <dd>{seleccionado.calificacion.toFixed(1)} / 5.0</dd>
              </div>
              <div>
                <dt>Sector DENUE</dt>
                <dd>{seleccionado.giroSectorCodigo}</dd>
              </div>
            </dl>

            <div className="supplier-detail__contact">
              <a href={`tel:${seleccionado.telefono}`}>
                <Phone size={16} /> {seleccionado.telefono}
              </a>
              <a href={`mailto:${seleccionado.correo}`}>
                <Mail size={16} /> {seleccionado.correo}
              </a>
            </div>

            <Button style={{ width: '100%' }}>Solicitar contacto</Button>
          </div>
        )}
      </SidePanel>
    </div>
  );
}
