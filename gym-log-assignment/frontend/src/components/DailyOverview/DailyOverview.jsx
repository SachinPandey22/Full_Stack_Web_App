import React, { useEffect, useMemo, useState } from 'react';
import { format, isSameDay } from 'date-fns';
import { fetchMealSummary, fetchWaterIntake } from '../../services/MealLogging';
import { getNutritionTargets, getUserWorkouts } from '../../services/api';
const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
};
const statCardStyle = {
  background: 'white',
  borderRadius: '12px',
  padding: '16px',
  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
};
const labelStyle = {
  fontSize: '12px',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: '#64748b',
};
const valueStyle = {
  fontSize: '24px',
  fontWeight: 700,
  color: '#0f172a',
};
const subLabelStyle = {
  fontSize: '13px',
  color: '#64748b',
};
function ProgressBar({ percent, accent = '#38bdf8' }) {
  const safePercent = Number.isFinite(percent) ? Math.min(100, Math.max(0, percent)) : 0;
  return (
    <div style={{ width: '100%', height: '6px', borderRadius: '999px', background: '#e2e8f0' }}>
      <div
        style={{
          width: `${safePercent}%`,
          height: '100%',
          borderRadius: '999px',
          background: accent,
          transition: 'width 0.3s ease',
        }}
      />
    </div>
  );
}

