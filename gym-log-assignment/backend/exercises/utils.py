"""
Utility functions for exercise and workout calculations.
Separates calculation logic from models (Single Responsibility Principle).
"""


def calculate_simple_calories(met_value, weight_kg, duration_minutes):
    """
    Calculate calories using simple MET formula.
    
    Args:
        met_value (float): Metabolic Equivalent of Task
        weight_kg (float): User's weight in kilograms
        duration_minutes (int): Workout duration in minutes
    
    Returns:
        float: Calculated calories burned, or None if invalid inputs
    
    Formula:
        Calories = MET × weight(kg) × duration(hours)
    """
    # Validate inputs
    if not all([met_value, weight_kg, duration_minutes]):
        return None
    
    if met_value <= 0 or weight_kg <= 0 or duration_minutes <= 0:
        print("Warning: Invalid values for calorie calculation")
        return None
    
    duration_hours = duration_minutes / 60
    calories = met_value * weight_kg * duration_hours
    
    return round(calories, 1)


def calculate_bmr(weight_kg, height_cm, age, sex):
    """
    Calculate Basal Metabolic Rate using Harris-Benedict equation.
    
    Args:
        weight_kg (float): Weight in kilograms
        height_cm (float): Height in centimeters
        age (int): Age in years
        sex (str): 'male' or 'female'
    
    Returns:
        float: Calculated BMR, or None if invalid inputs
    
    Formulas:
        Male: BMR = 10W + 6.25H - 5A + 5
        Female: BMR = 10W + 6.25H - 5A - 161
    """
    # Validate inputs
    if not all([weight_kg, height_cm, age, sex]):
        return None
    
    if weight_kg <= 0 or height_cm <= 0 or age <= 0:
        print("Warning: Invalid profile data for BMR calculation")
        return None
    
    # Calculate BMR based on sex
    if sex.lower() == 'male':
        bmr = (10 * weight_kg) + (6.25 * height_cm) - (5 * age) + 5
    else:  # female
        bmr = (10 * weight_kg) + (6.25 * height_cm) - (5 * age) - 161
    
    return bmr


def calculate_advanced_calories(met_value, weight_kg, height_cm, age, sex, duration_minutes):
    """
    Calculate calories using BMR-based formula.
    More accurate than simple calculation.
    
    Args:
        met_value (float): Metabolic Equivalent of Task
        weight_kg (float): User's weight in kilograms
        height_cm (float): User's height in centimeters
        age (int): User's age in years
        sex (str): 'male' or 'female'
        duration_minutes (int): Workout duration in minutes
    
    Returns:
        float: Calculated calories burned, or None if invalid inputs
    
    Formula:
        Calories = (MET × BMR / 24) × duration(hours)
    """
    # Calculate BMR first
    bmr = calculate_bmr(weight_kg, height_cm, age, sex)
    
    if not bmr:
        return None
    
    # Validate other inputs
    if not met_value or met_value <= 0:
        print("Warning: Invalid MET value")
        return None
    
    if not duration_minutes or duration_minutes <= 0:
        print("Warning: Invalid duration")
        return None
    
    # Calculate calories
    duration_hours = duration_minutes / 60
    calories_per_hour = (met_value * bmr) / 24
    calories = calories_per_hour * duration_hours
    
    return round(calories, 1)
