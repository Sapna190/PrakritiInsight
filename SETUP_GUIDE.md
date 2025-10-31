# AyurvediCure - Complete Setup & Run Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running on localhost:27017)
- Python 3.8+ with pip

### 1. Start MongoDB
```powershell
# Make sure MongoDB is running
# If installed as a service, it should auto-start
# Otherwise run:
mongod
```

### 2. Start Node.js Backend (Port 5000)
```powershell
cd backend
npm install
npm start
```

The backend will serve:
- Static files from the parent directory
- API endpoints at `/api/auth/*`
- Main page at `http://localhost:5000`

### 3. Start Python Flask ML Service (Port 5001 - Optional)
```powershell
# In a new terminal, from project root
python app.py
```

The Flask service provides:
- Disease prediction endpoint at `http://localhost:5001/predict`
- ML model training on startup

### 4. Access the Application
Open browser: `http://localhost:5000`

---

## 🔐 Authentication Flow

### Sign Up (Register)
1. Go to `http://localhost:5000` (index.html)
2. Fill in Name, Email, Password
3. Click "Sign Up"
4. User saved to MongoDB `ayurvedicure` database, `users` collection

### Sign In (Login)
1. Go to `http://localhost:5000/sign-in.html`
2. Enter Email and Password
3. Click "Sign In"
4. JWT token stored in `localStorage.authToken`
5. Redirects to `user-login.html` (dashboard)

### Protected Pages
These pages require authentication (auto-redirect to sign-in if not logged in):
- `user-login.html` - Dashboard
- `user-profile.html` - User Profile
- `user-settings.html` - Settings & Edit Profile
- `ai-chat-bot.html` - AI Doctor
- `human-doctor.html` - Human Doctor
- `prakriti-analysis.html` - Prakriti Assessment
- `prakriti-result.html` - Prakriti Results

### Logout
Click any "Log Out" link in navigation - clears tokens and redirects to sign-in

---

## 📊 Database Schema

### MongoDB Connection
```
Database: ayurvedicure
URI: mongodb://localhost:27017/ayurvedicure
```

