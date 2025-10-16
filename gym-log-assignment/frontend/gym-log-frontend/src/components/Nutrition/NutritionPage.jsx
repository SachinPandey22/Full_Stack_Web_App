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
        const p = await getProfile(token);
        const t = await getNutritionTargets(token);

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
        <div style={styles.container}>
          <div style={styles.skeletonGrid}>
            <div style={{...styles.skeletonCard, ...styles.leftSkeleton}} />
            <div style={{...styles.skeletonCard, ...styles.rightSkeleton}} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.pageTitle}>Nutrition Dashboard</h1>
            <p style={styles.pageSubtitle}>Track your daily nutrition targets and macro breakdown</p>
          </div>
          <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{marginRight: 6}}>
              <path d="M15 10H5M5 10L10 15M5 10L10 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Dashboard
          </button>
        </div>

        <div style={styles.grid}>
          {/* Left: Profile card */}
          <aside style={styles.leftCol}>
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.iconWrapper}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 style={styles.cardTitle}>Your Profile</h2>
              </div>
              
              {!profile ? (
                <div style={styles.emptyState}>
                  <p style={styles.emptyText}>No profile found.</p>
                </div>
              ) : (
                <div style={styles.profileGrid}>
                  <ProfileItem icon="👤" label="Name" value={profile.name || '—'} />
                  <ProfileItem icon="⚧" label="Sex" value={profile.sex || '—'} />
                  <ProfileItem icon="🎂" label="Age" value={profile.age ?? '—'} />
                  <ProfileItem icon="📏" label="Height" value={profile.height ? `${profile.height} cm` : '—'} />
                  <ProfileItem icon="⚖️" label="Weight" value={profile.weight ? `${profile.weight} kg` : '—'} />
                  <ProfileItem icon="🎯" label="Goal" value={profile.goal || '—'} />
                  <ProfileItem icon="🏃" label="Activity" value={profile.activity_level || '—'} span2 />
                </div>
              )}
              
              <div style={styles.cardFooter}>
                <Link to="/profile" style={styles.primaryBtn}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{marginRight: 6}}>
                    <path d="M11.333 2.00004C11.5081 1.82494 11.716 1.68605 11.9447 1.59129C12.1735 1.49653 12.4187 1.44775 12.6663 1.44775C12.914 1.44775 13.1592 1.49653 13.3879 1.59129C13.6167 1.68605 13.8246 1.82494 13.9997 2.00004C14.1748 2.17513 14.3137 2.383 14.4084 2.61178C14.5032 2.84055 14.552 3.08575 14.552 3.33337C14.552 3.58099 14.5032 3.82619 14.4084 4.05497C14.3137 4.28374 14.1748 4.49161 13.9997 4.66671L5.33301 13.3334L1.33301 14.6667L2.66634 10.6667L11.333 2.00004Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Edit Profile
                </Link>
              </div>
            </div>
          </aside>

          {/* Right: Targets */}
          <main style={styles.rightCol}>
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.iconWrapper}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 11L12 14L22 4M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 style={styles.cardTitle}>Nutrition Targets</h2>
              </div>

              {!targets ? (
                <div style={styles.emptyState}>
                  <p style={styles.emptyText}>Nothing to display. Check your profile information.</p>
                  <Link to="/profile" style={styles.primaryBtn}>Go to Profile</Link>
                </div>
              ) : (
                <>
                  <div style={styles.statsGrid}>
                    <StatCard 
                      label="BMR" 
                      value={Math.round(targets.bmr)} 
                      unit="kcal/day" 
                      color="#8b5cf6"
                      icon="🔥"
                    />
                    <StatCard 
                      label="TDEE" 
                      value={Math.round(targets.tdee)} 
                      unit="kcal/day" 
                      color="#3b82f6"
                      icon="⚡"
                    />
                    <StatCard 
                      label="Target" 
                      value={Math.round(targets.target_calories)} 
                      unit="kcal/day" 
                      color="#10b981"
                      icon="🎯"
                    />
                  </div>

                  <div style={styles.assumptionsCard}>
                    <h4 style={styles.assumptionsTitle}>Calculation Factors</h4>
                    <div style={styles.assumptionsTags}>
                      <span style={styles.tag}>
                        Activity × {targets.assumptions?.activity_multiplier ?? '—'}
                      </span>
                      <span style={styles.tag}>
                        Goal {Math.round((targets.assumptions?.goal_adjustment ?? 0) * 100)}%
                      </span>
                    </div>
                  </div>

                  <div style={styles.macroSection}>
                    <h3 style={styles.sectionTitle}>Daily Macro Breakdown</h3>
                    <p style={styles.sectionSubtitle}>Recommended macronutrient distribution</p>
                    
                    <div style={styles.macrosGrid}>
                      <MacroCard 
                        label="Protein" 
                        grams={targets.macros?.protein_g ?? 0} 
                        color="#6366f1"
                        icon="🥩"
                        gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                      />
                      <MacroCard 
                        label="Fat" 
                        grams={targets.macros?.fat_g ?? 0} 
                        color="#f59e0b"
                        icon="🥑"
                        gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                      />
                      <MacroCard 
                        label="Carbs" 
                        grams={targets.macros?.carbs_g ?? 0} 
                        color="#22c55e"
                        icon="🍞"
                        gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

/* ---------- Component Helpers ---------- */

function ProfileItem({ icon, label, value, span2 }) {
  return (
    <div style={{...styles.profileItem, ...(span2 ? styles.profileItemSpan2 : {})}}>
      <div style={styles.profileIcon}>{icon}</div>
      <div style={styles.profileContent}>
        <div style={styles.profileLabel}>{label}</div>
        <div style={styles.profileValue}>{value}</div>
      </div>
    </div>
  );
}

function StatCard({ label, value, unit, color, icon }) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statIcon}>{icon}</div>
      <div style={styles.statLabel}>{label}</div>
      <div style={styles.statValue}>{value.toLocaleString()}</div>
      <div style={styles.statUnit}>{unit}</div>
    </div>
  );
}

