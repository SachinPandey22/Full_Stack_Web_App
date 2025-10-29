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
         Build detail pages with “add workout" and workout description.
         
         




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
   
<hr>

<h2>Sprint 2 Review (Oct 13 - Oct 24)</h2>
<h3>Branch Demoed: release/DemoSprint2</h3>
<br>
<h4># MISAN: [SCRUM-35: Receive Notifications] Set-up Notification Panel so user can get messages on streaks and reminders - Refactored frontend in the landing page</h4>
 
      1. SCRUM-59 : Scaffold & UI Setup Type: Implementation
            Jira Link: https://cs3398-wookies-fall.atlassian.net/browse/SCRUM-59
            Reference: https://bitbucket.org/cs3398-wookies-f25/ai-fitness-tracker/branch/SCRUM-59-scaffold-ui-setup

      2. SCRUM-61 : Add Dropdown Panel UI Type: Implementation
            Jira Link: https://cs3398-wookies-fall.atlassian.net/browse/SCRUM-61
            Reference: https://bitbucket.org/cs3398-wookies-f25/ai-fitness-tracker/branch/feature/SCRUM-61-add-dropdown-panel-ui

      3. SCRUM-60: Connect to Backend API Type: Implementation
            Jira Link: https://cs3398-wookies-fall.atlassian.net/browse/SCRUM-60
            Reference: https://bitbucket.org/cs3398-wookies-f25/ai-fitness-tracker/branch/SCRUM-60-connect-to-backend-api

      4. SCRUM-63: Notification Preferences Page Type: Feature
            Jira Link: https://cs3398-wookies-fall.atlassian.net/browse/SCRUM-63
            Reference: https://bitbucket.org/cs3398-wookies-f25/ai-fitness-tracker/branch/feature/SCRUM-63-notification-preferences-page
            
      5. SCRUM-62: Refactor Frontend Type: Design
            Jira Link: https://cs3398-wookies-fall.atlassian.net/browse/SCRUM-62
            Reference: https://bitbucket.org/cs3398-wookies-f25/ai-fitness-tracker/branch/SCRUM-62-refactor-frontend
        
        * Next Step:
         Integrate streaks and Reminder messages to notification, refactor frontend for all pages, Provide notification in mobile phone

   # SACHIN(Sprint 2): Completed the Supabase Integration, TDEE and Macro Recommendation, and Nutrition Progress Visualization
      1.	SCRUM-42 Backend: Database & Supabase Integration
            Jira Link: https://cs3398-wookies-fall.atlassian.net/browse/SCRUM-42
            Reference: https://bitbucket.org/cs3398-wookies-f25/ai-fitness-tracker/branch/feature/SCRUM-42-backend-database-supabase-integ

      2. SCRUM-43 Backend, Frontend: Add TDEE & Macro Calculation API, Nutrition Dashboard Component
            Jira Link: https://cs3398-wookies-fall.atlassian.net/browse/SCRUM-43
            Reference: https://bitbucket.org/cs3398-wookies-f25/ai-fitness-tracker/branch/SCRUM-43-backend-add-tdee-macro-calculat
      3. SCRUM-44 Create NutritionSnapshot Model and API (Backend)
            Jira Link: https://cs3398-wookies-fall.atlassian.net/browse/SCRUM-44
            Reference: https://bitbucket.org/cs3398-wookies-f25/ai-fitness-tracker/branch/feature/SCRUM-44-create-nutritionsnapshot-model-

      4. SCRUM-45 Integrate Snapshot API with Frontend (Nutrition Page)
            Jira Link: https://cs3398-wookies-fall.atlassian.net/browse/SCRUM-45
            Reference: https://bitbucket.org/cs3398-wookies-f25/ai-fitness-tracker/branch/feature/SCRUM-45-integrate-snapshot-api-with-fro

      5. SCRUM-46 Add Nutrition Progress Visualization (Frontend UI)
            Jira Link: https://cs3398-wookies-fall.atlassian.net/browse/SCRUM-46
            Reference: https://bitbucket.org/cs3398-wookies-f25/ai-fitness-tracker/branch/feature/SCRUM-46-add-nutrition-progress-visualiz      
      * Next Step:
         1. Implement a feature to let users export their fitness and profile data in a downloadable format.
         2. Add a “Delete Account” option that permanently removes the user’s data from the database.
         3. Ensure proper confirmation and security checks before deletion to prevent accidental data loss.
         4. Update the frontend settings page to include these options under “Privacy & Data Control.”


