import React, { useEffect, useState } from 'react';
import { AppShell } from './components/Layout';
import LoginView from './views/LoginView';
import RegisterView from './views/RegisterView';
import DashboardView from './views/DashboardView';
import CompanyProfileView from './views/CompanyProfileView';
import LocationAnalysisView from './views/LocationAnalysisView';
import SupplierDirectoryView from './views/SupplierDirectoryView';
import ReportsView from './views/ReportsView';
import { getEmpresaActual } from './api/client';

// Vistas que viven DENTRO del shell (sidebar + topbar)
// Nota: "Simulador de factibilidad" e "Historial de análisis" ya no son
// vistas independientes; su funcionalidad vive dentro de "ubicacion"
// (LocationAnalysisView).
const AUTHENTICATED_VIEWS = {
  dashboard: DashboardView,
  perfil: CompanyProfileView,
  ubicacion: LocationAnalysisView,
  proveedores: SupplierDirectoryView,
  reportes: ReportsView,
};

export default function App() {
  const [authView, setAuthView] = useState('login'); // 'login' | 'register' | null
  const [current, setCurrent] = useState('dashboard');
  const [empresa, setEmpresa] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (authView === null) {
      getEmpresaActual().then(setEmpresa);
    }
  }, [authView]);

  function handleNavigate(key) {
    if (key === 'login') {
      setAuthView('login');
      return;
    }
    setCurrent(key);
  }

  if (authView === 'login') {
    return <LoginView onLoginSuccess={() => setAuthView(null)} onGoToRegister={() => setAuthView('register')} />;
  }
  if (authView === 'register') {
    return <RegisterView onRegisterSuccess={() => setAuthView('login')} onGoToLogin={() => setAuthView('login')} />;
  }

  const ActiveView = AUTHENTICATED_VIEWS[current] || DashboardView;

  return (
    <AppShell
      current={current}
      onNavigate={handleNavigate}
      empresa={empresa}
      mobileOpen={mobileNavOpen}
      onOpenMobileNav={() => setMobileNavOpen(true)}
      onCloseMobile={() => setMobileNavOpen(false)}
    >
      <ActiveView onNavigate={handleNavigate} />
    </AppShell>
  );
}
