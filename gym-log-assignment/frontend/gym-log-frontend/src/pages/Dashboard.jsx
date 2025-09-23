import React from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Button from '../components/common/Button/Button';

export default function Dashboard() {
  const { user, clearSession } = useAuth();

  const onLogout = () => {
    clearSession();
    toast.success('Signed out');
    window.location.href = '/login';
  };

  return (
    <div style={{maxWidth: 720, margin: '40px auto'}}>
      <h2>Dashboard</h2>
      <p>Welcome {user?.email || 'athlete'}!</p>
      <Button onClick={onLogout}>Logout</Button>
    </div>
  );
}