# Surendra: Implemented comprehensive date-based navigation system with calendar integration, enhanced user experience with motivational quotes and notes functionality, added macro validation with preset suggestions, and developed water intake tracking feature with persistent storage

      1. SCRUM-54 Date Navigation & Calendar Feature
   Type: Implementation
   Jira Link: https://cs3398-wookies-fall.atlassian.net/jira/software/projects/SCRUM/list/?jql=project%20%3D%20%22SCRUM%22%20ORDER%20BY%20created%20DESC&selectedIssue=SCRUM-54
   Reference: https://bitbucket.org/cs3398-wookies-f25/ai-fitness-tracker/branch/feature/SCRUM-54-DataNavigationCalenderFeatures
   Description: Built DateNavigator component with Next/Previous day buttons, swipe gesture support for day-to-day navigation, calendar popup for date selection, and compact sidebar calendar view. Created backend API endpoints and database schema to store and fetch meals by specific dates.

      2. SCRUM-52 Target Setting and Calorie Validation
   Type: Implementation
   Jira Link: https://cs3398-wookies-fall.atlassian.net/jira/software/projects/SCRUM/list/?jql=project%20%3D%20%22SCRUM%22%20ORDER%20BY%20created%20DESC&selectedIssue=SCRUM-52
   Reference: https://bitbucket.org/cs3398-wookies-f25/ai-fitness-tracker/branch/SCRUM-52-target-setting-and-calorie-validation
   Description: Implemented mandatory macro field validation (protein, carbs, fat) preventing users from proceeding without complete input. Added macro preset suggestions (40/30/30, 45/25/30 splits) with quick-select dropdown. Developed calorie surplus warning system displaying red alerts when logged calories exceed daily targets.

      3. SCRUM-55 Motivation & Notes UI Revamp
   Type: Implementation
   Jira Link: https://cs3398-wookies-fall.atlassian.net/jira/software/projects/SCRUM/list/?jql=project%20%3D%20%22SCRUM%22%20ORDER%20BY%20created%20DESC&selectedIssue=SCRUM-55
   Reference: https://bitbucket.org/cs3398-wookies-f25/ai-fitness-tracker/branch/feature/SCRUM-55-motivation-notes-ui-revamp
   Description: Removed streak feature and replaced with auto-rotating motivational quotes slideshow (3-4 quotes with swipe/timed fade transitions). Added notes field to meal logging interface allowing users to attach personal comments and reminders to individual meals.

      4. SCRUM-53 Water Intake Tracker Integration
   Type: Implementation
   Jira Link: https://cs3398-wookies-fall.atlassian.net/jira/software/projects/SCRUM/list/?jql=project%20%3D%20%22SCRUM%22%20ORDER%20BY%20created%20DESC&selectedIssue=SCRUM-53
   Reference: https://bitbucket.org/cs3398-wookies-f25/ai-fitness-tracker/branch/feature/SCRUM-53-WaterIntakeTrackerIntegration
   Description: Developed water tracking component on main dashboard with tap-to-add/remove functionality (500ml per glass). Built database schema and backend endpoints for persistent water intake logging and retrieval across dates.

      5. SCRUM-31 Minor UI Polish & Consistency Check
   Type: Quality Assurance
   Jira Link: https://cs3398-wookies-fall.atlassian.net/jira/software/projects/SCRUM/list/?jql=project%20%3D%20%22SCRUM%22%20ORDER%20BY%20created%20DESC&selectedIssue=SCRUM-31
   Reference: https://bitbucket.org/cs3398-wookies-f25/ai-fitness-tracker/branch/feature/SCRUM-31-minor-ui-polish-consistency-che
   Description: Conducted comprehensive UI consistency review across Meal Logging interface. Standardized spacing, padding, and font alignment for Target Setting, Water Tracker, Motivational Slideshow, and Date Navigator components. Ensured color palette and button styles align with existing design theme, resolving misalignments and correcting typos.
   
   Next steps: Enhanced frontend user experience with gesture-based navigation and motivational elements while strengthening data validation, expanding tracking capabilities to include hydration monitoring, and ensuring UI consistency across all new features

 BIGYAN – Sprint 2 Summary (Chatbot & Support System)

Implemented complete Chatbot and Support System with interactive UI access points, guided troubleshooting flows, escalation features, and full-stack automated testing to enhance user support experience and accessibility.

1. SCRUM-51 Chatbot UI Access Points

