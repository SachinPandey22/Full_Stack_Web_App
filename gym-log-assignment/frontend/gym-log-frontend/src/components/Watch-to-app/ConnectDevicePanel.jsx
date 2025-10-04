import { useEffect, useMemo, useState } from "react";
import { createPairingCode, fetchDevices, revokeDevice } from "../../services/pairing";

function formatRelTime(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
}

function useCountdown(expiresAtIso) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!expiresAtIso) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [expiresAtIso]);

  return useMemo(() => {
    if (!expiresAtIso) return { seconds: 0, done: true };
    const diff = Math.max(0, Math.floor((new Date(expiresAtIso).getTime() - now) / 1000));
    return { seconds: diff, done: diff <= 0 };
  }, [expiresAtIso, now]);
}

export default function ConnectDevicePanel() {
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState([]);
  const [err, setErr] = useState("");
  const [pairing, setPairing] = useState(null); // { code, expires_at }
  const { seconds, done } = useCountdown(pairing?.expires_at);

  async function loadDevices() {
    setErr("");
    try {
      const list = await fetchDevices();
      setDevices(Array.isArray(list) ? list : []);
    } catch (e) {
      setErr(e.message || "Failed to load devices");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDevices();
  }, []);

  async function onGenerateCode() {
    setErr("");
    try {
      const p = await createPairingCode();
      setPairing(p);
    } catch (e) {
      setErr(e.message || "Failed to create pairing code");
    }
  }

  async function onRevoke(id) {
    setErr("");
    try {
      await revokeDevice(id);
      await loadDevices();
    } catch (e) {
      setErr(e.message || "Failed to revoke");
    }
  }

  function copyCode() {
    if (!pairing?.code) return;
    navigator.clipboard?.writeText(pairing.code);
  }

  return (
    <div className="w-full h-full p-6 bg-white rounded-2xl shadow-md ring-1 ring-black/5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Connect Your Watch</h2>
        {loading ? (
          <span className="text-sm text-gray-500">Loading…</span>
        ) : devices.length ? (
          <span className="text-sm text-emerald-600">{devices.length} device(s) connected</span>
        ) : (
          <span className="text-sm text-gray-500">No devices connected</span>
        )}
      </div>

      {err && (
        <div className="mb-4 rounded-lg bg-red-50 text-red-700 px-3 py-2 text-sm">
          {err}
        </div>
      )}

      {/* Connected devices */}
      {devices.length > 0 && (
        <div className="mb-6">
          <div className="text-sm font-medium mb-2">Connected Devices</div>
          <ul className="space-y-2">
            {devices.map((d) => (
              <li key={d.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="text-sm">
                  <div className="font-semibold">{d.platform?.toUpperCase() || "Device"}</div>
                  <div className="text-gray-600">Last sync: {d.last_seen ? formatRelTime(d.last_seen) : "—"}</div>
                </div>
                <button
                  onClick={() => onRevoke(d.id)}
                  className="text-red-600 hover:bg-red-50 rounded-lg px-3 py-1 text-sm border border-red-200"
                >
                  Disconnect
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Pairing code section */}
      <div className="mt-auto">
        {!pairing ? (
          <div className="rounded-xl bg-indigo-50 p-4">
            <div className="font-semibold mb-1">Step 1: Generate your pairing code</div>
            <p className="text-sm text-gray-700 mb-3">
              You’ll enter this code in the mobile app to link your watch.
            </p>
            <button
              onClick={onGenerateCode}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 text-white px-4 py-2 shadow hover:bg-indigo-700"
            >
              Generate pairing code
            </button>
          </div>
        ) : (
          <div className="rounded-xl border p-4">
            <div className="text-sm text-gray-700 mb-2">Your pairing code</div>
            <div className="flex items-center gap-3 mb-1">
              <div className="text-3xl font-extrabold tracking-widest">{pairing.code}</div>
              <button
                onClick={copyCode}
                className="px-3 py-1 rounded-lg border text-sm hover:bg-gray-50"
              >
                Copy
              </button>
            </div>
            <div className="text-xs text-gray-500 mb-4">
              Expires in {done ? "0" : seconds}s (at {formatRelTime(pairing.expires_at)})
            </div>

            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-gray-50 p-3">
                <div className="font-semibold mb-1">Android (Health Connect)</div>
                <ol className="list-decimal list-inside space-y-1 text-gray-700">
                  <li>Install the bridge app on your phone</li>
                  <li>Open it and enter the pairing code above</li>
                  <li>Allow Health Connect permissions</li>
                </ol>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <div className="font-semibold mb-1">iOS (HealthKit)</div>
                <ol className="list-decimal list-inside space-y-1 text-gray-700">
                  <li>Install the bridge app on your iPhone</li>
                  <li>Open it and enter the pairing code above</li>
                  <li>Allow Health access when prompted</li>
                </ol>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={onGenerateCode}
                className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50"
              >
                Generate new code
              </button>
              <button
                onClick={loadDevices}
                className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50"
              >
                Refresh status
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
