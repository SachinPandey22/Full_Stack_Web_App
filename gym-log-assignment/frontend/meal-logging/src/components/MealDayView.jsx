import React, { useState } from 'react';
import './MealDayView.css';

const MealDayView = () => {
  const [meals, setMeals] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMeal, setCurrentMeal] = useState(null);
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [validationMessage, setValidationMessage] = useState('');

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const remainingCalories = 1400 - totalCalories;

  const handleAddMeal = () => {
    setIsEditing(true);
    setCurrentMeal(null);
    setMealName('');
    setCalories('');
    setValidationMessage('');
  };

  const handleEditMeal = (meal) => {
    setIsEditing(true);
    setCurrentMeal(meal);
    setMealName(meal.name);
    setCalories(meal.calories.toString());
    setValidationMessage('');
  };

  const handleSaveMeal = () => {
    // Validation
    if (!mealName.trim()) {
      setValidationMessage('Meal name is required');
      return;
    }
    
    if (!calories || isNaN(calories) || parseInt(calories) <= 0) {
      setValidationMessage('Please enter a valid calorie amount');
      return;
    }

    const mealData = {
      id: currentMeal ? currentMeal.id : Date.now(),
      name: mealName.trim(),
      calories: parseInt(calories)
    };

    if (currentMeal) {
      // Update existing meal
      setMeals(meals.map(meal => meal.id === currentMeal.id ? mealData : meal));
    } else {
      // Add new meal
      setMeals([...meals, mealData]);
    }

    // Reset form
    setIsEditing(false);
    setCurrentMeal(null);
    setMealName('');
    setCalories('');
    setValidationMessage('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentMeal(null);
    setMealName('');
    setCalories('');
    setValidationMessage('');
  };

  return (
    <div className="meal-day-view">
      <h1>April 24</h1>
      
      <div className="calorie-summary">
        <div className="total-calories">1,400 Total</div>
        <div className="remaining-calories">{remainingCalories} Remaining</div>
      </div>

      <div className="meals-section">
        <h2>MEALS</h2>
        
        {meals.length === 0 ? (
          <div className="empty-state">
            <p>No meals logged</p>
            <button className="add-meal-btn" onClick={handleAddMeal}>
              Add a meal
            </button>
          </div>
        ) : (
          <div className="meals-list">
            {meals.map(meal => (
              <div key={meal.id} className="meal-item">
                <div className="meal-info">
                  <span className="meal-name">{meal.name}</span>
                  <span className="meal-calories">{meal.calories}</span>
                </div>
                <button 
                  className="edit-btn"
                  onClick={() => handleEditMeal(meal)}
                >
                  Edit
                </button>
              </div>
            ))}
            <button className="add-meal-btn" onClick={handleAddMeal}>
              Add a meal
            </button>
          </div>
        )}
      </div>

      {isEditing && (
        <div className="meal-form">
          <h2>{currentMeal ? 'Edit Meal' : 'Add Meal'}</h2>
          
          <div className="form-group">
            <label htmlFor="mealName">Meal Name</label>
            <input
              type="text"
              id="mealName"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              placeholder="Enter meal name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="calories">Calories</label>
            <input
              type="number"
              id="calories"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="Enter calories"
            />
          </div>

          {validationMessage && (
            <div className="validation-message">{validationMessage}</div>
          )}

          <div className="form-actions">
            <button className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
            <button className="save-btn" onClick={handleSaveMeal}>
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealDayView;