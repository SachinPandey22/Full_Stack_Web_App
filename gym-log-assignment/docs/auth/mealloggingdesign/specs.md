# Meal Logging Component Specifications

## Overview
Meal tracking component with macros, streak counter, and weekly progress view.

## Features
- Date navigation (prev/next day)
- Calorie and macro tracking (protein, carbs, fats)
- Streak counter
- Quick add buttons for common meals
- Weekly progress chart view
- Add/Edit/Delete meals
- Motivational quotes

## Data Requirements
- Total daily calories: 1400
- Target macros: Protein 100g, Carbs 150g, Fats 50g
- Meals stored with: name, calories, protein, carbs, fats

## Validation Rules
- Meal name: required, non-empty string
- Calories: required, must be positive number
- Macros: optional, positive numbers or 0