import React, { useState } from 'react';
import { MapPinned } from 'lucide-react';
import { Button, Input, Select, Textarea } from '../components/ui';
import { DenueSectores, DenueRamasPorSector } from '../data/denueSectors';
import { registro } from '../api/client';

export default function RegisterView({ onRegisterSuccess, onGoToLogin }) {
  const [form, setForm] = useState({
    razonSocial: '',
    nombreComercial: '',
    correoContacto: '',
    password: '',
    giroSectorCodigo: '',
    giroRamaCodigo: '',
    descripcionNegocio: '',
    ciudadBase: '',
  });
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function updateSector(codigo) {
    setForm((f) => ({ ...f, giroSectorCodigo: codigo, giroRamaCodigo: '' }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await registro(form);
      onRegisterSuccess();
    } finally {
      setLoading(false);
    }
  }

  const sectorOptions = DenueSectores.map((s) => ({
    value: s.codigo,
    label: `${s.codigo} — ${s.nombre}`,
  }));

  const ramaOptions = (DenueRamasPorSector[form.giroSectorCodigo] || []).map((r) => ({
    value: r.codigo,
    label: `${r.codigo} — ${r.nombre}`,
  }));

  return (
    <div className="auth-screen">
      <div className="auth-screen__panel auth-screen__panel--wide">
        <div className="auth-brand">
          <span className="auth-brand__mark">
            <MapPinned size={22} strokeWidth={1.75} />
          </span>
          <div>
            <div className="auth-brand__name">GeoExpande</div>
            <div className="auth-brand__tag">Inteligencia de ubicación y vinculación B2B</div>
          </div>
        </div>

        <h1 className="auth-title">Registra tu empresa</h1>
        <p className="auth-subtitle">
          Usaremos tu giro comercial (clasificación DENUE) para calcular zonas de oportunidad relevantes para ti.
        </p>

        <form className="auth-form auth-form--grid" onSubmit={handleSubmit}>
          <Input
            label="Razón social"
            placeholder="Comercializadora del Noroeste S.A. de C.V."
            value={form.razonSocial}
            onChange={(e) => update('razonSocial', e.target.value)}
          />
          <Input
            label="Nombre comercial"
            placeholder="NorOeste Retail"
            value={form.nombreComercial}
            onChange={(e) => update('nombreComercial', e.target.value)}
          />
          <Input
            label="Correo de contacto"
            type="email"
            placeholder="contacto@tuempresa.mx"
            value={form.correoContacto}
            onChange={(e) => update('correoContacto', e.target.value)}
          />
          <Input
            label="Contraseña"
            type="password"
            placeholder="Crea una contraseña segura"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
          />

          <Select
            label="Giro comercial (sector DENUE)"
            hint="Clasificación oficial SCIAN / INEGI usada para el análisis de zonas."
            options={sectorOptions}
            value={form.giroSectorCodigo}
            onChange={(e) => updateSector(e.target.value)}
          />
          <Select
            label="Giro específico (opcional)"
            hint={form.giroSectorCodigo ? 'Precisa tu actividad dentro del sector elegido.' : 'Elige primero un sector.'}
            options={ramaOptions}
            placeholder={form.giroSectorCodigo ? 'Selecciona una opción' : 'Elige primero un sector'}
            value={form.giroRamaCodigo}
            onChange={(e) => update('giroRamaCodigo', e.target.value)}
            disabled={!form.giroSectorCodigo}
          />

          <div className="auth-form__full">
            <Textarea
              label="Describe tu negocio"
              hint="Esto es lo que la IA lee para buscar en la API del DENUE qué zonas de oportunidad recomendarte: a qué te dedicas, a quién le vendes y qué tipo de zona buscas."
              placeholder="Ej. Tienda de abarrotes y conveniencia de barrio. Buscamos zonas con alta densidad habitacional, poca competencia de tiendas de autoservicio y buen flujo peatonal."
              value={form.descripcionNegocio}
              onChange={(e) => update('descripcionNegocio', e.target.value)}
            />
          </div>

          <Input
            label="Ciudad donde opera actualmente"
            placeholder="Hermosillo, Sonora"
            value={form.ciudadBase}
            onChange={(e) => update('ciudadBase', e.target.value)}
          />

          <div className="auth-form__full">
            <Button type="submit" size="lg" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Creando cuenta…' : 'Crear cuenta'}
            </Button>
          </div>
        </form>

        <p className="auth-switch">
          ¿Ya tienes cuenta?{' '}
          <button className="link-btn" onClick={onGoToLogin}>
            Inicia sesión
          </button>
        </p>
        </div>

        <div className="auth-screen__side" aria-hidden="true">
          <div className="auth-side__card">
            <div className="auth-side__stat">+5.5M</div>
            <div className="auth-side__label">establecimientos del DENUE analizados a nivel nacional</div>
          </div>
        </div>
      </div>
  );
}