### User Collection Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (hashed with bcrypt),
  phone: String (nullable),
  dateOfBirth: String (nullable),
  gender: String (nullable),
  locality: String (nullable),
  pinCode: String (nullable),
  avatar: String (default: 'img/user/user.png'),
  createdAt: Date
}
```

---

## 🛠️ API Endpoints

### Authentication

#### POST `/api/auth/register`
Register a new user
```json
Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response (201):
{
  "message": "User registered successfully"
}
```

#### POST `/api/auth/login`
Login existing user
```json
Request:
{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response (200):
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### GET `/api/auth/profile` 🔒
Get current user profile (requires JWT token in Authorization header)
```json
Headers:
{
  "Authorization": "Bearer jwt_token_here"
}

Response (200):
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "dateOfBirth": "2000-07-10",
  "gender": "Male",
  "locality": "Hauz Khas",
  "pinCode": "110030",
  "avatar": "img/user/user.png",
  "createdAt": "2024-10-26T..."
}
```

#### PUT `/api/auth/profile` 🔒
Update user profile (requires JWT token)
```json
Request:
{
  "name": "John Doe",
  "phone": "9876543210",
  "dateOfBirth": "2000-07-10",
  "gender": "Male",
  "locality": "New Delhi",
  "pinCode": "110001"
}

Response (200):
{
  "message": "Profile updated successfully",
  "user": { /* updated user object */ }
}
```

#### PUT `/api/auth/change-password` 🔒
Change user password (requires JWT token)
```json
Request:
{
  "currentPassword": "OldPass123",
  "newPassword": "NewPass456"
}

Response (200):
{
  "message": "Password changed successfully"
}
```

---

## 📁 Project Structure

```
AyurvediCure-main/
├── backend/
│   ├── models/
│   │   └── User.js (MongoDB User Schema)
│   ├── routes/
│   │   └── auth.js (Auth API Routes)
│   ├── middleware/
│   │   └── auth.js (JWT Verification Middleware)
│   ├── server.js (Express Server)
│   ├── package.json
│   └── .env (Environment Variables)
│
├── js/
│   ├── auth.js (Reusable Auth Helper - NEW!)
│   ├── jquery8a54.js
│   ├── plugins8a54.js
│   └── init8a54.js
│
├── css/
│   ├── style8a54.css
│   └── plugins8a54.css
│
├── img/
│   └── user/
│       └── user.png (Default Avatar)
│
├── app.py (Flask ML Service)
├── index.html (Sign Up Page)
├── sign-in.html (Login Page)
├── user-login.html (Dashboard - Protected)
├── user-profile.html (Profile Display - Protected)
├── user-settings.html (Edit Profile - Protected)
├── ai-chat-bot.html (AI Doctor - Protected)
├── human-doctor.html (Human Doctor - Protected)
├── prakriti-analysis.html (Prakriti Test - Protected)
├── prakriti-result.html (Results - Protected)
└── ... (other public pages)
```

---

## 🎯 Key Features Implemented

### ✅ Dynamic User Profile
- **user-profile.html**: Fetches user data from MongoDB via API
- Displays profile fields with default "Not Set" for null values
- Real-time user info in header (name, email)
- Phone field added to profile display

### ✅ Profile Editing
- **user-settings.html**: Edit profile form with live data
- Updates: name, phone, gender, date of birth, locality, PIN code
- Email is read-only (unique identifier)
- "I approve all changes" checkbox required
- Success/error messages

### ✅ Authentication Protection
- JWT-based authentication with bcrypt password hashing
- Token stored in `localStorage.authToken`
- Protected pages auto-redirect to sign-in if no token
- Session expiry handling (401 errors clear token)
- Reusable `auth.js` script for all protected pages

### ✅ Logout Functionality
- All "Log Out" links clear localStorage
- Redirects to sign-in page
- Alert confirmation

### ✅ Default Data Handling
- Profile fields show "Not Set" when null
- Form fields remain empty for easy editing
- No errors on missing data

---

## 🔧 Configuration

### Backend Environment (.env)
```env
MONGODB_URI=mongodb://localhost:27017/ayurvedicure
JWT_SECRET=change_this_secret_in_production
PORT=5000
```

### Frontend localStorage
```javascript
authToken: "jwt_token_here"  // JWT for authentication
userEmail: "user@example.com"  // User email (for convenience)
frenify_skin: "light"  // Theme preference
frenify_panel: ""  // Panel state
prakriti: "Pitta"  // Prakriti test result
```

---

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB is running: `mongo` or `mongosh`
- Verify port 5000 is free: `netstat -ano | findstr :5000`
- Check `backend/.env` exists with correct values

### Users not saving
- Check MongoDB connection in backend console logs
- Look for "User registered successfully" message
- Verify database exists: `use ayurvedicure` in mongo shell

### Sign-in fails
- Check browser console for errors
- Verify token is stored: `localStorage.authToken` in console
- Check backend logs for authentication errors

### Profile not loading
- Check Network tab: should see `/api/auth/profile` request
- Verify Authorization header contains token
- Check response status (401 = expired, 404 = user not found)

### Session expired errors
- Token expires after 1 hour (configurable in auth.js)
- Re-login to get new token
- Check JWT_SECRET hasn't changed

---

## 📝 Development Notes

### Adding More Profile Fields
1. Update `backend/models/User.js` schema
2. Add field to `backend/routes/auth.js` PUT handler
3. Update `user-profile.html` display
4. Add input to `user-settings.html` form
5. Update form submission in settings script

### Adding New Protected Pages
Just add these two lines before closing `</body>`:
```html
<script type="text/javascript" src="js/auth.js"></script>
<script>initAuth(true);</script>
```

### Making Pages Public (No Auth Required)
Use `initAuth(false)` to show user info if logged in, but don't require login:
```html
<script>initAuth(false);</script>
```

---

## 🎨 Theme Support

The app supports light/dark themes stored in `localStorage.frenify_skin`:
- Click sun/moon icon in header to toggle
- Preference persists across sessions
- Applied via CSS variables.
---

## 🆘 Need Help?

Check the documentation pages:
- `/documentation.html` - Full docs
- `/faq.html` - Common questions
- `/contact.html` - Contact support

---

**Happy Healing! 🌿**
