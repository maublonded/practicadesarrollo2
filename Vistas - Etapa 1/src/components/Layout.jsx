import React from 'react';
import {
  LayoutDashboard,
  Building2,
  MapPinned,
  Handshake,
  FileBarChart2,
  LogOut,
  Menu,
} from 'lucide-react';

const NAV_GROUPS = [
  {
    label: 'Análisis',
    items: [
      { key: 'dashboard', label: 'Panel principal', icon: LayoutDashboard },
      { key: 'ubicacion', label: 'Análisis de ubicación', icon: MapPinned },
    ],
  },
  {
    label: 'Comercial',
    items: [
      { key: 'proveedores', label: 'Directorio de proveedores', icon: Handshake },
      { key: 'reportes', label: 'Reportes ejecutivos', icon: FileBarChart2 },
    ],
  },
  {
    label: 'Cuenta',
    items: [{ key: 'perfil', label: 'Perfil de la empresa', icon: Building2 }],
  },
];

export function Sidebar({ current, onNavigate, mobileOpen, onCloseMobile }) {
  return (
    <>
      {mobileOpen && <div className="sidebar__scrim" onClick={onCloseMobile} />}
      <nav className={`sidebar ${mobileOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__brand">
          <span className="sidebar__brand-mark">GE</span>
          <div>
            <div className="sidebar__brand-name">GeoExpande</div>
            <div className="sidebar__brand-tag">Inteligencia de ubicación B2B</div>
          </div>
        </div>

        {NAV_GROUPS.map((group) => (
          <div className="sidebar__group" key={group.label}>
            <div className="sidebar__group-label">{group.label}</div>
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = current === item.key;
              return (
                <button
                  key={item.key}
                  className={`sidebar__item ${active ? 'sidebar__item--active' : ''}`}
                  onClick={() => {
                    onNavigate(item.key);
                    onCloseMobile?.();
                  }}
                >
                  <Icon size={18} strokeWidth={1.75} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}

        <button className="sidebar__item sidebar__item--logout" onClick={() => onNavigate('login')}>
          <LogOut size={18} strokeWidth={1.75} />
          <span>Cerrar sesión</span>
        </button>
      </nav>
    </>
  );
}

export function TopBar({ empresa, onOpenMobileNav }) {
  return (
    <header className="topbar">
      <button className="topbar__menu-btn" onClick={onOpenMobileNav} aria-label="Abrir menú">
        <Menu size={20} />
      </button>
      <div className="topbar__company">
        <span className="topbar__company-name">{empresa?.nombreComercial || 'Mi empresa'}</span>
        <span className="topbar__company-sub">{empresa?.giroSectorNombre}</span>
      </div>
      <div className="topbar__user">
        <div className="topbar__avatar">FP</div>
        <div>
          <div className="topbar__user-name">Francisco Pinela</div>
          <div className="topbar__user-role">Product Owner</div>
        </div>
      </div>
    </header>
  );
}

export function AppShell({ current, onNavigate, empresa, mobileOpen, onOpenMobileNav, onCloseMobile, children }) {
  return (
    <div className="app-shell">
      <Sidebar current={current} onNavigate={onNavigate} mobileOpen={mobileOpen} onCloseMobile={onCloseMobile} />
      <div className="app-shell__main">
        <TopBar empresa={empresa} onOpenMobileNav={onOpenMobileNav} />
        <main className="app-shell__content">{children}</main>
      </div>
    </div>
  );
}
