import React, { useState } from 'react';
import { MapPinned } from 'lucide-react';
import { Button, Input } from '../components/ui';
import { login } from '../api/client';

export default function LoginView({ onLoginSuccess, onGoToRegister }) {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!correo || !password) {
      setError('Ingresa tu correo y contraseña para continuar.');
      return;
    }
    setLoading(true);
    try {
      const res = await login(correo, password);
      onLoginSuccess(res);
    } catch (err) {
      setError('No pudimos iniciar tu sesión. Verifica tus datos e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-screen__panel">
        <div className="auth-brand">
          <span className="auth-brand__mark">
            <MapPinned size={22} strokeWidth={1.75} />
          </span>
          <div>
            <div className="auth-brand__name">GeoExpande</div>
            <div className="auth-brand__tag">Inteligencia de ubicación y vinculación B2B</div>
          </div>
        </div>

        <h1 className="auth-title">Inicia sesión</h1>
        <p className="auth-subtitle">Accede al panel de análisis de expansión de tu empresa.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <Input
            label="Correo electrónico"
            type="email"
            placeholder="tucorreo@empresa.mx"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            autoComplete="email"
          />
          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          {error && <div className="auth-error">{error}</div>}

          <Button type="submit" size="lg" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Entrando…' : 'Entrar'}
          </Button>
        </form>

        <p className="auth-switch">
          ¿No tienes cuenta?{' '}
          <button className="link-btn" onClick={onGoToRegister}>
            Registra tu empresa
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
