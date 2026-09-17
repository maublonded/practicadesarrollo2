/**
 * Mocks de datos.
 * ---------------------------------------------------------------------
 * Cada objeto está pensado para calzar 1:1 con un DTO que expondría una
 * Web API en .NET (System.Text.Json serializa por default a camelCase,
 * así que estos objetos ya usan esa convención). Los comentarios indican
 * el endpoint que reemplazaría a cada mock.
 */

// GET /api/empresas/{id}
export const mockEmpresaActual = {
  id: 'emp-001',
  razonSocial: 'Comercializadora del Noroeste S.A. de C.V.',
  nombreComercial: 'NorOeste Retail',
  giroSectorCodigo: '46',
  giroSectorNombre: 'Comercio al por menor',
  giroRamaCodigo: '4611',
  giroRamaNombre: 'Comercio al por menor de abarrotes y alimentos',
  descripcionNegocio: 'Tienda de abarrotes y conveniencia de barrio, enfocada en despensa básica, snacks y bebidas. Buscamos zonas con alta densidad habitacional, poca competencia directa de tiendas de autoservicio grandes y buen flujo peatonal.',
  correoContacto: 'contacto@noroesteretail.mx',
  ciudadBase: 'Hermosillo, Sonora',
  tamano: 'Mediana',
  preferenciasExpansion: {
    presupuestoMaximoMXN: 4500000,
    regionesInteres: ['Noroeste', 'Bajío'],
    radioBusquedaKm: 50,
  },
};

// GET /api/dashboard/resumen
export const mockDashboardResumen = {
  analisisRealizados: 12,
  zonasEvaluadas: 47,
  proveedoresRecomendados: 86,
  ultimaActualizacionDenue: '2026-08-01',
  metricas: [
    { etiqueta: 'Análisis activos', valor: 3, delta: '+1 esta semana' },
    { etiqueta: 'Zonas con alto potencial', valor: 9, delta: '+2 vs. mes anterior' },
    { etiqueta: 'Proveedores en catálogo', valor: 1240, delta: '+58 nuevos' },
    { etiqueta: 'Efectividad del sistema', valor: '93%', delta: 'meta: 90%' },
  ],
  comparativaCiudades: [
    { ciudad: 'Hermosillo', puntuacion: 82, establecimientosGiro: 134 },
    { ciudad: 'Culiacán', puntuacion: 76, establecimientosGiro: 98 },
    { ciudad: 'Guadalajara', puntuacion: 71, establecimientosGiro: 512 },
    { ciudad: 'León', puntuacion: 68, establecimientosGiro: 240 },
    { ciudad: 'Querétaro', puntuacion: 64, establecimientosGiro: 187 },
  ],
};

// GET /api/analisis/{id}/zonas  (resultado del algoritmo de puntuación geográfica)
export const mockZonas = [
  { id: 'zn-01', nombre: 'Hermosillo Centro', estado: 'Sonora', municipio: 'Hermosillo', puntuacion: 88, establecimientosGiro: 61, poblacion: 210000, nivel: 'alto', lat: 29.0729, lng: -110.9559 },
  { id: 'zn-02', nombre: 'Hermosillo Norte', estado: 'Sonora', municipio: 'Hermosillo', puntuacion: 74, establecimientosGiro: 39, poblacion: 165000, nivel: 'medio', lat: 29.1268, lng: -110.9640 },
  { id: 'zn-03', nombre: 'Obregón Sur', estado: 'Sonora', municipio: 'Cajeme', puntuacion: 69, establecimientosGiro: 28, poblacion: 98000, nivel: 'medio', lat: 27.4713, lng: -109.9280 },
  { id: 'zn-04', nombre: 'Culiacán Poniente', estado: 'Sinaloa', municipio: 'Culiacán', puntuacion: 91, establecimientosGiro: 74, poblacion: 340000, nivel: 'alto', lat: 24.7995, lng: -107.4534 },
  { id: 'zn-05', nombre: 'Mazatlán Zona Dorada', estado: 'Sinaloa', municipio: 'Mazatlán', puntuacion: 55, establecimientosGiro: 45, poblacion: 145000, nivel: 'bajo', lat: 23.2494, lng: -106.4235 },
  { id: 'zn-06', nombre: 'León Centro-Norte', estado: 'Guanajuato', municipio: 'León', puntuacion: 63, establecimientosGiro: 132, poblacion: 410000, nivel: 'medio', lat: 21.1444, lng: -101.6800 },
];

