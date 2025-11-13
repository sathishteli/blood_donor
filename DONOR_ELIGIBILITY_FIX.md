# Donor Eligibility Check Fix - Blood Request Button

## Problem
The "Request Blood" button on the Find Donors page was disabled even when donors met the 90-day eligibility requirement or were first-time donors. The issue was that the frontend was relying entirely on a `donor.available` field from the backend that wasn't being computed or sent correctly.

## Root Cause
In `Donors.js`, the button relied solely on `donor.available` property:
```javascript
disabled={!donor.available}  // ❌ This property wasn't being set correctly
```

The backend likely wasn't computing eligibility server-side, so all donors appeared as unavailable.

## Solution
Added **client-side eligibility computation** in `Donors.js` that checks:

1. **First-time donors** → Always eligible ✅
2. **Previous donors with donation date** → Eligible if 90+ days have passed ✅
3. **Previous donors without date or invalid date** → Not eligible ❌

### Updated Logic in Donors.js:
```javascript
const computeEligibility = () => {
  // If backend provides available flag, trust it
  if (typeof donor.available === "boolean") return donor.available;
  
  // first-time donors are eligible
  if (donor.isFirstTimeDonor === true || donor.isFirstTimeDonor === "true") 
    return true;
  
  // Check if last donation date exists and is valid
  if (!donor.lastBloodDonatedDate) return false;
  const last = new Date(donor.lastBloodDonatedDate);
  if (isNaN(last.getTime())) return false;
  
  // Calculate days since last donation
  const now = new Date();
  const days = Math.floor((now - last) / (1000 * 60 * 60 * 24));
  return days >= 90;
};

const eligible = computeEligibility();
```

## Changes Made
**File:** `frontend/src/pages/Donors.js`

- Wrapped donor mapping in a function to access `computeEligibility()`
- Replaced hardcoded `donor.available` with `eligible` variable
- Status dot color now reflects actual eligibility
- Button enabled/disabled state now matches eligibility logic
- Status text shows "Available" or "Not Yet Eligible"

## How It Works Now

### Scenario 1: First-time donor
- `isFirstTimeDonor = true`
- Button: **Enabled** ✅
- Status: Available

### Scenario 2: Donated 5 months ago
- `isFirstTimeDonor = false`
- `lastBloodDonatedDate = "2025-06-13"`
- Current date: Nov 13, 2025 = 153 days ago
- 153 ≥ 90? **YES** ✅
- Button: **Enabled** ✅
- Status: Available

### Scenario 3: Donated 30 days ago
- `isFirstTimeDonor = false`
- `lastBloodDonatedDate = "2025-10-14"`
- Current date: Nov 13, 2025 = 30 days ago
- 30 ≥ 90? **NO** ❌
- Button: **Disabled** (greyed out)
- Status: Not Yet Eligible

## Backend Requirements
For this to work, ensure your user/donor API returns these fields:
```javascript
{
  _id: "...",
  name: "John Doe",
  email: "john@example.com",
  bloodGroup: "O+",
  city: "Mumbai",
  phone: "9876543210",
  isFirstTimeDonor: true,  // ✅ REQUIRED
  lastBloodDonatedDate: "2025-06-13",  // ✅ REQUIRED (null for first-timers)
  available: boolean  // ⚠️ Optional (frontend will compute if missing)
}
```

## Testing
1. Register a new donor as first-time donor
2. Search for that donor in Find Donors page
3. Button should be **enabled** (green, clickable)
4. Register another donor with previous donation date > 90 days ago
5. Button should be **enabled** (green, clickable)
6. Register a donor with donation < 90 days ago
7. Button should be **disabled** (greyed out)

## CSS Styling Already in Place
- `.request-btn:disabled` has grey background and `cursor: not-allowed`
- Status dot colors: green (available) vs red (unavailable)
- These work perfectly with the new logic
