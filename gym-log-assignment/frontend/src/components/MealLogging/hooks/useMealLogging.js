import { useCallback, useEffect, useMemo, useState } from 'react';
import { format, subDays, parseISO } from 'date-fns';
import {
  fetchMeals,
  fetchMealSummary,
  fetchWeeklySummary,
  createMeal as apiCreateMeal,
  updateMeal as apiUpdateMeal,
  deleteMeal as apiDeleteMeal,
  fetchNutritionTargets,
  saveNutritionTargets,
  fetchNutritionRecommendations,
  fetchWaterIntake,
  saveWaterIntake,
} from '../../../services/MealLogging';

const DEFAULT_GOALS = { calories: 0, protein: 0, carbs: 0, fat: 0 };
const DEFAULT_MEAL_FORM = {
  type: 'breakfast',
  name: '',
  calories: '',
  protein: '',
  carbs: '',
  fat: '',
  notes: '',
  imageFile: null,
  imagePreview: '',
};
const DEFAULT_WATER = {
  id: null,
  date: '',
  glasses: 0,
  glass_size: 500,
  total_ml: 0,
};

const mapMeal = (meal, dateLabel) => ({
  id: meal.id,
  type: meal.meal_type,
  name: meal.name,
  calories: meal.calories,
  protein: meal.protein,
  carbs: meal.carbs,
  fat: meal.fat,
  time: meal.time,
  date: dateLabel,
  notes: meal.notes || '',
  image: meal.image || '',
});

const toInt = (value) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
};

