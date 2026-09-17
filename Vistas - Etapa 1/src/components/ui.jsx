import React from 'react';

/** Botón con variantes primary / secondary / ghost / danger. */
export function Button({ variant = 'primary', size = 'md', icon: Icon, children, className = '', ...rest }) {
  return (
    <button className={`btn btn--${variant} btn--${size} ${className}`} {...rest}>
      {Icon && <Icon size={16} strokeWidth={1.75} />}
      {children}
    </button>
  );
}

/** Contenedor de tarjeta base. */
export function Card({ children, className = '', padded = true, ...rest }) {
  return (
    <div className={`card ${padded ? 'card--padded' : ''} ${className}`} {...rest}>
      {children}
    </div>
  );
}

/** Encabezado estándar de una vista: título, subtítulo y acción principal. */
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
      </div>
      {action && <div className="page-header__action">{action}</div>}
    </div>
  );
}

/** Insignia de estado / nivel (alto, medio, bajo, etc.). */
export function Badge({ tone = 'neutral', children }) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}

/** Tarjeta de métrica para dashboards. */
export function StatCard({ label, value, delta, icon: Icon }) {
  return (
    <Card className="stat-card">
      <div className="stat-card__top">
        <span className="stat-card__label">{label}</span>
        {Icon && (
          <span className="stat-card__icon">
            <Icon size={18} strokeWidth={1.75} />
          </span>
        )}
      </div>
      <div className="stat-card__value">{value}</div>
      {delta && <div className="stat-card__delta">{delta}</div>}
    </Card>
  );
}

/** Select estilizado, con soporte de label y texto de ayuda. */
export function Select({ label, hint, options, placeholder = 'Selecciona una opción', ...rest }) {
  return (
    <label className="field">
      {label && <span className="field__label">{label}</span>}
      <select className="field__control" defaultValue="" {...rest}>
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hint && <span className="field__hint">{hint}</span>}
    </label>
  );
}

/** Input de texto estilizado. */
export function Input({ label, hint, ...rest }) {
  return (
    <label className="field">
      {label && <span className="field__label">{label}</span>}
      <input className="field__control" {...rest} />
      {hint && <span className="field__hint">{hint}</span>}
    </label>
  );
}

/** Textarea estilizado. */
export function Textarea({ label, hint, ...rest }) {
  return (
    <label className="field">
      {label && <span className="field__label">{label}</span>}
      <textarea className="field__control field__control--textarea" {...rest} />
      {hint && <span className="field__hint">{hint}</span>}
    </label>
  );
}

/** Estado vacío reutilizable. */
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="empty-state">
      {Icon && <Icon size={32} strokeWidth={1.75} />}
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}

/** Panel lateral (drawer) simple, usado para el detalle de proveedor. */
export function SidePanel({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="side-panel__overlay" onClick={onClose}>
      <aside className="side-panel" onClick={(e) => e.stopPropagation()}>
        <div className="side-panel__header">
          <h3>{title}</h3>
          <button className="side-panel__close" onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </div>
        <div className="side-panel__body">{children}</div>
      </aside>
    </div>
  );
}

/** Skeleton simple para estados de carga. */
export function Skeleton({ height = 16, width = '100%' }) {
  return <div className="skeleton" style={{ height, width }} />;
}
