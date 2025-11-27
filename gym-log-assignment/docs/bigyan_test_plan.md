Unit Test Plan – Bigyan Dhakal
Location of Tests
My unit tests are in:
frontend/src/components/ChatSupport/__tests__/ChatPopup.test.jsx
frontend/src/components/ChatSupport/__tests__/SearchSupport.test.jsx
frontend/src/components/DailyOverview/__tests__/DailyOverview.test.jsx

Features and Code Under Test
1. ChatPopup → handleSendMessage (UI Logic + API Call)
File: frontend/src/components/ChatSupport/__tests__/ChatPopup.test.jsx
code touched:
frontend/src/components/ChatSupport/ChatPopup.jsx
handleSendMessage internal logic
fetch("api/support/contact/") POST call
Auth/profile context data passed into ChatPopup

Tests:
sends support message when both fields are filled
Renders ChatPopup inside MemoryRouter so button navigation and toggles work.
Mocks:
useAuth() to provide a profile name
fetch to simulate the support API returning { ok: true }
window.alert to detect success message
Opens the chat popup, toggles the email/message form, types into:

Email field
Message textarea
Clicks the send button.
Asserts:
fetch is called once
Correct POST payload is sent: { email, message }
Success alert "Message sent!" appears
This test uses component fields, exercises form state, and validates the returned UI behavior after a successful POST.

2. SearchSupport → handleSend (Branch for Missing Access Token)
File: frontend/src/components/ChatSupport/__tests__/SearchSupport.test.jsx
Production code touched:
frontend/src/components/ChatSupport/SearchSupport.jsx
handleSend method
Logic that checks for access token (getAccessToken)
Branch that renders bot reminder message when token is missing

Tests:
appends login reminder when token is missing
Mocks:
useAuth() so that getAccessToken() returns null
sendChatMessage to ensure it is not called
react-router-dom navigation
Renders SearchSupport and types a message into the input field.
Clicks the send button.
Asserts:
The login reminder bot message
“please log in so I can tailor recommendations to your profile”
appears in the UI
sendChatMessage is never called
This test verifies the missing-token branch, uses component state, and checks the rendered UI output instead of making API calls.

3. DailyOverview → Data Rendering from Fetched Summary
File: frontend/src/components/DailyOverview/__tests__/DailyOverview.test.jsx
Production code touched:
frontend/src/components/DailyOverview/DailyOverview.jsx
Service calls:
fetchMealSummary
fetchWaterIntake
getNutritionTargets
getUserWorkouts

Tests:
renders calories and protein from fetched summary
Mocks all service functions to resolve predictable values:
calories: 1500
protein: 120
carbs: 180
fats: 50
Renders DailyOverview.
Uses findByText and getByText to assert the UI displays:
"1500 kcal"
"120 g"
Confirms the component correctly consumes async service data and updates UI on mount.
This test validates returned object fields from service mocks and ensures they render in the component.
