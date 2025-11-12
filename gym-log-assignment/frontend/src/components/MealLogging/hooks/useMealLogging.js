import { useState, useEffect, useCallback } from 'react';
import { format, addDays, subDays } from 'date-fns';
import {
  getMealsByDate,
  createMeal,
  deleteMeal as apiDeleteMeal,
  getMealTargets,
  saveMealTargets
} from '../../../services/MealLogging';

export const useMealLogging = () => {
  const [showMealLog, setShowMealLog] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [goalsSet, setGoalsSet] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  const [currentDate, setCurrentDate] = useState(new Date());
  const [meals, setMeals] = useState([]);

  const [newMeal, setNewMeal] = useState({
    type: 'breakfast',
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    notes: ''
  });

  const [dailyGoals, setDailyGoals] = useState({
    calories: 2200,
    protein: 165,
    carbs: 220,
    fat: 73
  });

  const [goalInput, setGoalInput] = useState({
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  });

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  };

  const loadMealTargets = async () => {
    try {
      const targets = await getMealTargets();
      if (targets) {
        setDailyGoals({
          calories: targets.daily_calories,
          protein: targets.daily_protein,
          carbs: targets.daily_carbs,
          fat: targets.daily_fat
        });
        setGoalsSet(true);
      }
    } catch (error) {
      console.error('Failed to load meal targets:', error);
    }
  };

  const loadMealsForDate = useCallback(async (date) => {
    try {
      setLoading(true);
      const dateStr = format(date, 'yyyy-MM-dd');
      const mealsData = await getMealsByDate(dateStr);
      const transformedMeals = mealsData.map(meal => ({
        id: meal.id,
        type: meal.meal_type,
        name: meal.name,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat,
        time: meal.time,
        date: date.toDateString(),
        notes: meal.notes || ''
      }));
      setMeals(transformedMeals);
    } catch (error) {
      console.error('Failed to load meals:', error);
      showToast('Failed to load meals');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMealTargets();
  }, []);

  useEffect(() => {
    if (goalsSet) {
      loadMealsForDate(currentDate);
    }
  }, [currentDate, goalsSet, loadMealsForDate]);

  const currentDateMeals = meals.filter(meal => meal.date === currentDate.toDateString());

  const totals = currentDateMeals.reduce((acc, meal) => ({
    calories: acc.calories + meal.calories,
    protein: acc.protein + meal.protein,
    carbs: acc.carbs + meal.carbs,
    fat: acc.fat + meal.fat
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const remaining = dailyGoals.calories - totals.calories;

  const generateWeekData = () => {
    const data = [];
    for (let i = -6; i <= 0; i++) {
      const date = addDays(currentDate, i);
      const dayMeals = meals.filter(meal => meal.date === date.toDateString());
      const dayCalories = dayMeals.reduce((sum, meal) => sum + meal.calories, 0);
      data.push({ day: format(date, 'EEE'), calories: dayCalories, date });
    }
    return data;
  };

  const weekData = generateWeekData();

  const saveGoals = async () => {
    try {
      const newGoals = {
        daily_calories: parseInt(goalInput.calories) || 2200,
        daily_protein: parseInt(goalInput.protein) || 165,
        daily_carbs: parseInt(goalInput.carbs) || 220,
        daily_fat: parseInt(goalInput.fat) || 73
      };

      await saveMealTargets(newGoals);

      setDailyGoals({
        calories: newGoals.daily_calories,
        protein: newGoals.daily_protein,
        carbs: newGoals.daily_carbs,
        fat: newGoals.daily_fat
      });
      setGoalsSet(true);
      setShowGoalsModal(false);
      setShowMealLog(true);
      showToast('🎯 Goals saved successfully!');
    } catch (error) {
      console.error('Failed to save goals:', error);
      showToast('❌ Failed to save goals');
    }
  };

  const addMeal = async () => {
    try {
      setLoading(true);
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const mealData = {
        meal_type: newMeal.type,
        name: newMeal.name,
        calories: parseInt(newMeal.calories) || 0,
        protein: parseInt(newMeal.protein) || 0,
        carbs: parseInt(newMeal.carbs) || 0,
        fat: parseInt(newMeal.fat) || 0,
        date: dateStr,
        time: timeStr,
        notes: newMeal.notes || ''
      };

      const createdMeal = await createMeal(mealData);

      const transformedMeal = {
        id: createdMeal.id,
        type: createdMeal.meal_type,
        name: createdMeal.name,
        calories: createdMeal.calories,
        protein: createdMeal.protein,
        carbs: createdMeal.carbs,
        fat: createdMeal.fat,
        time: createdMeal.time,
        date: currentDate.toDateString(),
        notes: createdMeal.notes || ''
      };

      setMeals([...meals, transformedMeal]);
      setShowModal(false);
      setNewMeal({ type: 'breakfast', name: '', calories: '', protein: '', carbs: '', fat: '', notes: '' });
      showToast('✅ Meal added successfully!');
    } catch (error) {
      console.error('Failed to add meal:', error);
      showToast('❌ Failed to add meal');
    } finally {
      setLoading(false);
    }
  };

  const deleteMeal = async (id) => {
    try {
      setLoading(true);
      await apiDeleteMeal(id);
      setMeals(meals.filter(meal => meal.id !== id));
      showToast('🗑️ Meal deleted');
    } catch (error) {
      console.error('Failed to delete meal:', error);
      showToast('❌ Failed to delete meal');
    } finally {
      setLoading(false);
    }
  };

  const copyYesterday = async () => {
    try {
      setLoading(true);
      const yesterday = subDays(currentDate, 1);
      const yesterdayStr = format(yesterday, 'yyyy-MM-dd');
      const yesterdayMeals = await getMealsByDate(yesterdayStr);

      if (yesterdayMeals.length === 0) {
        showToast('❌ No meals found from yesterday');
        return;
      }

      const todayStr = format(currentDate, 'yyyy-MM-dd');
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      for (const meal of yesterdayMeals) {
        const mealData = {
          meal_type: meal.meal_type,
          name: meal.name,
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.carbs,
          fat: meal.fat,
          date: todayStr,
          time: timeStr,
          notes: meal.notes || ''
        };
        await createMeal(mealData);
      }

      await loadMealsForDate(currentDate);
      showToast(`📋 Copied ${yesterdayMeals.length} meals from yesterday!`);
    } catch (error) {
      console.error('Failed to copy meals:', error);
      showToast('❌ Failed to copy meals');
    } finally {
      setLoading(false);
    }
  };

  return {
    meals,
    newMeal,
    setNewMeal,
    goalInput,
    setGoalInput,
    dailyGoals,
    currentDate,
    setCurrentDate,
    totals,
    remaining,
    weekData,
    currentDateMeals,
    loading,
    toast,
    showMealLog,
    setShowMealLog,
    showModal,
    setShowModal,
    goalsSet,
    setGoalsSet,
    showGoalsModal,
    setShowGoalsModal,
    handlers: {
      loadMealsForDate,
      saveGoals,
      addMeal,
      deleteMeal,
      copyYesterday,
      showToast
    }
  };
};
