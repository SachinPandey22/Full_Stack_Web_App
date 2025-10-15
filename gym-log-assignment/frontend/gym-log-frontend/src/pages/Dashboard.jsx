//  for authenticated users
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Button from '../components/common/Button/Button';
import { NotificationsBell } from '../components/Notifications/Index'

// Importing sub-components for the dashboard
import DailyOverview from '../components/DailyOverview/DailyOverview';
import MealLogging from '../components/MealLogging/MealLogging';
import WorkoutActivity from '../components/WorkoutActivity/WorkoutActivity';
import AIPanel from '../components/AIPanel/AIPanel';
import ProgressMotivation from '../components/ProgressMotivation/ProgressMotivation';
import QuickActions from '../components/QuickActions/QuickActions';
import ConnectDevicePanel from "../components/Watch-to-app/ConnectDevicePanel";
import { getProfile } from '../services/api';

// for authenticated users
export default function Dashboard() {
  const { user, clearSession } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

// Reading profile info from localStorage
const { getAccessToken } = useAuth();
const [profile, setProfile] = React.useState(null);

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
    localStorage.removeItem('userProfile');
    toast.success('Signed out');
    window.location.href = '/login';
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Header with user info + logout */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>Welcome {profile?.name ||user?.email || 'athlete'}!</h2>
        {profile?.goal && (
          <p style={{ marginLeft: '290px', color: '#555' }}>
            Goal: {profile.goal}
          </p>
        )}

        <NotificationsBell
          onClick={() => setIsOpen(o => !o)}
          hasUnread={unreadCount > 0}
        />

        <Button onClick={onLogout}>Logout</Button>
      </div>

      {/* Fitness Dashboard Layout */}
      <div style={{
        display: 'grid',
        gridTemplateAreas: `
          "overview overview actions"
          "meals workout aipan"
          "progress progress connect"
        `,
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '5px',
        padding: '10px',
        background: '#f7f9fa',
        minHeight: '100vh'
      }}>
        <div style={{ gridArea: 'overview', background: '#e3f6fc', borderRadius: '10px', padding: '20px' }}>
          <DailyOverview />
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
      </div>
    </div>
  );
}