function DailyOverview() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const today = useMemo(() => new Date(), []);
  useEffect(() => {
    let isMounted = true;
    const loadSummary = async () => {
      setLoading(true);
      setError(null);
      try {
        const todayISO = format(today, 'yyyy-MM-dd');
        let nutritionTargets = null;
        try {
          nutritionTargets = await getNutritionTargets();
        } catch (err) {
          if (err?.response?.status !== 404) {
            console.error('Failed to load nutrition targets', err);
            throw err;
          }
        }
        const [daySummaryData, workoutsData, waterData] = await Promise.all([
          fetchMealSummary(todayISO),
          getUserWorkouts().catch((err) => {
            console.error('Failed to load workouts', err);
            return [];
          }),
          fetchWaterIntake(todayISO).catch((err) => {
            if (err?.response?.status !== 404) {
              console.error('Failed to load water intake', err);
            }
            return null;
          }),
        ]);
        if (!isMounted) return;
        const totals = daySummaryData?.totals || {};
        const remaining = daySummaryData?.remaining || {};
        const targets = daySummaryData?.targets || {};
        const proteinToday = totals.protein ?? 0;
        const proteinTarget =
          targets.protein ??
          nutritionTargets?.macros?.protein_g ??
          null;
        const caloriesConsumed = totals.calories ?? 0;
        const caloriesTarget =
          targets.calories ??
          nutritionTargets?.target_calories ??
          null;
        const caloriesRemaining =
          remaining.calories ??
          (caloriesTarget != null
            ? caloriesTarget - caloriesConsumed
            : null);
        const workoutsToday = (workoutsData || []).filter((workout) => {
          if (!workout?.added_date) return false;
          const parsed = new Date(workout.added_date);
          return !Number.isNaN(parsed.valueOf()) && isSameDay(parsed, today);
        }).length;
        const hydrationGlasses = waterData?.glasses ?? 0;
        const hydrationGlassSize = waterData?.glass_size ?? 500;
        const hydrationTotalMl =
          waterData?.total_ml ?? hydrationGlasses * hydrationGlassSize;
        const hydrationGoalGlasses = 8;
        const hydrationGoalMl = hydrationGlassSize * hydrationGoalGlasses;

        setSummary({
          dateLabel: format(today, 'EEEE, MMM d'),
          tdee: nutritionTargets?.tdee ?? null,
          caloriesConsumed,
          caloriesTarget,
          caloriesRemaining,
          workoutsToday,
          proteinToday,
          proteinTarget,
          hydration: {
            glasses: hydrationGlasses,
            glassSize: hydrationGlassSize,
            totalMl: hydrationTotalMl,
            goalGlasses: hydrationGoalGlasses,
            goalMl: hydrationGoalMl,
          },
        });
      } catch (err) {
        console.error('Failed to load daily summary', err);
        if (isMounted) {
          setError('Unable to load your daily snapshot right now.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadSummary();
    return () => {
      isMounted = false;
    };
  }, [today]);
  const renderBody = () => {
    if (loading) {
      return (
        <div style={{ padding: '24px', textAlign: 'center', color: '#475569' }}>
          Loading today&apos;s stats...
        </div>
      );
    }
    if (error) {
      return (
        <div
          style={{
            padding: '24px',
            textAlign: 'center',
            color: '#dc2626',
            fontWeight: 500,
          }}
        >
          {error}
        </div>
      );
    }
    if (!summary) {
      return (
        <div
          style={{
            padding: '24px',
            textAlign: 'center',
            color: '#475569',
            fontWeight: 500,
          }}
        >
          No data yet. Start logging meals or workouts to see your summary.
        </div>
      );
    }
    const {
      dateLabel,
      tdee,
      caloriesConsumed,
      caloriesTarget,
      caloriesRemaining,
      workoutsToday,
      proteinToday,
      proteinTarget,
      hydration,
    } = summary;
    const proteinDelta =
      proteinTarget != null ? proteinTarget - proteinToday : null;
    const caloriesPercent =
      caloriesTarget != null && caloriesTarget > 0
        ? (caloriesConsumed / caloriesTarget) * 100
        : null;
    const proteinPercent =
      proteinTarget != null && proteinTarget > 0
        ? (proteinToday / proteinTarget) * 100
        : null;
    const hydrationGoalMl = hydration?.goalMl ?? 0;
    const hydrationPercent =
      hydrationGoalMl > 0 ? ((hydration?.totalMl ?? 0) / hydrationGoalMl) * 100 : 0;
    const glassesRemaining =
      hydration?.goalGlasses != null
        ? Math.max(hydration.goalGlasses - (hydration?.glasses ?? 0), 0)
        : null;

    return (
      <>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: '16px',
          }}
        >
          <div>
            {/*<h3 style={{ margin: 0, fontSize: '22px', color: '#0f172a' }}>
              Today&apos;s Summary
            </h3>*/}
            <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
              {dateLabel}
            </p>
          </div>
          {caloriesRemaining != null && (
            <span
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: caloriesRemaining >= 0 ? '#16a34a' : '#dc2626',
              }}
            >
              {caloriesRemaining >= 0
                ? `${Math.round(caloriesRemaining)} kcal left`
                : `${Math.abs(Math.round(caloriesRemaining))} kcal over`}
            </span>
          )}
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '12px',
          }}
        >
          <div style={statCardStyle}>
            <span style={labelStyle}>TDEE</span>
            <span style={valueStyle}>
              {tdee != null ? `${Math.round(tdee)} kcal` : 'Set up profile'}
            </span>
            <span style={subLabelStyle}>
              Based on your profile &amp; activity
            </span>
          </div>
          <div style={statCardStyle}>
            <span style={labelStyle}>Calories</span>
            <span style={valueStyle}>
              {Math.round(caloriesConsumed || 0)} kcal
            </span>
            <span style={subLabelStyle}>
              Target: {caloriesTarget != null ? `${Math.round(caloriesTarget)} kcal` : 'Not set'}
            </span>
            {caloriesPercent != null && (
              <div style={{ marginTop: '8px' }}>
                <ProgressBar percent={caloriesPercent} accent="#fb7185" />
                <span style={{ ...subLabelStyle, display: 'block', marginTop: '4px' }}>
                  {Math.min(100, Math.round(caloriesPercent))}% of goal
                </span>
              </div>
            )}
          </div>
          <div style={statCardStyle}>
            <span style={labelStyle}>Workouts</span>
            <span style={valueStyle}>{workoutsToday}</span>
            <span style={subLabelStyle}>Logged today</span>
          </div>
        </div>
        <div
          style={{
            marginTop: '18px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '14px',
          }}
        >
          <div
            style={{
              borderRadius: '16px',
              padding: '20px',
              background: 'linear-gradient(135deg, #4c1d95, #7c3aed)',
              color: 'white',
              boxShadow: '0 8px 18px rgba(76, 29, 149, 0.25)',
            }}
          >
            <div style={{ fontSize: '13px', letterSpacing: '0.12em', opacity: 0.8 }}>
              Protein Today
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700, margin: '8px 0' }}>
              {Math.round(proteinToday || 0)} g
            </div>
            <div style={{ margin: '10px 0' }}>
              {proteinPercent != null && (
                <ProgressBar percent={proteinPercent} accent="#c4b5fd" />
              )}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>
              {proteinTarget != null
                ? `Goal: ${Math.round(proteinTarget)} g (${proteinDelta >= 0 ? `${Math.round(proteinDelta)} g to go` : `${Math.abs(Math.round(proteinDelta))} g over`})`
                : 'Set your daily targets to get a protein goal.'}
            </div>
          </div>
          <div
            style={{
              borderRadius: '16px',
              padding: '20px',
              background: 'linear-gradient(135deg, #0f766e, #14b8a6)',
              color: 'white',
              boxShadow: '0 8px 18px rgba(15, 118, 110, 0.25)',
            }}
          >
            <div style={{ fontSize: '13px', letterSpacing: '0.12em', opacity: 0.8 }}>
              Hydration
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, margin: '8px 0' }}>
              {hydration?.glasses ?? 0}/{hydration?.goalGlasses ?? 8} glasses
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>
              {Math.round(hydration?.totalMl ?? 0)} ml logged ·{' '}
              {glassesRemaining != null
                ? `${glassesRemaining} glass${glassesRemaining === 1 ? '' : 'es'} to go`
                : 'Add a water entry to unlock tips'}
            </div>
            <div style={{ marginTop: '12px' }}>
              <ProgressBar percent={hydrationPercent} accent="#99f6e4" />
            </div>
          </div>
        </div>
      </>
    );
  };
  return (
    <div style={containerStyle}>
      {renderBody()}
    </div>
  );
}
export default DailyOverview;
