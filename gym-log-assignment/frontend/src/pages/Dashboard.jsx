//  for authenticated users
import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Button from '../components/common/Button/Button';
import { NotificationsBell, NotificationsDropdown } from '../components/Notifications/Index'

// Importing sub-components for the dashboard
import MealLogging from '../components/MealLogging/MealLogging';
import WorkoutActivity from '../components/WorkoutActivity/WorkoutActivity';
import AIPanel from '../components/AIPanel/AIPanel';
import ProgressMotivation from '../components/ProgressMotivation/ProgressMotivation';
import QuickActions from '../components/QuickActions/QuickActions';
import ConnectDevicePanel from "../components/Watch-to-app/ConnectDevicePanel";
import NutritionCard from "../components/Nutrition/NutritionCard";
import { getProfile, deleteAccount } from '../services/api';
import { useNavigate } from 'react-router-dom';
// for authenticated users
export default function Dashboard() {
  const { user, clearSession } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const anchorRef = useRef(null);


// Reading profile info from localStorage
const { getAccessToken } = useAuth();
const [profile, setProfile] = React.useState(null);
const [deletingAccount, setDeletingAccount] = React.useState(false);

React.useEffect(() => {
  const fetchUserProfile = async () => {
    const token = getAccessToken();
    if (!token) return;
    try {
      const data = await getProfile(token);  // ✅ Same function you use in ProfileForm
      setProfile(data);
    } catch (err) {
      console.error("Failed to load profile", err);
    }
  };
  fetchUserProfile();
}, [user, getAccessToken]); 

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
    <div style={{ padding: '20px' }}>
      {/* Header with user info + logout */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h2>Welcome {profile?.name || user?.email || 'athlete'}!</h2>
          <button
            onClick={() => navigate('/profile')}
            style={{
              background: '#ffffff',
              border: '2px solid #007bff',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              color: '#007bff',
              fontSize: '16px',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            title="Edit Profile"
          >
            👤
          </button>
        </div>
        {profile?.goal && (
          <p style={{ marginLeft: '290px', color: '#555' }}>
            Goal: {profile.goal}
          </p>
        )}

        {/* Anchor: bell + controlled dropdown */}
          <div ref={anchorRef} style={{ position: 'relative' }}>
  <NotificationsBell onClick={() => setNotifOpen(v => !v)} hasUnread={false} />
  <NotificationsDropdown
    isOpenExternal={notifOpen}
    onOpenChange={setNotifOpen}
    logoSrc="/notification_image.jpg"
    anchorRef={anchorRef}        // NEW
  />
</div>



        <Button onClick={onLogout}>Logout</Button>
        <Button
          onClick={handleDeleteAccount}
          style={{ marginLeft: '8px', backgroundColor: '#dc2626' }}
          disabled={deletingAccount}
        >
          {deletingAccount ? 'Deleting…' : 'Delete Account'}
        </Button>
      </div>

      {/* Fitness Dashboard Layout */}
      <div style={{
        display: 'grid',
        gridTemplateAreas: `
          "overview overview actions"
          "meals workout aipan"
          "progress nutritions connect"
        `,
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '5px',
        padding: '10px',
        background: '#f7f9fa',
        minHeight: '100vh'
      }}>
        <div
          style={{
            gridArea: 'overview',
            background: '#e3f6fc',
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
              <h3 style={{ margin: '6px 0 0', fontSize: '26px', color: '#0f172a' }}>See your daily overview</h3>
            </div>
            <span style={{ fontSize: '40px' }} role="img" aria-label="overview icon">📊</span>
          </div>
          <p style={{ color: '#475569', marginTop: '12px', lineHeight: 1.5 }}>
            Dive into a dedicated page to view today&apos;s calories, workouts, and macro targets without the rest of the dashboard clutter.
          </p>
          <Button
            onClick={() => navigate('/daily-overview')}
            style={{
              alignSelf: 'flex-start',
              marginTop: 'auto',
              backgroundColor: '#0ea5e9',
              color: '#ffffff',
              padding: '10px 20px',
              borderRadius: '999px'
            }}
          >
            View Daily Overview
          </Button>
        </div>
        <div style={{ gridArea: 'meals', background: '#fff7e6', borderRadius: '10px', padding: '20px' }}>
          <MealLogging />
        </div>
        <div style={{ gridArea: 'workout', background: '#eeeafc', borderRadius: '20px', padding: '20px' }}>
          <WorkoutActivity />
        </div>
        <div style={{ gridArea: 'aipan', background: '#d0f5ea', borderRadius: '10px', padding: '20px' }}>
          <AIPanel />
        </div>
        <div style={{ gridArea: 'progress', background: '#ffe3e3', borderRadius: '10px', padding: '20px' }}>
          <ProgressMotivation />
        </div>
        <div style={{ gridArea: 'actions', background: '#e8e6ff', borderRadius: '10px', padding: '20px' }}>
          <QuickActions />
        </div>
        <div style={{ gridArea: 'connect', background: '#eef5ff', borderRadius: '10px', padding: '20px' }}>
          <ConnectDevicePanel /> 
        </div>
        <div style={{ gridArea: 'nutritions', background: '#eef5ff', borderRadius: '20px', padding: '20px' }}>
          <NutritionCard /> 
        </div>        
      </div>
    </div>
  );
}