export const useMealLogging = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [goalsSet, setGoalsSet] = useState(false);
  const [dailyGoals, setDailyGoals] = useState(DEFAULT_GOALS);
  const [goalInput, setGoalInput] = useState({
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  });

  const [meals, setMeals] = useState([]);
  const [totals, setTotals] = useState(DEFAULT_GOALS);
  const [remaining, setRemaining] = useState(DEFAULT_GOALS);
  const [weeklyRaw, setWeeklyRaw] = useState([]);

  const [water, setWater] = useState(DEFAULT_WATER);
  const [waterLoading, setWaterLoading] = useState(false);
  const [waterSaving, setWaterSaving] = useState(false);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [error, setError] = useState(null);

  const [showMealLog, setShowMealLog] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);

  const [editingMeal, setEditingMeal] = useState(null);
  const [formMeal, setFormMeal] = useState(DEFAULT_MEAL_FORM);

  const showToast = useCallback((message) => {
    setToast(message);
    if (message) {
      window.setTimeout(() => setToast(''), 3000);
    }
  }, []);

  const applyGoals = useCallback((targets) => {
    if (!targets) return;
    const nextGoals = {
      calories: targets.target_calories ?? targets.calories ?? 0,
      protein: targets.protein_g ?? targets.protein ?? 0,
      carbs: targets.carbs_g ?? targets.carbs ?? 0,
      fat: targets.fat_g ?? targets.fat ?? 0,
    };
    setDailyGoals(nextGoals);
    setGoalInput({
      calories: String(nextGoals.calories || ''),
      protein: String(nextGoals.protein || ''),
      carbs: String(nextGoals.carbs || ''),
      fat: String(nextGoals.fat || ''),
    });
  }, []);

  const loadNutritionTargets = useCallback(async () => {
    try {
      const targets = await fetchNutritionTargets();
      if (targets) {
        applyGoals(targets);
        setGoalsSet(true);
      } else {
        setGoalsSet(false);
      }
    } catch (err) {
      console.error('Failed to load nutrition targets', err);
      setGoalsSet(false);
    }
  }, [applyGoals]);

  const hydrateSummary = useCallback((summary) => {
    if (!summary) return;
    if (summary.targets) {
      applyGoals(summary.targets);
      setGoalsSet(true);
    }
    setTotals(summary.totals || DEFAULT_GOALS);
    setRemaining(summary.remaining || DEFAULT_GOALS);
  }, [applyGoals]);

  const formatDateForApi = useCallback(
    (dateValue) => format(dateValue, 'yyyy-MM-dd'),
    [],
  );

  const loadDataForDate = useCallback(async (target = currentDate) => {
    const targetDate = target instanceof Date ? target : new Date(target);
    const dateStr = formatDateForApi(targetDate);
    const dateLabel = targetDate.toDateString();

    setLoading(true);
    try {
      const [mealList, summary, weekly] = await Promise.all([
        fetchMeals(dateStr),
        fetchMealSummary(dateStr),
        fetchWeeklySummary(dateStr),
      ]);

      setMeals(mealList.map((meal) => mapMeal(meal, dateLabel)));
      hydrateSummary(summary);

      const weeklyData = (weekly?.days || []).map((day) => {
        const parsed = parseISO(day.date);
        return {
          date: day.date,
          dayLabel: format(parsed, 'EEE'),
          calories: day.calories || 0,
          protein: day.protein || 0,
          carbs: day.carbs || 0,
          fat: day.fat || 0,
        };
      });
      setWeeklyRaw(weeklyData);
      setError(null);
    } catch (err) {
      console.error('Failed to load meals', err);
      setError(err);
      showToast('Failed to load meals');
    } finally {
      setLoading(false);
    }

    setWaterLoading(true);
    try {
      const entry = await fetchWaterIntake(dateStr);
      if (entry) {
        setWater({
          id: entry.id,
          date: entry.date,
          glasses: entry.glasses,
          glass_size: entry.glass_size,
          total_ml: entry.total_ml,
        });
      } else {
        setWater({ ...DEFAULT_WATER, date: dateStr });
      }
    } catch (err) {
      console.error('Failed to load water intake', err);
      showToast('Failed to load water intake');
    } finally {
      setWaterLoading(false);
    }
  }, [currentDate, formatDateForApi, hydrateSummary, showToast]);

  useEffect(() => {
    loadNutritionTargets();
  }, [loadNutritionTargets]);

  useEffect(() => {
    if (goalsSet) {
      loadDataForDate(currentDate);
    }
  }, [currentDate, goalsSet, loadDataForDate]);

  const resetMealForm = useCallback(() => {
    setEditingMeal(null);
    setFormMeal(DEFAULT_MEAL_FORM);
  }, []);

  const saveMeal = useCallback(async () => {
    const dateStr = formatDateForApi(currentDate);
    const now = new Date();
    const basePayload = {
      meal_type: formMeal.type,
      name: formMeal.name.trim(),
      calories: toInt(formMeal.calories),
      protein: toInt(formMeal.protein),
      carbs: toInt(formMeal.carbs),
      fat: toInt(formMeal.fat),
      notes: formMeal.notes || '',
      date: dateStr,
      time: editingMeal?.time || format(now, 'HH:mm'),
    };
    const payload = formMeal.imageFile
      ? { ...basePayload, image: formMeal.imageFile }
      : basePayload;

    if (!payload.name) {
      showToast('Please provide a meal name');
      return;
    }

    setLoading(true);
    try {
      if (editingMeal) {
        await apiUpdateMeal(editingMeal.id, payload);
        showToast('Meal updated');
      } else {
        await apiCreateMeal(payload);
        showToast('Meal added');
      }
      setShowModal(false);
      resetMealForm();
      await loadDataForDate(currentDate);
    } catch (err) {
      console.error('Failed to save meal', err);
      showToast('Failed to save meal');
    } finally {
      setLoading(false);
    }
  }, [currentDate, editingMeal, formMeal, formatDateForApi, loadDataForDate, resetMealForm, showToast]);

  const deleteMeal = useCallback(async (mealId) => {
    setLoading(true);
    try {
      await apiDeleteMeal(mealId);
      showToast('Meal deleted');
      await loadDataForDate(currentDate);
    } catch (err) {
      console.error('Failed to delete meal', err);
      showToast('Failed to delete meal');
    } finally {
      setLoading(false);
    }
  }, [currentDate, loadDataForDate, showToast]);

  const copyYesterday = useCallback(async () => {
    setLoading(true);
    const yesterday = subDays(currentDate, 1);
    const yesterdayStr = formatDateForApi(yesterday);
    const todayStr = formatDateForApi(currentDate);
    try {
      const mealsToCopy = await fetchMeals(yesterdayStr);
      if (!mealsToCopy.length) {
        showToast('No meals to copy from yesterday');
        return;
      }

      for (const meal of mealsToCopy) {
        await apiCreateMeal({
          meal_type: meal.meal_type,
          name: meal.name,
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.carbs,
          fat: meal.fat,
          notes: meal.notes || '',
          date: todayStr,
          time: meal.time,
        });
      }
      showToast(`Copied ${mealsToCopy.length} meals from yesterday`);
      await loadDataForDate(currentDate);
    } catch (err) {
      console.error('Failed to copy meals', err);
      showToast('Failed to copy meals');
    } finally {
      setLoading(false);
    }
  }, [currentDate, formatDateForApi, loadDataForDate, showToast]);

  const saveGoals = useCallback(async () => {
    const calories = toInt(goalInput.calories);
    const protein = toInt(goalInput.protein);
    const carbs = toInt(goalInput.carbs);
    const fat = toInt(goalInput.fat);

    if (!calories || !protein || !carbs || !fat) {
      showToast('Please provide calorie and macro goals');
      return;
    }

    setLoading(true);
    try {
      const updated = await saveNutritionTargets({
        calories,
        protein,
        carbs,
        fat,
      });
      applyGoals(updated);
      setGoalsSet(true);
      setShowGoalsModal(false);
      showToast('Daily goals saved');
      await loadDataForDate(currentDate);
    } catch (err) {
      console.error('Failed to save goals', err);
      showToast('Failed to save goals');
    } finally {
      setLoading(false);
    }
  }, [applyGoals, currentDate, goalInput, loadDataForDate, showToast]);

  const useRecommendations = useCallback(async () => {
    setLoading(true);
    try {
      const recommendation = await fetchNutritionRecommendations();
      applyGoals(recommendation);
      setGoalsSet(true);
      setShowGoalsModal(false);
      showToast('Recommended goals applied');
      await loadDataForDate(currentDate);
    } catch (err) {
      console.error('Failed to load recommendations', err);
      if (err.response?.data?.missing_fields) {
        showToast('Complete your profile to get recommendations');
      } else {
        showToast('Failed to load recommendations');
      }
    } finally {
      setLoading(false);
    }
  }, [applyGoals, currentDate, loadDataForDate, showToast]);

  const updateWater = useCallback(async (nextGlasses) => {
    const safeGlasses = Math.max(0, nextGlasses);
    const dateStr = formatDateForApi(currentDate);
    const glassSize = water.glass_size || 500;
    setWaterSaving(true);
    try {
      const updated = await saveWaterIntake({
        date: dateStr,
        glasses: safeGlasses,
        glassSize,
      });
      setWater({
        id: updated.id,
        date: updated.date,
        glasses: updated.glasses,
        glass_size: updated.glass_size,
        total_ml: updated.total_ml,
      });
    } catch (err) {
      console.error('Failed to save water intake', err);
      showToast('Failed to update water intake');
    } finally {
      setWaterSaving(false);
    }
  }, [currentDate, formatDateForApi, showToast, water.glass_size]);

  const incrementWater = useCallback(() => {
    updateWater(water.glasses + 1);
  }, [updateWater, water.glasses]);

  const decrementWater = useCallback(() => {
    if (water.glasses === 0) return;
    updateWater(water.glasses - 1);
  }, [updateWater, water.glasses]);

  const startEditMeal = useCallback((meal) => {
    setEditingMeal(meal);
    setFormMeal({
      type: meal.type,
      name: meal.name,
      calories: String(meal.calories),
      protein: String(meal.protein),
      carbs: String(meal.carbs),
      fat: String(meal.fat),
      notes: meal.notes || '',
      imageFile: null,
      imagePreview: meal.image || '',
    });
    setShowModal(true);
  }, []);

  const startAddMeal = useCallback(() => {
    resetMealForm();
    setShowModal(true);
  }, [resetMealForm]);

  const weekData = useMemo(
    () =>
      weeklyRaw.map((day) => ({
        day: day.dayLabel,
        calories: day.calories,
        protein: day.protein,
        carbs: day.carbs,
        fat: day.fat,
      })),
    [weeklyRaw],
  );

  return {
    meals,
    newMeal: formMeal,
    setNewMeal: setFormMeal,
    editingMeal,
    setEditingMeal,
    goalInput,
    setGoalInput,
    dailyGoals,
    currentDate,
    setCurrentDate,
    totals,
    remaining,
    weekData,
    currentDateMeals: meals,
    water,
    waterLoading,
    waterSaving,
    loading,
    toast,
    error,
    showMealLog,
    setShowMealLog,
    showModal,
    setShowModal,
    showGoalsModal,
    setShowGoalsModal,
    goalsSet,
    handlers: {
      loadMealsForDate: loadDataForDate,
      addMeal: saveMeal,
      deleteMeal,
      copyYesterday,
      saveGoals,
      useRecommendations,
      showToast,
      startAddMeal,
      startEditMeal,
      resetMealForm,
      incrementWater,
      decrementWater,
      updateWater,
    },
  };
};
