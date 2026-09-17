# GeoExpande — Frontend (React)

UI completa del proyecto **Plataforma de Inteligencia de Ubicación y Vinculación
Comercial B2B**. Solo frontend: no incluye backend. Está preparado para
integrarse después con una Web API en **.NET (C#)**.

## Cómo correrlo

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`.

## Estructura

```
src/
  api/client.js          # Capa de acceso a datos. HOY usa mocks (MOCK_MODE=true).
                          # Cuando exista el backend .NET, cambia MOCK_MODE a false
                          # y ajusta BASE_URL — los componentes no cambian.
  data/
    denueSectores.js      # Catálogo oficial de los 20 sectores SCIAN/DENUE (INEGI).
    mockData.js            # Datos simulados con la forma exacta de los futuros DTOs.
  components/
    ui.jsx                 # Componentes base: Button, Card, Select, Badge, etc.
    Layout.jsx              # Sidebar + Topbar + AppShell.
  views/
    LoginView.jsx
    RegisterView.jsx
    DashboardView.jsx
    CompanyProfileView.jsx
    LocationAnalysisView.jsx      # Filtros + mapa de calor (placeholder) + ranking de zonas
    FeasibilitySimulatorView.jsx
    SupplierDirectoryView.jsx     # Directorio + ficha técnica en panel lateral
    AnalysisHistoryView.jsx
    ReportsView.jsx
  App.jsx                  # Navegación entre vistas (sin router externo)
  App.css                  # Estilos de layout y componentes
  styles/tokens.css        # Paleta, tipografía y variables de diseño
```

## Navegación

No se usa `react-router`: `App.jsx` controla la vista activa con estado local
(`current`) y se la pasa al `Sidebar`. Es intencional para mantener el
proyecto ligero; si más adelante quieren URLs reales (`/dashboard`,
`/proveedores`, etc.) se puede sustituir por `react-router-dom` sin tocar las
vistas, solo `App.jsx` y `Layout.jsx`.

## Integración futura con el backend .NET

1. Todas las llamadas a datos pasan por `src/api/client.js`. Ningún
   componente importa los mocks directamente.
2. Los objetos en `mockData.js` ya están en camelCase (igual que el JSON que
   produce `System.Text.Json` en ASP.NET Core por default), para minimizar
   fricción al conectar la API real.
3. Cada función en `client.js` tiene, en un comentario, el endpoint REST que
   debería reemplazarla (ej. `GET /api/dashboard/resumen`,
   `POST /api/auth/login`).
4. El catálogo de giros (`denueSectores.js`) trae los 20 sectores oficiales
   del SCIAN. El catálogo completo (subsectores, ramas y clases — ~1,090
   categorías) es demasiado grande para incrustarlo a mano; en producción
   debería servirse desde un endpoint propio como
   `GET /api/catalogos/scian/sectores` /
   `GET /api/catalogos/scian/subsectores?sectorCodigo=...`, poblado con el
   catálogo oficial descargable en inegi.org.mx/app/scian.

## Mapa de calor

`LocationAnalysisView.jsx` incluye un **placeholder** de mapa de calor hecho
con SVG (para no depender de una librería de mapas ni de una API key). Está
aislado en un solo bloque del componente — para producción se recomienda
sustituirlo por una librería real (Leaflet, Mapbox GL o Google Maps),
alimentada por las coordenadas que devuelva `GET /api/analisis/{id}/zonas`.

## Pendiente / próximos pasos sugeridos

- Sustituir el placeholder del mapa por una librería real de mapas.
- Conectar `client.js` a la Web API .NET cuando exista.
- Añadir manejo de sesión persistente (hoy el login es solo de UI).
- Añadir validaciones de formulario más estrictas antes de producción.
