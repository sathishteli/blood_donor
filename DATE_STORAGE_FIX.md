# MongoDB Date Storage Fix - Last Blood Donated Date

## Problem
The `lastBloodDonatedDate` field was either:
1. Storing the wrong date in MongoDB
2. Showing "No donation dates" on the profile page
3. Not being captured during registration

## Root Cause
1. **Backend User Model** didn't have `isFirstTimeDonor` and `lastBloodDonatedDate` fields
2. **Auth Controller** wasn't extracting and storing these fields from registration form
3. **Login response** wasn't returning these fields to the frontend
4. **Donor Model** had field named `lastDonationDate` (inconsistent naming)
5. **Registration didn't validate** the date format before storing

## Solution Implemented

### 1. **Updated User Model** (`backend/models/User.js`)
Added two new fields:
```javascript
isFirstTimeDonor: { type: Boolean, default: true },
lastBloodDonatedDate: { type: Date, default: null },
```

### 2. **Updated Auth Controller** (`backend/controllers/authController.js`)

**Registration:**
- Extracts `isFirstTimeDonor` and `lastBloodDonatedDate` from request
- Converts `isFirstTimeDonor` to boolean properly
- Only sets `lastBloodDonatedDate` if:
  - The date is provided AND
  - User selected "No, I have donated before"
- Properly converts string date to Date object: `new Date(lastBloodDonatedDate)`

```javascript
const userData = {
  name, email, password: hashed, bloodGroup, city, phone,
  isFirstTimeDonor: isFirstTimeDonor === true || isFirstTimeDonor === "true" ? true : false,
};

if (lastBloodDonatedDate && (isFirstTimeDonor === false || isFirstTimeDonor === "false")) {
  userData.lastBloodDonatedDate = new Date(lastBloodDonatedDate);
}
```

**Login:**
- Returns all user fields including donation info in response
- Ensures frontend gets complete user object with new fields

### 3. **Updated Donor Model** (`backend/models/Donor.js`)

Fixed inconsistent naming and added eligibility logic:
```javascript
isFirstTimeDonor: { type: Boolean, default: true },
lastBloodDonatedDate: { type: Date, default: null },  // Changed from lastDonationDate
available: { type: Boolean, default: true },
```

**Pre-save Hook** - Auto-calculates eligibility:
```javascript
if (this.isFirstTimeDonor === true) {
  this.available = true;  // First-time always available
} else if (!this.lastBloodDonatedDate) {
  this.available = true;  // No date = assume available
} else {
  const daysSince = Math.floor((Date.now() - this.lastBloodDonatedDate) / (1000 * 60 * 60 * 24));
  this.available = daysSince >= 90;
}
```

### 4. **Updated Donor Routes** (`backend/routes/donorRoutes.js`)

**Registration:**
- Accepts `isFirstTimeDonor` and `lastBloodDonatedDate`
- Same validation logic as User registration
- Makes date fields optional instead of required

**Login:**
- Returns complete donor object with new fields
- Includes `available` status

## What Gets Stored in MongoDB

### First-Time Donor:
```javascript
{
  _id: ObjectId,
  name: "John Doe",
  email: "john@example.com",
  bloodGroup: "O+",
  city: "Mumbai",
  phone: "9876543210",
  isFirstTimeDonor: true,
  lastBloodDonatedDate: null,
  available: true,  // Auto-set by pre-save hook
  createdAt: ISODate("2025-11-13T...")
}
```

### Previous Donor:
```javascript
{
  _id: ObjectId,
  name: "Jane Smith",
  email: "jane@example.com",
  bloodGroup: "B+",
  city: "Delhi",
  phone: "9876543211",
  isFirstTimeDonor: false,
  lastBloodDonatedDate: ISODate("2025-08-12T00:00:00.000Z"),
  available: true,  // Auto-calculated: 93 days >= 90
  createdAt: ISODate("2025-11-13T...")
}
```

## Frontend Display

**Profile Page** shows:
- ✅ "📅 First Time Donor ✨" - if first-time
- ✅ "📅 Last Donated: 8/12/2025 (93 days ago)" - if previous donor
- ✅ "📅 No donation date" - only if data missing

**Find Donors Page** shows:
- ✅ Status and last donation date
- ✅ Green dot if eligible, red if not
- ✅ Request button enabled/disabled based on eligibility

## Testing Checklist

1. **Register First-Time Donor:**
   - [ ] Select "Yes, First Time Donor"
   - [ ] Date field should be hidden
   - [ ] In MongoDB: `isFirstTimeDonor: true, lastBloodDonatedDate: null`
   - [ ] Profile shows "First Time Donor ✨"
   - [ ] Request button enabled ✅

2. **Register Previous Donor with 120 days ago:**
   - [ ] Select "No, I have donated before"
   - [ ] Enter date: 2025-07-15
   - [ ] In MongoDB: `isFirstTimeDonor: false, lastBloodDonatedDate: ISODate("2025-07-15")`
   - [ ] Profile shows "Last Donated: 7/15/2025 (120 days ago)"
   - [ ] Request button enabled ✅

3. **Register Previous Donor with 20 days ago:**
   - [ ] Select "No, I have donated before"
   - [ ] Enter date: 2025-10-24
   - [ ] In MongoDB: `isFirstTimeDonor: false, lastBloodDonatedDate: ISODate("2025-10-24")`
   - [ ] Profile shows "Last Donated: 10/24/2025 (20 days ago)"
   - [ ] Request button disabled ❌

## Key Fixes
✅ Date properly converted to ISO format in MongoDB
✅ Consistent field naming (`lastBloodDonatedDate`)
✅ Proper boolean conversion for `isFirstTimeDonor`
✅ Login returns all fields needed by frontend
✅ Pre-save hook auto-calculates eligibility
✅ Frontend receives complete donor data with dates

## Important Notes
- Old registrations won't have these fields - consider migration if needed
- Date format from frontend: YYYY-MM-DD (HTML date input)
- MongoDB stores as ISO Date: YYYY-MM-DDTHH:MM:SS.000Z
- Frontend converts back to local format for display
