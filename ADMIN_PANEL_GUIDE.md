# 🛠️ Admin Panel Access Guide

## How to Access the Admin Panel

### URL:
```
http://localhost:5000/admin-panel.html
```

### Prerequisites:
1. ✅ Backend server running (`cd backend && npm start`)
2. ✅ MongoDB connected
3. ✅ User must be **signed in** (authentication required)

---

## Features

### 1. **Student Management**
   - Add student prakriti analysis records
   - Track follow-up dates
   - Monitor completion status

### 2. **Prakriti Types**
   - **Vata** - Air & Space dominant
   - **Pitta** - Fire & Water dominant  
   - **Kapha** - Earth & Water dominant

### 3. **Record Operations**
   - ✅ **Add**: Create new student record with name, prakriti type, follow-up date
   - ✅ **Mark Done**: Update status from Pending to Done
   - 🗑️ **Delete**: Remove student records
   - 📊 **View**: See all records in a sortable table

### 4. **Data Storage**
   - **Database**: MongoDB (`prakritirecords` collection)
   - **Per User**: Each user sees only their own records
   - **Backup**: Falls back to localStorage if API unavailable

---

## Step-by-Step Access

### Option 1: Direct URL
1. Make sure you're **signed in**
2. Navigate to: `http://localhost:5000/admin-panel.html`
3. If not logged in, you'll be redirected to sign-in page

### Option 2: From Dashboard
You can add a link to the admin panel in your navigation:

**Add to user-login.html or any protected page:**
```html
<li>
    <a href="admin-panel.html" class="fn__tooltip menu__item" data-position="right" title="Admin Panel">
        <span class="icon">🛠️</span>
        <span class="text">Admin Panel</span>
    </a>
</li>
```

---

## Usage Guide

### Adding a Student Record:
1. Enter **Student Name** (e.g., "John Doe")
2. Select **Prakriti Type** (Vata/Pitta/Kapha)
3. Choose **Follow-up Date** (future date)
4. Click **"Add Student"**
5. Record appears in the table below

### Managing Records:
- **✓ Button**: Mark follow-up as completed
- **🗑️ Button**: Delete the record (confirmation required)
- **Status Badge**: 
  - 🟢 Green = Done
  - 🟡 Yellow = Pending

### Navigation:
- **🏠 Dashboard**: Return to main dashboard (top-left)
- **🚪 Logout**: Sign out and clear session (top-right)

---

## API Endpoints

The admin panel uses these backend APIs:

### Get All Records
```
GET /api/prakriti/records
Headers: Authorization: Bearer <token>
```

### Create Record
```
POST /api/prakriti/records
Headers: Authorization: Bearer <token>
Body: {
  "studentName": "John Doe",
  "prakritiType": "Vata",
  "followUpDate": "2025-11-15"
}
```

### Update Record
```
PUT /api/prakriti/records/:id
Headers: Authorization: Bearer <token>
Body: {
  "status": "Done"
}
```

### Delete Record
```
DELETE /api/prakriti/records/:id
Headers: Authorization: Bearer <token>
```

---

## Security Features

✅ **Authentication Required**: Must be logged in to access  
✅ **User Isolation**: Each user sees only their own records  
✅ **JWT Token**: Secure token-based authentication  
✅ **Auto-Redirect**: Redirects to sign-in if token missing/expired  

---

## Database Schema

**Collection**: `prakritirecords`

```javascript
{
  userId: ObjectId,           // Reference to User
  studentName: String,         // Student's name
  prakritiType: String,        // "Vata", "Pitta", or "Kapha"
  followUpDate: Date,          // Scheduled follow-up date
  status: String,              // "Pending" or "Done"
  notes: String,               // Optional notes
  createdAt: Date,             // Record creation date
  updatedAt: Date              // Last update date
}
```

---

## Troubleshooting

### ❌ "Admin access requires authentication"
**Solution**: Sign in first at `http://localhost:5000/sign-in.html`

### ❌ Records not saving
**Solution**: 
1. Check backend console for errors
2. Verify MongoDB is running
3. Check browser console (F12) for API errors

### ❌ Can't see records
**Solution**: 
- Records are user-specific
- Sign in with the same account that created them
- Check Network tab to see API responses

### ❌ "Failed to add record"
**Solution**: 
- Ensure all fields are filled (name, prakriti, date)
- Check that follow-up date is valid
- Verify token hasn't expired (re-login if needed)

---

## Quick Links

- **Admin Panel**: http://localhost:5000/admin-panel.html
- **Sign In**: http://localhost:5000/sign-in.html
- **Dashboard**: http://localhost:5000/user-login.html
- **API Docs**: See SETUP_GUIDE.md

---

## Example Workflow

1. **Sign In**: Go to sign-in page and log in
2. **Access Admin**: Navigate to admin-panel.html
3. **Add Student**: 
   - Name: "Sarah Johnson"
   - Prakriti: "Pitta"
   - Follow-up: "2025-11-20"
   - Click "Add Student"
4. **View Record**: See Sarah's record in the table
5. **Complete Follow-up**: Click ✓ button when done
6. **Status Updates**: Badge turns green (Done)
7. **Delete if Needed**: Click 🗑️ to remove

---

**Made with ❤️ for AyurvediCure Practitioners**
