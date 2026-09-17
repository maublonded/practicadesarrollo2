/**
 * Cliente de API — capa de integración con el backend.
 * ---------------------------------------------------------------------
 * Hoy MOCK_MODE = true, así que cada función regresa datos simulados
 * (con un pequeño delay para simular red). Cuando exista la Web API en
 * .NET, basta con:
 *   1) Poner MOCK_MODE = false (o controlarlo por variable de entorno,
 *      p. ej. import.meta.env.VITE_API_BASE_URL).
 *   2) Ajustar BASE_URL al host de la API (ej. https://api.tuproyecto.mx).
 *   3) Los componentes NO cambian: todos consumen estas funciones, nunca
 *      los mocks directamente.
 *
 * Convenciones esperadas del backend .NET:
 *   - JSON en camelCase (default de System.Text.Json en ASP.NET Core).
 *   - Autenticación por Bearer token (JWT) en el header Authorization.
 *   - Códigos de error estándar (401, 403, 404, 422, 500) con body
 *     { message: string, errors?: Record<string,string[]> }.
 */

import {
  mockEmpresaActual,
  mockDashboardResumen,
  mockZonas,
  mockPuntosCalorDenue,
  mockProveedores,
  mockHistorialAnalisis,
  mockSimulacionFactibilidad,
} from '../data/mockData';
import { DenueSectores } from '../data/denueSectors';

export const MOCK_MODE = true;
export const BASE_URL = 'https://api.tuproyecto.mx'; // TODO: variable de entorno real

function delay(data, ms = 350) {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

// ---- Auth -------------------------------------------------------------
// POST /api/auth/login  { correo, password } -> { token, usuario }
export async function login(correo, password) {
  if (MOCK_MODE) {
    return delay({
      token: 'mock-jwt-token',
      usuario: { id: 'usr-01', nombre: 'Francisco Pinela', correo, rol: 'admin' },
    });
  }
  // fetch(`${BASE_URL}/api/auth/login`, { method: 'POST', body: JSON.stringify({ correo, password }) })
}

// POST /api/auth/registro
export async function registro(datos) {
  if (MOCK_MODE) return delay({ ok: true, usuarioId: 'usr-02' });
}

// ---- Catálogos ----------------------------------------------------------
// GET /api/catalogos/scian/sectores
export async function getSectoresDenue() {
  if (MOCK_MODE) return delay(DenueSectores);
}

// ---- Empresa / perfil ---------------------------------------------------
// GET /api/empresas/{id}
export async function getEmpresaActual() {
  if (MOCK_MODE) return delay(mockEmpresaActual);
}

// PUT /api/empresas/{id}
export async function actualizarEmpresa(payload) {
  if (MOCK_MODE) return delay({ ...mockEmpresaActual, ...payload });
}

// ---- Dashboard ------------------------------------------------------------
// GET /api/dashboard/resumen
export async function getDashboardResumen() {
  if (MOCK_MODE) return delay(mockDashboardResumen);
}

// ---- Análisis espacial ------------------------------------------------------
// GET /api/analisis/{id}/zonas
export async function getZonasRecomendadas() {
  if (MOCK_MODE) return delay(mockZonas);
}

// GET /api/analisis/{id}/puntos-calor  (coordenadas crudas de establecimientos
// DENUE del giro analizado, usadas para pintar la capa de calor del mapa)
export async function getPuntosCalorDenue() {
  if (MOCK_MODE) return delay(mockPuntosCalorDenue);
}

// GET /api/simulador/resultado?zonaId=
export async function getSimulacionFactibilidad(zonaId) {
  if (MOCK_MODE) return delay({ ...mockSimulacionFactibilidad, zonaId });
}

// GET /api/analisis/historial
export async function getHistorialAnalisis() {
  if (MOCK_MODE) return delay(mockHistorialAnalisis);
}

// ---- Proveedores B2B ------------------------------------------------------
// GET /api/proveedores?zonaId=&categoria=
export async function getProveedores(filtros = {}) {
  if (MOCK_MODE) {
    let data = mockProveedores;
    if (filtros.categoria) {
      data = data.filter((p) => p.categoria === filtros.categoria);
    }
    return delay(data);
  }
}

// ---- Reportes ---------------------------------------------------------------
// POST /api/reportes/ejecutivo  -> devuelve URL o blob del PDF generado
export async function generarReporteEjecutivo(payload) {
  if (MOCK_MODE) return delay({ ok: true, url: '#', generadoEn: new Date().toISOString() });
}