// GET /api/analisis/{id}/puntos-calor  (ubicaciones crudas de establecimientos DENUE
// usadas para construir el mapa de calor; cada punto trae una intensidad relativa
// 0–1 que normalmente vendría de la densidad de establecimientos del giro en esa
// coordenada). Son datos de ejemplo alrededor de las mismas zonas de mockZonas.
export const mockPuntosCalorDenue = [
  { lat: 29.0729, lng: -110.9559, intensidad: 0.9 },
  { lat: 29.0755, lng: -110.9510, intensidad: 0.8 },
  { lat: 29.0690, lng: -110.9605, intensidad: 0.7 },
  { lat: 29.0810, lng: -110.9480, intensidad: 0.6 },
  { lat: 29.0650, lng: -110.9650, intensidad: 0.5 },
  { lat: 29.1268, lng: -110.9640, intensidad: 0.6 },
  { lat: 29.1310, lng: -110.9590, intensidad: 0.5 },
  { lat: 29.1220, lng: -110.9700, intensidad: 0.4 },
  { lat: 27.4713, lng: -109.9280, intensidad: 0.5 },
  { lat: 27.4755, lng: -109.9230, intensidad: 0.4 },
  { lat: 27.4670, lng: -109.9330, intensidad: 0.4 },
  { lat: 24.7995, lng: -107.4534, intensidad: 1.0 },
  { lat: 24.8035, lng: -107.4480, intensidad: 0.9 },
  { lat: 24.7950, lng: -107.4590, intensidad: 0.8 },
  { lat: 24.8080, lng: -107.4430, intensidad: 0.7 },
  { lat: 24.7910, lng: -107.4650, intensidad: 0.6 },
  { lat: 24.8010, lng: -107.4380, intensidad: 0.6 },
  { lat: 23.2494, lng: -106.4235, intensidad: 0.4 },
  { lat: 23.2530, lng: -106.4190, intensidad: 0.3 },
  { lat: 23.2450, lng: -106.4290, intensidad: 0.3 },
  { lat: 21.1444, lng: -101.6800, intensidad: 0.7 },
  { lat: 21.1490, lng: -101.6750, intensidad: 0.6 },
  { lat: 21.1400, lng: -101.6860, intensidad: 0.6 },
  { lat: 21.1470, lng: -101.6900, intensidad: 0.5 },
];

// GET /api/proveedores?zonaId=&categoria=
export const mockProveedores = [
  {
    id: 'prov-001',
    nombreComercial: 'Logística Sonora Express',
    categoria: 'Logística y transporte',
    giroSectorCodigo: '48-49',
    zona: 'Hermosillo Centro',
    calificacion: 4.6,
    telefono: '662 123 4567',
    correo: 'ventas@sonoraexpress.mx',
    descripcion: 'Distribución de última milla y almacenaje temporal para comercio minorista en el noroeste.',
  },
  {
    id: 'prov-002',
    nombreComercial: 'Insumos Comerciales del Pacífico',
    categoria: 'Insumos y suministros',
    giroSectorCodigo: '43',
    zona: 'Hermosillo Centro',
    calificacion: 4.2,
    telefono: '662 234 5678',
    correo: 'contacto@insumospacifico.mx',
    descripcion: 'Proveedor mayorista de empaques, mobiliario y consumibles para punto de venta.',
  },
  {
    id: 'prov-003',
    nombreComercial: 'Mantenimiento Integral MI',
    categoria: 'Mantenimiento y servicios',
    giroSectorCodigo: '56',
    zona: 'Culiacán Poniente',
    calificacion: 4.8,
    telefono: '667 345 6789',
    correo: 'servicio@mantenimientomi.mx',
    descripcion: 'Mantenimiento eléctrico, climas y refrigeración comercial con cobertura regional.',
  },
  {
    id: 'prov-004',
    nombreComercial: 'Seguridad Privada Noroeste',
    categoria: 'Seguridad',
    giroSectorCodigo: '56',
    zona: 'Hermosillo Norte',
    calificacion: 4.1,
    telefono: '662 456 7890',
    correo: 'contacto@segnoroeste.mx',
    descripcion: 'Vigilancia física y monitoreo remoto para locales comerciales y bodegas.',
  },
];

// GET /api/analisis/historial
export const mockHistorialAnalisis = [
  { id: 'an-101', nombre: 'Expansión NorOeste Retail — Q3', giro: 'Comercio al por menor', fechaCreacion: '2026-08-12', estado: 'Completado', zonasEvaluadas: 18 },
  { id: 'an-102', nombre: 'Piloto Bajío', giro: 'Comercio al por menor', fechaCreacion: '2026-08-20', estado: 'En progreso', zonasEvaluadas: 9 },
  { id: 'an-103', nombre: 'Exploración Pacífico Norte', giro: 'Comercio al por menor', fechaCreacion: '2026-07-30', estado: 'Completado', zonasEvaluadas: 20 },
];

// GET /api/simulador/resultado?zonaId=
export const mockSimulacionFactibilidad = {
  zonaId: 'zn-01',
  cuotaPresenciaEstimadaPct: 6.4,
  establecimientosCompetidores: 61,
  demandaEstimadaMensualMXN: 1850000,
  nivelRiesgo: 'Medio',
  recomendacion: 'Zona con alta concentración de comercios similares; hay demanda comprobada, pero se recomienda diferenciación de oferta.',
};
