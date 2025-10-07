# SHAKTIMAN- AI Fitness Tracker
> An AI-powered fitness assistant that records body metrics, tracks fitness progress, and provides personalized diet and workout suggestions.


## Table of Contents
* [General Info](#general-information)
* [Technologies Used](#technologies-used)
* [Contributions]
* [Features](#features)
* [Screenshots](#screenshots)
* [Setup](#setup)
* [Usage](#usage)
* [Project Status](#project-status)
* [Room for Improvement](#room-for-improvement)
* [Acknowledgements](#acknowledgements)
* [Contact](#contact)
<!-- * [License](#license) -->


## General Information
Team Members: Sapnil Basnet, Surendra Bikram Khatri, Bigyan Dhakal, Misan Parajuli, Sachin Pandey

What we’re creating: An AI-powered fitness tracker that records user data (weight, shape, sleep, overall fitness) and provides personalized diet and calorie recommendations to achieve fitness goals.

Audience: Fitness enthusiasts who want to track progress and receive AI-based diet and workout suggestions.

Why we’re doing this: As a team, we are passionate about health and fitness. We want to build a tool that not only tracks metrics but also motivates people to live healthier lifestyles by combining AI with accessible fitness tracking. 


## Technologies Used

Django REST Framework (Python)
 – backend API and authentication

React (JavaScript, Create React App)
 – frontend interface

SQLite (development) / PostgreSQL (future)
 – database for storing users, workouts, exercises

JWT (djangorestframework-simplejwt)
 – secure authentication and session handling

Axios
 – frontend-backend communication

React Router
 – navigation and protected routes

React Hook Form + Zod
 – client-side form handling and validation

React Hot Toast
 – user notifications (success/error)

GitHub / Bitbucket
 – version control and collaboration



 ## Contributions

* * Sprint 1 (Sept 22 - Oct 3)

   # SACHIN: Completed the authentication flow — both frontend and backend — including user registration, login, protected routes, and backend testing.
      1. SCRUM-23 Frontend: Auth Screens, Client Validation & API Integration  Type: Implementation
            Jira Link: https://cs3398-wookies-fall.atlassian.net/browse/SCRUM-23
            Reference: https://bitbucket.org/cs3398-wookies-f25/ai-fitness-tracker/commits/branch/feature%2FSCRUM-23-frontend-auth-screens-client-va

      2. SCRUM-6 Design: Auth UX & Error States (Register, Login, Logout) Type: Design
            Jira Link: https://cs3398-wookies-fall.atlassian.net/browse/SCRUM-6
            Reference: https://bitbucket.org/cs3398-wookies-f25/ai-fitness-tracker/commits/branch/feature%2FSCRUM-6-design-auth-ux-error-states-regi

      3. SCRUM-22 Backend: Auth API & SQL Persistence Type: Implementation
            Jira Link: https://cs3398-wookies-fall.atlassian.net/browse/SCRUM-22
            Reference: https://bitbucket.org/cs3398-wookies-f25/ai-fitness-tracker/commits/branch/feature%2FSCRUM-22-backend-auth-api-sql-persistenc

      4. SCRUM-26 Frontend Tests: Component & Flow (React Testing Library) Type: Unit/UI Testing
            Jira Link: https://cs3398-wookies-fall.atlassian.net/browse/SCRUM-26
            Reference: https://bitbucket.org/cs3398-wookies-f25/ai-fitness-tracker/commits/branch/feature%2FSCRUM-26-frontend-tests-component-flow-v

      5. SCRUM-25 Backend Tests: Unit & Integration Type: Unit/Integration Testing
            Jira Link: https://cs3398-wookies-fall.atlassian.net/browse/SCRUM-25
            Reference: https://bitbucket.org/cs3398-wookies-f25/ai-fitness-tracker/commits/branch/feature%2FSCRUM-25-backend-tests-unit-integration-
      
      * Next Step:
         TDEE calculation from profile + activity level using a documented formula, Updating profile immediately updates recommended targets
         
         
 # MISAN: Designed an android app to access health data locally through user's phone - tested pairing code to connect app and web server - designed frontend component to display status
 
      1. SCRUM-36 Backend: Design Oauth2 flow for smartwatch integration  Type: Implementation
            Jira Link: https://cs3398-wookies-fall.atlassian.net/browse/SCRUM-36
            Reference: https://bitbucket.org/cs3398-wookies-f25/ai-fitness-tracker/branch/feature/SCRUM-36-design-oauth2-flow-for-smartwat

      2. SCRUM-39 Testing: Testing Pairing Code Type: Test
            Jira Link: https://cs3398-wookies-fall.atlassian.net/browse/SCRUM-39
            Reference: https://bitbucket.org/cs3398-wookies-f25/ai-fitness-tracker/branch/SCRUM-39-Revised-testing-pairing-code

      3. SCRUM-37 Frontend: Frontend Visualization Type: Implementation
            Jira Link: https://cs3398-wookies-fall.atlassian.net/browse/SCRUM-37
            Reference: https://bitbucket.org/cs3398-wookies-f25/ai-fitness-tracker/branch/feature/SCRUM-37-frontend-visualization

      4. SCRUM-41 Frontend+Backend: App development Type: Design
            Jira Link: https://cs3398-wookies-fall.atlassian.net/browse/SCRUM-41
            Reference: https://bitbucket.org/cs3398-wookies-f25/ai-fitness-tracker/branch/SCRUM-41-app-development
      
      * Next Step:
         Display Steps, Heart rate, sleep + Design ios application

# BIGYAN: Completed the profile setup feature, including frontend validation and UI design, backend API creation, and data persistence with personalized dashboard integration.


1. SCRUM-7 Frontend: Validation & Personalization
   Type: Implementation
   Status: Done
   Jira Link: https://cs3398-wookies-fall.atlassian.net/jira/software/projects/SCRUM/boards/1?jql=assignee%20%3D%20712020%3A05b5acc5-5dfe-46c6-b168-92783269987e&selectedIssue=SCRUM-7
   Description:
   Implemented client-side validation rules for the profile form (required fields, weight > 0, height > 0).
   Disabled the “Save” button until all inputs were valid.
   Added a success toast confirming profile setup and personalized the dashboard with the user’s name.
   Branch: feature/SCRUM-7-frontend-validation-personalization
   Reference: https://bitbucket.org/cs3398-wookies-f25/ai-fitness-tracker/branch/feature/SCRUM-7-frontend-validation-integration

2. SCRUM-5 UI Design: Profile Form
   Type: Design / Frontend Implementation
   Status: Done 
   Jira Link: https://cs3398-wookies-fall.atlassian.net/jira/software/projects/SCRUM/boards/1?jql=assignee%20%3D%20712020%3A05b5acc5-5dfe-46c6-b168-92783269987e&selectedIssue=SCRUM-7
   Description:
   Built a React-based Profile Form with fields for Name, Sex (dropdown), Height, Weight, and Goal (dropdown).
   Applied proper input types (number for height/weight and select for dropdowns).
   Ensured responsive design for both web and mobile using CSS Flexbox and media queries.
   Branch: feature/SCRUM-5-ui-design-profile-form
   Reference: https://bitbucket.org/cs3398-wookies-f25/ai-fitness-tracker/branch/feature/SCRUM-5-ui-design-%E2%80%93-profile-form

3. SCRUM-9 Backend: Profile API Endpoint
   Type: Backend / API Implementation
   Status: Done 
   Jira Link: https://cs3398-wookies-fall.atlassian.net/jira/software/projects/SCRUM/boards/1?jql=assignee%20%3D%20712020%3A05b5acc5-5dfe-46c6-b168-92783269987e&selectedIssue=SCRUM-9
   Description:
   Created /api/user/profile endpoint with JWT authentication.
   Supported POST and PUT for saving user profile data.
   Implemented server-side input validation (ensuring weight and height > 0).
   Tested endpoint using Postman and verified secure data persistence.
   Branch: feature/SCRUM-9-backend-profile-api
   Reference: https://bitbucket.org/cs3398-wookies-f25/ai-fitness-tracker/branch/feature/SCRUM-9-backend-api-endpoint

4. SCRUM-11 Persistence & State Management
   Type: Full-Stack Integration
   Status: Done 
   Jira Link: https://cs3398-wookies-fall.atlassian.net/jira/software/projects/SCRUM/boards/1?jql=assignee%20%3D%20712020%3A05b5acc5-5dfe-46c6-b168-92783269987e&selectedIssue=SCRUM-11
   Description:
   Integrated SQL persistence for the profile. The frontend automatically fetches saved profile data upon reload and pre-fills the form.
   Implemented error-handling for invalid tokens and server errors with user-friendly messages.
   Branch: feature/SCRUM-11-profile-persistence
   Reference: https://bitbucket.org/cs3398-wookies-f25/ai-fitness-tracker/branch/feature/SCRUM-11-persistence-state-management

Next Steps (Sprint 2):
- Update profile immediately after changes to reflect new TDEE targets.
- Add error handling for API and invalid inputs.
- Create automated frontend tests for validation and persistence.

# SAPNIL: Designed UI for Workout Library - Added Workouts according to the muscle groups - Added images to the workouts

      1. SCRUM-14 Exercise Library UI  Type: Frontend
            Jira Link: https://cs3398-wookies-fall.atlassian.net/jira/software/projects/SCRUM/boards/1?selectedIssue=SCRUM-14
            Reference: https://bitbucket.org/cs3398-wookies-f25/ai-fitness-tracker/branch/feature/SCRUM-14-exercise-library-ui-frontend-de

      2. SCRUM-13 API + Database Schema Type: Backend + Implementation
            Jira Link: https://cs3398-wookies-fall.atlassian.net/jira/software/projects/SCRUM/boards/1?selectedIssue=SCRUM-13
            Reference: https://bitbucket.org/cs3398-wookies-f25/ai-fitness-tracker/branch/feature/SCRUM-13-api-database-schema-backend-des

      3. SCRUM-15 Adding Image to Buttons of Workout Library Type: Frontend+Design
            Jira Link: https://cs3398-wookies-fall.atlassian.net/jira/software/projects/SCRUM/boards/1?selectedIssue=SCRUM-15
            Reference: https://bitbucket.org/cs3398-wookies-f25/ai-fitness-tracker/branch/feature/SCRUM-15-adding-image-to-buttons-of-work?dest=main

      4. SCRUM-16 Adding Image to Workouts Type: Frontend+Design
            Jira Link: https://cs3398-wookies-fall.atlassian.net/jira/software/projects/SCRUM/boards/1?selectedIssue=SCRUM-16
            Reference: https://bitbucket.org/cs3398-wookies-f25/ai-fitness-tracker/branch/feature/SCRUM-16-adding-image-to-workouts

      
      * Next Step:
         Build detail pages with “add to plan,” add search and filter chips, Workout pages with descriptions and video, add tests, run instructions, track calorie tracking after workout
         
         




   # Surendra: Developed full-stack meal logging system with CRUD APIs, data models for meals/macros tracking, and frontend UI featuring real-time daily totals, quick-add modal, and optimistic updates for seamless user experience

      1. SCRUM-28 Data Model & Service Logic
   Type: Implementation
   Jira Link: https://cs3398-wookies-fall.atlassian.net/jira/software/projects/SCRUM/boards/1?selectedIssue=SCRUM-28
   Reference: https://bitbucket.org/cs3398-wookies-f25/ai-fitness-tracker/branch/feature/SCRUM-28-DataModelServiceLogic?dest=main

      2. SCRUM-29 API/Backend: Day Summary & CRUD
   Type: Implementation
   Jira Link: https://cs3398-wookies-fall.atlassian.net/jira/software/projects/SCRUM/boards/1?selectedIssue=SCRUM-29
   Reference: https://bitbucket.org/cs3398-wookies-f25/ai-fitness-tracker/branch/feature/SCRUM-29-API-backend-summary-crud

      3. SCRUM-27 Design: Meal Day View + Add/Edit Flow
   Type: Design
   Jira Link: https://cs3398-wookies-fall.atlassian.net/jira/software/projects/SCRUM/boards/1?selectedIssue=SCRUM-27
   Reference: https://bitbucket.org/cs3398-wookies-f25/ai-fitness-tracker/branch/SCRUM-27-design-specs-docs

      4. SCRUM-30 Frontend: Meal Log UI & Quick-Add
   Type: Implementation
   Jira Link: https://cs3398-wookies-fall.atlassian.net/jira/software/projects/SCRUM/boards/1?selectedIssue=SCRUM-30
   Reference: https://bitbucket.org/cs3398-wookies-f25/ai-fitness-tracker/branch/feature/SCRUM-30-frontend-MealLogUI2


   *Refine Meal Log UI with improved error handling and loading states + Expand backend with advanced filtering, meal templates, and bulk operations for enhanced data management
   
## Features
1. User Profiles

What it does: Allows users to create personal accounts with information like age, weight, height, gender, and fitness goals (lose weight, gain muscle, maintain).

Who uses it: All users.

User Story: As a new user, I want to create a profile so the system can provide me with personalized recommendations.

2. Personalized Goal Setting

What it does: Sets daily calorie targets using a TDEE calculator and provides macro breakdown (protein, carbs, fat).

Who uses it: Users who want structured goals.

User Story: As a user, I want a daily calorie and macro breakdown so I can stay on track toward my fitness goal.

3. Food & Nutrition Tracking..

What it does: Allows users to log meals manually, see calories + macros, and track daily nutrition summary.

Who uses it: Users tracking their diet.

User Story: As a user, I want to log my meals so I can monitor my calorie intake and progress.

4. Workout Logging

What it does: Logs exercises (cardio, strength, flexibility) with sets/reps/duration and estimates calories burned.

Who uses it: Users tracking their workouts.

User Story: As a user, I want to log my workouts so I can track my activity and calorie burn.

5. AI/Smart Suggestions (Lightweight)

What it does: Suggests meal ideas (e.g., “high-protein breakfast under 400 cal”) and workouts based on user goals.

Who uses it: Users who need guidance.

User Story: As a user, I want AI-based suggestions so I don’t have to plan every meal or workout myself.

6. Progress Dashboard

What it does: Displays graphs for weight, calories, and workouts over time. Adds streaks/badges for motivation.

Who uses it: Users tracking progress.

User Story: As a user, I want to visualize my progress so I stay motivated and accountable.

7. Sleep & Recovery Tracking

What it does: Allows users to log sleep duration and quality (manual input or synced from smartwatch). Provides insights on recovery, suggests optimal sleep hours, and correlates sleep patterns with workout performance and calorie intake.

Who uses it: Users who want to optimize recovery and overall health.

User Story: As a user, I want to track my sleep so I can understand how rest impacts my energy, workouts, and progress.

## Screenshots
![Alt text](images/ai_fitness.png)

<!-- If you have screenshots you'd like to share, include them here. -->


## Setup
Requirements are listed in:
- backend/requirements.txt (Python/Django dependencies)
- frontend/gym-log-frontend/package.json (React dependencies)
- install npm


Steps:

Clone repo

Install backend dependencies: pip install -r requirements.txt

Install frontend dependencies: npm install

Run development server

## Usage
1. Sign up or log in (JWT authentication).
2. Access the protected dashboard after login.
3. Use the same email password after Register to Login.
3. Future features:
   - Input personal details and fitness goals.
   - Log meals and workouts.
   - View AI-based suggestions for diet and workouts.
   - Track progress with charts and dashboards.



## Project Status
Project is: in progress.


## Room for Improvement
Include areas you believe need improvement / could be improved. Also add TODOs for future development.

Room for improvement:
- Improvement to be done 1
- Improvement to be done 2

To do:
- Feature to be added 1
- Feature to be added 2


## Acknowledgements
Give credit here.
- This project was inspired by...
- This project was based on [this tutorial](https://www.example.com).
- Many thanks to...


## Contact



<!-- Optional -->
<!-- ## License -->
<!-- This project is open source and available under the [... License](). -->

<!-- You don't have to include all sections - just the one's relevant to your project -->
//test