# Unit Test Plan – Sapnil Basnet

# Location of Tests
My unit tests are in:

frontend/src/components/WorkoutActivity/MyWorkouts.test.js
frontend/src/components/WorkoutActivity/WorkoutStats.test.js

## Features and Code Under Test

1. MyWorkouts Component Rendering and Interaction (React Component)
File: frontend/src/components/WorkoutActivity/MyWorkouts.test.js

Production code touched:

frontend/src/components/WorkoutActivity/MyWorkouts.jsx
- Component rendering logic
- React Router navigation integration (useNavigate hook)
- Authentication context integration (useAuth hook)
- Axios API call integration

## Tests:

# test: renders component without crashing
- Wraps <MyWorkouts /> in <BrowserRouter> to provide routing context.
- Calls render() from React Testing Library.

Asserts:

- Component renders without throwing errors.
- Basic smoke test validates the component structure is valid.
- This test validates the component function executes and returns a valid JSX object.

# test: displays My Workouts heading

- Renders <MyWorkouts /> component.
- Uses screen.getByRole('heading', { name: /my workouts/i }) to query the DOM.

Asserts:

- The main heading element exists in the rendered output.
- Text content matches "My Workouts".
- This test uses component return values (JSX) and validates rendered DOM elements.

# test: renders navigation buttons
- Renders <MyWorkouts /> component.
- Queries for navigation button text using screen.getByText(/back to library/i).

Asserts:

- Navigation button element is present in the document.
- Button text content is correct.
- This test verifies component fields (button elements) and user interface elements.

# Mocking Strategy:

- Mocked axios to prevent real API calls during testing.
- Mocked react-router-dom's useNavigate to isolate navigation logic.
- Mocked AuthContext's useAuth hook to provide fake authentication state (getAccessToken, user).
- All mocks ensure the component is tested in isolation as a proper unit test.

2. WorkoutStats Component Display Logic (React Component)
File: frontend/src/components/WorkoutActivity/WorkoutStats.test.js
Production code touched:

frontend/src/components/WorkoutActivity/WorkoutStats.jsx

- Component state management
- Conditional rendering logic
- React Router navigation integration

# Tests:

test: renders component without crashing
Calls render(<WorkoutStats />).

Asserts:

- Component renders successfully without errors.
- Basic component structure is valid.
- This validates the component function and its return object (JSX).

# test: renders stats functionality

- Renders <WorkoutStats /> component.
- Queries for text content using screen.getByText(/stats/i).

Asserts:

- Stats-related content is displayed in the rendered output.
- Component handles data display logic correctly.
- This test uses component fields (rendered text elements) and verifies conditional rendering logic.

### Mocking Strategy:

- Mocked axios to simulate API responses for workout statistics.
- Mocked rea#ct-router-dom's useNavigate for navigation handling.
- Mocked AuthContext's useAuth to provide authentication state without real backend calls.
- Isolated component logic from external dependencies for true unit testing.

## Why These Tests Cover Complex Code Structures
- Classes/Methods/Functions Tested:
- React functional components (MyWorkouts, WorkoutStats) – complex component functions
- Component render methods – returns JSX (complex return objects)
- React hooks – useNavigate, useAuth, useState, useEffect
- Event handlers – button click handlers, navigation logic

## Fields Used:
- Component props (passed to child components)
- Component state (managed by React hooks)
- DOM elements (buttons, headings, text content)
- JSX attributes (roles, text content, accessibility properties)

# Return Objects Verified:
- JSX elements returned by component render functions
- DOM nodes created from JSX (queried via React Testing Library)
- Component output validated through screen queries and assertions

