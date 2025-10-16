import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getNutritionTargets, getProfile } from '../../services/api';

export default function NutritionPage() {
  const { getAccessToken } = useAuth();
  const navigate = useNavigate();
  const [targets, setTargets] = useState(null);
  const [profile, setProfile]   = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const token = getAccessToken();
      if (!token) {
        toast.error('Please log in.');
        setLoading(false);
        return;
      }
      try {
        // Load profile (left panel)
        const p = await getProfile(token);
        // Load targets (right panel)
        const t = await getNutritionTargets(token);

        // Normalize possible shapes for targets
        const normalizedTargets = t?.macros ? t : {
          ...t,
          macros: {
            protein_g: t?.protein_g ?? 0,
            fat_g:     t?.fat_g ?? 0,
            carbs_g:   t?.carbs_g ?? 0,
          },
          assumptions: t?.meta || {},
        };

        if (mounted) {
          setProfile(p);
          setTargets(normalizedTargets);
        }
      } catch (err) {
        const detail = err?.response?.data;
        if (detail?.missing_fields) {
          toast.error(`Complete your profile: ${detail.missing_fields.join(', ')}`);
        } else if (detail?.detail) {
          toast.error(detail.detail);
        } else {
          toast.error('Could not load data. Please try again.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [getAccessToken]);

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.skeletonRow}>
          <div style={{...styles.card, ...styles.skel}} />
          <div style={{...styles.card, ...styles.skel}} />
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Left: Profile card */}
      <aside style={styles.leftCol}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Your Profile</h2>
          {!profile ? (
            <p style={styles.muted}>No profile found.</p>
          ) : (
            <ul style={styles.kvList}>
              <KV k="Name" v={profile.name || '—'} />
              <KV k="Sex" v={profile.sex || '—'} />
              <KV k="Age" v={profile.age ?? '—'} />
              <KV k="Height" v={profile.height ? `${profile.height} cm` : '—'} />
              <KV k="Weight" v={profile.weight ? `${profile.weight} kg` : '—'} />
              <KV k="Goal" v={profile.goal || '—'} />
              <KV k="Activity" v={profile.activity_level || '—'} />
            </ul>
          )}
          <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
            {/* Use Link or navigate (no full reload, no token loss) */}
            <Link to="/profile" style={styles.primaryBtn}>Adjust Profile</Link>
            <button onClick={() => navigate('/dashboard')} style={styles.ghostBtn}>Back to Dashboard</button>
          </div>
        </div>
      </aside>

      {/* Right: Targets */}
      <main style={styles.rightCol}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Nutrition Targets</h2>

          {!targets ? (
            <>
              <p style={styles.muted}>Nothing to display. Check your profile information.</p>
              <Link to="/profile" style={styles.primaryBtn}>Go to Profile</Link>
            </>
          ) : (
            <>
              <div style={styles.statsGrid}>
                <Stat label="BMR" value={`${Math.round(targets.bmr)} kcal/day`} />
                <Stat label="TDEE" value={`${Math.round(targets.tdee)} kcal/day`} />
                <Stat label="Target" value={`${Math.round(targets.target_calories)} kcal/day`} />
                <div style={styles.statBox}>
                  <div style={styles.statLabel}>Assumptions</div>
                  <div style={styles.assumptions}>
                    <span>Activity × {targets.assumptions?.activity_multiplier ?? '—'}</span>
                    <span>Goal {Math.round((targets.assumptions?.goal_adjustment ?? 0) * 100)}%</span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 20 }}>
                <h3 style={styles.sectionTitle}>Macro Split (grams/day)</h3>
                <MacroRow label="Protein" grams={targets.macros?.protein_g ?? 0} color="#6366f1" />
                <MacroRow label="Fat"     grams={targets.macros?.fat_g ?? 0}   color="#f59e0b" />
                <MacroRow label="Carbs"   grams={targets.macros?.carbs_g ?? 0} color="#22c55e" />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

/* ---------- small helpers ---------- */

function KV({ k, v }) {
  return (
    <li style={styles.kvRow}>
      <span style={styles.kKey}>{k}</span>
      <span style={styles.kVal}>{v}</span>
    </li>
  );
}

function Stat({ label, value }) {
  return (
    <div style={styles.statBox}>
      <div style={styles.statLabel}>{label}</div>
      <div style={styles.statValue}>{value}</div>
    </div>
  );
}

function MacroRow({ label, grams = 0, color = '#4a90e2' }) {
  const pct = Math.min(100, (grams / 300) * 100); // simple relative bar
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={styles.macroRowTop}>
        <span>{label}</span>
        <strong>{Math.round(grams)} g</strong>
      </div>
      <div style={styles.barTrack}>
        <div style={{ ...styles.barFill, width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

/* ---------- styles (inline to match your current approach) ---------- */
const styles = {
  page:   { maxWidth: 1100, margin: '0 auto', padding: 16 },
  leftCol:{ width: 320, flex: '0 0 320px' },
  rightCol:{ flex: 1 },
  skeletonRow:{ display: 'flex', gap: 16 },
  card:   { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  skel:   { height: 240, background: '#f3f4f6' },
  cardTitle:{ margin: 0, fontSize: 20, fontWeight: 700 },
  sectionTitle:{ margin: 0, fontSize: 18, fontWeight: 700 },
  kvList: { listStyle: 'none', padding: 0, margin: '12px 0 0 0', display: 'grid', rowGap: 8 },
  kvRow:  { display: 'flex', justifyContent: 'space-between' },
  kKey:   { color: '#6b7280' },
  kVal:   { fontWeight: 600 },
  primaryBtn:{ background:'#111827', color:'#fff', padding:'8px 12px', borderRadius:8, border:'none', textDecoration:'none', display:'inline-block' },
  ghostBtn:  { background:'transparent', color:'#111827', padding:'8px 12px', borderRadius:8, border:'1px solid #d1d5db' },
  statsGrid:{ display:'grid', gridTemplateColumns:'repeat(4, minmax(0,1fr))', gap:12, marginTop:12 },
  statBox:  { border:'1px solid #e5e7eb', borderRadius:10, padding:12, background:'#fafafa' },
  statLabel:{ fontSize:12, color:'#6b7280' },
  statValue:{ fontSize:18, fontWeight:700 },
  assumptions:{ display:'flex', flexDirection:'column', gap:4, marginTop:6, color:'#374151' },
  macroRowTop:{ display:'flex', justifyContent:'space-between' },
  barTrack:{ height:8, background:'#eee', borderRadius: 999, overflow:'hidden' },
  barFill:{ height:8, borderRadius:999 },
  // two-column layout wrapper:
  pageRow:{ display:'flex', gap:16 },
};

// turn page into two columns using a wrapper div
styles.page = { ...styles.page, display: 'flex', gap: 16 };
