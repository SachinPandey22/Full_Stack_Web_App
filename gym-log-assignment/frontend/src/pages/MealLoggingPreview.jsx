import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardCard from '../components/MealLogging/DashboardCard';

const MealLoggingPreview = () => {
  const navigate = useNavigate();
  return <DashboardCard handleOpenMealTracker={() => navigate('/meal-logging')} />;
};

export default MealLoggingPreview;
