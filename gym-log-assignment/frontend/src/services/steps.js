import { apiClient } from "./api";

export async function fetchSteps({ from, to, limit = 200 } = {}) {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  if (limit) params.set("limit", String(limit));
  const res = await apiClient.get(`/api/mobile/steps?${params.toString()}`);
  return res.data; // array of {start,end,steps,source,ext_id}
}