import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { PageHeader, Card, Input, Select, Textarea, Button } from '../components/ui';
import { DenueSectores, DenueRamasPorSector } from '../data/denueSectors';
import { getEmpresaActual, actualizarEmpresa } from '../api/client';

export default function CompanyProfileView() {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    getEmpresaActual().then(setForm);
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }
  function updatePref(field, value) {
    setForm((f) => ({ ...f, preferenciasExpansion: { ...f.preferenciasExpansion, [field]: value } }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setSavedMsg('');
    await actualizarEmpresa(form);
    setSaving(false);
    setSavedMsg('Perfil actualizado correctamente.');
  }

  if (!form) return null;

  const sectorOptions = DenueSectores.map((s) => ({ value: s.codigo, label: `${s.codigo} — ${s.nombre}` }));
  const ramaOptions = (DenueRamasPorSector[form.giroSectorCodigo] || []).map((r) => ({
    value: r.codigo,
    label: `${r.codigo} — ${r.nombre}`,
  }));

  return (
    <div className="view-stack">
      <PageHeader title="Perfil de la empresa" subtitle="Esta información se usa para personalizar tus análisis de expansión." />

      <form onSubmit={handleSave} className="view-stack">
        <Card>
          <div className="card__header">
            <h3>Datos generales</h3>
          </div>
          <div className="grid grid--2">
            <Input label="Razón social" value={form.razonSocial} onChange={(e) => update('razonSocial', e.target.value)} />
            <Input label="Nombre comercial" value={form.nombreComercial} onChange={(e) => update('nombreComercial', e.target.value)} />
            <Input label="Correo de contacto" type="email" value={form.correoContacto} onChange={(e) => update('correoContacto', e.target.value)} />
            <Input label="Ciudad base" value={form.ciudadBase} onChange={(e) => update('ciudadBase', e.target.value)} />
          </div>
        </Card>

        <Card>
          <div className="card__header">
            <h3>Giro comercial</h3>
            <span className="card__header-hint">Clasificación oficial DENUE / SCIAN (INEGI)</span>
          </div>
          <div className="grid grid--2">
            <Select
              label="Sector"
              options={sectorOptions}
              value={form.giroSectorCodigo}
              onChange={(e) => {
                const s = DenueSectores.find((x) => x.codigo === e.target.value);
                update('giroSectorCodigo', e.target.value);
                update('giroSectorNombre', s?.nombre || '');
                update('giroRamaCodigo', '');
                update('giroRamaNombre', '');
              }}
            />
            <Select
              label="Giro específico"
              hint={form.giroSectorCodigo ? undefined : 'Elige primero un sector.'}
              options={ramaOptions}
              placeholder={form.giroSectorCodigo ? 'Selecciona una opción' : 'Elige primero un sector'}
              value={form.giroRamaCodigo || ''}
              onChange={(e) => {
                const r = (DenueRamasPorSector[form.giroSectorCodigo] || []).find((x) => x.codigo === e.target.value);
                update('giroRamaCodigo', e.target.value);
                update('giroRamaNombre', r?.nombre || '');
              }}
              disabled={!form.giroSectorCodigo}
            />
            <Select
              label="Tamaño de la empresa"
              options={[
                { value: 'Micro', label: 'Micro' },
                { value: 'Pequeña', label: 'Pequeña' },
                { value: 'Mediana', label: 'Mediana' },
                { value: 'Grande', label: 'Grande' },
              ]}
              value={form.tamano}
              onChange={(e) => update('tamano', e.target.value)}
            />
          </div>
          <Textarea
            label="Describe tu negocio"
            hint="Esto es lo que la IA lee para buscar en la API del DENUE qué zonas de oportunidad recomendarte: a qué te dedicas, a quién le vendes y qué tipo de zona buscas."
            placeholder="Ej. Tienda de abarrotes y conveniencia de barrio. Buscamos zonas con alta densidad habitacional, poca competencia de tiendas de autoservicio y buen flujo peatonal."
            value={form.descripcionNegocio || ''}
            onChange={(e) => update('descripcionNegocio', e.target.value)}
            style={{ marginTop: 'var(--sp-4)' }}
          />
        </Card>

        <Card>
          <div className="card__header">
            <h3>Preferencias de expansión</h3>
          </div>
          <div className="grid grid--2">
            <Input
              label="Presupuesto máximo (MXN)"
              type="number"
              value={form.preferenciasExpansion.presupuestoMaximoMXN}
              onChange={(e) => updatePref('presupuestoMaximoMXN', Number(e.target.value))}
            />
            <Input
              label="Radio de búsqueda (km)"
              type="number"
              value={form.preferenciasExpansion.radioBusquedaKm}
              onChange={(e) => updatePref('radioBusquedaKm', Number(e.target.value))}
            />
            <Input
              label="Regiones de interés"
              hint="Separadas por coma"
              value={form.preferenciasExpansion.regionesInteres.join(', ')}
              onChange={(e) => updatePref('regionesInteres', e.target.value.split(',').map((s) => s.trim()))}
            />
          </div>
        </Card>

        <div className="form-actions">
          {savedMsg && <span className="form-actions__msg">{savedMsg}</span>}
          <Button type="submit" icon={Save} disabled={saving}>
            {saving ? 'Guardando…' : 'Guardar cambios'}
          </Button>
        </div>
      </form>
    </div>
  );
}