Type: Frontend Implementation
Jira Link: (https://cs3398-wookies-fall.atlassian.net/browse/SCRUM-51)

Reference: https://bitbucket.org/cs3398-wookies-f25/ai-fitness-tracker/branch/feature/SCRUM-51-design-chatbot-ui-access-points

Description:
Designed and integrated “Chat with Support” button on login and help menus. Implemented responsive popup chat panel with adaptive layout for both desktop and mobile devices. Ensured smooth navigation and persistent accessibility across authenticated routes.

2. SCRUM-58 Support & Contact Us Page

Type: Frontend / UX Design
Jira Link: (https://cs3398-wookies-fall.atlassian.net/browse/SCRUM-58)

Reference: https://bitbucket.org/cs3398-wookies-f25/ai-fitness-tracker/branch/feature/SCRUM-58-support-and-contact-us-page

Description:
Developed a Support page containing FAQs and troubleshooting steps. Integrated “Contact Us” form connected to backend email API for user inquiries, providing confirmation toasts for successful submissions.

3. SCRUM-56 Guided Troubleshooting Flows

Type: Frontend Logic / UX Interaction
Jira Link: https://cs3398-wookies-fall.atlassian.net/browse/SCRUM-56

Reference: (https://bitbucket.org/cs3398-wookies-f25/ai-fitness-tracker/branch/feature/SCRUM-56-create-guided-troubleshooting-f)

Description:
Created guided chat flows to help users with common actions such as updating profile, adding a workout or meal, and viewing nutrition tips. Implemented step-by-step conversational prompts with “Start Over” reset functionality for clarity and usability.

4. SCRUM-57 Escalation & Chat History Features

Type: Full-Stack Enhancement
Jira Link: https://cs3398-wookies-fall.atlassian.net/browse/SCRUM-57

Reference: https://bitbucket.org/cs3398-wookies-f25/ai-fitness-tracker/branch/feature/SCRUM-57-add-escalation-and-chat-history

Description:
Implemented local chat message storage using browser localStorage for session persistence. Added “Escalate to Support” feature allowing users to send unresolved issues via email. Enhanced chat UI with auto-scroll and improved readability.

5. SCRUM-23 Automated Testing Integration

Type: Testing / Quality Assurance
Jira Link: https://cs3398-wookies-fall.atlassian.net/browse/SCRUM-12

Reference: https://bitbucket.org/cs3398-wookies-f25/ai-fitness-tracker/branch/feature/SCRUM-12-unit-testing-frontend-backend

Description:
Implemented automated tests using Vitest and Pytest. Verified chat form rendering, input validation, and persistence on the frontend. Backend tests ensured proper rejection of invalid inputs and verified successful data persistence and metric recalculation in the database.

Next Sprint (3):
Integrate AI chatbot responses, add FAQ recommendations, and connect the “Contact Us” feature to a real email support service. and polish the frontend so that it looks like a real app with features.

 # SAPNIL(Sprint 2): Added Workout Components for every workouts. Added personal workout data to database for pesonalization.
      1.	SCRUM-47 Frontend: Implement Workout Detail Page
            Jira Link: https://cs3398-wookies-fall.atlassian.net/browse/SCRUM-47
            Reference: https://bitbucket.org/cs3398-wookies-f25/ai-fitness-tracker/branch/feature/SCRUM-47-implement-workout-detail-page

      2. SCRUM-48 Backend, Populate and Structure Exercise Information
            Jira Link: https://cs3398-wookies-fall.atlassian.net/browse/SCRUM-48
            Reference: https://bitbucket.org/cs3398-wookies-f25/ai-fitness-tracker/branch/feature/SCRUM-48-populate-and-structure-exercise

      3. SCRUM-49 Backend + Frontend, Add Workouts to Personal Database
            Jira Link: https://cs3398-wookies-fall.atlassian.net/browse/SCRUM-49
            Reference: https://bitbucket.org/cs3398-wookies-f25/ai-fitness-tracker/branch/feature/SCRUM-49-add-workouts-to-personal-databa

      4. SCRUM-50 Backend, Integrate Exercise Population Command for Django App
            Jira Link: https://cs3398-wookies-fall.atlassian.net/browse/SCRUM-50
            Reference: https://bitbucket.org/cs3398-wookies-f25/ai-fitness-tracker/branch/feature/SCRUM-50-integrate-exercise-population-c

           
      * Next Step:
         Add functionality to log completed workouts and automatically calculate calories burned based on reps, sets, and weight.

<hr>## Features
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