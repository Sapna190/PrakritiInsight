# 🔄 Prakriti Analysis Auto-Save Feature

## How It Works

When a user completes the **Prakriti Analysis** form, the result is now **automatically saved** to:
1. ✅ **Database** (MongoDB - `prakritirecords` collection)
2. ✅ **Admin Panel** (visible immediately)
3. ✅ **localStorage** (for offline access)

---

## Workflow

### 1. User Takes Prakriti Test
```
http://localhost:5000/prakriti-analysis.html
```

**Steps:**
1. User selects answers for 4 questions:
   - Body Frame
   - Skin Type
   - Temperament
   - Appetite

2. Clicks **"Analyze Prakriti"**

3. System calculates dominant dosha:
   - **Vata** (Air & Space)
   - **Pitta** (Fire & Water)
   - **Kapha** (Earth & Water)

### 2. Auto-Save to Database

The result is **automatically saved** with:
- **Student Name**: Current logged-in user's name
- **Prakriti Type**: Vata/Pitta/Kapha
- **Follow-up Date**: Automatically set to 7 days from today
- **Analysis Scores**: Vata, Pitta, Kapha scores (saved in notes)
- **Status**: "Pending" (can be marked as "Done" later)

### 3. View in Admin Panel

**Access:** `http://localhost:5000/admin-panel.html`

The saved record appears immediately with:
- User's name
- Prakriti type (color-coded badge)
- Scheduled follow-up date
- Analysis scores (in notes)
- Status (Pending/Done)

---

## API Endpoint

### Submit Prakriti Analysis
```
POST /api/prakriti/submit
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "prakritiType": "vata",
  "scores": {
    "vata": 3,
    "pitta": 1,
    "kapha": 0
  }
}

Response (201):
{
  "message": "Prakriti analysis saved successfully",
  "record": {
    "_id": "...",
    "userId": "...",
    "studentName": "John Doe",
    "prakritiType": "Vata",
    "followUpDate": "2025-11-02T00:00:00.000Z",
    "notes": "Analysis scores - Vata: 3, Pitta: 1, Kapha: 0",
    "status": "Pending",
    "createdAt": "...",
    "updatedAt": "..."
  },
  "followUpDate": "2025-11-02T00:00:00.000Z"
}
```

---

## Features

### ✅ Automatic Follow-up Scheduling
- Follow-up date automatically set to **7 days** from analysis date
- Can be tracked in Admin Panel
- Helps practitioners schedule check-ins

### ✅ Score Tracking
- All answer scores (Vata, Pitta, Kapha) saved in notes
- Helps understand dosha distribution
- Useful for detailed analysis

### ✅ User Attribution
- Each record linked to the user who took the test
- User's name automatically populated
- Can track multiple analyses over time

### ✅ Status Management
- Initial status: "Pending"
- Can mark as "Done" after follow-up completed
- Visual badges (Green=Done, Yellow=Pending)

---

## Complete Flow Example

### Scenario: Sarah Takes Prakriti Test

1. **Sarah logs in**
   - Goes to: `http://localhost:5000/sign-in.html`
   - Enters: sarah@example.com / password

2. **Takes Analysis**
   - Navigates to: `http://localhost:5000/prakriti-analysis.html`
   - Selects answers:
     - Frame: Thin, lean → Vata
     - Skin: Dry, rough → Vata
     - Temperament: Anxious, talkative → Vata
     - Appetite: Irregular → Vata
   - Clicks "Analyze Prakriti"

3. **Result Displayed**
   - Shows: "You are predominantly **Vata**!"
   - Success message: "✅ Your analysis has been saved"
   - Follow-up scheduled for: November 2, 2025

4. **Saved to Database**
   ```javascript
   {
     studentName: "Sarah Johnson",
     prakritiType: "Vata",
     followUpDate: "2025-11-02",
     notes: "Analysis scores - Vata: 4, Pitta: 0, Kapha: 0",
     status: "Pending"
   }
   ```

5. **Admin Panel Access**
   - Sarah (or admin) goes to: `http://localhost:5000/admin-panel.html`
   - Sees her record in the table
   - Can mark as "Done" after follow-up

---

## Benefits

### For Users:
- ✅ Results automatically saved
- ✅ No need to manually record findings
- ✅ Can view history in admin panel
- ✅ Follow-up reminders scheduled

### For Practitioners:
- ✅ All patient analyses in one place
- ✅ Track follow-up dates
- ✅ See analysis scores for detailed review
- ✅ Mark completed consultations

### For Database:
- ✅ Persistent storage
- ✅ Easy to query and analyze
- ✅ Export data for reports
- ✅ Track trends over time

---

## Testing

### Test the Auto-Save Feature:

1. **Sign In**
   ```
   http://localhost:5000/sign-in.html
   ```

2. **Take Prakriti Test**
   ```
   http://localhost:5000/prakriti-analysis.html
   ```
   - Select any 4 answers
   - Click "Analyze Prakriti"

3. **Check Success Message**
   - Look for green success alert
   - Should show follow-up date

4. **Verify in Admin Panel**
   ```
   http://localhost:5000/admin-panel.html
   ```
   - See your record in the table
   - Check scores in notes

5. **Check Database** (Optional)
   ```powershell
   mongosh
   use ayurvedicure
   db.prakritirecords.find().pretty()
   ```

---

## Error Handling

### ❌ "Not saved to database"
**Cause**: Not signed in or token expired
**Solution**: Sign in again

### ❌ "Failed to save prakriti analysis"
**Cause**: Backend not running or database down
**Solution**: 
1. Check backend: `cd backend && npm start`
2. Check MongoDB: `mongosh`
3. Check browser console for errors

### ❌ Record not visible in Admin Panel
**Cause**: Different user account or not loading
**Solution**: 
1. Sign in with same account that took test
2. Refresh admin panel page
3. Check browser console (F12)

---

## Database Schema

**Collection**: `prakritirecords`

```javascript
{
  _id: ObjectId,
  userId: ObjectId,              // Link to user who took test
  studentName: String,            // User's name
  prakritiType: String,           // "Vata", "Pitta", or "Kapha"
  followUpDate: Date,             // Auto-set to +7 days
  status: String,                 // "Pending" or "Done"
  notes: String,                  // Analysis scores
  createdAt: Date,
  updatedAt: Date
}
```

---

## Future Enhancements

Possible additions:
- 📧 Email reminders for follow-ups
- 📊 Trend graphs (track changes over time)
- 📝 Detailed recommendations based on type
- 👥 Practitioner notes/comments
- 📅 Calendar integration
- 📱 Mobile notifications

---

## Quick Links

- **Prakriti Test**: http://localhost:5000/prakriti-analysis.html
- **Admin Panel**: http://localhost:5000/admin-panel.html
- **Sign In**: http://localhost:5000/sign-in.html

---

**Automated Prakriti Tracking - Making Ayurveda Care Easier! 🌿**