function MacroCard({ label, grams = 0, color, icon, gradient }) {
  const calories = label === 'Protein' ? grams * 4 : label === 'Fat' ? grams * 9 : grams * 4;
  
  return (
    <div style={styles.macroCard}>
      <div style={{...styles.macroCardHeader, background: gradient}}>
        <span style={styles.macroIcon}>{icon}</span>
        <span style={styles.macroLabel}>{label}</span>
      </div>
      <div style={styles.macroCardBody}>
        <div style={styles.macroAmount}>{Math.round(grams)}<span style={styles.macroUnit}>g</span></div>
        <div style={styles.macroCals}>{Math.round(calories)} kcal</div>
      </div>
    </div>
  );
}

/* ---------- Styles ---------- */
const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #f8fafc, #f1f5f9)',
    padding: '32px 16px',
  },
  container: {
    maxWidth: 1200,
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    flexWrap: 'wrap',
    gap: 16,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: 800,
    margin: 0,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  pageSubtitle: {
    fontSize: 16,
    color: '#64748b',
    margin: '8px 0 0 0',
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    background: '#fff',
    color: '#334155',
    padding: '10px 18px',
    borderRadius: 10,
    border: '1px solid #e2e8f0',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    transition: 'all 0.2s',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '340px 1fr',
    gap: 24,
    '@media (max-width: 968px)': {
      gridTemplateColumns: '1fr',
    },
  },
  leftCol: {},
  rightCol: {},
  card: {
    background: '#fff',
    borderRadius: 16,
    padding: 24,
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
    border: '1px solid #f1f5f9',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottom: '2px solid #f1f5f9',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 700,
    color: '#1e293b',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
  },
  emptyText: {
    color: '#94a3b8',
    marginBottom: 16,
  },
  profileGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 12,
    marginBottom: 20,
  },
  profileItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    padding: 12,
    background: '#f8fafc',
    borderRadius: 10,
    border: '1px solid #e2e8f0',
  },
  profileItemSpan2: {
    gridColumn: 'span 2',
  },
  profileIcon: {
    fontSize: 20,
    lineHeight: 1,
  },
  profileContent: {
    flex: 1,
    minWidth: 0,
  },
  profileLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  profileValue: {
    fontSize: 15,
    fontWeight: 700,
    color: '#1e293b',
    marginTop: 4,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  cardFooter: {
    paddingTop: 16,
    borderTop: '1px solid #f1f5f9',
  },
  primaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    padding: '12px 20px',
    borderRadius: 10,
    border: 'none',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: 14,
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
    transition: 'all 0.2s',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    padding: 20,
    background: 'linear-gradient(135deg, #667eea08 0%, #764ba208 100%)',
    borderRadius: 12,
    border: '1px solid #e2e8f0',
    textAlign: 'center',
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 800,
    color: '#1e293b',
    lineHeight: 1,
  },
  statUnit: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 4,
  },
  assumptionsCard: {
    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  assumptionsTitle: {
    margin: '0 0 12px 0',
    fontSize: 14,
    fontWeight: 700,
    color: '#78350f',
  },
  assumptionsTags: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  tag: {
    background: '#fff',
    color: '#92400e',
    padding: '6px 12px',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    border: '1px solid #fbbf24',
  },
  macroSection: {
    marginTop: 32,
  },
  sectionTitle: {
    margin: 0,
    fontSize: 18,
    fontWeight: 700,
    color: '#1e293b',
  },
  sectionSubtitle: {
    margin: '6px 0 20px 0',
    fontSize: 14,
    color: '#64748b',
  },
  macrosGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 16,
  },
  macroCard: {
    borderRadius: 12,
    overflow: 'hidden',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  macroCardHeader: {
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  macroIcon: {
    fontSize: 24,
  },
  macroLabel: {
    color: '#fff',
    fontWeight: 700,
    fontSize: 16,
  },
  macroCardBody: {
    padding: '20px 16px',
    background: '#fff',
    textAlign: 'center',
  },
  macroAmount: {
    fontSize: 36,
    fontWeight: 800,
    color: '#1e293b',
    lineHeight: 1,
  },
  macroUnit: {
    fontSize: 18,
    fontWeight: 600,
    color: '#94a3b8',
    marginLeft: 4,
  },
  macroCals: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 8,
    fontWeight: 600,
  },
  skeletonGrid: {
    display: 'grid',
    gridTemplateColumns: '340px 1fr',
    gap: 24,
  },
  skeletonCard: {
    background: 'linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
    borderRadius: 16,
  },
  leftSkeleton: {
    height: 400,
  },
  rightSkeleton: {
    height: 600,
  },
};

// Add keyframe animation for skeleton
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  
  @media (max-width: 968px) {
    .grid { grid-template-columns: 1fr !important; }
    .skeletonGrid { grid-template-columns: 1fr !important; }
  }
`;
document.head.appendChild(styleSheet);

