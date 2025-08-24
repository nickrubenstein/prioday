# Prioday

## A prioritized todo list for repetative chores and tasks
For organizing chores and tasks on daily, weekly, monthly, or yearly schedules. 

### Some Use cases
- Do you need to be reminded to do that thing every 5 days, 2 weeks, or 3 months?
- Ever forget the last time you vacuumed? 
- Are you sure you watered the plants yesterday or was it the day before yesterday? 
- Not sure if you finished wordle, duolingo, the daily chess puzzle today?
- Do you need a reminder to pay that bill this month?
- Did you filter that mead you were brewing on the 19th or the 29th of last month?

### Solution
- Set a frequency for how often a task needs to be done
- Tasks that need to be done today will be at the top of the todo list (colored blue)
- Tasks that do not need to be done until a future date are further down the list
- Tasks that should have been done yesterday will be shown in red
- Easily see the last time a task was done and the days before a task needs to be done again

## Development

### Running Tests

This project uses Playwright for end-to-end testing.

**Prerequisites:**
1. Install dependencies: `npm install`
2. Install browser binaries: `npx playwright install`

**Test Commands:**
- `npm test` - Run all tests in headless mode
- `npm run test:headed` - Run tests with browser UI visible
- `npm run test:ui` - Open interactive test runner
- `npm run test:report` - View detailed test results

**Manual Testing:**
- `npm run serve` - Start local development server on http://localhost:3000
