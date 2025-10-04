import { apiClient } from './api';

/** Read CSRF token from cookie (only matters if your backend enforces CSRF) */
function getCsrfToken(name = 'csrftoken') {
  const m = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return m ? decodeURIComponent(m[2]) : null;
}

function withCsrf(headers = {}) {
  const token = getCsrfToken();
  return token ? { ...headers, 'X-CSRFToken': token } : headers;
}

/**
 * Create a pairing code for the current user.
 * POST /api/pairing-codes  →  { code, expires_at }
 * If backend uses trailing slashes, change to '/api/pairing-codes/'.
 */
export async function createPairingCode() {
  const res = await apiClient.post(
    '/api/pairing-codes',
    {},
    { headers: withCsrf() }
  );
  return res.data; // { code, expires_at }
}

/**
 * Get the user's connected devices.
 * GET /api/mobile/devices  →  [ { id, platform, last_seen }, ... ]
 * If your backend uses trailing slashes, change to '/api/mobile/devices/'.
 */
export async function fetchDevices() {
  const res = await apiClient.get('/api/mobile/devices');
  return Array.isArray(res.data) ? res.data : [];
}

/**
 * Revoke (unlink) a device by id.
 * DELETE /api/mobile/devices/:id  →  204 or { ok: true }
 * If your backend uses trailing slashes, change to `/api/mobile/devices/${id}/`.
 */
export async function revokeDevice(id) {
  const res = await apiClient.delete(
    `/api/mobile/devices/${id}`,
    { headers: withCsrf() }
  );
  return res.data ?? { ok: true };
}

export async function safeCreatePairingCode() {
  try { return { success: true, data: await createPairingCode() }; }
  catch (e) { return { success: false, error: e?.response?.data || e.message, status: e?.response?.status }; }
}

export async function safeFetchDevices() {
  try { return { success: true, data: await fetchDevices() }; }
  catch (e) { return { success: false, error: e?.response?.data || e.message, status: e?.response?.status }; }
}

export async function safeRevokeDevice(id) {
  try { return { success: true, data: await revokeDevice(id) }; }
  catch (e) { return { success: false, error: e?.response?.data || e.message, status: e?.response?.status }; }
}
