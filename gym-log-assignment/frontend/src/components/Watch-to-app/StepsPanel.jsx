import { useEffect, useState } from "react";
import { fetchSteps } from "../../services/steps";

export default function StepsPanel() {
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState("");

  async function load() {
    try { setRows(await fetchSteps({ limit: 200 })); setErr(""); }
    catch (e) { setErr(e?.message || "Failed to load steps"); }
  }

  useEffect(() => { load(); }, []);

  if (err) return <p style={{ color: "crimson" }}>Error: {err}</p>;
  if (!rows) return <p>Loading steps…</p>;
  if (!rows.length) return <p>No step data yet.</p>;

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0 }}>Your recent steps</h3>
        <button onClick={load}>Refresh</button>
      </div>
      <table style={{ width: "100%", marginTop: 8 }}>
        <thead>
          <tr><th>Start</th><th>End</th><th>Steps</th><th>Source</th></tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.ext_id || i}>
              <td>{new Date(r.start).toLocaleString()}</td>
              <td>{new Date(r.end).toLocaleString()}</td>
              <td>{r.steps}</td>
              <td>{r.source}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
