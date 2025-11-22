//  for authenticated users
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Button from '../components/common/Button/Button';
import { NotificationsBell, NotificationsDropdown } from '../components/Notifications/Index'
import {ProfileIcon, ProfileDropdown } from '../components/Profile/Index'

// Importing sub-components for the dashboard
import WorkoutActivity from '../components/WorkoutActivity/WorkoutActivity';
import NutritionTarget from '../components/NutritionTarget/NutritionTarget';
import ProgressMotivation from '../components/ProgressMotivation/ProgressMotivation';
import QuickActions from '../components/QuickActions/QuickActions';
import ConnectDevicePanel from "../components/Watch-to-app/ConnectDevicePanel";
import NutritionCard from "../components/Nutrition/NutritionCard";
import DailyOverview from '../components/DailyOverview/DailyOverview';
import Macros from '../components/Macros/Macros';
import DashboardCard from '../components/MealLogging/DashboardCard';
import { getProfile, deleteAccount } from '../services/api';
import { useNavigate } from 'react-router-dom';
import AppNavBar from '../components/layout/AppNavBar';
import { getDaysSince } from '../utils/dateUtils';
import '../styles/profileUpdate.css';
import NutritionTrends from '../components/Nutrition/NutritionTrends';
import MealLog from '../components/MealLog/MealLog';
// for authenticated users
export default function Dashboard() {
  const { user, clearSession, getAccessToken, profile, isProfileLoading, profileUpdatedAt } = useAuth();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const anchorRef = useRef(null);
  const reminderShownRef = useRef(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const notifAnchorRef = useRef(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const daysSinceUpdate = getDaysSince(profileUpdatedAt);
  const needsProfileUpdate = typeof daysSinceUpdate === 'number' && daysSinceUpdate >= 14;

  useEffect(() => {
    if (needsProfileUpdate && !reminderShownRef.current) {
      toast(
        `It’s been ${daysSinceUpdate} days since your last profile update — want updated suggestions?`,
        { icon: '⏰' }
      );
      reminderShownRef.current = true;
    } else if (!needsProfileUpdate) {
      reminderShownRef.current = false;
    }
  }, [needsProfileUpdate, daysSinceUpdate]);

  const onLogout = () => {
    clearSession();
    // localStorage.removeItem('userProfile');
    toast.success('Signed out');
    window.location.href = '/login';
  };
  
const handleDeleteAccount = async () => {
  if (deletingAccount) return;

  const confirmText = window.prompt(
    'This will permanently delete your account and data.\n\nType DELETE to confirm.'
  );

  if (!confirmText) {
    return; // user cancelled
  }

  if (confirmText.trim().toUpperCase() !== 'DELETE') {
    toast.error('You must type DELETE exactly to confirm.');
    return;
  }

  try {
    setDeletingAccount(true);

    const token = getAccessToken();
    if (!token) {
      toast.error('Please log in again.');
      return;
    }

    await deleteAccount(token, confirmText.trim());
    toast.success('Your account has been deleted.');

    clearSession();
    navigate('/login');
  } catch (err) {
    console.error('Delete account error:', err);
    const detail =
      err?.response?.data?.detail ||
      (err?.response ? `Error ${err.response.status}` : 'Could not delete account.');
    toast.error(detail);
  } finally {
    setDeletingAccount(false);
  }
};
  return (
    <>
      <AppNavBar
        rightContent={
          <div style={{ display: 'flex', alignItems: 'center', gap: 56 }}>

            {/* Anchor: bell + controlled dropdown */}
            <div ref={anchorRef} style={{ position: 'relative' }}>
              <NotificationsBell onClick={() => setNotifOpen(v => !v)} hasUnread={false} />
              <NotificationsDropdown
              isOpenExternal={notifOpen}
                onOpenChange={setNotifOpen}
                anchorRef={anchorRef}   
              />
            </div>

            {/* Profile Button */}
                <div ref={notifAnchorRef} style={{ position: 'relative' }}>
      <ProfileIcon onClick={() => setProfileMenuOpen(v => !v)} fullName={profile?.name} />

      <ProfileDropdown
        isOpen={profileMenuOpen}
        onClose={() => setProfileMenuOpen(false)}
        onProfile={() => navigate('/profile')}
        onLogout={onLogout}                 // optional
        onDeleteAccount={handleDeleteAccount} // optional
      />
    </div>
          </div>
          }
        />



    


      

      {/* Fitness Dashboard Layout */}
      <div style={{
        display: 'grid',
        gridTemplateAreas: `
          "overview overview actions actions "
          "overview overview nuttarget macros"
          "workout workout meallog progress"
          "nutritions nutritions meallog progress"
        `,
        gridTemplateColumns: '2fr 1.5fr 1fr 1.5fr',
        gridTemplateRows: `
          minmax(50px, auto) 
          minmax(350px, 50px) 
          minmax(300px, auto) 
          minmax(220px, 1fr)`,
        gap: '10px',
        padding: '10px',
        background: '#f7f9fa',
        minHeight: '100vh'
      }}>
        <div
          style={{
            gridArea: 'overview',
            background: '#b4ecfeff',
            borderRadius: '10px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 10px 20px rgba(15, 23, 42, 0.08)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: '6px 0 0', fontFamily:'sans-serif', fontSize: '26px', color: '#0f172a', fontWeight: 900}}>Daily overview</h3>
            </div>
            <span style={{ fontSize: '40px' }} role="img" aria-label="overview icon">📊</span>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
        <DailyOverview />
        </div>
        </div>
       {/* <div
          style={{
            gridArea: 'meals',
            background: '#fff7e6',
            borderRadius: '10px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: '100%',
          }}
        >
          <DashboardCard handleOpenMealTracker={() => navigate('/meal-logging')} />
        </div>*/}
        <div style={{ gridArea: 'workout', background: '#eeeafc', borderRadius: '20px', padding: '20px' }}>
          <WorkoutActivity />
        </div>
        <div style={{ gridArea: 'nuttarget', background: '#d0f5ea', borderRadius: '10px', padding: '20px' }}>
          <NutritionTarget
            bmr={profile?.bmr}
            tdee={profile?.tdee}
            targetCalories={profile?.target_calories}
          />
        </div>
        <div style={{ gridArea: 'macros', background: '#d0f5ea', borderRadius: '10px', padding: '20px', }}>
          <Macros />
        </div>
        <div style={{ gridArea: 'progress', background: '#eeeafc', borderRadius: '10px', padding: '20px' }}>
          <ProgressMotivation />
        </div>
        <div style={{ gridArea: 'meallog', background: '#b4ecfeff', borderRadius: '10px', padding: '20px' }}>
          <MealLog />
        </div>
        <div style={{ gridArea: 'actions', background: '#e8e6ff', borderRadius: '10px', padding: '20px' }}>
          <QuickActions />
        </div>
        <div style={{ gridArea: 'nutritions', background: '#eef5ff', borderRadius: '20px', padding: '20px' }}>
          <NutritionCard /> 
        </div>        
      </div>
    </>
  );
}
